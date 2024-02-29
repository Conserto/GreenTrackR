export interface GeoLocation {
  lat: number;
  lon: number;
}

export interface DetailedGeoLoc extends GeoLocation {
  countryName: string;
  cityName: string;
  countryCode: string;
}
