import { Units } from 'src/const';
import type { Measure } from 'src/interface';
import {
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
  cityName: 'Nantes',
  url: 'https://conserto.pro/',
  network: { size: 39, sizeUncompress: 488000 },
  ges: {
    dataCenterTotal: 0.55,
    networkTotal: 0.05,
    deviceTotal: 1.68,
    websiteTotal: 2.28,
  },
  nbRequest: 21,
  score: {
    value: 54.49,
    gradeLetter: 'C+',
    color: 'yellow',
    limit: 50,
    textColor: 'black',
  },
  zone: 'France',
  carbonIntensity: 371,
  hourlyCarbonData: [],
  dom: 261,
};

test('Wait function', async () => {
  const waitingTime = 2000;
  let currentTime = Date.now();
  expect(Date.now()).toBeLessThan(currentTime + waitingTime);
  currentTime = Date.now();
  await wait(waitingTime);
  expect(Date.now()).toBeGreaterThan(currentTime + waitingTime);
});

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
        content: `${formatSize(measure.network.size)} ${Units.pageSize}`,
      },
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
        content: `${formatNumber(measure.ges.websiteTotal)} ${Units.carbonEmissions}`,
      },
      gesScore: {
        content: formatNumber(measure.score.value ?? -1),
        style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`,
      },
      gesGrade: {
        content: measure.score.gradeLetter,
        style: `background-color: ${measure.score.color}; color: ${measure.score.textColor}`,
      },
      gesZone: { content: `${measure.cityName}, ${measure.zone}` },
      gesIntensity: { content: `${measure.carbonIntensity} ${Units.carbonIntensity}` },
    },
  ]);
});

test('ToHistoFormattedDatas function', async () => {
  assert.deepEqual(toHistoFormattedDatas(measure), [
    {
      label: 'dataCenterTotal',
      value: formatNumber(measure.ges.dataCenterTotal),
      color: '#86665f',
    },
    {
      label: 'networkTotal',
      value: formatNumber(measure.ges.networkTotal),
      color: '#7b7aab',
    },
    {
      label: 'deviceTotal',
      value: formatNumber(measure.ges.deviceTotal),
      color: '#5e806d',
    },
    {
      label: 'websiteTotal',
      value: formatNumber(measure.ges.websiteTotal),
      color: '#535481',
    },
  ]);
});
