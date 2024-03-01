export class NetworkService {
  cosntructor() {}

  getUrl(url: string) {
    var formattedUrl = new URL(url);
    if (formattedUrl.host.split('.').length <= 2) {
      formattedUrl.host = 'www.' + formattedUrl.host;
    }
    return formattedUrl;
  }

  getHarEntries(): Promise<any> {
    return new Promise((resolve) => {
      chrome.devtools.network.getHAR(resolve);
    });
  }

  filterNetworkResources(entries: HARFormatEntry[]) {
    return entries.filter((harEntry: HARFormatEntry) => !harEntry.request.url.startsWith('data'));
  }

  getMotherUrl(entries: HARFormatEntry[]) {
    return entries.length > 0 ? entries[0].request.url : null;
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
    return !harEntry.request.url.startsWith('data');
  }
}
