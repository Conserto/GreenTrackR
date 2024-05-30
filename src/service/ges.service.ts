import { getCarbonIntensity, getCurrentZone, getServerZone } from 'src/api';
import { codeZone } from 'src/assets/data/codeZone';
import { KWH_DEVICE, KWH_PER_BYTE_NETWORK, KWH_PER_REQUEST_DATA_CENTER } from 'src/const/measure.const';
import type { CarbonData, CarbonDatas, EnergyMeasure, GES, NetworkResponse, ResTotals } from 'src/interface';
import { logDebug, logErr } from '../utils/log';
import { SEARCH_AUTO } from '../const/key.const';

export class GESService {

  private cacheGesByUrl: Map<string, GES>;
  private cacheUserGes?: GES;

  constructor() {
    this.cacheGesByUrl = new Map<string, GES>();
  }

  async computeGES(countryCodeSelected: string, userCountryCodeSelected: string, urlHost?: URL) {
    let cacheSrvKey = (countryCodeSelected === SEARCH_AUTO && urlHost?.hostname) ? urlHost.hostname : undefined;
    let userGesUseCacheUserGes = userCountryCodeSelected === SEARCH_AUTO && this.cacheUserGes;
    let zoneGES: GES | undefined;
    let userGES: GES | undefined;
    if (cacheSrvKey && this.cacheGesByUrl.has(cacheSrvKey)) {
      logDebug('cache for Server');
      zoneGES = this.cacheGesByUrl.get(cacheSrvKey);
    } else {
      zoneGES = await this.getGESServer(urlHost, countryCodeSelected);
      if (zoneGES && cacheSrvKey) {
        this.cacheGesByUrl.set(cacheSrvKey, zoneGES);
      }
    }
    if (userGesUseCacheUserGes) {
      logDebug('cache for user');
      userGES = this.cacheUserGes;
    } else {
      userGES = await this.getGESUser(userCountryCodeSelected);
      if (userCountryCodeSelected === SEARCH_AUTO && userGES) {
        this.cacheUserGes = userGES;
      }
    }
    const networkGES: GES = {
      countryCode: '', countryName: '',
      display: zoneGES?.display?.split(',')[0] + ' -- ' + userGES?.display?.split(',')[0],
      carbonIntensity: ((userGES?.carbonIntensity || 0) + (zoneGES?.carbonIntensity || 0)) / 2,
      wu: ((userGES?.wu || 0) + (zoneGES?.wu || 0)) / 2,
      adpe: ((userGES?.adpe || 0) + (zoneGES?.adpe || 0)) / 2
    };
    return { zoneGES, userGES, networkGES };
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

  async getGESServer(url: URL | undefined, countryCodeSelected: string): Promise<GES | undefined> {
    logDebug('Call GES Server');
    return await this.getGES(url, true, countryCodeSelected);
  }

  async getGESUser(userCountryCodeSelected: string): Promise<GES | undefined> {
    logDebug('Call GES User');
    return this.getGES(undefined, false, userCountryCodeSelected);
  }

  async getGES(url: URL | undefined, serverType: boolean, countryCodeSelected: string): Promise<GES | undefined> {
    let GES: GES | undefined = undefined;
    try {
      if (window.navigator.onLine) {
        GES = await this.getGESFromApi(url, serverType, countryCodeSelected);
      } else {
        GES = await this.getGESFromLocalFile(countryCodeSelected);
      }
    } catch (error) {
      try {
        GES = await this.getGESFromLocalFile(countryCodeSelected);
      } catch (e) {
        logErr(`There has been a problem when trying to get GES Emissions : ${error} from distant API and local file`);
      }
    }
    const countryCode = countryCodeSelected !== SEARCH_AUTO ? countryCodeSelected : (GES && GES.countryCode ? GES.countryCode : undefined);
    if (countryCode && GES) {
      let datas = codeZone.find((line) => line.zone === countryCode);
      GES.wu = datas?.wu ? datas.wu * 1000 : undefined;
      GES.adpe = datas?.adpe ? datas.adpe * 1000 * 1000 : undefined;
    }
    logDebug(`Return GES ${GES?.cityName} / ${GES?.carbonIntensity} / ${GES?.wu} / ${GES?.adpe}`);
    return GES;
  }

  async getGESFromApi(urlHost: URL | undefined, serverType: boolean, countryCodeSelected: string): Promise<GES | undefined> {
    let ges: GES | undefined;
    try {
      if (countryCodeSelected !== SEARCH_AUTO) {
        const countryName = codeZone.find((zoneObj) => zoneObj.zone === countryCodeSelected)?.countryName ?? '';
        ges = {
          carbonIntensity: await getCarbonIntensity(countryCodeSelected),
          countryCode: countryCodeSelected,
          countryName: countryName,
          display: this.getDisplayZone(undefined, countryName)
        };
      } else {
        const location = serverType ? await getServerZone(urlHost) : await getCurrentZone();
        logDebug(`Location ${location}`);
        if (location) {
          ges = {
            carbonIntensity: await getCarbonIntensity(location),
            countryCode: location.countryCode,
            countryName: location.countryName,
            cityName: location.cityName,
            display: this.getDisplayZone(location.cityName, location.countryName)
          };
        }
      }
    } catch (error: any) {
      throw new Error(`There has been a problem when trying to get GES emissions from API : ${error}`);
    }
    return ges;
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

  async parseCarbonFile(countryCodeSelected: string): Promise<CarbonDatas> {
    let data: CarbonData[] = [];
    let countryName: string = '';
    try {
      if (countryCodeSelected == SEARCH_AUTO) {
        countryCodeSelected = 'FR';
      }
      let response: any = await import('src/assets/data/data_carbon.json');
      countryName = response[countryCodeSelected]?.[0].country_name;
      data = this.getSortedDayGESReport(response, countryCodeSelected);
    } catch (error: any) {
      logErr(
        'There has been a problem when trying to get GES emissions from Local file : ' + error
      );
    }
    return { data, countryName };
  }

  getSortedDayGESReport(jsonContent: any, countryCodeSelected: string): CarbonData[] {
    const dayGESReport = this.getDayGESReport(jsonContent, countryCodeSelected);
    return dayGESReport.sort((a: any, b: any) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  getDayGESReport(jsonContent: any, countryCodeSelected: string): CarbonData[] {
    return jsonContent[countryCodeSelected]
      .filter((dataCountry: any) => {
        let now = new Date();
        let reportDate = new Date(dataCountry.date);
        return now.getDay() === reportDate.getDay() && reportDate.getHours() < now.getHours();
      })
      .map((dataCountry: any) => ({
        date: new Date(dataCountry.date),
        carbonIntensity: dataCountry.carbonfactor
      }));
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
