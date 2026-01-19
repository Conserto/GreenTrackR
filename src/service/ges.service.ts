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
  getLocalStorageObject,
  getRealCall,
  getWuUnit,
  logDebug,
  logErr,
  logWarn
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
    const callApi = this.canCallApi();
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

  /**
   * Check if we can call external APIs
   * More robust check for Firefox compatibility
   */
  private canCallApi(): boolean {
    try {
      const hasToken = !!getLocalStorageObject(paramTokenCo2);
      // navigator.onLine can be unreliable in extension contexts
      // Default to true if we can't determine
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      logDebug(`canCallApi: hasToken=${hasToken}, isOnline=${isOnline}`);
      return isOnline && hasToken;
    } catch (e) {
      logDebug(`canCallApi error: ${e}, defaulting to false`);
      return false;
    }
  }

  async computeGES(countryCodeSelected: string, userCountryCodeSelected: string, urlHost?: URL) {
    const callApi = this.canCallApi();
    logDebug(`computeGES: countryCode=${countryCodeSelected}, userCountry=${userCountryCodeSelected}, callApi=${callApi}`);

    let cacheSrvKey = (countryCodeSelected === SEARCH_AUTO && urlHost?.hostname) ? urlHost.hostname : undefined;
    let userGesUseCacheUserGes = userCountryCodeSelected === SEARCH_AUTO && this.cacheGesUser;
    let serverGES: GES | undefined;
    let userGES: GES | undefined;

    // Get Server GES
    if (cacheSrvKey && this.cacheGesByUrl.has(cacheSrvKey)) {
      logDebug('Using cache for Server GES');
      serverGES = this.cacheGesByUrl.get(cacheSrvKey);
    } else {
      serverGES = await this.getGESServer(urlHost, countryCodeSelected, callApi);
      if (serverGES && cacheSrvKey) {
        this.cacheGesByUrl.set(cacheSrvKey, serverGES);
      }
    }

    // Get User GES
    if (userGesUseCacheUserGes) {
      logDebug('Using cache for User GES');
      userGES = this.cacheGesUser;
    } else {
      userGES = await this.getGESUser(userCountryCodeSelected, callApi);
      if (userCountryCodeSelected === SEARCH_AUTO && userGES) {
        this.cacheGesUser = userGES;
      }
    }

    logDebug(`computeGES result: serverGES=${serverGES?.countryCode}, userGES=${userGES?.countryCode}`);
    return { serverGES, userGES };
  }

  async getGESServer(url: URL | undefined, countryCodeSelected: string, callApi: boolean): Promise<GES | undefined> {
    logDebug(`getGESServer: url=${url?.hostname}, countryCode=${countryCodeSelected}`);
    return await this.getGES(url, true, countryCodeSelected, callApi);
  }

  async getGESUser(userCountryCodeSelected: string, callApi: boolean): Promise<GES | undefined> {
    logDebug(`getGESUser: countryCode=${userCountryCodeSelected}`);
    return this.getGES(undefined, false, userCountryCodeSelected, callApi);
  }

  async getGES(url: URL | undefined, serverType: boolean, countryCodeSelected: string, callApi: boolean): Promise<GES | undefined> {
    let ges: GES | undefined = undefined;
    let location: DetailedGeoLoc | string | undefined = undefined;
    let carbonResponse: Co2SignalResponse | undefined = undefined;

    try {
      // Step 1: Get location
      if (countryCodeSelected == SEARCH_AUTO) {
        const cacheKey = url && url.host ? url.host + serverType : undefined;
        location = cacheKey ? this.cacheLocationByHost.get(cacheKey) : undefined;

        if (!location) {
          logDebug(`Getting location for ${serverType ? 'server' : 'user'}...`);
          try {
            location = await this.getLocation(url, serverType);
            logDebug(`Location result: ${JSON.stringify(location)}`);
          } catch (locError) {
            logWarn(`Failed to get location: ${locError}`);
            // Use fallback - try to continue without location
          }

          if (cacheKey && location) {
            this.cacheLocationByHost.set(cacheKey, location);
          }
        }
      } else {
        location = countryCodeSelected;
      }

      // Step 2: Get carbon intensity from API (if enabled)
      if (callApi && location) {
        try {
          logDebug(`Getting carbon intensity for location: ${typeof location === 'string' ? location : location?.countryCode}`);
          carbonResponse = await getCarbonIntensity(location);
          logDebug(`Carbon intensity result: ${carbonResponse?.carbonIntensity}`);
        } catch (carbonError) {
          logWarn(`Failed to get carbon intensity from API: ${carbonError}`);
          // Continue with local data
        }
      }

      // Step 3: Find zone from local data
      const countryCode = typeof location === 'string' ? location : location?.countryCode || '';
      const zone: Zone | undefined = this.findZoneFromLocation(countryCode);
      const city = typeof location === 'string' ? undefined : location?.cityName;

      if (zone) {
        logDebug(`Found zone: ${zone.countryName} (${zone.zoneAlpha2})`);
        ges = {
          countryCode: carbonResponse?.countryCode || zone.zoneAlpha2 || countryCodeSelected,
          countryName: zone.countryName,
          cityName: city,
          display: formatDisplayZone(city, zone.countryName),
          carbonIntensity: carbonResponse?.carbonIntensity || zone.carbonFactor,
          wu: zone.wu ? getWuUnit(zone.wu) : undefined,
          adpe: zone.adpe ? getAdpeUnit(zone.adpe) : undefined
        };
      } else if (countryCode) {
        // Fallback: create minimal GES with just country code
        logWarn(`Zone not found for ${countryCode}, using fallback`);
        ges = {
          countryCode: countryCode,
          countryName: countryCode,
          cityName: city,
          display: city ? `${city}, ${countryCode}` : countryCode,
          carbonIntensity: carbonResponse?.carbonIntensity || 500, // World average fallback
          wu: undefined,
          adpe: undefined
        };
      }
    } catch (error) {
      logErr(`Error in getGES: ${error}`);
    }

    logDebug(`getGES result: ${ges?.cityName || 'no city'} / CI=${ges?.carbonIntensity} / WU=${ges?.wu} / ADPE=${ges?.adpe}`);
    return ges;
  }

  findZoneFromLocation(countryCode: string) {
    if (!countryCode) return undefined;
    const search = countryCode.toUpperCase();
    return codeZone.find((cz) => cz.zoneAlpha2 === search || cz.zoneAlpha3 === search);
  }

  async getLocation(urlHost: URL | undefined, serverType: boolean): Promise<DetailedGeoLoc | undefined> {
    try {
      const result = serverType ? await getServerZone(urlHost) : await getCurrentZone();
      return result;
    } catch (error) {
      logErr(`getLocation failed: ${error}`);
      return undefined;
    }
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