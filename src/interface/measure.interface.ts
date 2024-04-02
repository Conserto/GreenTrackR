import type { GES, GESTotals, NetworkResponse, Score } from '.';

export interface Measure {
  date: Date;
  url?: string;
  action?: string;
  ges?: GESTotals;
  energy: EnergyMeasure;
  score?: Score;
  dom: number;
  userGES?: GES;
  serverGES?: GES;
  networkMeasure: NetworkMeasure;
  extensionMeasure: NetworkMeasure;
  complete: boolean;
}

export interface NetworkMeasure {
  network: NetworkResponse;
  nbRequest: number;
  nbRequestCache: number;
}

export interface EnergyMeasure {
  kWhDataCenter: number;
  kWhNetwork: number;
  kWhDevice: number;
  kWhPage: number;
}
