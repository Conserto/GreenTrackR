import type { DetailedGeoLoc } from 'src/interface';
import { IP_API, IPFI_API } from '../const/url.const';
import { logErr } from '../utils/log';

const getIpAddress = async (): Promise<string | undefined> => {
  const { ip } = await fetch(IPFI_API)
    .then((res) => res.json())
    .catch(reason => logErr('Error getting ip address: ' + reason));
  return ip ? ip : undefined;
};

export const getCurrentZone = async (url?: string): Promise<DetailedGeoLoc> => {
  const origin = url ? url : await getIpAddress();
  if (!origin) {
    return { cityName: '', countryCode: '', countryName: '', lon: 0, lat: 0 };
  }
  const { lat, lon, countryCode, country, city } = await fetch(
    IP_API + origin)
    .then((res) => res.json())
    .catch(reason => logErr('Error getting current zone: ' + reason));
  return city ? { cityName: city, countryCode, countryName: country, lat, lon } : {
    cityName: '',
    countryCode: '',
    countryName: '',
    lon: 0,
    lat: 0
  };
};

export const getServerZone = (urlHost?: URL): Promise<DetailedGeoLoc> => {
  return getCurrentZone(urlHost ? urlHost.host.replaceAll("^www\.","") : urlHost); // Remove www.
};
