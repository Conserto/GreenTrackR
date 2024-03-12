import { Units } from 'src/const';
import type { Measure } from 'src/interface';
import {
  createEmptyMeasure,
  formatDate,
  formatGesMeasuresForTable,
  formatNumber,
  formatSize,
  getAverageValue,
  toHistoFormattedDatas,
  wait,
} from 'src/utils/utils';
import { assert, expect, test } from 'vitest';

const measure: Measure = {
  date: new Date(),
  url: 'https://conserto.pro/',
  networkMeasure: {
    nbRequest: 21,
    network: { size: 39, sizeUncompress: 488000 },
  },
  ges: {
    dataCenterTotal: 0.55,
    networkTotal: 0.05,
    deviceTotal: 1.68,
    pageTotal: 2.28,
  },
  energy: {
    kWhDataCenter: 0.007497401472,
    kWhDevice: 0.01161,
    kWhNetwork: 0.000280091966,
    kWhPage: 0.019387493,
  },
  score: {
    value: 54.49,
    gradeLetter: 'C+',
    color: 'yellow',
    limit: 50,
    textColor: 'black',
  },
  dom: 261,
  userGES: {
    countryName: 'France',
    countryCode: 'fr',
    cityName: 'Nantes',
    carbonIntensity: 371,
  },
  serverGES: {
    countryName: 'France',
    countryCode: 'fr',
    cityName: 'Nantes',
    carbonIntensity: 371,
  },
};

test('GetAverageValue function', async () => {
  expect(getAverageValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(5.5);
});

test('FormatDate function', async () => {
  const date = new Date('Wed Feb 21 2024 10:21:16 GMT+0100');
  expect(formatDate(date)).toBe(date.toLocaleString());
});

test('FormatNumber function', async () => {
  const nbTest = 0.13216549;
  expect(formatNumber(nbTest)).toBe('0.13');
});

test('FormatSize function', async () => {
  const bigSize = 456000;
  const smallSize = 456;
  expect(formatSize(bigSize)).toBe(bigSize / 1000);
  expect(formatSize(smallSize)).toBe('0.46');
});

test('FormatGesMeasuresForTable function', async () => {
  assert.deepEqual(formatGesMeasuresForTable([measure]), [
    {
      date: { content: formatDate(measure.date), style: 'font-weight:bold' },
      url: { content: measure.url },
      compressedSizeTransferred: {
        content: `${formatSize(measure.networkMeasure.network.size)} ${Units.pageSize}`,
      },
      uncompressedSizeTransferred: {
        content: `${formatSize(measure.networkMeasure.network.sizeUncompress)} ${Units.pageSize}`,
      },
      nbRequest: { content: measure.networkMeasure.nbRequest },
      // TODO WHEN DOM COMPUTING IS OK
      // dom: { content: measure.dom },
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
    },
  ]);
});

test('ToHistoFormattedDatas function', async () => {
  assert.deepEqual(toHistoFormattedDatas(measure), [
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
  ]);
});

test('CreateEmptyMeasure function', async () => {
  const emptyMeasure = {
    url: '',
    networkMeasure: {
      nbRequest: 0,
      network: {
        size: 0,
        sizeUncompress: 0,
      },
    },
    ges: {
      dataCenterTotal: 0,
      networkTotal: 0,
      deviceTotal: 0,
      pageTotal: 0,
    },
    energy: {
      kWhDataCenter: 0,
      kWhNetwork: 0,
      kWhDevice: 0,
      kWhPage: 0,
    },
    score: {
      value: 0,
      color: '',
      textColor: '',
      gradeLetter: '',
      limit: 0,
    },
    userGES: {
      carbonIntensity: 0,
      countryName: '',
      cityName: '',
      countryCode: '',
    },
    serverGES: {
      carbonIntensity: 0,
      countryName: '',
      cityName: '',
      countryCode: '',
    },
    extensionMeasure: {
      nbRequest: 0,
      network: {
        size: 0,
        sizeUncompress: 0,
    },
  },
    dom: 0,
  };
  const { date, ...measure } = createEmptyMeasure();
  assert.deepEqual(measure, emptyMeasure);
});
