import type { Measure } from 'src/interface';
import { formatNumber, translate } from 'src/utils';

const create_csv = (measureHistory: Measure[]) => {
  let csv = translate('csvColumnsLabel') + '\n';
  measureHistory.forEach((measure) => {
    const date = new Date(measure.date);
    csv +=
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString() +
      ';"' +
      measure.url +
      '";' +
      measure.networkMeasure.network.size +
      ';' +
      Math.round(measure.networkMeasure.network.size / 1024) +
      ';' +
      measure.dom +
      ';' +
      formatNumber(measure.ges?.dataCenterTotal) +
      ';' +
      formatNumber(measure.ges?.networkTotal) +
      ';' +
      formatNumber(measure.ges?.deviceTotal) +
      ';' +
      formatNumber(measure.ges?.pageTotal) +
      ';' +
      formatNumber(measure.score?.value) +
      ';' +
      measure.score?.gradeLetter +
      ';' +
      measure.serverGES?.countryName +
      ';' +
      measure.serverGES?.carbonIntensity +
      ';' +
      measure.networkMeasure.nbRequest +
      '\n';
  });
  return csv;
};

const getHorodatage = () => {
  let date = new Date();
  return (
    date.toLocaleString('default', { year: 'numeric' }) +
    date.toLocaleString('default', { month: '2-digit' }) +
    date.toLocaleString('default', { day: '2-digit' }) +
    ('0' + date.getHours()).slice(-2) +
    ('0' + date.getMinutes()).slice(-2) +
    ('0' + date.getSeconds()).slice(-2)
  );
};

export const export_data = (measureHistory: Measure[]) => {
  // Create file data
  let to_export = create_csv(measureHistory);

  const csvContent = 'data:text/csv;charset=utf-8,' + to_export;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `greentracker_${getHorodatage()}.csv`);
  document.body.appendChild(link);

  link.click();
};
