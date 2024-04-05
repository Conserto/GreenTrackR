export interface GES {
  carbonIntensity?: number;
  countryName: string;
  cityName?: string;
  countryCode: string;
}

export interface GESTotals {
  dataCenterTotal?: number;
  networkTotal?: number;
  deviceTotal?: number;
  pageTotal?: number;
}

export interface CarbonDatas {
  data: CarbonData[];
  countryName: string;
}

export interface CarbonData {
  date: Date | null;
  carbonIntensity: number;
}
