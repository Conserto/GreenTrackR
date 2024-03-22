import type { GeoLocation } from 'src/interface';
import { CO2_API } from '../const/url.const';
import { logErr, logWarn } from '../utils/log';

export const getCarbonIntensity = async (location: string | GeoLocation | undefined) => {
  if (!location) {
    logWarn('Carbon intensity not check because no location');
    return -1;
  }
  let requestUrl = CO2_API;
  if (typeof location === 'string') {
    requestUrl += `countryCode=${location}`;
  } else {
    requestUrl += `lon=${location.lon}&lat=${location.lat}`;
  }
  const { data } = await fetch(requestUrl, {
    headers: { 'auth-token': `Bearer ${import.meta.env.VITE_CO2_SIGNAL_TOKEN}` }
  }).then((res) => res.json()).catch(reason => logErr('Error getting carbon intensity: ' + reason));
  return data ? data.carbonIntensity : -1;
};
