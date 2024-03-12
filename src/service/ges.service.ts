import { getCarbonIntensity, getCurrentZone, getServerZone } from 'src/api';
import { codeZone } from 'src/assets/data/codeZone';
import {
  KWH_DEVICE,
  KWH_PER_REQUEST_DATA_CENTER,
  KWH_PER_BYTE_NETWORK,
} from 'src/const/measure.const';
import { GesTypeEnum } from 'src/enum';
import type {
  CarbonData,
  CarbonDatas,
  EnergyMeasure,
  GES,
  GESTotals,
  NetworkResponse,
} from 'src/interface';

export class GESService {
  constructor() {}

  async computeGES(urlHost: URL, countryCodeSelected: string, userCountryCodeSelected: string) {
    const zoneGES = await this.getGES(urlHost, GesTypeEnum.SERVER, countryCodeSelected);
    const userGES = await this.getGES(urlHost, GesTypeEnum.USER, userCountryCodeSelected);

    return { zoneGES, userGES };
  }

  async getGES(url: URL, gesType: GesTypeEnum, countryCodeSelected: string): Promise<GES> {
    let GES;
    try {
      if (window.navigator.onLine) {
        GES = await this.getGESFromApi(url, gesType, countryCodeSelected);
      } else {
        GES = await this.getGESFromLocalFile(countryCodeSelected);
      }
    } catch (error) {
      try {
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

  async getGESFromApi(
    urlHost: URL,
    gesType: GesTypeEnum,
    countryCodeSelected: string,
  ): Promise<GES> {
    try {
      const GES = {
        carbonIntensity: 0,
        countryName: '',
        cityName: '',
        countryCode: '',
      };
      if (countryCodeSelected !== 'auto') {
        GES.carbonIntensity = await getCarbonIntensity(countryCodeSelected);
        GES.countryCode = countryCodeSelected;
        GES.countryName =
          codeZone.find((zoneObj) => zoneObj.zone === countryCodeSelected)?.countryName ?? '';
      } else {
        const location =
          gesType === GesTypeEnum.USER ? await getCurrentZone() : await getServerZone(urlHost);
        GES.carbonIntensity = await getCarbonIntensity(location);
        GES.countryCode = location.countryCode;
        GES.countryName = location.countryName;
        GES.cityName = location.cityName;
      }

      return GES;
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

  getEnergyAndGES(
    zoneGES: GES,
    userGES: GES,
    network: NetworkResponse,
    nbRequest: number,
  ): { ges: GESTotals; energy: EnergyMeasure } {
    let kWhDataCenter = nbRequest * KWH_PER_REQUEST_DATA_CENTER;
    let kWhNetwork = network.size * KWH_PER_BYTE_NETWORK;
    let kWhDevice = network.sizeUncompress * KWH_DEVICE;

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
}
