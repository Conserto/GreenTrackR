import { getCarbonIntensity, getCurrentZone, getServerZone } from 'src/api';
import { codeZone } from 'src/assets/data/codeZone';
import { KWH_DEVICE, KWH_PER_BYTE_NETWORK, KWH_PER_REQUEST_DATA_CENTER } from 'src/const/measure.const';
import type { CarbonData, CarbonDatas, EnergyMeasure, GES, GESTotals, NetworkResponse } from 'src/interface';
import { logErr, logInfo } from '../utils/log';
import { SEARCH_AUTO } from '../const/key.const';

export class GESService {

  private cacheGesByUrl: Map<String, GES>;
  private cacheUserGes?: GES;
  private carbonFile = 'src/assets/data/data_carbon.json';

  constructor() {
    this.cacheGesByUrl = new Map<String, GES>();
  }

  async computeGES(countryCodeSelected: string, userCountryCodeSelected: string, urlHost?: URL) {
    let cacheSrvKey = (countryCodeSelected === SEARCH_AUTO && urlHost?.hostname) ? urlHost.hostname : undefined;
    let userGesUseCacheUserGes = userCountryCodeSelected === SEARCH_AUTO && this.cacheUserGes;
    let zoneGES: GES | undefined;
    let userGES: GES | undefined;
    if (cacheSrvKey && this.cacheGesByUrl.has(cacheSrvKey)) {
      zoneGES = this.cacheGesByUrl.get(cacheSrvKey);
    } else {
      zoneGES = await this.getGESServer(urlHost, countryCodeSelected);
      if (zoneGES && cacheSrvKey) {
        this.cacheGesByUrl.set(cacheSrvKey, zoneGES);
      }
    }
    if (userGesUseCacheUserGes) {
      userGES = this.cacheUserGes;
    } else {
      userGES = await this.getGESUser(userCountryCodeSelected);
      if (userCountryCodeSelected === SEARCH_AUTO && userGES) {
        this.cacheUserGes = userGES;
      }
    }
    return { zoneGES, userGES };
  }

  async getGESServer(url: URL | undefined, countryCodeSelected: string): Promise<GES | undefined> {
    logInfo('Call GES Server');
    return await this.getGES(url, true, countryCodeSelected);
  }

  async getGESUser(userCountryCodeSelected: string): Promise<GES | undefined> {
    logInfo('Call GES User');
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
    logInfo(`Return GES ${GES?.cityName} / ${GES?.carbonIntensity}`);
    return GES;
  }

  async getGESFromApi(urlHost: URL | undefined, serverType: boolean, countryCodeSelected: string): Promise<GES> {
    const GES = {
      carbonIntensity: 0,
      countryName: '',
      cityName: '',
      countryCode: ''
    };
    try {
      if (countryCodeSelected !== SEARCH_AUTO) {
        GES.carbonIntensity = await getCarbonIntensity(countryCodeSelected);
        GES.countryCode = countryCodeSelected;
        GES.countryName =
          codeZone.find((zoneObj) => zoneObj.zone === countryCodeSelected)?.countryName ?? '';
      } else {
        const location = serverType ? await getServerZone(urlHost) : await getCurrentZone();
        logInfo(`Location: ${location.cityName}`);
        GES.carbonIntensity = await getCarbonIntensity(location);
        GES.countryCode = location.countryCode;
        GES.countryName = location.countryName;
        GES.cityName = location.cityName;
      }
    } catch (error: any) {
      throw new Error(`There has been a problem when trying to get GES emissions from API : ${error}`);
    }
    return GES;
  }

  async getGESFromLocalFile(countryCodeSelected: string): Promise<GES> {
    let lastReportOnDate;
    const { data: carbonData, countryName } =
    (await this.parseCarbonFile(countryCodeSelected)) || [];

    if (carbonData.length > 0) {
      lastReportOnDate = carbonData[carbonData.length - 1];
    }

    return {
      carbonIntensity: lastReportOnDate?.carbonIntensity ?? 0,
      countryName: countryName,
      cityName: '',
      countryCode: countryCodeSelected
    };
  }

  async parseCarbonFile(countryCodeSelected: string): Promise<CarbonDatas> {
    let data: CarbonData[] = [];
    let countryName: string = '';
    try {
      if (countryCodeSelected == SEARCH_AUTO) {
        countryCodeSelected = 'FR';
      }
      let response: any = await import(this.carbonFile);
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

  getEnergyAndGES(network: NetworkResponse, nbRequest: number, zoneGES?: GES, userGES?: GES): {
    ges: GESTotals;
    energy: EnergyMeasure
  } {
    let kWhDataCenter = nbRequest * KWH_PER_REQUEST_DATA_CENTER;
    let kWhNetwork = network.size * KWH_PER_BYTE_NETWORK;
    let kWhDevice = network.sizeUncompress * KWH_DEVICE;

    const dataCenterTotal = zoneGES ? kWhDataCenter * zoneGES.carbonIntensity : -1;
    const networkTotal = zoneGES ? kWhNetwork * zoneGES.carbonIntensity : -1;
    const deviceTotal = userGES ? kWhDevice * userGES.carbonIntensity : -1;
    const pageTotal = dataCenterTotal + networkTotal + deviceTotal;

    return {
      ges: { dataCenterTotal, networkTotal, deviceTotal, pageTotal },
      energy: {
        kWhDataCenter,
        kWhNetwork,
        kWhDevice,
        kWhPage: kWhDataCenter + kWhDevice + kWhNetwork
      }
    };
  }
}
