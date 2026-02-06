import { browser } from 'wxt/browser';
import {
  getTabUrl,
  getUrl,
  isAfter,
  isNetworkResource,
  isCacheCall,
  setWebRequestCache,
  logDebug,
  logWarn,
  logInfo,
  getTabId
} from 'src/utils';
import type { DetailServer, DetailServerUrl, NetworkDetail, NetworkResponse } from 'src/interface';

// ==========================================
// TYPES
// ==========================================

interface WebRequestCacheInfo {
  url: string;
  fromCache: boolean;
}

interface WebRequestResponse {
  success: boolean;
  data?: WebRequestCacheInfo[];
}

// ==========================================
// CONSTANTS
// ==========================================

const IS_FIREFOX = typeof navigator !== 'undefined' && /Firefox/i.test(navigator.userAgent);

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
  '.avif': 'image',
  '.svg': 'image',
  '.ico': 'image',
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

// ==========================================
// NETWORK SERVICE
// ==========================================

export class NetworkService {

  async fetchWebRequestCacheInfo(): Promise<void> {
    if (!IS_FIREFOX) {
      logDebug('Chrome detected - using HAR for cache detection');
      setWebRequestCache(new Map(), false);
      return;
    }

    const tabId = getTabId();
    if (!tabId) {
      logWarn('No tab ID for fetching webRequest cache info');
      return;
    }

    try {
      const response = await browser.runtime.sendMessage({
        action: 'GET_REQUEST_CACHE_INFO',
        tabId
      }) as WebRequestResponse;

      if (response?.success && response.data) {
        const cache = new Map<string, { fromCache: boolean }>();

        for (const info of response.data) {
          let normalizedUrl = info.url;
          try {
            const parsed = new URL(info.url);
            parsed.hash = '';
            normalizedUrl = parsed.href;
          } catch { /* ignore */ }
          cache.set(normalizedUrl, { fromCache: info.fromCache });
        }

        setWebRequestCache(cache, true);
        logInfo(`✅ Firefox: Loaded ${cache.size} requests from webRequest API`);
      }
    } catch (error) {
      logWarn(`Failed to fetch webRequest cache info: ${error}`);
      setWebRequestCache(new Map(), false);
    }
  }

  async getHarEntries(retryCount = 0, maxRetries = 5): Promise<{ entries: HARFormatEntry[] }> {
    await this.fetchWebRequestCacheInfo();

    return new Promise((resolve) => {
      if (!browser.devtools?.network?.getHAR) {
        logWarn('browser.devtools.network.getHAR not available');
        resolve({ entries: [] });
        return;
      }

      browser.devtools.network.getHAR((har) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const harAny = har as any;
        const entries: HARFormatEntry[] = harAny?.entries || harAny?.log?.entries || [];

        logDebug(`HAR entries count: ${entries.length} (attempt ${retryCount + 1}/${maxRetries + 1})`);

        if (entries.length === 0 && retryCount < maxRetries) {
          const delay = IS_FIREFOX ? Math.min(300 + retryCount * 300, 1500) : 500;
          logDebug(`HAR empty, retrying in ${delay}ms (${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => {
            this.getHarEntries(retryCount + 1, maxRetries).then(resolve);
          }, delay);
        } else {
          if (entries.length > 0) {
            logInfo(`✓ HAR populated with ${entries.length} entries`);
          }
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
    const cacheCount = entries.filter((entry) => isCacheCall(entry)).length;
    logDebug(`Cache detection: ${cacheCount}/${entries.length} cached`);
    return cacheCount;
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
    let cacheCount = 0;
    let realCount = 0;
    const cached: string[] = [];
    const real: string[] = [];

    entries.forEach((entry) => {
      const isCache = isCacheCall(entry);
      const transferSize = this.getTransferSize(entry, isCache);
      const uncompressSize = this.getUncompressedSize(entry);

      responsesSize += transferSize;
      responsesSizeUncompress += uncompressSize;

      const urlShort = entry.request.url.split('?')[0].substring(entry.request.url.lastIndexOf('/') + 1) || '[root]';

      if (isCache) {
        cacheCount++;
        cached.push(urlShort);
      } else {
        realCount++;
        real.push(`${urlShort} (${Math.round(transferSize)}KB)`);
      }
    });

    if (cached.length > 0) {
      logInfo(`🟢 CACHED (${cacheCount}): ${cached.slice(0, 3).join(', ')}${cached.length > 3 ? ` +${cached.length - 3} more` : ''}`);
    }
    if (real.length > 0) {
      logInfo(`🔵 REAL (${realCount}): ${real.slice(0, 3).join(', ')}${real.length > 3 ? ` +${real.length - 3} more` : ''}`);
    }
    logInfo(`📊 Total: ${responsesSize.toFixed(2)} KB transferred, ${responsesSizeUncompress.toFixed(2)} KB uncompressed`);

    return { responsesSize, responsesSizeUncompress };
  }

  private getTransferSize(entry: HARFormatEntry, isCache?: boolean): number {
    const response = entry.response;

    if (isCache ?? isCacheCall(entry)) {
      return 0;
    }

    const transferSize = response?._transferSize;
    if (typeof transferSize === 'number' && transferSize > 0) {
      return transferSize;
    }

    const bodySize = response?.bodySize ?? 0;
    if (bodySize > 0) {
      return bodySize;
    }

    const contentSize = response?.content?.size ?? 0;
    if (contentSize > 0) {
      return contentSize;
    }

    return 0;
  }

  private getUncompressedSize(entry: HARFormatEntry): number {
    const response = entry.response;
    const contentSize = response?.content?.size ?? 0;

    if (contentSize < 0) {
      const bodySize = response?.bodySize ?? 0;
      const transferSize = response?._transferSize ?? 0;
      if (bodySize > 0) return bodySize;
      if (transferSize > 0) return transferSize;
      return 0;
    }

    return contentSize;
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

      logDebug(`📦 ${resourceType}: ${groupEntries.length} total (${nbCache} cached, ${groupEntries.length - nbCache} real)`);
    }

    return resp.sort((a, b) => {
      if (a.resource === 'other') return 1;
      if (b.resource === 'other') return -1;
      return a.resource.localeCompare(b.resource);
    });
  }

  getResourceType(entry: HARFormatEntry): string {
    if (entry._resourceType) {
      return entry._resourceType;
    }

    const headers = entry.response?.headers || [];
    const contentTypeHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'content-type');
    const contentType = contentTypeHeader?.value?.split(';')[0].trim().toLowerCase();

    if (contentType) {
      for (const [type, resourceType] of Object.entries(CONTENT_TYPE_MAP)) {
        if (contentType.startsWith(type)) {
          return resourceType;
        }
      }
    }

    const urlPath = (entry.request?.url || '').split('?')[0].toLowerCase();
    for (const [ext, resourceType] of Object.entries(EXTENSION_MAP)) {
      if (urlPath.endsWith(ext)) {
        return resourceType;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initiator = (entry as any)._initiator;
    if (initiator?.type === 'xmlhttprequest' || initiator?.type === 'fetch') {
      return 'xhr';
    }

    return 'other';
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
        const isCache = isCacheCall(entry);
        const size = this.getTransferSize(entry, isCache);
        const sizeUncompress = this.getUncompressedSize(entry);

        responsesSize += size;
        responsesSizeUncompress += sizeUncompress;

        detail.push({
          url: entry.request?.url ?? '',
          cache: isCache,
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