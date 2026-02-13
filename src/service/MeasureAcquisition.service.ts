import { browser } from 'wxt/browser';
import { RequestAction } from 'src/enum';
import type { GES, Measure, NetworkMeasure, SimpleGES } from 'src/interface';

import { GESService, NetworkService, ScoreService } from '.';
import {
  calculNetworkGes,
  calculResourcesFromAllServer,
  createEmptyMeasure,
  getBrowserName,
  getLocalStorageObject,
  getTabId,
  getUrl,
  IS_FIREFOX,
  IS_SAFARI,
  logDebug,
  logErr,
  logInfo,
  logWarn,
  reloadCurrentTab,
} from 'src/utils';
import { paramRetry, PREFIX_URL_EXTENSION } from '../const';
import { VITE_MAX_HAR_RETRIES_DEFAULT } from '../const/config.const';
import { SEARCH_AUTO } from '../const/key.const';

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

    logInfo(`🔧 MeasureAcquisition initialized - Browser: ${getBrowserName()}`);
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
   * MAIN METHOD (OPTIMIZED FOR FIREFOX & SAFARI)
   * Smartly handles cache and retries
   * Safari: Uses webRequest API instead of HAR (not available)
   */
  async getNetworkMeasure(forceRefresh: boolean = true) {
    logInfo(`🚀 getNetworkMeasure - forceRefresh: ${forceRefresh}, retryCount: ${this.harRetryCount}`);

    const harApiAvailable = this.networkService.isHarApiAvailable();
    
    // ========== SAFARI SPECIAL HANDLING (No HAR API) ==========
    if (!harApiAvailable && IS_SAFARI) {
      logInfo('Safari detected - HAR API unavailable, using webRequest API only');
      
      if (this.harRetryCount === 0) {
        logInfo('🔄 First call - reloading page for webRequest monitoring...');
        this.harRetryCount++;
        
        await reloadCurrentTab(forceRefresh);
        await this.waitTabUpdate();
        
        // Extra delay for webRequest population
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const har = await this.networkService.getWebRequestNetworkEntries();
      
      if (har && har.entries && har.entries.length > 0) {
        let entriesNetwork = this.networkService.filterNetworkResources(har.entries);
        let entriesNew = this.networkService.filterNewerOnly(entriesNetwork, this.latestCheck);
        let [entriesExtension, entriesPage] = this.filterEntriesExtensionAndPage(entriesNew);

        logInfo(`📈 Safari WebRequest - Total: ${entriesNetwork.length}, Page: ${entriesPage.length}, Extension: ${entriesExtension.length}`);

        this.measure = await this.getMeasureFromEntries(this.measure, entriesPage);
        this.measure = {
          ...this.measure,
          extensionMeasure: this.getNetworkAndRequestFromEntries(entriesExtension)
        };

        const cacheCount = this.measure.networkMeasure.nbRequestCache;
        const realCount = this.measure.networkMeasure.nbRequest;
        const totalCount = cacheCount + realCount;

        logInfo(`✅ Safari Analysis complete:`);
        logInfo(`   📦 Total requests: ${totalCount}`);
        logInfo(`   🔵 Real requests: ${realCount} (${this.measure.networkMeasure.network.size.toFixed(2)} KB)`);
        logInfo(`   🟢 Cached requests: ${cacheCount} (0 KB transferred)`);
      } else {
        logWarn('⚠️ No webRequest entries found on Safari');
      }
      
      this.harRetryCount = 0;
      return;
    }

    // ========== STEP 1: RELOAD IF NECESSARY (Chrome/Firefox) ==========
    if (this.harRetryCount === 0 && forceRefresh) {
      logInfo('🔄 First call with forceRefresh - reloading page with cache bypass...');
      this.harRetryCount++;

      // Reload with cache bypass
      await reloadCurrentTab(true);

      // Wait for reload to finish
      await this.waitTabUpdate();

      // Firefox: extra delay for HAR population
      if (IS_FIREFOX) {
        logDebug('⏳ Firefox detected - extra delay for HAR population (2000ms)');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // ========== STEP 2: HAR RETRIEVAL ==========
    const har = await this.networkService.getHarEntries();

    logDebug(`📊 HAR result: ${har ? 'received' : 'null'}, entries: ${har?.entries?.length ?? 0}`);

    // ========== STEP 3: VALIDATION AND RETRY ==========
    if (!har || !har.entries || har.entries.length === 0) {
      if (this.harRetryCount <= this.nbRetry) {
        logWarn(`⚠️ No HAR entries, retrying (${this.harRetryCount}/${this.nbRetry})...`);
        this.harRetryCount++;

        // Reload without bypassing cache to enable cache detection
        await reloadCurrentTab();
        await this.waitTabUpdate();

        if (IS_FIREFOX) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Recursive call
        await this.getNetworkMeasure(false);
        return;
      } else {
        logErr(`❌ Failed to retrieve HAR entries after ${this.nbRetry} retries`);
        this.harRetryCount = 0;
        return;
      }
    }

    // ========== STEP 4: FILTERING ENTRIES ==========
    let entriesNetwork = this.networkService.filterNetworkResources(har.entries);
    let entriesNew = this.networkService.filterNewerOnly(entriesNetwork, this.latestCheck);
    let [entriesExtension, entriesPage] = this.filterEntriesExtensionAndPage(entriesNew);

    logInfo(`📈 Entries - Total: ${entriesNetwork.length}, New: ${entriesNew.length}, Page: ${entriesPage.length}, Extension: ${entriesExtension.length}`);

    // ========== STEP 5: FINAL VALIDATION ==========
    if (entriesPage.length === 0 && entriesNetwork.length === 0) {
      if (this.harRetryCount <= this.nbRetry) {
        logWarn(`⚠️ No page entries found, retrying (${this.harRetryCount}/${this.nbRetry})...`);
        this.harRetryCount++;

        await reloadCurrentTab();
        await this.waitTabUpdate();

        if (IS_FIREFOX) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        await this.getNetworkMeasure(false);
        return;
      } else {
        logErr(`❌ No entries found after ${this.nbRetry} retries`);
      }
    } else {
      // ========== STEP 6: DATA PROCESSING ==========
      this.measure = await this.getMeasureFromEntries(this.measure, entriesPage);
      this.measure = {
        ...this.measure,
        extensionMeasure: this.getNetworkAndRequestFromEntries(entriesExtension)
      };

      // Calculate the number of cached requests
      const cacheCount = this.measure.networkMeasure.nbRequestCache;
      const realCount = this.measure.networkMeasure.nbRequest;
      const totalCount = cacheCount + realCount;

      logInfo(`✅ Analysis complete:`);
      logInfo(`   📦 Total requests: ${totalCount}`);
      logInfo(`   🔵 Real requests: ${realCount} (${this.measure.networkMeasure.network.size.toFixed(2)} KB)`);
      logInfo(`   🟢 Cached requests: ${cacheCount} (0 KB transferred)`);
      logInfo(`   🎯 Cache efficiency: ${totalCount > 0 ? ((cacheCount / totalCount) * 100).toFixed(1) : 0}%`);
    }

    // Reset retry counter
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
   */
  async waitForDomElements(): Promise<void> {
    const tabId = await getTabId();
    if (!tabId) {
      logErr('No tab ID found for DOM elements');
      this.measure.dom = 0;
      return;
    }

    logDebug(`Getting DOM elements for tab ${tabId}`);

    try {

      if (!IS_SAFARI) {
        // Method 1: Use devtools.inspectedWindow.eval (works on both browsers)
        const domCount = await this.evalInInspectedWindow('document.getElementsByTagName("*").length');
        if (typeof domCount === 'number' && domCount >= 0) {
          this.measure.dom = domCount;
          logDebug(`DOM elements count (inspectedWindow.eval): ${this.measure.dom}`);
          return;
        }
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
      if ((IS_FIREFOX || IS_SAFARI) && browser.runtime?.sendMessage) {
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
   * Waits for tab to finish loading - DELEGATED TO BACKGROUND FOR ALL BROWSERS
   */
  waitTabUpdate(): Promise<number> {
    return new Promise((resolve) => {
      browser.runtime.sendMessage({ action: 'WAIT_TAB_UPDATE' })
        .then((resp: any) => {
          logDebug('Background WAIT_TAB_UPDATE returned: ' + JSON.stringify(resp));
          if (resp?.success) {
            resolve(0);
          } else {
            logDebug('Background WAIT_TAB_UPDATE timed out or failed');
            resolve(0);
          }
        })
        .catch((e) => {
          logDebug(`Background WAIT_TAB_UPDATE message error: ${e}`);
          resolve(0);
        });
    });
  }
}