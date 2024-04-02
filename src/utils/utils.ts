import type { Measure, TableData } from 'src/interface';
import { logDebug, logWarn } from './log';
import { Units } from '../const';

export const getAverageValue = (data: number[]) => {
  let sum = data.reduce((partialSum: number, a) => partialSum + a, 0);
  return sum / data.length;
};

export const translate = (translateKey?: string) => {
  let translatedLabel = '';
  if (translateKey) {
    try {
      translatedLabel = chrome.i18n.getMessage(translateKey);
    } catch (e) {
      logWarn('Warning ! You are trying to translate a null translateKey. -> ' + translateKey);
    }
    translatedLabel = translatedLabel ? translatedLabel.split('#')[0] : translateKey;
  }
  return translatedLabel;
};

export const translateDescription = (translateKey: string) => {
  let translatedLabel = '';
  if (translateKey) {
    try {
      translatedLabel = chrome.i18n.getMessage(translateKey);
    } catch (e) {
      logWarn('Warning ! You are trying to translate a null translateKey. -> ' + translateKey);
    }
    translatedLabel = translatedLabel ? (translatedLabel.split('#')[1] ? translatedLabel.split('#')[1] : '') : '';
  }
  return translatedLabel;
};

export const formatDate = (date: Date) => {
  return date.toLocaleString();
};

export const formatNumber = (value: number): string => {
  return value.toFixed(2);
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

export const formatGesMeasuresForTable = (measures: Measure[]): Map<string, TableData>[] => {
  return measures.map((measure): Map<string, TableData> => {
    let data: Map<any, TableData> = new Map<any, TableData>;
    data.set('date', { content: formatDate(measure.date), style: 'font-weight:bold' });
    data.set('url', { content: measure.url });
    data.set('sizeTransferred', {
      content: `${formatSize(measure.networkMeasure.network.size)} / ${formatSize(measure.networkMeasure.network.sizeUncompress)} ${Units.pageSize}`
    });
    data.set('nbRequest', { content: `${measure.networkMeasure.nbRequest} (${measure.networkMeasure.nbRequestCache})` });
    data.set('gesDataCenter', { content: `${formatNumber(measure.ges.dataCenterTotal)} ${Units.carbonEmissions}` });
    data.set('gesNetwork', { content: `${formatNumber(measure.ges.networkTotal)} ${Units.carbonEmissions}` });
    data.set('gesDevice', { content: `${formatNumber(measure.ges.deviceTotal)} ${Units.carbonEmissions}` });
    data.set('gesTotal', { content: `${formatNumber(measure.ges.pageTotal)} ${Units.carbonEmissions}` });
    data.set('gesScore', {
      content: formatNumber(measure.score.value ?? -1),
      style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`
    });
    data.set('gesGrade', {
      content: measure.score.gradeLetter,
      style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`
    });
    data.set('gesUserZone', { content: `${measure.userGES?.cityName}, ${measure.userGES?.countryName}` });
    data.set('gesZone', { content: `${measure.serverGES?.cityName}, ${measure.serverGES?.countryName}` });
    data.set('gesIntensity', { content: `${measure.serverGES?.carbonIntensity} ${Units.carbonIntensity}` });
    return data;
  });
};

export const toHistoFormattedDatas = (measure: Measure) => {
  if (measure) {
    return [
      {
        label: 'networkTotal',
        value: measure.ges.networkTotal,
        value2: measure.energy.kWhNetwork * 1000,
        color: '#7b7aab'
      },
      {
        label: 'dataCenterTotal',
        value: measure.ges.dataCenterTotal,
        value2: measure.energy.kWhDataCenter * 1000,
        color: '#86665f'
      },
      {
        label: 'deviceTotal',
        value: measure.ges.deviceTotal,
        value2: measure.energy.kWhDevice * 1000,
        color: '#5e806d'
      },
      {
        label: 'pageTotal',
        value: measure.ges.pageTotal,
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
      countryName: '',
      cityName: '',
      countryCode: ''
    },
    serverGES: {
      carbonIntensity: 0,
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