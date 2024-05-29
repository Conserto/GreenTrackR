import type { GES, ResTotals, NetworkResponse, Score } from '.';

export interface Measure {
  date: Date;
  url?: string;
  action?: string;
  ges?: ResTotals;
  wu?: ResTotals;
  adpe?: ResTotals;
  energy: EnergyMeasure;
  score?: Score;
  dom: number;
  userGES?: GES;
  serverGES?: GES;
  networkGES?: GES;
  networkMeasure: NetworkMeasure;
  extensionMeasure: NetworkMeasure;
  complete: boolean;
}

export interface NetworkMeasure {
  network: NetworkResponse;
  detail?: NetworkDetail[];
  nbRequest: number;
  nbRequestCache: number;
}

export interface NetworkDetail {
  resource: string;
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
