import type { GES, Measure, NetworkMeasure, TableData, TableHeader, TableSurHeader } from 'src/interface';
import { logDebug, logInfo, logWarn } from './log';

const PREFIX_HTML_KEY = '@';
const SUFFIX_HTML_FILE = '.html';
const SOURCE_HTML_FOLDER = '/descriptions/';

const cacheHtmlTranslate = new Map<string, string>;

export const getAverageValue = (data: number[]) => {
  let sum = data.reduce((partialSum: number, a) => partialSum + a, 0);
  return sum / data.length;
};

export const translate = (translateKey?: string) => {
  let translatedLabel = '';
  if (translateKey) {
    try {
      translatedLabel = chrome.i18n.getMessage(translateKey);
/*      if (translatedLabel && translatedLabel.startsWith(PREFIX_HTML_KEY)) {
        // TODO
        translatedLabel =  readFileSync(SOURCE_HTML_FOLDER + translatedLabel.replace(PREFIX_HTML_KEY,'') + SUFFIX_HTML_FILE);
      }*/
    } catch (e) {
      logWarn('Warning ! You are trying to translate a null translateKey. -> ' + translateKey);
    }
    translatedLabel = translatedLabel || translateKey;
  }
  return translatedLabel;
};

export const filterMeasure = (measures: Measure[], filter: string) => {
  if (measures) {
    return measures.filter((mes) => {
      return mes.action && mes.action === filter;
    });
  } else {
    return [];
  }
};

export const filterMeasurePage = (measures: Measure[]) => {
  if (measures) {
    return measures.filter((value, index, self) => {
      return self.findIndex(m => m.url === value.url) === index;
    });
  } else {
    return [];
  }
};

export const sumRequest = (measures: Measure[]) => {
  let netMes: NetworkMeasure = {
    nbRequest: 0,
    nbRequestCache: 0,
    network: {
      size: 0,
      sizeUncompress: 0
    }
  };
  if (measures) {
    measures.map(m => m.networkMeasure).forEach(n => {
      netMes.nbRequest += n.nbRequest;
      netMes.nbRequestCache += n.nbRequestCache;
      netMes.network.size += n.network.size;
      netMes.network.sizeUncompress += n.network.sizeUncompress;
    });
  }
  return netMes;
};

export const formatDate = (date: Date) => {
  return date.toLocaleString();
};

export const formatNumber = (value: number | undefined): string => {
  if (!value) {
    return '';
  } else {
    return value.toFixed(2);
  }
};

