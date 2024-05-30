import { getCarbonIntensity, getCurrentZone, getServerZone } from 'src/api';
import { codeZone } from 'src/assets/data/codeZone';
import { KWH_DEVICE, KWH_PER_BYTE_NETWORK, KWH_PER_REQUEST_DATA_CENTER } from 'src/const/measure.const';
import type {
  Co2SignalResponse,
  DetailedGeoLoc,
  DetailServer,
  DetailServerGes,
  EnergyMeasure,
  GES,
  NetworkResponse,
  ResTotals,
  SimpleGES,
  Zone
} from 'src/interface';
import {
  computeResources,
  formatDisplayZone,
  getAdpeUnit,
  getAverageValue,
  getLocalStorageObject, getRealCall,
  getWuUnit,
  logDebug,
  logErr
} from 'src/utils';
import { SEARCH_AUTO } from 'src/const/key.const';
import { paramTokenCo2 } from 'src/const';

export class GESService {

  private cacheGesByUrl: Map<string, GES>;
  private cacheGesUser?: GES;
  private cacheLocationByHost: Map<string, DetailedGeoLoc>;

  constructor() {
    this.cacheGesByUrl = new Map<string, GES>();
    this.cacheLocationByHost = new Map<string, DetailedGeoLoc>;
  }

  async computeGesDetailResource(countryCodeSelected: string, detailsServer?: DetailServer[], srvGes?: GES) {
    const defGes = countryCodeSelected === SEARCH_AUTO ? undefined : srvGes;
    const callApi = (window.navigator.onLine && getLocalStorageObject(paramTokenCo2));
    let respTmp: Map<string, DetailServerGes> = new Map<string, DetailServerGes>();
    let resp: DetailServerGes[] = [];
    if (detailsServer) {
      for (const ds of detailsServer) {
        const ges = defGes ? defGes : await this.getGESServer(ds.oneUrl, countryCodeSelected, callApi);
        let detailServerGes = respTmp.get(ges?.countryCode || '-');
        if (detailServerGes) {
          detailServerGes.hostnames.push(ds);
          detailServerGes.hit += ds.details.length;
          detailServerGes.hitReal += getRealCall(ds.details);
        } else {
          detailServerGes = {
            hostnames: [ds],
            ges: ges,
            hit: ds.details.length,
            hitReal: getRealCall(ds.details)
          };
        }
        respTmp.set(ges?.countryCode || '-', detailServerGes);
      }
      resp = [...respTmp.values()];
    }
    return resp;
  }

  async computeGES(countryCodeSelected: string, userCountryCodeSelected: string, urlHost?: URL) {
    const callApi = (window.navigator.onLine && getLocalStorageObject(paramTokenCo2));
    let cacheSrvKey = (countryCodeSelected === SEARCH_AUTO && urlHost?.hostname) ? urlHost.hostname : undefined;
    let userGesUseCacheUserGes = userCountryCodeSelected === SEARCH_AUTO && this.cacheGesUser;
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
      userGES = this.cacheGesUser;
    } else {
      userGES = await this.getGESUser(userCountryCodeSelected, callApi);
      if (userCountryCodeSelected === SEARCH_AUTO && userGES) {
        this.cacheGesUser = userGES;
      }
    }
    return { serverGES, userGES };
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
    let carbonResponse: Co2SignalResponse | undefined = undefined;
    try {
      if (countryCodeSelected == SEARCH_AUTO) {
        location = (url && url.host) ? this.cacheLocationByHost.get(url.host + serverType) : undefined;
        if (!location) {
          location = await this.getLocation(url, serverType);
          if (url && url.host && location) {
            this.cacheLocationByHost.set(url.host + serverType, location);
          }
        }
      } else {
        location = countryCodeSelected;
      }
      if (callApi) {
        carbonResponse = await getCarbonIntensity(location);
      }
      const zone: Zone | undefined = this.findZoneFromLocation(typeof location === 'string' ? location : location?.countryCode || '');
      const city = typeof location === 'string' ? undefined : location?.cityName;
      if (zone) {
        logDebug(`Retour: ${carbonResponse?.countryCode} || ${zone.zoneAlpha2} || ${countryCodeSelected}`);
        ges = {
          countryCode: carbonResponse?.countryCode || zone.zoneAlpha2 || countryCodeSelected,
          countryName: zone.countryName,
          cityName: city,
          display: formatDisplayZone(city, zone.countryName),
          carbonIntensity: carbonResponse?.carbonIntensity || zone.carbonFactor,
          wu: zone.wu ? getWuUnit(zone.wu) : undefined,
          adpe: zone.adpe ? getAdpeUnit(zone.adpe) : undefined
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

  async getGESFromLocalFile(countryCodeSelected: string): Promise<GES | undefined> {
    let lastReportOnDate;
    const { data: carbonData, countryName } =
    (await this.parseCarbonFile(countryCodeSelected)) || [];

    if (carbonData.length > 0) {
      lastReportOnDate = carbonData[carbonData.length - 1];
    }

    return {
      carbonIntensity: lastReportOnDate?.carbonIntensity ?? undefined,
      countryName: countryName,
      cityName: '',
      countryCode: countryCodeSelected,
      display: this.getDisplayZone(undefined, countryName)
    };
  }

  async getLocation(urlHost: URL | undefined, serverType: boolean) {
    return serverType ? await getServerZone(urlHost) : await getCurrentZone();
  }

  
  getEnergyAndResources(network: NetworkResponse, nbRequest: number, zoneGES?: SimpleGES, userGES?: GES, networkGES?: SimpleGES): {
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
      ges: computeResources(userGES?.carbonIntensity, zoneGES?.carbonIntensity, networkGES?.carbonIntensity, enrgy),
      wu: computeResources(userGES?.wu, zoneGES?.wu, networkGES?.wu, enrgy),
      adpe: computeResources(userGES?.adpe, zoneGES?.adpe, networkGES?.adpe, enrgy),
      energy: enrgy
    };
  }

}
