import { getTabUrl, getUrl, isAfter, isCacheCall, isNetworkResource, logDebug } from 'src/utils';
import type { DetailServer, DetailServerUrl, NetworkDetail, NetworkResponse } from 'src/interface';
import browser from 'webextension-polyfill';

export class NetworkService {

  getHarEntries(): Promise<any> {
    // TODO Firefox: problem
    return new Promise((resolve) => {
      browser.devtools.network.getHAR(resolve);
    });
  }

  filterNetworkResources(entries: HARFormatEntry[]) {
    return entries.filter((harEntry: HARFormatEntry) => isNetworkResource(harEntry));
  }

  calculateNbCache(entries: HARFormatEntry[]) {
    return entries.filter((harEntry: HARFormatEntry) => isCacheCall(harEntry)).length;
  }

  filterNewerOnly(entries: HARFormatEntry[], latest?: Date) {
    if (latest) {
      return entries.filter((harEntry: HARFormatEntry) => isAfter(harEntry, latest));
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
    const detailServers = Object.groupBy(entries, ({ request }) => getUrl(request.url)?.host ?? '');
    for (let index in Object.entries(detailServers)) {
      const key = Object.keys(detailServers)[index] ?? 'none';
      const mes = Object.values(detailServers)[index];
      const { detail, size } = this.calculateDetailServerUrl(mes);
      resp.push({
        hostname: key,
        oneUrl: mes ? getUrl(mes[0].request.url) : undefined,
        details: detail,
        sizeTotal: size
      });
    }
    return resp;
  }

  calculateDetailServerUrl(entries?: HARFormatEntry[]) {
    let detail: DetailServerUrl[] = [];
    let responsesSize = 0;
    let responsesSizeCompress = 0;
    if (entries) {
      entries.forEach((entry: HARFormatEntry) => {
        const size = entry.response._transferSize || 0;
        const sizeUncompress = entry.response.content.size;
        responsesSize += size;
        responsesSizeCompress += sizeUncompress;
        detail.push(
          {
            url: entry.request.url,
            cache: isCacheCall(entry),
            size: {
              size: size,
              sizeUncompress: sizeUncompress
            },
            resource: entry._resourceType || 'other'
          }
        );
      });
    }
    const size: NetworkResponse = {
      size: responsesSize,
      sizeUncompress: responsesSizeCompress
    };
    return { detail, size };
  }

}
