import { RequestAction } from 'src/enum';
import type { GES, Measure, NetworkMeasure } from '../interface';

import { GESService, NetworkService, ScoreService } from '.';
import { createEmptyMeasure, getTabUrl, reloadCurrentTab, sendChromeMsg } from 'src/utils';
import { PREFIX_URL_EXTENSION } from '../const';
import { logDebug, logInfo } from '../utils/log';
import { DOM_INFOS } from '../const/action.const';

export class MeasureAcquisition {
  public measure: Measure;
  private latest?: Date;
  private latestCheck?: Date;
  // FIXME Remise à zéro?
  private harRetryCount: number;
  private networkService: NetworkService;
  private gesService: GESService;
  private scoreService: ScoreService;

  constructor() {
    this.harRetryCount = 0;
    this.latest = undefined;
    this.latestCheck = undefined;
    this.networkService = new NetworkService();
    this.gesService = new GESService();
    this.scoreService = new ScoreService();
    this.measure = createEmptyMeasure();
  }

  updateMeasureValues(zoneGES?: GES, userGES?: GES): void {
    // Energie total requetes (réseau, user, server)
    const { ges, energy } = this.gesService.getEnergyAndGES(
      this.measure.networkMeasure.network,
      this.measure.networkMeasure.nbRequest,
      zoneGES,
      userGES
    );

    this.measure.ges = ges;
    this.measure.energy = energy;
    this.measure.userGES = userGES;
    this.measure.serverGES = zoneGES;
    this.measure.score = this.scoreService.getScore(this.measure.ges.pageTotal);
  }

  async getGESMeasure(countryCodeSelected: string, userCountryCodeSelected: string) {
    logDebug('Enter getGESMeasure');
    let urlHost = this.networkService.getUrl(this.measure.url);
    logDebug('Pass URL');
    const { zoneGES, userGES } = await this.gesService.computeGES(
      countryCodeSelected,
      userCountryCodeSelected,
      urlHost
    );
    logDebug('Pass computeGes');
    this.updateMeasureValues(zoneGES, userGES);
    logDebug('Pass update, wait Dom');
    await this.waitForDomElements();
    logDebug('End getGESMeasure');
    return this.measure;
  }

  async getNetworkMeasure(forceRefresh: boolean = true) {
    let har;
    if (this.harRetryCount === 0 && forceRefresh) {
      await this.retryGetNetworkMeasure(forceRefresh);
    } else {
      har = await this.networkService.getHarEntries();
      let entriesNetwork = this.networkService.filterNetworkResources(har.entries);
      let entriesNew = this.networkService.filterNewerOnly(entriesNetwork, this.latestCheck);
      let [entriesExtension, entriesPage] = this.filterEntriesExtensionAndPage(entriesNew);
      if (entriesPage.length == 0 && entriesNetwork.length == 0) {
        logDebug('entries_page.length == 0');
        await this.retryGetNetworkMeasure(forceRefresh);
      } else {
        this.measure = await this.getMeasureFromEntries(this.measure, entriesPage);
        this.measure = {
          ...this.measure,
          extensionMeasure: this.getNetworkAndRequestFromEntries(entriesExtension)
        };
        logInfo(`Extension request ignore, datas: requests=${this.measure.extensionMeasure.nbRequest}` +
          ` / size(compress/uncompress)=${this.measure.extensionMeasure.network.size}/${this.measure.extensionMeasure.network.size} KB`);
      }
    }
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
      networkMeasure: this.getNetworkAndRequestFromEntries(entries)
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
      network: {
        size: responsesSize,
        sizeUncompress: responsesSizeUncompress
      }
    };
    return networkMeasure;
  }

  async retryGetNetworkMeasure(forceRefresh: boolean): Promise<void> {
    // FIXME check
    // FIXME compteur réinitialisé?
    if (this.harRetryCount < parseInt(import.meta.env.VITE_MAX_HAR_RETRIES)) {
      // TODO check if undefined
      logInfo('Reload : ' + await getTabUrl());
      this.harRetryCount++;
      await reloadCurrentTab();

      //TODO: to delete, we'll have to implement this on service-worker so it can send message to svelte component
      // wen new entries are loaded -> Replace it by chrome?webNavigation.onCompleted on service-worker.ts (see this file)
      await this.waitTabUpdate();
      await this.getNetworkMeasure(forceRefresh);
    }
  }

  // FIXME Timeout
  waitForDomElements() {
    return new Promise<void>((resolve) => {
      const handleRuntimeMsg = async (message: { type: string; value: any }) => {
        logDebug('handleRuntimeMsg');
        if (message.type === DOM_INFOS) {
          chrome.runtime.onMessage.addListener(handleRuntimeMsg);
          this.measure.dom = message.value;
          resolve();
        }
      };

      chrome.runtime.onMessage.addListener(handleRuntimeMsg);
      sendChromeMsg({ action: RequestAction.GET_DOM_ELEMENTS });
    });
  }

  //TODO: to delete, we'll have to implement this on service-worker so it can send message to svelte component
  // wen new entries are loaded
  waitTabUpdate() {
    return new Promise((resolve) => {
      function onTabUpdated(updatedTabId: number, info: any) {
        // FIXME constante
        if (info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(onTabUpdated); // Remove the listener
          resolve(updatedTabId);
        }
      }

      chrome.tabs.onUpdated.addListener(onTabUpdated);
    });
  }

}
