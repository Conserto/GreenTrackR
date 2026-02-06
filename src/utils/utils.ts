import type { DetailServerUrl, Measure, TableHeader, TableSurHeader } from 'src/interface';
import { logDebug } from './log';
import { PREFIX_URL_DATA, PREFIX_URL_EXTENSION } from '../const';

// ==========================================
// WEBREQUEST CACHE (Firefox only)
// ==========================================

let webRequestCache: Map<string, { fromCache: boolean }> = new Map();
let webRequestDataLoaded = false;

export const setWebRequestCache = (cache: Map<string, { fromCache: boolean }>, loaded: boolean): void => {
  webRequestCache = cache;
  webRequestDataLoaded = loaded;
};

const isUrlCachedViaWebRequest = (url: string): boolean | null => {
  if (!webRequestDataLoaded) return null;

  let normalizedUrl = url;
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    normalizedUrl = parsed.href;
  } catch { /* ignore */ }

  const info = webRequestCache.get(normalizedUrl);
  if (info) return info.fromCache;

  const urlWithoutQuery = normalizedUrl.split('?')[0];
  for (const [cachedUrl, cachedInfo] of webRequestCache.entries()) {
    if (cachedUrl.split('?')[0] === urlWithoutQuery) {
      return cachedInfo.fromCache;
    }
  }

  return null;
};

// ==========================================
// EXISTING FUNCTIONS
// ==========================================

export const filterMeasure = (measures: Measure[], filter: string) => {
  if (measures) {
    return measures.filter((mes) => {
      return mes.action && mes.action === filter;
    });
  } else {
    return [];
  }
};

export const isNetworkResource = (harEntry: HARFormatEntry) => {
  return harEntry.request.url && !harEntry.request.url.startsWith(PREFIX_URL_DATA);
};

/**
 * Cache detection - Firefox uses webRequest API, Chrome uses HAR
 */
export const isCacheCall = (harEntry: HARFormatEntry): boolean => {
  const response = harEntry.response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entryAny = harEntry as any;
  const IS_FIREFOX = typeof navigator !== 'undefined' && /Firefox/i.test(navigator.userAgent);

  // FIREFOX: webRequest API en priorité (fiable)
  if (IS_FIREFOX) {
    const webRequestResult = isUrlCachedViaWebRequest(harEntry.request?.url);
    if (webRequestResult !== null) {
      return webRequestResult;
    }
  }

  // CHROME: _fromCache
  if (harEntry._fromCache) {
    return true;
  }

  // CHROME: _transferSize > 0 = PAS cache
  const transferSize = response?._transferSize;
  if (typeof transferSize === 'number' && transferSize > 0) {
    return false;
  }

  // FIREFOX: bodySize < 0 = cache
  if (IS_FIREFOX) {
    const bodySize = response?.bodySize;
    if (typeof bodySize === 'number' && bodySize < 0) {
      return true;
    }
    if (typeof transferSize === 'number' && transferSize < 0) {
      return true;
    }
  }

  // Status 304
  if (response?.status === 304) {
    return true;
  }

  // Cache headers
  const headers = response?.headers || [];
  const xCache = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'x-cache');
  if (xCache?.value?.toLowerCase().includes('hit')) {
    return true;
  }
  const cfCache = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'cf-cache-status');
  if (cfCache?.value?.toLowerCase() === 'hit') {
    return true;
  }

  // Cache object / flags
  if (entryAny.cache?.beforeRequest || entryAny.cache?.afterRequest) {
    return true;
  }
  if (entryAny._fromDiskCache || entryAny._fromMemoryCache) {
    return true;
  }

  return false;
};

export const isAfter = (harEntry: HARFormatEntry, date: Date) => {
  let reqDate = new Date(harEntry.startedDateTime);
  return reqDate > date;
};

export const isRealUrl = (url: string) => {
  return url !== '' && !PREFIX_URL_EXTENSION.test(url);
};

export const getRealCall = (details: DetailServerUrl[]) => {
  return details.filter(d => !d.cache).length;
};

export const getLocalStorageObject = (key: string) => {
  const stringValue = localStorage.getItem(key);
  logDebug(`Value for ${key}: ${stringValue}`);
  if (stringValue && stringValue.length > 0) {
    return JSON.parse(stringValue);
  } else {
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorageObject = (key: string, value: any) => {
  logDebug(`Save ${key} -> ${value}`);
  localStorage.setItem(key, JSON.stringify(value));
};

export const getSurHead = (tableHeaders: TableHeader[]): Map<string, TableSurHeader> => {
  let result = new Map<string, TableSurHeader>();
  tableHeaders.forEach(val => {
    let head = val.groupHead ? val.groupHead : '';
    let data = result.get(head);
    if (data) {
      result.set(head, {
        colspan: data.colspan + 1,
        id: data.id,
        translateKey: head.length > 0 ? head : undefined,
        icon: val.icon ? val.icon : data.icon,
        class: val.class
      });
    } else {
      result.set(head, {
        colspan: 1,
        id: head,
        translateKey: head.length > 0 ? head : undefined,
        icon: val.icon ? val.icon : undefined,
        class: val.class
      });
    }
  });
  return result;
};

export const createEmptyMeasure = (): Measure => {
  return {
    date: new Date(),
    url: '',
    ges: { dataCenterTotal: 0, networkTotal: 0, deviceTotal: 0, pageTotal: 0 },
    wu: { dataCenterTotal: 0, networkTotal: 0, deviceTotal: 0, pageTotal: 0 },
    adpe: { dataCenterTotal: 0, networkTotal: 0, deviceTotal: 0, pageTotal: 0 },
    energy: { kWhDataCenter: 0, kWhNetwork: 0, kWhDevice: 0, kWhPage: 0 },
    score: { value: 0, color: '', textColor: '', gradeLetter: '', limit: 0 },
    userGES: { carbonIntensity: 0, wu: 0, adpe: 0, countryName: '', cityName: '', countryCode: '', display: '' },
    serverGES: { carbonIntensity: 0, wu: 0, adpe: 0, countryName: '', cityName: '', countryCode: '', display: '' },
    complete: false,
    dom: 0,
    extensionMeasure: { nbRequest: 0, nbRequestCache: 0, detail: [], network: { size: 0, sizeUncompress: 0 } },
    networkMeasure: { nbRequest: 0, nbRequestCache: 0, detail: [], network: { size: 0, sizeUncompress: 0 } }
  };
};

export const scrollPrompt = (topPrompt: number, leftPrompt: number, timeout: number) => {
  logDebug(`Scroll ${topPrompt} / ${leftPrompt}`);
  const end = (document.body.scrollHeight - window.innerHeight) === window.scrollY;
  if (!end) {
    window.scrollBy({ left: leftPrompt, top: topPrompt, behavior: 'smooth' });
    return new Promise<void>((resolve, reject) => {
      const failed = setTimeout(() => { reject(Error('Timeout')); }, timeout);
      window.addEventListener('scrollend', () => {
        clearTimeout(failed);
        resolve();
      });
    });
  } else {
    logDebug('End Of Page');
    return new Promise<void>((resolve) => resolve());
  }
};