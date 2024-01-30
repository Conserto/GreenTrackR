import {
  KWH_DEVICE,
  KWH_PER_BYTE_DATA_CENTER,
  KWH_PER_BYTE_NETWORK,
} from 'src/const/measure.const';
import type {
  CarbonData,
  CarbonDatas,
  GES,
  GESTotals,
  Measure,
  NetworkResponse,
} from 'src/interface';

export class GESService {
  private jsonFile = import.meta.env.VITE_CARBON_DATA_FILE;
  private headers = new Headers({
    Host: 'api.localhost',
    'X-Forwarded-Proto': 'http',
    'X-Forwarded-Host': 'api.localhost',
    'X-Forwarded-Port': '80',
  });
  constructor() {}

  async computeGES(urlHost: URL, countryCodeSelected: string, userCountryCodeSelected: string) {
    const zoneGES = await this.getGES(urlHost, this.headers, countryCodeSelected);
    const userGES = await this.getGES(urlHost, this.headers, userCountryCodeSelected);
    return { zoneGES, userGES };
  }

  async getGES(url: URL, headers: Headers, countryCodeSelected: string) {
    let GES;
    try {
      GES = await this.getGESFromApi(url, headers, countryCodeSelected);
      if (!GES.carbonIntensity) {
        GES = await this.getGESFromLocalFile(this.jsonFile, countryCodeSelected);
      }
    } catch (error) {
      throw new Error('There has been a problem when trying to get GES Emissions : ' + error);
    }
    return GES;
  }

  //TODO: return type
  async getGESFromApi(urlHost: URL, headers: Headers, countryCodeSelected: string): Promise<GES> {
    try {
      const zonesGES = await fetch(
        `
        ${import.meta.env.VITE_CARBON_API_URL}/carbon/${urlHost.host}/${countryCodeSelected}`,
        {
          headers: headers,
        },
      );
      const results = await zonesGES.json();
      return {
        dailyCarbonData: [],
        carbonIntensity: results.carbonIntensity,
        countryName: results.countryName,
        cityName: results.cityName,
        countryCode: results.countryCode,
      };
    } catch (error: any) {
      throw new Error(
        'There has been a problem when trying to get GES emissions from API : ' + error,
      );
    }
  }

  async getGESFromLocalFile(carbonJsonFile: string, countryCodeSelected: string): Promise<GES> {
    let lastReportOnDate;
    const { data: carbonData, countryName } =
      (await this.parseCarbonFile(carbonJsonFile, countryCodeSelected)) || [];

    if (carbonData.length > 0) {
      lastReportOnDate = carbonData[carbonData.length - 1];
    }
    return {
      dailyCarbonData: carbonData,
      carbonIntensity: lastReportOnDate?.carbonIntensity ?? 0,
      countryName: countryName,
      cityName: '',
      countryCode: countryCodeSelected,
    };
  }

  async parseCarbonFile(carbonJsonFile: string, countryCodeSelected: string): Promise<CarbonDatas> {
    let data: CarbonData[] = [];
    let countryName: string = '';
    try {
      if (countryCodeSelected !== 'auto') {
        let response = await fetch(chrome.runtime.getURL(carbonJsonFile));
        if (response.ok) {
          const jsonContent = await response.json();
          countryName = jsonContent[countryCodeSelected][0].country_name;
          data = this.getSortedDayGESReport(jsonContent, countryCodeSelected);
          console.log('chargement reussi');
        } else {
          throw new Error(
            'There has been a problem when trying to get GES emissions from Local file',
          );
        }
      }
    } catch (error: any) {
      throw new Error(
        'There has been a problem when trying to get GES emissions from Local file : ' + error,
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
    const carbonData = jsonContent[countryCodeSelected].map((dataCountry: any) => {
      let now = new Date();
      let reportDate = new Date(dataCountry.date);
      if (now.getDay() === reportDate.getDay() && reportDate.getHours() < now.getHours()) {
        return {
          date: reportDate,
          carbonIntensity: dataCountry.carbonfactor,
        };
      }
    });

    return carbonData;
  }

  getGESColor(value: number, coeff: number) {
    let thresholds = [
      { limit: 4.5, grade: 'F', color: '255, 19, 7' },
      { limit: 4.25, grade: 'E', color: '255, 102, 13' },
      { limit: 3.75, grade: 'D', color: '255, 139, 14' },
      { limit: 3.25, grade: 'D+', color: '255, 183, 0' },
      { limit: 2.75, grade: 'C', color: '255, 212, 58' },
      { limit: 2.0, grade: 'C+', color: '254, 244, 46' },
      { limit: 1.25, grade: 'B', color: '191, 222, 57' },
      { limit: 0.5, grade: 'B+', color: '52, 188, 110' },
      { limit: 0.25, grade: 'A', color: '24, 164, 64' },
      { limit: -Infinity, grade: 'A+', color: '3, 126, 34' },
    ];

    for (let element of thresholds) {
      if (value >= element.limit) {
        return 'rgba(' + element.color + ',' + coeff + ')';
      }
    }
  }

  getGESTotals(zoneGES: GES, userGES: GES, network: NetworkResponse, nbRequest: number): GESTotals {
    let kWhDataCenterTotal = 2 * nbRequest * network.sizeUncompress * KWH_PER_BYTE_DATA_CENTER;
    let kWhNetworkTotal = network.sizeUncompress * KWH_PER_BYTE_NETWORK;
    let kWhDeviceTotal = nbRequest * KWH_DEVICE;

    const dataCenterTotal = kWhDataCenterTotal * zoneGES.carbonIntensity;
    const networkTotal = kWhNetworkTotal * zoneGES.carbonIntensity;
    const deviceTotal = kWhDeviceTotal * userGES.carbonIntensity;
    const websiteTotal = dataCenterTotal + networkTotal + deviceTotal;

    return { dataCenterTotal, networkTotal, deviceTotal, websiteTotal };
  }
}
