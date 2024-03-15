import { RequestAction } from 'src/enum';
import type { GES, Measure, NetworkMeasure } from '../interface';

import { GESService, NetworkService, ScoreService } from '.';
import { createEmptyMeasure, sendChromeMsg } from 'src/utils';
import { PREFIX_URL_EXTENSION } from '../const';
import { logDebug, logInfo } from '../utils/log';

export class MeasureAcquisition {
  public measure: Measure;
  private harRetryCount: number;
  private networkService: NetworkService;
  private gesService: GESService;
  private scoreService: ScoreService;

  constructor() {
    this.harRetryCount = 0;
    this.networkService = new NetworkService();
    this.gesService = new GESService();
    this.scoreService = new ScoreService();
    this.measure = createEmptyMeasure();
  }

  updateMeasureValues(zoneGES: GES | undefined, userGES: GES | undefined): void {
    // Energie total requetes (réseau, user, server)
    const { ges, energy } = this.gesService.getEnergyAndGES(
      zoneGES,
      userGES,
      this.measure.networkMeasure.network,
      this.measure.networkMeasure.nbRequest
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
      urlHost,
      countryCodeSelected,
      userCountryCodeSelected
    );
    logDebug('Pass computeGes');
    this.updateMeasureValues(zoneGES, userGES);
    logDebug('Pass update, wait Dom');
    await this.waitForDomElements();
    logDebug('End getGESMeasure');
    return this.measure;
  }

  async getNetworkMeasure(forceRefresh: boolean = true) {
    let har,
      entries: HARFormatEntry[] = [],
      entries_page: HARFormatEntry[] = [],
      entries_extension: HARFormatEntry[] = [];
    if (this.harRetryCount === 0 && forceRefresh) {
      await this.retryGetNetworkMeasure();
    } else {
      har = await this.networkService.getHarEntries();
      entries = this.networkService.filterNetworkResources(har.entries);
      entries.forEach((entry) => {
        if (PREFIX_URL_EXTENSION.test(entry.request.url)) {
          entries_extension.push(entry);
        } else {
          entries_page.push(entry);
        }
      });
      if (entries_page.length == 0) {
        await this.retryGetNetworkMeasure();
      }
      this.measure = await this.getMeasureFromEntries(this.measure, entries_page);
      this.measure = {
        ...this.measure,
        extensionMeasure: this.getNetworkAndRequestFromEntries(entries_extension)
      };
      logInfo(`Extension request ignore, datas: requests=${this.measure.extensionMeasure.nbRequest}` +
        ` / size(compress/uncompress)=${this.measure.extensionMeasure.network.size}/${this.measure.extensionMeasure.network.size} KB`);
    }
  }

  async getMeasureFromEntries(measureCurrent: Measure, entries: HARFormatEntry[]) {
    let measureNew: Measure;
    measureNew = {
      ...measureCurrent,
      date: new Date(),
      url: await this.networkService.getMotherUrl(entries),
      networkMeasure: this.getNetworkAndRequestFromEntries(entries)
    };
    return measureNew;
  }

  getNetworkAndRequestFromEntries(entries: HARFormatEntry[]) {
    let networkMeasure: NetworkMeasure;
    const { responsesSize, responsesSizeUncompress } =
      this.networkService.calculateResponseSizes(entries);
    networkMeasure = {
      nbRequest: entries.length,
      network: {
        size: responsesSize,
        sizeUncompress: responsesSizeUncompress
      }
    };
    return networkMeasure;
  }

  async retryGetNetworkMeasure(): Promise<void> {
    // FIXME check
    if (this.harRetryCount < parseInt(import.meta.env.VITE_MAX_HAR_RETRIES)) {
      this.harRetryCount++;
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.reload(() => tabs[0].id);

      //TODO: to delete, we'll have to implement this on service-worker so it can send message to svelte component
      // wen new entries are loaded -> Replace it by chrome?webNavigation.onCompleted on service-worker.ts (see this file)
      await this.waitTabUpdate();
      await this.getNetworkMeasure();
    }
  }

  waitForDomElements() {
    return new Promise<void>((resolve) => {
      const handleRuntimeMsg = async (message: { type: string; value: any }) => {
        // FIXME constante
        if (message.type === 'domInfos') {
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
