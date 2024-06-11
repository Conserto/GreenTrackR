export interface GeoLocation {
  lat: number;
  lon: number;
}

export interface DetailedGeoLoc extends GeoLocation {
  countryName: string;
  cityName: string;
  countryCode: string;
}

export interface Zone {
  countryName: string,
  country: string,
  continent: string,
  zoneAlpha2: string,
  zoneAlpha3: string,
  wu?: number,
  adpe?: number,
  carbonFactor: number,
}