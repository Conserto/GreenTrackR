import { browser } from 'wxt/browser';
import { getTabUrl, getUrl, isAfter, isCacheCall, isNetworkResource, logDebug, logWarn, logInfo } from 'src/utils';
import type { DetailServer, DetailServerUrl, NetworkDetail, NetworkResponse } from 'src/interface';

/**
 * Detect Firefox browser
 */
const IS_FIREFOX = typeof navigator !== 'undefined' && /Firefox/i.test(navigator.userAgent);

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

export class NetworkService {

  /**
   * Get HAR entries - OPTIMIZED FOR FIREFOX
   * Firefox needs more time to populate the HAR after navigation
   */
  getHarEntries(retryCount: number = 0, maxRetries: number = 5): Promise<{ entries: HARFormatEntry[] }> {
    return new Promise((resolve) => {
      if (!browser.devtools?.network?.getHAR) {
        logWarn('browser.devtools.network.getHAR not available');
        resolve({ entries: [] });
        return;
      }

      browser.devtools.network.getHAR((har) => {
        const harAny = har as any;
        const entries: HARFormatEntry[] = harAny?.entries || harAny?.log?.entries || [];

        logDebug(`HAR entries count: ${entries.length} (attempt ${retryCount + 1}/${maxRetries + 1})`);

        // Firefox: give more time if HAR is empty and it's a retry
        if (entries.length === 0 && retryCount < maxRetries) {
          // Progressive delay: 300ms, 500ms, 800ms, 1200ms, 1500ms
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

  /**
   * Size calculation OPTIMIZED with detailed logs
   */
  calculateResponseSizes(entries: HARFormatEntry[]): { responsesSize: number; responsesSizeUncompress: number } {
    let responsesSize = 0;
    let responsesSizeUncompress = 0;
    let cacheCount = 0;
    let realCount = 0;

    // Group by cache status for clean logs
    const cached: string[] = [];
    const real: string[] = [];

    entries.forEach((entry) => {
      const isCache = isCacheCall(entry);
      const transferSize = this.getTransferSize(entry);
      const uncompressSize = this.getUncompressedSize(entry);

      responsesSize += transferSize;
      responsesSizeUncompress += uncompressSize;

      const urlShort = entry.request.url.split('?')[0].substring(entry.request.url.lastIndexOf('/') + 1);

      if (isCache) {
        cacheCount++;
        cached.push(urlShort);
      } else {
        realCount++;
        real.push(`${urlShort} (${Math.round(transferSize)}KB)`);
      }
    });

    // Condensed and informative logs
    if (cached.length > 0) {
      logInfo(`🟢 CACHED (${cacheCount}): ${cached.slice(0, 3).join(', ')}${cached.length > 3 ? ` +${cached.length - 3} more` : ''}`);
    }
    if (real.length > 0) {
      logInfo(`🔵 REAL (${realCount}): ${real.slice(0, 3).join(', ')}${real.length > 3 ? ` +${real.length - 3} more` : ''}`);
    }

    logInfo(`📊 Total: ${responsesSize.toFixed(2)} KB transferred, ${responsesSizeUncompress.toFixed(2)} KB uncompressed`);

    return { responsesSize, responsesSizeUncompress };
  }

  /**
   * Get transfer size - ULTRA-ROBUST VERSION
   */
  private getTransferSize(entry: HARFormatEntry): number {
    const response = entry.response;

    // If cache detected, transferSize = 0
    if (isCacheCall(entry)) {
      return 0;
    }

    // Chrome: _transferSize
    const transferSize = response?._transferSize ?? null;
    if (typeof transferSize === 'number' && transferSize > 0) {
      return transferSize;
    }

    // Firefox: bodySize (but not if negative)
    const bodySize = response?.bodySize ?? 0;
    if (bodySize > 0) {
      return bodySize;
    }

    // Fallback: content.size
    const contentSize = response?.content?.size ?? 0;
    if (contentSize > 0) {
      // If we get here with a negative bodySize, it's an undetected cache
      if (bodySize < 0 || (transferSize !== null && transferSize < 0)) {
        logDebug(`⚠️ Possible cache miss-detection: ${entry.request.url.substring(0, 60)}...`);
        return 0;
      }
      return contentSize;
    }

    return 0;
  }

  /**
   * Get uncompressed size - ROBUST VERSION
   */
  private getUncompressedSize(entry: HARFormatEntry): number {
    const response = entry.response;
    const contentSize = response?.content?.size ?? 0;

    // Firefox can return -1 for certain resources
    if (contentSize < 0) {
      // Try bodySize or transferSize
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

    // Sort: 'other' always last, rest alphabetically
    return resp.sort((a, b) => {
      if (a.resource === 'other') return 1;
      if (b.resource === 'other') return -1;
      return a.resource.localeCompare(b.resource);
    });
  }

  /**
   * Get resource type (cross-browser)
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
        const sizeUncompress = this.getUncompressedSize(entry);

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