import type { DetailedGeoLoc } from 'src/interface';

const getIpAddress = async () => {
  try {
    const { ip } = await fetch('https://api.ipify.org/?format=json').then((res) => res.json());
    return ip;
  } catch (error) {
    throw 'Error getting ip address:' + error;
  }
};

export const getCurrentZone = async (url: string | null = null): Promise<DetailedGeoLoc> => {
  const origin = url ? url : await getIpAddress();
  try {
    const { lat, lon, countryCode, country, city } = await fetch(
      `http://ip-api.com/json/${origin}`,
    ).then((res) => res.json());
    return { cityName: city, countryCode, countryName: country, lat, lon };
  } catch (error) {
    throw 'Error getting current zone:' + error;
  }
};

export const getServerZone = (urlHost: URL): Promise<DetailedGeoLoc> => {
  const url = urlHost.host.slice(4); // Remove www.
  return getCurrentZone(url);
};
