import { browser } from 'wxt/browser';
import { getTabUrl, getUrl, isAfter, isCacheCall, isNetworkResource, logDebug, logWarn } from 'src/utils';
import type { DetailServer, DetailServerUrl, NetworkDetail, NetworkResponse } from 'src/interface';

/**
 * Content-Type to resource type mapping (Firefox fallback)
 */
const CONTENT_TYPE_MAP: Record<string, string> = {
  'text/html': 'document',
  'application/xhtml+xml': 'document',
  'text/css': 'stylesheet',
  'text/javascript': 'script',
  'application/javascript': 'script',
  'application/x-javascript': 'script',
  'application/json': 'xhr',
  'application/xml': 'xhr',
  'text/xml': 'xhr',
  'image/': 'image',
  'font/': 'font',
  'application/font': 'font',
  'application/x-font': 'font',
  'video/': 'media',
  'audio/': 'media',
};

/**
 * File extension to resource type mapping (Firefox fallback)
 */
const EXTENSION_MAP: Record<string, string> = {
  '.html': 'document',
  '.htm': 'document',
  '.css': 'stylesheet',
  '.js': 'script',
  '.mjs': 'script',
  '.json': 'xhr',
  '.xml': 'xhr',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.gif': 'image',
  '.webp': 'image',
  '.svg': 'image',
  '.ico': 'image',
  '.avif': 'image',
  '.woff': 'font',
  '.woff2': 'font',
  '.ttf': 'font',
  '.otf': 'font',
  '.eot': 'font',
  '.mp4': 'media',
  '.webm': 'media',
  '.mp3': 'media',
  '.ogg': 'media',
  '.wav': 'media',
};

export class NetworkService {

