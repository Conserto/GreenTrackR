import type { CarbonData, GES, GESTotals, NetworkResponse, Score } from '.';

export interface Measure {
  date: Date;
  url: string;
  network: NetworkResponse;
  ges: GESTotals;
  energy: EnergyMeasure;
  nbRequest: number;
  score: Score;
  dom: number;
  userGES: GES;
  serverGES: GES;
}

export interface EnergyMeasure {
  kWhDataCenter: number;
  kWhNetwork: number;
  kWhDevice: number;
  kWhPage: number;
}
