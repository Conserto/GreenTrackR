import type { GES, ResTotals, NetworkResponse, Score, SimpleGES } from '.';

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
  serversGES?: SimpleGES;
  detailResources?: DetailServer[];
  detailResourcesGes?: DetailServerGes[];
  networkGES?: SimpleGES;
  networkMeasure: NetworkMeasure;
  extensionMeasure: NetworkMeasure;
  complete: boolean;
}

export interface DetailServerGes {
  hostnames: DetailServer[];
  ges?: GES;
  hit: number;
  hitReal: number;
}

export interface DetailServer {
  hostname: string;
  oneUrl?: URL;
  sizeTotal: NetworkResponse;
  details: DetailServerUrl[]
}

export interface DetailServerUrl {
  url: string;
  size: NetworkResponse;
  resource: string;
  cache: boolean;
}

export interface NetworkMeasure {
  network: NetworkResponse;
  detail: NetworkDetail[];
  nbRequest: number;
  nbRequestCache: number;
}

export interface NetworkDetail {
  resource: string;
  network: NetworkResponse;
  nbRequest: number;
  nbRequestCache: number;
}

export interface DetailServer {
  hostname: string;
  ges: GES;
  details: DetailServerUrl[]
}

export interface DetailServerUrl {
  url: string;
  size: NetworkResponse;
  resource: string;
  cache: boolean;
}

export interface EnergyMeasure {
  kWhDataCenter: number;
  kWhNetwork: number;
  kWhDevice: number;
  kWhPage: number;
}
