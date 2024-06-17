export interface SimpleGES {
  carbonIntensity?: number;
  wu?: number;
  adpe?: number;
}

export interface GES extends SimpleGES {
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

export interface Co2SignalResponse {
  carbonIntensity?: number;
  countryCode?: string;
}


