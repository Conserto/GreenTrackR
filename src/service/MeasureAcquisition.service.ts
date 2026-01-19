import { browser } from 'wxt/browser';
import { RequestAction } from 'src/enum';
import type { GES, Measure, NetworkMeasure, SimpleGES } from 'src/interface';

import { GESService, NetworkService, ScoreService } from '.';
import {
  calculNetworkGes,
  calculResourcesFromAllServer,
  createEmptyMeasure,
  getLocalStorageObject,
  getTabId,
  getUrl,
  logDebug,
  logErr,
  logInfo,
  reloadCurrentTab
} from 'src/utils';
import { paramRetry, PREFIX_URL_EXTENSION } from '../const';
import { VITE_MAX_HAR_RETRIES_DEFAULT } from '../const/config.const';
import { SEARCH_AUTO } from '../const/key.const';

/**
 * Detect Firefox browser via user agent
 */
const IS_FIREFOX = typeof navigator !== 'undefined' && /Firefox/i.test(navigator.userAgent);

export class MeasureAcquisition {
  public measure: Measure;
  private latest?: Date;
  private latestCheck?: Date;
  private harRetryCount: number;
  private networkService: NetworkService;
  private gesService: GESService;
  private scoreService: ScoreService;
  private readonly nbRetry: number;

  constructor() {
    this.harRetryCount = 0;
    this.latest = undefined;
    this.latestCheck = undefined;
    this.networkService = new NetworkService();
    this.gesService = new GESService();
    this.scoreService = new ScoreService();
    this.measure = createEmptyMeasure();
    this.nbRetry = getLocalStorageObject(paramRetry) ?? VITE_MAX_HAR_RETRIES_DEFAULT;

    logDebug(`MeasureAcquisition initialized - Browser: ${IS_FIREFOX ? 'Firefox' : 'Chrome/Chromium'}`);
  }

  /**
   * Updates measure values including total energy and resources (network, user, server).
   */
  updateMeasureValues(serverGES?: GES, userGES?: GES, networkGES?: SimpleGES, serversGES?: SimpleGES): void {
    const { ges, wu, adpe, energy } = this.gesService.getEnergyAndResources(
      this.measure.networkMeasure.network,
      this.measure.networkMeasure.nbRequest,
      serversGES,
      userGES,
      networkGES
    );

    this.measure.ges = ges;
    this.measure.wu = wu;
    this.measure.adpe = adpe;
    this.measure.energy = energy;
    this.measure.userGES = userGES;
    this.measure.serverGES = serverGES;
    this.measure.serversGES = serversGES;
    this.measure.networkGES = networkGES;
    this.measure.complete = !!(serverGES && userGES);

    if (this.measure.ges?.pageTotal) {
      this.measure.score = this.scoreService.getScore(this.measure.ges.pageTotal);
    } else {
      this.measure.score = undefined;
    }
  }

  async getGESMeasure(countryCodeSelected: string, userCountryCodeSelected: string) {
    logDebug('getGESMeasure');
    let urlHost = getUrl(this.measure.url);
    const { serverGES, userGES } = await this.gesService.computeGES(
      countryCodeSelected,
      userCountryCodeSelected,
      urlHost
    );
    this.measure = {
      ...this.measure,
      detailResourcesGes: await this.gesService.computeGesDetailResource(countryCodeSelected, this.measure.detailResources, serverGES)
    };
    let serversGes: SimpleGES | undefined = undefined;
    if (this.measure.detailResourcesGes && countryCodeSelected === SEARCH_AUTO) {
      serversGes = calculResourcesFromAllServer(this.measure.networkMeasure.network.size, this.measure.detailResourcesGes);
    } else if (serverGES) {
      serversGes = serverGES;
    }
    const networkGes: SimpleGES = calculNetworkGes(serversGes, userGES);
    this.updateMeasureValues(serverGES, userGES, networkGes, serversGes);
    logDebug('Wait for DOM');
    await this.waitForDomElements();
    logDebug('End getGESMeasure');
    return this.measure;
  }

