import { RequestAction } from 'src/enum';
import type { GES, Measure } from '../../interface';
import { sendChromeMsg } from '../chrome.utils';

import { NetworkService, GESService, ScoreService } from '../service';

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
    this.measure = this.initMeasureAcquisition();
  }

  initMeasureAcquisition(): Measure {
    return {
      date: new Date(),
      cityName: '',
      url: '',
      network: {
        size: 0,
        sizeUncompress: 0,
      },
      ges: {
        dataCenterTotal: 0,
        networkTotal: 0,
        deviceTotal: 0,
        pageTotal: 0,
      },
      energy: {
        kWhDataCenter: 0,
        kWhNetwork: 0,
        kWhDevice: 0,
        kWhPage: 0,
      },
      nbRequest: 0,
      zone: '',
      score: {
        value: 0,
        color: '',
        textColor: '',
        gradeLetter: '',
        limit: 0,
      },
      carbonIntensity: 0,
      dom: 0,
    };
  }

  updateMeasureValues(zoneGES: GES | undefined, userGES: GES | undefined): void {
    if (zoneGES && userGES) {
      //Energie total requetes (réseau, user, server)
      const { ges, energy } = this.gesService.getEnergyAndGES(
        zoneGES,
        userGES,
        this.measure.network,
        this.measure.nbRequest,
      );

      this.measure.ges = ges;
      this.measure.energy = energy;
      this.measure.userGES = userGES;
      this.measure.serverGES = zoneGES;
      this.measure.score = this.scoreService.getScore(this.measure.ges.pageTotal);
    }
  }

  async getGESMeasure(countryCodeSelected: string, userCountryCodeSelected: string) {
    let urlHost = this.networkService.getUrl(this.measure.url);
    const { zoneGES, userGES } = await this.gesService.computeGES(
      urlHost,
      countryCodeSelected,
      userCountryCodeSelected,
    );
    this.updateMeasureValues(zoneGES, userGES);
    await this.waitForDomElements();
    return this.measure;
  }

  async getNetworkMeasure(forceRefresh: boolean = true) {
    let har,
      entries: HARFormatEntry[] = [];
    if (this.harRetryCount === 0 && forceRefresh) {
      await this.retryGetNetworkMeasure();
    } else {
      har = await this.networkService.getHarEntries();
      entries = this.networkService.filterNetworkResources(har.entries);
      if (entries.length > 0) {
        const { responsesSize, responsesSizeUncompress } =
          this.networkService.calculateResponseSizes(entries);
        this.measure = {
          ...this.measure,
          date: new Date(),
          url: this.networkService.getMotherUrl(entries) || '',
          nbRequest: entries.length,
          network: {
            size: responsesSize,
            sizeUncompress: responsesSizeUncompress,
          },
        };
      } else {
        await this.retryGetNetworkMeasure();
      }
    }
  }
  async retryGetNetworkMeasure(): Promise<void> {
    if (this.harRetryCount < parseInt(import.meta.env.VITE_MAX_HAR_RETRIES)) {
      this.harRetryCount++;
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.reload(() => tabs[0].id);

      //TODO: to delete, we'll have to implement this on service-worker so it can send message to svelte component
      // wen new entries are loaded -> Replace it by chrome?webNavigation.onCompleted on service-worker.ts (see this file)
      await this.waitTabUpdate();
      await this.getNetworkMeasure();
    }
  }

  waitForDomElements() {
    return new Promise<void>((resolve) => {
      const handleRuntimeMsg = async (message: { type: string; value: any }) => {
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
        if (info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(onTabUpdated); // Remove the listener
          resolve(updatedTabId);
        }
      }

      chrome.tabs.onUpdated.addListener(onTabUpdated);
    });
  }

  static async getZones() {
    let zones = await fetch(
      `
        ${import.meta.env.VITE_CARBON_API_URL}/zones`,
    );
    const zonesContent = await zones.json();
    const sortedZones = zonesContent?.sort((a: any, b: any) =>
      a.countryName.localeCompare(b.countryName),
    );

    return sortedZones;
  }
}
