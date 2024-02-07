import type { CarbonData, GESTotals, NetworkResponse, Score } from '.';

export interface Measure {
  date: Date;
  cityName: string;
  url: string;
  network: NetworkResponse;
  ges: GESTotals;
  nbRequest: number;
  score: Score;
  zone: string;
  carbonIntensity: number;
  hourlyCarbonData?: CarbonData[];
}
