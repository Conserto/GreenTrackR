import type { GeoLocation } from 'src/interface';
import { CO2_API } from '../const/url.const';
import { logErr } from '../utils/log';

export const getCarbonIntensity = async (location: string | GeoLocation | undefined) => {
  // TODO Check
  if (!location) {
    return -1;
  }
  try {
    let requestUrl = CO2_API;
    if (typeof location === 'string') {
      requestUrl += `countryCode=${location}`;
    } else {
      requestUrl += `lon=${location.lon}&lat=${location.lat}`;
    }

    // FIXME catch dans le call
    const { data } = await fetch(requestUrl, {
      headers: { 'auth-token': `Bearer ${import.meta.env.VITE_CO2_SIGNAL_TOKEN}` }
    }).then((res) => res.json());
    return data.carbonIntensity;
  } catch (error) {
    // TODO Check
    logErr('Error getting carbon intensity:' + error);
    return -1;
  }
};
