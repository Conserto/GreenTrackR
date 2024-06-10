import { getCarbonIntensity, getCurrentZone, getServerZone } from 'src/api';
import { codeZone } from 'src/assets/data/codeZone';
import { KWH_DEVICE, KWH_PER_BYTE_NETWORK, KWH_PER_REQUEST_DATA_CENTER } from 'src/const/measure.const';
import type { DetailedGeoLoc, EnergyMeasure, GES, NetworkResponse, ResTotals, Zone } from 'src/interface';
import { logDebug, logErr } from '../utils/log';
import { SEARCH_AUTO } from '../const/key.const';
import { getLocalStorageObject } from '../utils';
import { paramTokenCo2 } from '../const';

export class GESService {

  private cacheGesByUrl: Map<string, GES>;
  private cacheUserGes?: GES;

  constructor() {
    this.cacheGesByUrl = new Map<string, GES>();
  }

  async computeGES(countryCodeSelected: string, userCountryCodeSelected: string, urlHost?: URL) {
    const callApi = (window.navigator.onLine && getLocalStorageObject(paramTokenCo2));
    let cacheSrvKey = (countryCodeSelected === SEARCH_AUTO && urlHost?.hostname) ? urlHost.hostname : undefined;
    let userGesUseCacheUserGes = userCountryCodeSelected === SEARCH_AUTO && this.cacheUserGes;
    let serverGES: GES | undefined;
    let userGES: GES | undefined;
    if (cacheSrvKey && this.cacheGesByUrl.has(cacheSrvKey)) {
      logDebug('cache for Server');
      serverGES = this.cacheGesByUrl.get(cacheSrvKey);
    } else {
      serverGES = await this.getGESServer(urlHost, countryCodeSelected, callApi);
      if (serverGES && cacheSrvKey) {
        this.cacheGesByUrl.set(cacheSrvKey, serverGES);
      }
    }
    if (userGesUseCacheUserGes) {
      logDebug('cache for user');
      userGES = this.cacheUserGes;
    } else {
      userGES = await this.getGESUser(userCountryCodeSelected, callApi);
      if (userCountryCodeSelected === SEARCH_AUTO && userGES) {
        this.cacheUserGes = userGES;
      }
    }
    const networkGES: GES = {
      countryCode: '', countryName: '',
      display: serverGES?.display?.split(',')[0] + ' -- ' + userGES?.display?.split(',')[0],
      carbonIntensity: ((userGES?.carbonIntensity || 0) + (serverGES?.carbonIntensity || 0)) / 2,
      wu: ((userGES?.wu || 0) + (serverGES?.wu || 0)) / 2,
      adpe: ((userGES?.adpe || 0) + (serverGES?.adpe || 0)) / 2
    };
    return { serverGES, userGES, networkGES };
  }

  getDisplayZone(cityName: string | undefined, countryName: string | undefined) {
    let value: string = '-';
    if (cityName && countryName) {
      value = cityName + ', ' + countryName;
    } else if (countryName) {
      value = countryName;
    } else if (cityName) {
      value = cityName;
    }
    return value;
  }

  async getGESServer(url: URL | undefined, countryCodeSelected: string, callApi: boolean): Promise<GES | undefined> {
    logDebug('Call GES Server');
    return await this.getGES(url, true, countryCodeSelected, callApi);
  }

  async getGESUser(userCountryCodeSelected: string, callApi: boolean): Promise<GES | undefined> {
    logDebug('Call GES User');
    return this.getGES(undefined, false, userCountryCodeSelected, callApi);
  }

  async getGES(url: URL | undefined, serverType: boolean, countryCodeSelected: string, callApi: boolean): Promise<GES | undefined> {
    let ges: GES | undefined = undefined;
    let location: DetailedGeoLoc | string | undefined = undefined;
    let carbonIntensity = undefined;
    try {
      if (countryCodeSelected == SEARCH_AUTO) {
        location = await this.getLocation(url, serverType);
      } else {
        location = countryCodeSelected;
      }
      if (callApi) {
        carbonIntensity = await getCarbonIntensity(location);
      }
      const zone: Zone | undefined = this.findZoneFromLocation(typeof location === 'string' ? location : location?.countryCode || '');
      const city = typeof location === 'string' ? undefined : location?.cityName;
      if (zone) {
        ges = {
          countryCode: zone.zoneAlpha2 || countryCodeSelected,
          countryName: zone.countryName,
          cityName: city,
          display: this.getDisplayZone(city, zone.countryName),
          carbonIntensity: carbonIntensity || zone.carbonFactor,
          wu: zone.wu ? zone.wu * 1000 : undefined,
          adpe: zone.adpe ? zone.adpe * 1000 * 1000 : undefined
        };
      }
    } catch (error) {
      logErr(`There has been a problem when trying to get GES Emissions : ${error} from distant API and local file`);
    }
    logDebug(`Return GES ${ges?.cityName} / ${ges?.carbonIntensity} / ${ges?.wu} / ${ges?.adpe}`);
    return ges;
  }

  findZoneFromLocation(countryCode: string) {
    const search = countryCode.toUpperCase();
    return codeZone.find((cz) => cz.zoneAlpha2 === search || cz.zoneAlpha3 === search);
  }

  async getLocation(urlHost: URL | undefined, serverType: boolean) {
    // TODO Cache
    return serverType ? await getServerZone(urlHost) : await getCurrentZone();
  }

  getEnergyAndResources(network: NetworkResponse, nbRequest: number, zoneGES?: GES, userGES?: GES, networkGES?: GES): {
    ges: ResTotals;
    wu: ResTotals;
    adpe: ResTotals;
    energy: EnergyMeasure
  } {
    const kWhDataCenter = nbRequest * KWH_PER_REQUEST_DATA_CENTER;
    const kWhNetwork = network.size * KWH_PER_BYTE_NETWORK;
    const kWhDevice = network.sizeUncompress * KWH_DEVICE;

    const enrgy: EnergyMeasure = {
      kWhDataCenter,
      kWhNetwork,
      kWhDevice,
      kWhPage: kWhDataCenter + kWhDevice + kWhNetwork
    };

    return {
      ges: this.getResources(userGES?.carbonIntensity, zoneGES?.carbonIntensity, networkGES?.carbonIntensity, enrgy),
      wu: this.getResources(userGES?.wu, zoneGES?.wu, networkGES?.wu, enrgy),
      adpe: this.getResources(userGES?.adpe, zoneGES?.adpe, networkGES?.adpe, enrgy),
      energy: enrgy
    };
  }

  getResources(usrResource: number | undefined, srvResource: number | undefined, netResource: number | undefined, energy: EnergyMeasure): ResTotals {
    const dataCenterTotal = srvResource ? energy.kWhDataCenter * srvResource : undefined;
    const networkTotal = netResource ? energy.kWhNetwork * netResource : undefined;
    const deviceTotal = usrResource ? energy.kWhDevice * usrResource : undefined;
    const pageTotal = (dataCenterTotal ? dataCenterTotal : 0) + (networkTotal ? networkTotal : 0) + (deviceTotal ? deviceTotal : 0);
    return {
      dataCenterTotal: dataCenterTotal,
      networkTotal: networkTotal,
      deviceTotal: deviceTotal,
      pageTotal: pageTotal
    };
  }

}