  /**
   * Main method to get network measurements
   * Handles both Chrome and Firefox
   */
  async getNetworkMeasure(forceRefresh: boolean = true) {
    logDebug(`getNetworkMeasure started - forceRefresh: ${forceRefresh}, retryCount: ${this.harRetryCount}`);

    // If first call with forceRefresh, reload page first to capture fresh network data
    if (this.harRetryCount === 0 && forceRefresh) {
      logDebug('First call with forceRefresh - reloading page...');
      this.harRetryCount++;

      // Reload page using devtools API (works on both Chrome and Firefox)
      browser.devtools.inspectedWindow.reload({ ignoreCache: true });

      await this.waitTabUpdate();

      // Extra delay for Firefox HAR population
      if (IS_FIREFOX) {
        logDebug('Firefox detected - adding extra delay for HAR population');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    // Now get HAR entries
    const har = await this.networkService.getHarEntries();

    logDebug(`HAR result: ${har ? 'received' : 'null'}, entries: ${har?.entries?.length ?? 0}`);

    if (!har || !har.entries || har.entries.length === 0) {
      // Retry if we haven't exhausted retries
      if (this.harRetryCount <= this.nbRetry) {
        logDebug(`No HAR entries, retrying (${this.harRetryCount}/${this.nbRetry})...`);
        this.harRetryCount++;

        browser.devtools.inspectedWindow.reload({ ignoreCache: true });
        await this.waitTabUpdate();

        if (IS_FIREFOX) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Recursive call
        await this.getNetworkMeasure(false); // false to avoid infinite reload loop
        return;
      } else {
        logErr(`Failed to retrieve HAR entries after ${this.nbRetry} retries`);
        this.harRetryCount = 0;
        return;
      }
    }

    // Process entries
    let entriesNetwork = this.networkService.filterNetworkResources(har.entries);
    let entriesNew = this.networkService.filterNewerOnly(entriesNetwork, this.latestCheck);
    let [entriesExtension, entriesPage] = this.filterEntriesExtensionAndPage(entriesNew);

    logDebug(`Entries stats - Total: ${entriesNetwork.length}, New: ${entriesNew.length}, Page: ${entriesPage.length}, Extension: ${entriesExtension.length}`);

    if (entriesPage.length === 0 && entriesNetwork.length === 0) {
      // Retry if we haven't exhausted retries
      if (this.harRetryCount <= this.nbRetry) {
        logDebug(`No page entries found, retrying (${this.harRetryCount}/${this.nbRetry})...`);
        this.harRetryCount++;

        browser.devtools.inspectedWindow.reload({ ignoreCache: true });
        await this.waitTabUpdate();

        if (IS_FIREFOX) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        await this.getNetworkMeasure(false);
        return;
      } else {
        logErr(`No entries found after ${this.nbRetry} retries`);
      }
    } else {
      // Success - process the entries
      this.measure = await this.getMeasureFromEntries(this.measure, entriesPage);
      this.measure = {
        ...this.measure,
        extensionMeasure: this.getNetworkAndRequestFromEntries(entriesExtension)
      };

      logInfo(`Page stats: requests=${this.measure.networkMeasure.nbRequest}, size=${this.measure.networkMeasure.network.size} KB`);
      logInfo(`Extension request ignored, stats: requests=${this.measure.extensionMeasure.nbRequest}` +
        ` / size(compress/uncompress)=${this.measure.extensionMeasure.network.size}/${this.measure.extensionMeasure.network.size} KB`);
    }

    // Reset retry counter at the end
    this.harRetryCount = 0;
  }

  filterEntriesExtensionAndPage(entries: HARFormatEntry[]): [HARFormatEntry[], HARFormatEntry[]] {
    let entries_extension: HARFormatEntry[] = [],
      entries_page: HARFormatEntry[] = [];
    entries.forEach((entry) => {
      if (PREFIX_URL_EXTENSION.test(entry.request.url)) {
        entries_extension.push(entry);
      } else {
        entries_page.push(entry);
        this.latest = new Date(entry.startedDateTime);
      }
    });
    return [entries_extension, entries_page];
  }

  applyLatest() {
    this.latestCheck = this.latest;
  }

  async getMeasureFromEntries(measureCurrent: Measure, entries: HARFormatEntry[]) {
    let measureNew: Measure;
    measureNew = {
      ...measureCurrent,
      date: new Date(),
      url: await this.networkService.getMotherUrl(),
      networkMeasure: this.getNetworkAndRequestFromEntries(entries),
      detailResources: this.networkService.getDetailResourcesFromEntries(entries)
    };
    return measureNew;
  }

  getNetworkAndRequestFromEntries(entries: HARFormatEntry[]) {
    let networkMeasure: NetworkMeasure;
    const { responsesSize, responsesSizeUncompress } =
      this.networkService.calculateResponseSizes(entries);
    let nbCache = this.networkService.calculateNbCache(entries);
    networkMeasure = {
      nbRequest: entries.length - nbCache,
      nbRequestCache: nbCache,
      detail: this.networkService.calculateDetailResponseSizes(entries),
      network: {
        size: responsesSize,
        sizeUncompress: responsesSizeUncompress
      }
    };
    return networkMeasure;
  }

  /**
   * Gets DOM element count using devtools.inspectedWindow.eval
   * This method works on both Chrome and Firefox
   */
  async waitForDomElements(): Promise<void> {
    const tabId = getTabId();
    if (!tabId) {
      logErr('No tab ID found for DOM elements');
      this.measure.dom = 0;
      return;
    }

    logDebug(`Getting DOM elements for tab ${tabId}`);

    try {
      // Method 1: Use devtools.inspectedWindow.eval (works on both browsers)
      const domCount = await this.evalInInspectedWindow('document.getElementsByTagName("*").length');
      if (typeof domCount === 'number' && domCount >= 0) {
        this.measure.dom = domCount;
        logDebug(`DOM elements count (inspectedWindow.eval): ${this.measure.dom}`);
        return;
      }

      // Method 2: Chrome - direct tabs.sendMessage
      if (!IS_FIREFOX && browser.tabs?.sendMessage) {
        try {
          const response = await browser.tabs.sendMessage(tabId, { action: RequestAction.GET_DOM_ELEMENTS });
          if (response?.success) {
            this.measure.dom = response.data?.domElements || 0;
            logDebug(`DOM elements count (tabs.sendMessage): ${this.measure.dom}`);
            return;
          }
        } catch (e) {
          logDebug(`tabs.sendMessage failed: ${e}`);
        }
      }

      // Method 3: Firefox - route through background script
      if (IS_FIREFOX && browser.runtime?.sendMessage) {
        try {
          const response = await browser.runtime.sendMessage({
            forwardToTab: true,
            tabId: tabId,
            payload: { action: RequestAction.GET_DOM_ELEMENTS }
          });
          if (response?.success && response?.data) {
            this.measure.dom = response.data.domElements ?? response.data.data?.domElements ?? 0;
            logDebug(`DOM elements count (runtime.sendMessage): ${this.measure.dom}`);
            return;
          }
        } catch (e) {
          logDebug(`runtime.sendMessage failed: ${e}`);
        }
      }

      logDebug('All DOM element retrieval methods failed, using 0 as default');
      this.measure.dom = 0;

    } catch (error) {
      logErr(`Error getting DOM elements: ${error}`);
      this.measure.dom = 0;
    }
  }

  /**
   * Evaluates expression in inspected window context
   * Returns Promise that resolves with the result
   */
  private evalInInspectedWindow(expression: string): Promise<any> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 3000);

      browser.devtools.inspectedWindow.eval(expression, (result, exceptionInfo) => {
        clearTimeout(timeout);
        if (exceptionInfo) {
          logDebug(`inspectedWindow.eval exception: ${JSON.stringify(exceptionInfo)}`);
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Waits for tab to finish loading
   */
  waitTabUpdate(): Promise<number> {
    return new Promise((resolve) => {
      const maxTimeout = setTimeout(() => {
        logDebug('Tab update wait timed out (max 8s)');
        cleanup();
        resolve(0);
      }, 8000);

      let navListener: ((url: string) => void) | null = null;
      let tabListener: ((tabId: number, info: chrome.tabs.TabChangeInfo) => void) | null = null;

      const cleanup = () => {
        clearTimeout(maxTimeout);
        if (navListener) {
          try { browser.devtools.network.onNavigated.removeListener(navListener); } catch (e) { /* ignore */ }
        }
        if (tabListener && browser.tabs?.onUpdated) {
          try { browser.tabs.onUpdated.removeListener(tabListener); } catch (e) { /* ignore */ }
        }
      };

      // Primary: Use devtools.network.onNavigated (works in DevTools context for both browsers)
      navListener = (url: string) => {
        logDebug(`Navigation completed to: ${url}`);
        setTimeout(() => {
          cleanup();
          resolve(0);
        }, IS_FIREFOX ? 1500 : 500);
      };

      try {
        browser.devtools.network.onNavigated.addListener(navListener);
        logDebug('Listening for navigation via devtools.network.onNavigated');
        return;
      } catch (e) {
        logDebug(`Failed to add onNavigated listener: ${e}`);
      }

      // Fallback: Use tabs.onUpdated (Chrome, needs tabs permission)
      if (browser.tabs?.onUpdated) {
        tabListener = (updatedTabId: number, info: chrome.tabs.TabChangeInfo) => {
          if (info.status === 'complete') {
            logDebug(`Tab ${updatedTabId} finished loading`);
            cleanup();
            resolve(updatedTabId);
          }
        };

        try {
          browser.tabs.onUpdated.addListener(tabListener);
          logDebug('Listening for tab update via tabs.onUpdated');
          return;
        } catch (e) {
          logDebug(`Failed to add tabs.onUpdated listener: ${e}`);
        }
      }

      // Last resort: fixed delay
      logDebug('Using fixed delay fallback for tab update wait');
      cleanup();
      setTimeout(() => resolve(0), IS_FIREFOX ? 3000 : 2000);
    });
  }
}