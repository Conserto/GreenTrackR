import {
  KWH_DEVICE,
  KWH_PER_REQUEST_DATA_CENTER,
  KWH_PER_BYTE_NETWORK,
} from 'src/const/measure.const';
import type {
  CarbonData,
  CarbonDatas,
  EnergyMeasure,
  GES,
  GESTotals,
  Measure,
  NetworkResponse,
} from 'src/interface';

export class GESService {
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

  async getGES(url: URL, headers: Headers, countryCodeSelected: string): Promise<GES> {
    let GES;
    try {
      GES = await this.getGESFromApi(url, headers, countryCodeSelected);
      if (!GES.carbonIntensity) {
        GES = await this.getGESFromLocalFile(countryCodeSelected);
      }
    } catch (error) {
      try {
        console.warn(
          'There has been a problem when trying to get distant GES Emissions : ' +
            error +
            '. Trying to get data from local file',
        );

        GES = await this.getGESFromLocalFile(countryCodeSelected);
      } catch (e) {
        throw new Error(
          'There has been a problem when trying to get GES Emissions : ' +
            error +
            'from distant API and local file',
        );
      }
    }
    return GES;
  }

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
      const hourlyCarbonData = await this.getHourlyGES(urlHost, this.headers, results.countryCode);

      return {
        hourlyCarbonData: hourlyCarbonData,
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

  async getGESFromLocalFile(countryCodeSelected: string): Promise<GES> {
    let lastReportOnDate;
    const { data: carbonData, countryName } =
      (await this.parseCarbonFile(countryCodeSelected)) || [];

    if (carbonData.length > 0) {
      lastReportOnDate = carbonData[carbonData.length - 1];
    }

    return {
      hourlyCarbonData: carbonData,
      carbonIntensity: lastReportOnDate?.carbonIntensity ?? 0,
      countryName: countryName,
      cityName: '',
      countryCode: countryCodeSelected,
    };
  }

  async parseCarbonFile(countryCodeSelected: string): Promise<CarbonDatas> {
    let data: CarbonData[] = [];
    let countryName: string = '';
    try {
      if (countryCodeSelected == 'auto') {
        countryCodeSelected = 'FR';
      }
      let response: any = await import('src/assets/data/data_carbon.json');
      countryName = response[countryCodeSelected]?.[0].country_name;

      data = this.getSortedDayGESReport(response, countryCodeSelected);
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
    const carbonData = jsonContent[countryCodeSelected]
      .filter((dataCountry: any) => {
        let now = new Date();
        let reportDate = new Date(dataCountry.date);
        return now.getDay() === reportDate.getDay() && reportDate.getHours() < now.getHours();
      })
      .map((dataCountry: any) => ({
        date: new Date(dataCountry.date),
        carbonIntensity: dataCountry.carbonfactor,
      }));

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

  getEnergyAndGES(
    zoneGES: GES,
    userGES: GES,
    network: NetworkResponse,
    nbRequest: number,
  ): { ges: GESTotals; energy: EnergyMeasure } {
    let kWhDataCenter = 2 * nbRequest * network.sizeUncompress * KWH_PER_REQUEST_DATA_CENTER;
    let kWhNetwork = network.sizeUncompress * KWH_PER_BYTE_NETWORK;
    let kWhDevice = nbRequest * KWH_DEVICE;

    const dataCenterTotal = kWhDataCenter * zoneGES.carbonIntensity;
    const networkTotal = kWhNetwork * zoneGES.carbonIntensity;
    const deviceTotal = kWhDevice * userGES.carbonIntensity;
    const pageTotal = dataCenterTotal + networkTotal + deviceTotal;

    return {
      ges: { dataCenterTotal, networkTotal, deviceTotal, pageTotal },
      energy: {
        kWhDataCenter,
        kWhNetwork,
        kWhDevice,
        kWhPage: kWhDataCenter + kWhDevice + kWhNetwork,
      },
    };
  }

  async getHourlyGES(url: URL, headers: Headers, countryCodeSelected: string) {
    let hourlyGES;
    try {
      hourlyGES = await this.getHourlyGESFromApi(url, headers, countryCodeSelected);
    } catch (error) {
      throw new Error('There has been a problem when trying to get GES Emissions : ' + error);
    }
    return hourlyGES;
  }

  async getHourlyGESFromApi(url: URL, headers: Headers, codeCountry: string) {
    let hourlyCarbonDataFormatted: CarbonData[];
    try {
      let hourlyCarbonData = await fetch(
        `${import.meta.env.VITE_CARBON_API_URL}/carbon/daily/${codeCountry}/${new Date().toJSON().slice(0, 10)}`,
        {
          headers: headers,
        },
      );

      const res = await hourlyCarbonData.json();
      hourlyCarbonDataFormatted = res.map((hourlyCarbonData: any) => {
        return {
          date: new Date(hourlyCarbonData.date),
          carbonIntensity: hourlyCarbonData.carbonfactor,
        };
      });
    } catch (error) {
      throw new Error(
        'There has been a problem when trying to get Hourly GES Emissions : ' + error,
      );
    }
    return hourlyCarbonDataFormatted;
  }
}
