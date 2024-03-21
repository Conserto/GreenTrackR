import { PREFIX_URL_DATA, PREFIX_URL_EXTENSION } from '../const';
import { logInfo, logWarn } from '../utils/log';
import { getTabUrl } from '../utils';

export class NetworkService {

  getUrl(url?: string) {
    let formattedUrl: URL | undefined = undefined;
    if (url && this.isRealUrl(url)) {
      try {
        formattedUrl = new URL(url);
        // FIXME pourquoi en dur, quel est le but d'ajouter www si 0 ou 1 ou 2?
        if (formattedUrl.host.split('.').length <= 2) {
          formattedUrl.host = 'www.' + formattedUrl.host;
        }
      } catch (e) {
        logWarn(`Error when parsing url ${url} -> ${e}`);
      }
    } else {
      logWarn('No url found');
    }
    logInfo(`return url ${formattedUrl}`);
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
    logInfo(`Mother url: ${url}`);
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

  /**
   * Detect network resources (data urls embedded in page is not network resource)
   *  Test with request.url as  request.httpVersion === "data"  does not work with old chrome version (example v55)
   */
  isNetworkResource(harEntry: HARFormatEntry) {
    return harEntry.request.url && !harEntry.request.url.startsWith(PREFIX_URL_DATA);
  }

  isCacheCall(harEntry: HARFormatEntry) {
    return harEntry._fromCache;
  }

  isAfter(harEntry: HARFormatEntry, date: Date) {
    let reqDate = new Date(harEntry.startedDateTime);
    return reqDate > date;
  }

  isRealUrl(url: string) {
    return url !== '' && !PREFIX_URL_EXTENSION.test(url);
  }
}
