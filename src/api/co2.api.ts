import type { Co2SignalResponse, GeoLocation } from 'src/interface';
import { CO2_API } from 'src/const/url.const';
import { getLocalStorageObject, logDebug, logErr, logWarn } from 'src/utils';
import { paramTokenCo2 } from 'src/const';

const cache = new Map<string, Co2SignalResponse>();

export const getCarbonIntensity = async (location: string | GeoLocation | undefined): Promise<Co2SignalResponse | undefined> => {
  let token = getLocalStorageObject(paramTokenCo2);
  if (!location) {
    logWarn('Carbon intensity not check because no location');
    return undefined;
  } else if (!token) {
    logWarn('Carbon intensity not check because no Token');
    return undefined;
  }
  logDebug('Call Carbon intensity');
  let requestUrl = CO2_API;
  let params = '';
  let cacheVal: Co2SignalResponse | undefined = undefined;
  if (typeof location === 'string') {
    params = `countryCode=${location}`;
  } else if (location.lon !== 0 && location.lat !== 0) {
    params = `lon=${location.lon}&lat=${location.lat}`;
  } else {
    logWarn('Carbon intensity not check because location not valid');
    return undefined;
  }
  cacheVal = cache.get(params);
  if (cacheVal) {
    logDebug('Use cache for Carbon intensity');
    return cacheVal;
  } else {
    requestUrl += params;
    const { countryCode, data } = await fetch(requestUrl, {
      headers: { 'auth-token': `${token}` }
    }).then((res) => res.json()).catch(reason => logErr('Error getting carbon intensity: ' + reason));
    if (data.carbonIntensity) {
      cache.set(params, { carbonIntensity: data.carbonIntensity, countryCode: countryCode });
    }
    return data ? { carbonIntensity: data.carbonIntensity, countryCode: countryCode } : undefined;
  }
};
