export interface GES {
  carbonIntensity?: number;
  wu?: number;
  adpe?: number;
  countryName: string;
  cityName?: string;
  countryCode: string;
  display: string;
}

export interface ResTotals {
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
