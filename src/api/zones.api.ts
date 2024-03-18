import type { DetailedGeoLoc } from 'src/interface';
import { IP_API, IPFI_API } from '../const/url.const';
import { logErr } from '../utils/log';

const getIpAddress = async () => {
  // FIXME continuable si erreur?
  try {
    // FIXME catch dans call
    const { ip } = await fetch(IPFI_API).then((res) => res.json());
    return ip;
  } catch (error) {
    logErr('Error getting ip address: ' + error);
    return undefined;
  }
};

export const getCurrentZone = async (url: string | undefined = undefined): Promise<DetailedGeoLoc> => {
  const origin = url ? url : await getIpAddress();
  // FIXME si null pas traiter, continuable si erreur?
  try {
    // FIXME catch dans call
    const { lat, lon, countryCode, country, city } = await fetch(
      IP_API + origin
    ).then((res) => res.json());
    return { cityName: city, countryCode, countryName: country, lat, lon };
  } catch (error) {
    logErr('Error getting current zone: ' + error);
    return { cityName: '', countryCode: '', countryName: '', lon: 0, lat: 0 };
  }
};

export const getServerZone = (urlHost: URL | undefined): Promise<DetailedGeoLoc> => {
  // FIXME slice 4? Pourquoi pas un regex ou replace?
  const url = urlHost ? urlHost.host.slice(4) : null; // Remove www.
  return getCurrentZone(url);
};
