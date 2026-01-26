import type { DetailServerUrl, Measure, TableHeader, TableSurHeader } from 'src/interface';
import { logDebug } from './log';
import { PREFIX_URL_DATA, PREFIX_URL_EXTENSION } from '../const';

export const filterMeasure = (measures: Measure[], filter: string) => {
  if (measures) {
    return measures.filter((mes) => {
      return mes.action && mes.action === filter;
    });
  } else {
    return [];
  }
};

/**
 * Detect network resources (data urls embedded in page is not network resource)
 */
export const isNetworkResource = (harEntry: HARFormatEntry) => {
  return harEntry.request.url && !harEntry.request.url.startsWith(PREFIX_URL_DATA);
};

/**
 * ULTRA-ROBUST cache detection for Firefox + Chrome
 *
 * CRITICAL: Chrome uses bodySize=-1 to mean "unknown", NOT "cached"
 * We must check _transferSize first on Chrome to avoid false positives
 */
export const isCacheCall = (harEntry: HARFormatEntry): boolean => {
  const response = harEntry.response;
  const entryAny = harEntry as any;

  const IS_FIREFOX = typeof navigator !== 'undefined' && /Firefox/i.test(navigator.userAgent);

  // ========== CHROME - Primary indicator ==========
  // Chrome sets _fromCache to 'memory' or 'disk' when cached
  if (typeof harEntry._fromCache === 'string') {
    return true;
  }

  // ========== CHROME - Check _transferSize FIRST ==========
  // If _transferSize > 0, it's definitely NOT cached (real network transfer)
  const transferSize = response?._transferSize;
  if (typeof transferSize === 'number' && transferSize > 0) {
    return false;  // Definitely NOT cache - data was transferred!
  }

  // ========== FIREFOX ONLY - Negative sizes ==========
  // Firefox uses negative values to indicate cache
  // Chrome uses -1 to mean "unknown" (not cache), so only apply this to Firefox
  if (IS_FIREFOX) {
    const bodySize = response?.bodySize;
    if (typeof bodySize === 'number' && bodySize < 0) {
      return true;
    }

    if (typeof transferSize === 'number' && transferSize < 0) {
      return true;
    }
  }

  // ========== BOTH - Status 304 ==========
  if (response?.status === 304) {
    return true;
  }

  // ========== BOTH - Cache headers ==========
  const headers = response?.headers || [];

  const xCache = headers.find(h => h.name.toLowerCase() === 'x-cache');
  if (xCache?.value?.toLowerCase().includes('hit')) {
    return true;
  }

  const cfCache = headers.find(h => h.name.toLowerCase() === 'cf-cache-status');
  if (cfCache?.value?.toLowerCase() === 'hit') {
    return true;
  }

  // ========== FIREFOX ONLY - Timing patterns ==========
  if (IS_FIREFOX) {
    const contentSize = response?.content?.size ?? 0;
    const bodySize = response?.bodySize ?? 0;

    if (harEntry.time === 0 && bodySize === 0 && contentSize > 0) {
      return true;
    }

    const timings = harEntry.timings;
    if (timings) {
      const { blocked, dns, connect, send, wait, ssl } = timings;
      const totalNonReceive = (blocked ?? 0) + (dns ?? 0) + (connect ?? 0) + (send ?? 0) + (wait ?? 0) + (ssl ?? 0);

      if (totalNonReceive === 0 && timings.receive > 0 && contentSize > 0) {
        return true;
      }
    }
  }

  // ========== BOTH - Cache object / flags ==========
  if (entryAny.cache?.beforeRequest || entryAny.cache?.afterRequest) {
    return true;
  }

  if (entryAny._fromDiskCache || entryAny._fromMemoryCache) {
    return true;
  }

  // ========== DEFAULT ==========
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