import type { DetailedGeoLoc } from 'src/interface';

const getIpAddress = async () => {
  // FIXME continuable si erreur?
  try {
    // FIXME constante
    const { ip } = await fetch('https://api.ipify.org/?format=json').then((res) => res.json());
    return ip;
  } catch (error) {
    throw 'Error getting ip address:' + error;
  }
};

export const getCurrentZone = async (url: string | null = null): Promise<DetailedGeoLoc> => {
  const origin = url ? url : await getIpAddress();
  // FIXME si null pas traiter, continuable si erreur?
  try {
    const { lat, lon, countryCode, country, city } = await fetch(
      // FIXME http pas https? A Placer en constante
      `http://ip-api.com/json/${origin}`
    ).then((res) => res.json());
    return { cityName: city, countryCode, countryName: country, lat, lon };
  } catch (error) {
    throw 'Error getting current zone:' + error;
  }
};

export const getServerZone = (urlHost: URL | undefined): Promise<DetailedGeoLoc> => {
  // FIXME slice 4? Pourquoi pas un regex?
  const url = urlHost ? urlHost.host.slice(4) : null; // Remove www.
  return getCurrentZone(url);
};