export const formatSize = (value?: number): string => {
  if (value) {
    const koValue = value / 1000;
    if (koValue < 1) {
      return formatNumber(koValue);
    } else {
      return Math.round(value / 1000).toString();
    }
  }
  return '0';
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

export const formatGesMeasuresForTable = (measures: Measure[], add?: Map<string, TableData>): Map<string, TableData>[] => {
  return measures.map((measure): Map<string, TableData> => {
    let data: Map<any, TableData> = new Map<any, TableData>;
    data.set('date', { content: formatDate(measure.date), style: 'font-weight:bold' });
    data.set('url', { content: formatShortUrl(measure.url), detail: measure.url });
    data.set('urlAction', { content: measure.action });
    data.set('sizeTransferred', {
      content: formatSizeTransferred(measure.networkMeasure.network.size, measure.networkMeasure.network.sizeUncompress)
    });
    data.set('nbRequest', { content: formatNbRequest(measure.networkMeasure.nbRequest, measure.networkMeasure.nbRequestCache) });
    data.set('gesDataCenter', { content: formatNumber(measure.ges?.dataCenterTotal) });
    data.set('gesNetwork', { content: formatNumber(measure.ges?.networkTotal) });
    data.set('gesDevice', { content: formatNumber(measure.ges?.deviceTotal) });
    data.set('gesTotal', { content: formatNumber(measure.ges?.pageTotal) });
    data.set('gesScore', {
      content: formatNumber(measure.score?.value),
      style: `background-color: ${measure.score?.color}; color: ${measure.score?.textColor}`
    });
    data.set('gesGrade', {
      content: measure.score?.gradeLetter,
      style: `background-color: ${measure.score?.color}; color: ${measure.score?.textColor}`
    });
    data.set('wuDataCenter', { content: formatNumber(measure.wu?.dataCenterTotal) });
    data.set('wuNetwork', { content: formatNumber(measure.wu?.networkTotal) });
    data.set('wuDevice', { content: formatNumber(measure.wu?.deviceTotal) });
    data.set('wuTotal', { content: formatNumber(measure.wu?.pageTotal) });
    data.set('apdeDataCenter', { content: formatNumber(measure.adpe?.dataCenterTotal) });
    data.set('adpeNetwork', { content: formatNumber(measure.adpe?.networkTotal) });
    data.set('adpeDevice', { content: formatNumber(measure.adpe?.deviceTotal) });
    data.set('adpeTotal', { content: formatNumber(measure.adpe?.pageTotal) });
    data.set('elcDataCenter', { content: formatNumber(measure.energy?.kWhDataCenter) });
    data.set('elcNetwork', { content: formatNumber(measure.energy?.kWhNetwork) });
    data.set('elcDevice', { content: formatNumber(measure.energy?.kWhDevice) });
    data.set('elcTotal', { content: formatNumber(measure.energy?.kWhPage) });
    data.set('gesUserZone', { content: formatGes(measure.userGES) });
    data.set('gesUserIntensity', { content: formatIntensity(measure.userGES) });
    data.set('gesZone', { content: formatGes(measure.serverGES) });
    data.set('gesIntensity', { content: formatIntensity(measure.serverGES) });
    if (add) {
      add.forEach((value, key) => {
        data.set(key, value);
      });
    }
    return data;
  });
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

export const formatShortUrl = (url: string | undefined) => {
  let formatted = '';
  if (url) {
    formatted = url.replace(/(^\w+:|^)\/\//, '');
    formatted = formatted.length > 23 ? `${formatted.slice(0, 23)}...` : formatted;
  }
  return formatted;
};

export const formatSizeTransferred = (netSize: number, netUncompressSize: number) => {
  if (netSize > 0 || netUncompressSize > 0) {
    return `${formatSize(netSize)} / ${formatSize(netUncompressSize)}`;
  } else {
    return '';
  }
};

export const formatNbRequest = (nb: number | undefined, nbCache: number | undefined) => {
  if ((nb && nb > 0) || (nbCache && nbCache > 0)) {
    return `${nb} (${nbCache})`;
  } else {
    return '';
  }
};

export const formatIntensity = (ges: GES | undefined) => {
  let formatted = '';
  if (ges?.carbonIntensity) {
    formatted = `${ges.carbonIntensity}`;
  }
  return formatted;
};

export const formatGes = (ges: GES | undefined) => {
  let formatted = '';
  if (ges) {
    if (ges.cityName) {
      formatted = ges.cityName;
    }
    if (ges.countryName) {
      if (formatted.length > 0) {
        formatted += `, ${ges.countryName}`;
      } else {
        formatted = ges.countryName;
      }
    }
  }
  return formatted;
};

export const toHistoFormattedDatas = (measure: Measure) => {
  if (measure) {
    return [
      {
        label: 'networkTotal',
        value: measure.ges?.networkTotal ? measure.ges.networkTotal : 0,
        value2: measure.energy.kWhNetwork * 1000,
        color: '#7b7aab'
      },
      {
        label: 'dataCenterTotal',
        value: measure.ges?.dataCenterTotal ? measure.ges.dataCenterTotal : 0,
        value2: measure.energy.kWhDataCenter * 1000,
        color: '#86665f'
      },
      {
        label: 'deviceTotal',
        value: measure.ges?.deviceTotal ? measure.ges.deviceTotal : 0,
        value2: measure.energy.kWhDevice * 1000,
        color: '#5e806d'
      },
      {
        label: 'pageTotal',
        value: measure.ges?.pageTotal ? measure.ges.pageTotal : 0,
        value2: measure.energy.kWhPage * 1000,
        color: '#535481'
      }
    ];
  } else {
    return [];
  }
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
      countryCode: ''
    },
    serverGES: {
      carbonIntensity: 0,
      wu: 0,
      adpe: 0,
      countryName: '',
      cityName: '',
      countryCode: ''
    },
    complete: false,
    dom: 0,
    extensionMeasure: {
      nbRequest: 0,
      nbRequestCache: 0,
      network: {
        size: 0,
        sizeUncompress: 0
      }
    },
    networkMeasure: {
      nbRequest: 0,
      nbRequestCache: 0,
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
        reject();
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