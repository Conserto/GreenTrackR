import type { DetailServerUrl, Measure, TableHeader, TableSurHeader } from 'src/interface';
import { logDebug, logWarn } from './log';
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

export const getUrl = (url?: string) => {
  let formattedUrl: URL | undefined = undefined;
  if (url && isRealUrl(url)) {
    try {
      formattedUrl = new URL(url);
    } catch (e) {
      logWarn(`Error when parsing url ${url} -> ${e}`);
    }
  } else {
    logWarn('No url found');
  }
  logDebug(`return url ${formattedUrl}`);
  return formattedUrl;
};

/**
 * Detect network resources (data urls embedded in page is not network resource)
 *  Test with request.url as  request.httpVersion === "data"  does not work with old chrome version (example v55)
 */
export const isNetworkResource = (harEntry: HARFormatEntry) => {
  return harEntry.request.url && !harEntry.request.url.startsWith(PREFIX_URL_DATA);
};

export const isCacheCall = (harEntry: HARFormatEntry): boolean => {
  return !!harEntry._fromCache;
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
    ges: {
      dataCenterTotal: 0,
      networkTotal: 0,
      deviceTotal: 0,
      pageTotal: 0
    },
    wu: {
      dataCenterTotal: 0,
      networkTotal: 0,
      deviceTotal: 0,
      pageTotal: 0
    },
    adpe: {
      dataCenterTotal: 0,
      networkTotal: 0,
      deviceTotal: 0,
      pageTotal: 0
    },
    energy: {
      kWhDataCenter: 0,
      kWhNetwork: 0,
      kWhDevice: 0,
      kWhPage: 0
    },
    score: {
      value: 0,
      color: '',
      textColor: '',
      gradeLetter: '',
      limit: 0
    },
    userGES: {
      carbonIntensity: 0,
      wu: 0,
      adpe: 0,
      countryName: '',
      cityName: '',
      countryCode: '',
      display: ''
    },
    serverGES: {
      carbonIntensity: 0,
      wu: 0,
      adpe: 0,
      countryName: '',
      cityName: '',
      countryCode: '',
      display: ''
    },
    complete: false,
    dom: 0,
    extensionMeasure: {
      nbRequest: 0,
      nbRequestCache: 0,
      detail: [],
      network: {
        size: 0,
        sizeUncompress: 0
      }
    },
    networkMeasure: {
      nbRequest: 0,
      nbRequestCache: 0,
      detail: [],
      network: {
        size: 0,
        sizeUncompress: 0
      }
    }
  };
};

export const scrollPrompt = (topPrompt: number, leftPrompt: number, timeout: number) => {
  logDebug(`Scroll ${topPrompt} / ${leftPrompt}`);
  const end = (document.body.scrollHeight - window.innerHeight) === window.scrollY;
  if (!end) {
    window.scrollBy({ left: leftPrompt, top: topPrompt, behavior: 'smooth' });
    return new Promise<void>((resolve, reject) => {
      const failed = setTimeout(() => {
        reject(Error('Timeout'));
      }, timeout);
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