  /**
   * Get HAR entries from DevTools
   * Handles both Chrome and Firefox
   */
  getHarEntries(retryCount: number = 0, maxRetries: number = 3): Promise<{ entries: HARFormatEntry[] }> {
    return new Promise((resolve) => {
      if (!browser.devtools?.network?.getHAR) {
        logWarn('browser.devtools.network.getHAR not available');
        resolve({ entries: [] });
        return;
      }

      browser.devtools.network.getHAR((har) => {
        const harAny = har as any;
        const entries: HARFormatEntry[] = harAny?.entries || harAny?.log?.entries || [];

        logDebug(`HAR entries count: ${entries.length}`);

        if (entries.length === 0 && retryCount < maxRetries) {
          logDebug(`HAR empty, retrying (${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => {
            this.getHarEntries(retryCount + 1, maxRetries).then(resolve);
          }, 500);
        } else {
          resolve({ entries });
        }
      });
    });
  }

  filterNetworkResources(entries: HARFormatEntry[]): HARFormatEntry[] {
    const filtered = entries.filter((entry) => isNetworkResource(entry));
    logDebug(`filterNetworkResources: ${entries.length} -> ${filtered.length} entries`);
    return filtered;
  }

  calculateNbCache(entries: HARFormatEntry[]): number {
    return entries.filter((entry) => isCacheCall(entry)).length;
  }

  filterNewerOnly(entries: HARFormatEntry[], latest?: Date): HARFormatEntry[] {
    if (latest) {
      const filtered = entries.filter((entry) => isAfter(entry, latest));
      logDebug(`filterNewerOnly: ${entries.length} -> ${filtered.length} entries`);
      return filtered;
    }
    return entries;
  }

  async getMotherUrl(): Promise<string | undefined> {
    const url = await getTabUrl();
    logDebug(`Mother url: ${url}`);
    return url;
  }

  calculateResponseSizes(entries: HARFormatEntry[]): { responsesSize: number; responsesSizeUncompress: number } {
    let responsesSize = 0;
    let responsesSizeUncompress = 0;

    entries.forEach((entry) => {
      responsesSize += this.getTransferSize(entry);
      responsesSizeUncompress += entry.response?.content?.size ?? 0;
    });

    return { responsesSize, responsesSizeUncompress };
  }

  /**
   * Get transfer size (cross-browser)
   * Chrome: _transferSize | Firefox: bodySize or content.size
   */
  private getTransferSize(entry: HARFormatEntry): number {
    if (typeof entry.response?._transferSize === 'number' && entry.response._transferSize > 0) {
      return entry.response._transferSize;
    }

    const bodySize = entry.response?.bodySize ?? 0;
    if (bodySize > 0) {
      return bodySize;
    }

    return entry.response?.content?.size ?? 0;
  }

  calculateDetailResponseSizes(entries: HARFormatEntry[]): NetworkDetail[] {
    const resp: NetworkDetail[] = [];
    const grouped = Object.groupBy(entries, (entry) => this.getResourceType(entry));

    for (const [resourceType, groupEntries] of Object.entries(grouped)) {
      if (!groupEntries || groupEntries.length === 0) continue;

      const { responsesSize, responsesSizeUncompress } = this.calculateResponseSizes(groupEntries);
      const nbCache = this.calculateNbCache(groupEntries);

      resp.push({
        resource: resourceType ?? 'other',
        network: { size: responsesSize, sizeUncompress: responsesSizeUncompress },
        nbRequestCache: nbCache,
        nbRequest: groupEntries.length - nbCache
      });
    }

    // Sort: 'other' always last, rest alphabetically
    return resp.sort((a, b) => {
      if (a.resource === 'other') return 1;
      if (b.resource === 'other') return -1;
      return a.resource.localeCompare(b.resource);
    });
  }

  /**
   * Get resource type (cross-browser)
   * Chrome: _resourceType directly | Firefox: Content-Type or URL extension
   */
  getResourceType(entry: HARFormatEntry): string {
    // Chrome provides _resourceType
    if (entry._resourceType) {
      return entry._resourceType;
    }

    // Firefox: detect from Content-Type header
    const contentType = this.getHeaderValue(entry.response?.headers, 'content-type');
    if (contentType) {
      for (const [type, resourceType] of Object.entries(CONTENT_TYPE_MAP)) {
        if (contentType.startsWith(type)) {
          return resourceType;
        }
      }
    }

    // Firefox: detect from URL extension
    const urlPath = (entry.request?.url || '').split('?')[0].toLowerCase();
    for (const [ext, resourceType] of Object.entries(EXTENSION_MAP)) {
      if (urlPath.endsWith(ext)) {
        return resourceType;
      }
    }

    // Firefox: check initiator for XHR
    const initiator = entry._initiator as any;
    if (initiator?.type === 'xmlhttprequest' || initiator?.type === 'fetch') {
      return 'xhr';
    }

    return 'other';
  }

  /**
   * Get header value by name (case-insensitive)
   */
  private getHeaderValue(headers: any[] | undefined, name: string): string | null {
    if (!headers) return null;
    const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value.split(';')[0].trim().toLowerCase() : null;
  }

  getDetailResourcesFromEntries(entries: HARFormatEntry[]): DetailServer[] {
    const resp: DetailServer[] = [];
    const grouped = Object.groupBy(entries, ({ request }) => getUrl(request?.url)?.host ?? 'unknown');

    for (const [hostname, groupEntries] of Object.entries(grouped)) {
      if (!groupEntries || groupEntries.length === 0) continue;

      const { detail, size } = this.calculateDetailServerUrl(groupEntries);
      resp.push({
        hostname: hostname ?? 'unknown',
        oneUrl: groupEntries[0]?.request?.url ? getUrl(groupEntries[0].request.url) : undefined,
        details: detail,
        sizeTotal: size
      });
    }

    return resp;
  }

  calculateDetailServerUrl(entries?: HARFormatEntry[]): { detail: DetailServerUrl[]; size: NetworkResponse } {
    const detail: DetailServerUrl[] = [];
    let responsesSize = 0;
    let responsesSizeUncompress = 0;

    if (entries) {
      entries.forEach((entry) => {
        const size = this.getTransferSize(entry);
        const sizeUncompress = entry.response?.content?.size ?? 0;

        responsesSize += size;
        responsesSizeUncompress += sizeUncompress;

        detail.push({
          url: entry.request?.url ?? '',
          cache: isCacheCall(entry),
          size: { size, sizeUncompress },
          resource: this.getResourceType(entry)
        });
      });
    }

    return {
      detail,
      size: { size: responsesSize, sizeUncompress: responsesSizeUncompress }
    };
  }
}