import type { GES, GESTotals, NetworkResponse, Score } from '.';

export interface Measure {
  date: Date;
  url: string | undefined;
  ges: GESTotals;
  energy: EnergyMeasure;
  score: Score;
  dom: number;
  userGES: GES | undefined;
  serverGES: GES | undefined;
  networkMeasure: NetworkMeasure;
  extensionMeasure: NetworkMeasure;
}

export interface NetworkMeasure {
  network: NetworkResponse;
  nbRequest: number;
}

export interface EnergyMeasure {
  kWhDataCenter: number;
  kWhNetwork: number;
  kWhDevice: number;
  kWhPage: number;
}
