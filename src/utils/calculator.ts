import type { DetailServerGes, EnergyMeasure, GES, ResTotals, SimpleGES } from 'src/interface';
import { logDebug } from './log';

export const getAverageValue = (data: number[]) => {
  let sum = data.reduce((partialSum: number, a) => partialSum + a, 0);
  return sum / data.length;
};

export const getWuUnit = (data: number) => {
  return data * 1000;
};

export const getAdpeUnit = (data: number) => {
  return data * 1000 * 1000;
};

export const computeResources = (usrResource: number | undefined, srvResource: number | undefined, netResource: number | undefined, energy: EnergyMeasure): ResTotals => {
  const dataCenterTotal = srvResource ? energy.kWhDataCenter * srvResource : undefined;
  const networkTotal = netResource ? energy.kWhNetwork * netResource : undefined;
  const deviceTotal = usrResource ? energy.kWhDevice * usrResource : undefined;
  const pageTotal = (dataCenterTotal ? dataCenterTotal : 0) + (networkTotal ? networkTotal : 0) + (deviceTotal ? deviceTotal : 0);
  return {
    dataCenterTotal: dataCenterTotal,
    networkTotal: networkTotal,
    deviceTotal: deviceTotal,
    pageTotal: pageTotal
  };
};

export const getGesScoreValue = (gesValue: number) => {
  const calcGESScore = -20 * gesValue + 100;
  let otherScore = (gesValue * 4.5) / 1000000;
  let i = 1;
  while (otherScore < 10) {
    otherScore *= 10;
    i *= 10;
  }
  if (gesValue <= 4.5) {
    return calcGESScore;
  } else if (gesValue > 10) {
    return Math.log(10 - (gesValue * 4.5 * i) / 10000000 + 2);
  } else {
    return gesValue;
  }
};

export const calculResourcesFromAllServer = (totalCompressSize: number, detailResourcesGes: DetailServerGes[]): SimpleGES => {
  let carbonIntensity = 0;
  let wu = 0;
  let adpe = 0;
  // Nb country
  const nbCountry = detailResourcesGes.length;
  let sumPonderation = 0;
  // Size by Country
  for (let detailsSrvGes of detailResourcesGes) {
    const compressSize: number = detailsSrvGes.hostnames.map(dsg => dsg.sizeTotal.size).reduce((a, b) => a + b, 0);
    const ponderation = (compressSize / totalCompressSize) * nbCountry;
    carbonIntensity += (detailsSrvGes.ges?.carbonIntensity || 0) * ponderation;
    wu += (detailsSrvGes.ges?.wu || 0) * ponderation;
    adpe += (detailsSrvGes.ges?.adpe || 0) * ponderation;
    sumPonderation += ponderation;
    logDebug(`calculResourcesFromAllServer: ${detailsSrvGes.ges?.countryCode} -> size: ${compressSize} / ponderation: ${ponderation}`);
  }

  return {
    carbonIntensity: carbonIntensity / sumPonderation,
    wu: wu / sumPonderation,
    adpe: adpe / sumPonderation
  };
};

export const calculNetworkGes = (srvGes?: SimpleGES, userGes?: GES): SimpleGES => {
  return {
    carbonIntensity: getAverageValue([userGes?.carbonIntensity || 0, srvGes?.carbonIntensity || 0]),
    wu: getAverageValue([userGes?.wu || 0, srvGes?.wu || 0]),
    adpe: getAverageValue([userGes?.adpe || 0, srvGes?.adpe || 0])
  };
};