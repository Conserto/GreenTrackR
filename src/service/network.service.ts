import { PREFIX_URL_DATA, PREFIX_URL_EXTENSION } from '../const';
import { logDebug, logWarn } from '../utils/log';
import { getTabUrl } from '../utils';
import type { DetailServer, DetailServerUrl, NetworkDetail } from '../interface';

export class NetworkService {

  getUrl(url?: string) {
    let formattedUrl: URL | undefined = undefined;
    if (url && this.isRealUrl(url)) {
      // TODO REVOIR histoire www
      try {
        // FIXME a revoir aussi
        url = url.replace('blob:','');
        formattedUrl = new URL(url);
        if (formattedUrl.host.split('.').length <= 2) {
          formattedUrl.host = 'www.' + formattedUrl.host;
        }
      } catch (e) {
        logWarn(`Error when parsing url ${url} -> ${e}`);
      }
    } else {
      logWarn('No url found');
    }
    logDebug(`return url ${formattedUrl}`);
    return formattedUrl;
  }

  getHarEntries(): Promise<any> {
    return new Promise((resolve) => {
      chrome.devtools.network.getHAR(resolve);
    });
  }

  filterNetworkResources(entries: HARFormatEntry[]) {
    return entries.filter((harEntry: HARFormatEntry) => this.isNetworkResource(harEntry));
  }

  calculateNbCache(entries: HARFormatEntry[]) {
    return entries.filter((harEntry: HARFormatEntry) => this.isCacheCall(harEntry)).length;
  }

  filterNewerOnly(entries: HARFormatEntry[], latest?: Date) {
    if (latest) {
      return entries.filter((harEntry: HARFormatEntry) => this.isAfter(harEntry, latest));
    } else {
      return entries;
    }
  }

  async getMotherUrl() {
    const url = await getTabUrl();
    logDebug(`Mother url: ${url}`);
    return url;
  }

  calculateResponseSizes(entries: HARFormatEntry[]) {
    let responsesSize = 0;
    let responsesSizeUncompress = 0;
    entries.forEach((entry: HARFormatEntry) => {
      responsesSize += entry.response._transferSize || 0;
      responsesSizeUncompress += entry.response.content.size;
    });
    return { responsesSize, responsesSizeUncompress };
  }

  calculateDetailResponseSizes(entries: HARFormatEntry[]): NetworkDetail[] {
    let resp: NetworkDetail[] = [];
    const detailEntries = Object.groupBy(entries, ({ _resourceType }) => _resourceType ?? '');
    for (let index in Object.entries(detailEntries)) {
      const key = Object.keys(detailEntries)[index] ?? 'other';
      const mes = Object.values(detailEntries)[index];
      const { responsesSize, responsesSizeUncompress } = this.calculateResponseSizes(mes);
      const nbCache = this.calculateNbCache(mes);
      resp.push({
        resource: key,
        network: {
          size: responsesSize,
          sizeUncompress: responsesSizeUncompress
        },
        nbRequestCache: nbCache,
        nbRequest: mes?.length - nbCache
      });
    }
    return resp;
  }

  getDetailResourcesFromEntries(entries: HARFormatEntry[]): DetailServer[] {
    let resp: DetailServer[] = [];
    const detailServers = Object.groupBy(entries, ({ request }) => this.getUrl(request.url)?.host ?? '');
    for (let index in Object.entries(detailServers)) {
      const key = Object.keys(detailServers)[index] ?? 'none';
      const mes = Object.values(detailServers)[index];
      resp.push({
        hostname: key,
        oneUrl: mes ? this.getUrl(mes[0].request.url) : undefined,
        details: mes ? this.calculateDetailServerUrl(mes) : []
      });
    }
    return resp;
  }

  calculateDetailServerUrl(entries: HARFormatEntry[]) {
    let resp: DetailServerUrl[] = [];
    entries.forEach((entry: HARFormatEntry) => {
      resp.push(
        {
          url: entry.request.url,
          cache: this.isCacheCall(entry),
          size: {
            size: entry.response._transferSize || 0,
            sizeUncompress: entry.response.content.size
          },
          resource: entry._resourceType || 'other'
        }
      );
    });
    return resp;
  }

  /**
   * Detect network resources (data urls embedded in page is not network resource)
   *  Test with request.url as  request.httpVersion === "data"  does not work with old chrome version (example v55)
   */
  isNetworkResource(harEntry: HARFormatEntry) {
    return harEntry.request.url && !harEntry.request.url.startsWith(PREFIX_URL_DATA);
  }

  isCacheCall(harEntry: HARFormatEntry): boolean {
    return !!harEntry._fromCache;
  }

  isAfter(harEntry: HARFormatEntry, date: Date) {
    let reqDate = new Date(harEntry.startedDateTime);
    return reqDate > date;
  }

  isRealUrl(url: string) {
    return url !== '' && !PREFIX_URL_EXTENSION.test(url);
  }
}
