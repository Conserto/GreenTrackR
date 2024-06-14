import type { GES, Measure, TableData, Zone } from '../interface';
import { Units } from '../const';

export const formatDate = (date: Date) => {
  return date.toLocaleString();
};

export const formatDisplayZone = (cityName: string | undefined, countryName: string | undefined): string => {
  let value: string = '-';
  if (cityName && countryName) {
    value = cityName + ', ' + countryName;
  } else if (countryName) {
    value = countryName;
  } else if (cityName) {
    value = cityName;
  }
  return value;
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

export const formatScoreForGrade = (score?: number) => {
  return score ? `${Math.round(score)}/100` : '-';
}

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

export const formatShortUrl = (url: string | undefined) => {
  let formatted = '';
  if (url) {
    formatted = url.replace(/(^\w+:|^)\/\//, '');
    formatted = formatted.length > 23 ? `${formatted.slice(0, 23)}...` : formatted;
  }
  return formatted;
};

export const formatUriOnly = (url: string | undefined) => {
  let formatted = '';
  try {
    const urlC = new URL(url ?? '');
    formatted = urlC.pathname.substring(urlC.pathname.lastIndexOf('/'));
  } catch (e) {

  }
  return formatted;
};

export const formatSimulationLabel = (zone: Zone | undefined) => {
  return `${zone?.countryName} (${formatNumber(zone?.carbonFactor)} ${Units.carbonIntensity})`;
};

export const formatSizeTransferred = (netSize: number, netUncompressSize: number) => {
  if (netSize > 0 || netUncompressSize > 0) {
    return `${formatSize(netSize)} / ${formatSize(netUncompressSize)}`;
  } else {
    return '';
  }
};

export const formatSizeTransferredWithUnit = (netSize: number, netUncompressSize: number) => {
  if (netSize > 0 || netUncompressSize > 0) {
    return `${formatSize(netSize)}${Units.pageSize}-${formatSize(netUncompressSize)}${Units.pageSize}`;
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

export const formatEmission = (ges: GES | undefined) => {
  let formatted = '';
  if (ges?.carbonIntensity) {
    formatted = `${ges.carbonIntensity} ${Units.carbonEmissions}`;
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
