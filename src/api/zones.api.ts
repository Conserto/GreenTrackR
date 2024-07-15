import type { DetailedGeoLoc } from 'src/interface';
import { IP_API, IPFI_API } from 'src/const/url.const';
import { logDebug, logErr } from 'src/utils';

const getIpAddress = async (): Promise<string | undefined> => {
  const { ip } = await fetch(IPFI_API)
    .then((res) => res.json())
    .catch(reason => logErr('Error getting ip address: ' + reason));
  return ip ? ip : undefined;
};

export const getCurrentZone = async (url?: URL | string): Promise<DetailedGeoLoc | undefined> => {
  logDebug(`Url ${url}`);
  const origin: string | URL | undefined = url ? url : await getIpAddress();
  logDebug(`Origin ${origin}`);
  if (!origin) {
    return undefined;
  }
  const apiCall = IP_API + (origin instanceof URL ? origin.host : origin);
  logDebug('Call URL for location: ' + apiCall);
  const { lat, lon, countryCode, country, city } = await fetch(apiCall)
    .then((res) => res.json())
    .catch(reason => logErr('Error getting current zone: ' + reason));
  return city ? { cityName: city, countryCode, countryName: country, lat, lon } : undefined;
};

export const getServerZone = (urlHost?: URL): Promise<DetailedGeoLoc | undefined> => {
  return getCurrentZone(urlHost); 
};
