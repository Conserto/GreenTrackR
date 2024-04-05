import type { DetailedGeoLoc } from 'src/interface';
import { IP_API, IPFI_API } from '../const/url.const';
import { logDebug, logErr } from '../utils/log';

const getIpAddress = async (): Promise<string | undefined> => {
  const { ip } = await fetch(IPFI_API)
    .then((res) => res.json())
    .catch(reason => logErr('Error getting ip address: ' + reason));
  return ip ? ip : undefined;
};

export const getCurrentZone = async (url?: string): Promise<DetailedGeoLoc | undefined> => {
  logDebug(`Url ${url}`);
  const origin = url ? url : await getIpAddress();
  logDebug(`Origin ${origin}`);
  if (!origin) {
    return undefined;
  }
  const { lat, lon, countryCode, country, city } = await fetch(
    IP_API + origin)
    .then((res) => res.json())
    .catch(reason => logErr('Error getting current zone: ' + reason));
  return city ? { cityName: city, countryCode, countryName: country, lat, lon } : undefined;
};

export const getServerZone = (urlHost?: URL): Promise<DetailedGeoLoc | undefined> => {
  return getCurrentZone(urlHost ? urlHost.host.replace(/^www\./,"") : urlHost); // Remove www.
};
