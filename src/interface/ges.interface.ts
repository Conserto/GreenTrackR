export interface GES {
  dailyCarbonData: CarbonData[];
  carbonIntensity: number;
  countryName: string;
  cityName: string;
  countryCode: string;
}

export interface GESTotals {
  dataCenterTotal: number;
  networkTotal: number;
  deviceTotal: number;
  websiteTotal: number;
}

export interface CarbonDatas {
  data: CarbonData[];
  countryName: string;
}

export interface CarbonData {
  date: Date | null;
  carbonIntensity: number;
}
