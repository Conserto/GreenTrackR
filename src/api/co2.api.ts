import type { GeoLocation } from 'src/interface';
import { CO2_API } from '../const/url.const';
import { logDebug, logErr, logWarn } from '../utils/log';
import { getLocalStorageObject } from '../utils';
import { paramTokenCo2 } from '../const';

export const getCarbonIntensity = async (location: string | GeoLocation | undefined): Promise<number | undefined> => {
  // TODO Cache
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
  if (typeof location === 'string') {
    requestUrl += `countryCode=${location}`;
  } else if (location.lon !== 0 && location.lat !== 0) {
    requestUrl += `lon=${location.lon}&lat=${location.lat}`;
  } else {
    logWarn('Carbon intensity not check because location not valid');
    return undefined;
  }
  const { data } = await fetch(requestUrl, {
    headers: { 'auth-token': `${token}` }
  }).then((res) => res.json()).catch(reason => logErr('Error getting carbon intensity: ' + reason));
  return data ? data.carbonIntensity : undefined;
};
