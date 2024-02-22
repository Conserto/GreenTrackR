import type { Measure } from 'src/interface';
import { Units } from 'src/const/units.const';

export const wait = (milliseconds: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};

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
      console.warn('Warning ! YOu are trying to translate a null translateKey.');
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
    compressedSizeTransferred: { content: `${formatSize(measure.network.size)} ${Units.pageSize}` },
    uncompressedSizeTransferred: {
      content: `${formatSize(measure.network.sizeUncompress)} ${Units.pageSize}`,
    },
    nbRequest: { content: measure.nbRequest },
    dom: { content: measure.dom },
    gesDataCenter: {
      content: `${formatNumber(measure.ges.dataCenterTotal)} ${Units.carbonEmissions}`,
    },
    gesNetwork: {
      content: `${formatNumber(measure.ges.networkTotal)} ${Units.carbonEmissions}`,
    },
    gesDevice: {
      content: `${formatNumber(measure.ges.deviceTotal)} ${Units.carbonEmissions}`,
    },
    gesTotal: {
      content: `${formatNumber(measure.ges.pageTotal)} ${Units.carbonEmissions}`,
    },
    gesScore: {
      content: formatNumber(measure.score.value ?? -1),
      style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`,
    },
    gesGrade: {
      content: measure.score.gradeLetter,
      style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`,
    },
    gesZone: { content: `${measure.serverGES.cityName}, ${measure.serverGES.countryName}` },
    gesIntensity: { content: `${measure.serverGES.carbonIntensity} ${Units.carbonIntensity}` },
  }));
};

export const toHistoFormattedDatas = (measure: Measure) => {
  if (measure) {
    return [
      {
        label: 'networkTotal',
        value: formatNumber(measure.ges.networkTotal),
        value2: formatNumber(measure.energy.kWhNetwork * 1000),
        color: '#7b7aab',
      },
      {
        label: 'dataCenterTotal',
        value: formatNumber(measure.ges.dataCenterTotal),
        value2: formatNumber(measure.energy.kWhDataCenter * 1000),
        color: '#86665f',
      },
      {
        label: 'deviceTotal',
        value: formatNumber(measure.ges.deviceTotal),
        value2: formatNumber(measure.energy.kWhDevice * 1000),
        color: '#5e806d',
      },
      {
        label: 'pageTotal',
        value: formatNumber(measure.ges.pageTotal),
        value2: formatNumber(measure.energy.kWhPage * 1000),
        color: '#535481',
      },
    ];
  } else {
    return [];
  }
};
