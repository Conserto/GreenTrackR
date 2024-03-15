import type { GeoLocation } from 'src/interface';

export const getCarbonIntensity = async (location: string | GeoLocation | undefined) => {
  if (!location) {
    return -1;
  }
  try {
    // FIXME Const
    let requestUrl = 'https://api.co2signal.com/v1/latest?';
    if (typeof location === 'string') {
      requestUrl += `countryCode=${location}`;
    } else {
      requestUrl += `lon=${location.lon}&lat=${location.lat}`;
    }

    const { data } = await fetch(requestUrl, {
      headers: { 'auth-token': `Bearer ${import.meta.env.VITE_CO2_SIGNAL_TOKEN}` }
    }).then((res) => res.json());
    return data.carbonIntensity;
  } catch (error) {
    throw 'Error getting carbon intensity:' + error;
  }
};
