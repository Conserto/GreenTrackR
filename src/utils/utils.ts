import type { Measure } from 'src/interface';
import { Units } from 'src/const/units.const';
import { logInfo, logWarn } from './log';

export const getAverageValue = (data: number[]) => {
  let sum = data.reduce((partialSum: number, a) => partialSum + a, 0);
  return sum / data.length;
};

export const translate = (translateKey: string) => {
  let translatedLabel = '';
  if (translateKey) {
    try {
      translatedLabel = chrome.i18n.getMessage(translateKey);
    } catch (e) {
      logWarn('Warning ! You are trying to translate a null translateKey. -> ' + translateKey);
    }
    translatedLabel = translatedLabel ? translatedLabel : translateKey;
  }
  return translatedLabel;
};

export const formatDate = (date: Date) => {
  return date.toLocaleString();
};

export const formatNumber = (value: number) => {
  return value.toFixed(2);
};

export const formatSize = (value: number) => {
  const koValue = value / 1000;
  if (koValue < 1) {
    return formatNumber(koValue);
  } else {
    return Math.round(value / 1000);
  }
};

export const getLocalStorageObject = (key: string) => {
  const stringValue = localStorage.getItem(key);
  if (stringValue) {
    return JSON.parse(stringValue);
  } else {
    return null;
  }
};

export const setLocalStorageObject = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const formatGesMeasuresForTable = (measures: Measure[]) => {
  return measures.map((measure) => ({
    date: { content: formatDate(measure.date), style: 'font-weight:bold' },
    url: { content: measure.url },
    sizeTransferred: { content: `${formatSize(measure.networkMeasure.network.size)} / ${formatSize(measure.networkMeasure.network.sizeUncompress)} ${Units.pageSize}` },
    nbRequest: { content: `${measure.networkMeasure.nbRequest}` },
    // TODO WHEN DOM COMPUTING IS OK
    // dom: { content: measure.dom },
    gesDataCenter: {
      content: `${formatNumber(measure.ges.dataCenterTotal)} ${Units.carbonEmissions}`
    },
    gesNetwork: {
      content: `${formatNumber(measure.ges.networkTotal)} ${Units.carbonEmissions}`
    },
    gesDevice: {
      content: `${formatNumber(measure.ges.deviceTotal)} ${Units.carbonEmissions}`
    },
    gesTotal: {
      content: `${formatNumber(measure.ges.pageTotal)} ${Units.carbonEmissions}`
    },
    gesScore: {
      content: formatNumber(measure.score.value ?? -1),
      style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`
    },
    gesGrade: {
      content: measure.score.gradeLetter,
      style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`
    },
    gesUserZone: { content: `${measure.userGES?.cityName}, ${measure.userGES?.countryName}` },
    gesZone: { content: `${measure.serverGES?.cityName}, ${measure.serverGES?.countryName}` },
    gesIntensity: { content: `${measure.serverGES?.carbonIntensity} ${Units.carbonIntensity}` }
  }));
};

export const toHistoFormattedDatas = (measure: Measure) => {
  if (measure) {
    return [
      {
        label: 'networkTotal',
        value: formatNumber(measure.ges.networkTotal),
        value2: formatNumber(measure.energy.kWhNetwork * 1000),
        color: '#7b7aab'
      },
      {
        label: 'dataCenterTotal',
        value: formatNumber(measure.ges.dataCenterTotal),
        value2: formatNumber(measure.energy.kWhDataCenter * 1000),
        color: '#86665f'
      },
      {
        label: 'deviceTotal',
        value: formatNumber(measure.ges.deviceTotal),
        value2: formatNumber(measure.energy.kWhDevice * 1000),
        color: '#5e806d'
      },
      {
        label: 'pageTotal',
        value: formatNumber(measure.ges.pageTotal),
        value2: formatNumber(measure.energy.kWhPage * 1000),
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
  logInfo(`Scroll ${topPrompt} / ${leftPrompt}`);
  window.scrollBy({ left: leftPrompt, top: topPrompt, behavior: 'smooth' });
  return new Promise((resolve, reject) => {
    const failed = setTimeout(() => {
      reject();
    }, timeout);

    const scrollHandler = () => {
      if (self.scrollY === topPrompt) {
        logInfo("Remove 1");
        window.removeEventListener("scroll", scrollHandler);
        clearTimeout(failed);
        resolve();
      }
    };
    if (self.scrollY === topPrompt) {
      logInfo("Remove 2");
      window.removeEventListener("scroll", scrollHandler);
      clearTimeout(failed);
      resolve();
    } else {
      window.addEventListener("scroll", scrollHandler);
    }
  });
};