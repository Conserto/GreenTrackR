import type { GESTotals, NetworkResponse, Score } from '.';

export interface Measure {
  cityName: string;
  url: string;
  network: NetworkResponse;
  ges: GESTotals;
  nbRequest: number;
  score: Score;
  zone: string;
  carbonIntensity: number;
}
