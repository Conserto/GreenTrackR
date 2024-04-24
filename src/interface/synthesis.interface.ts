import type { GES, ResTotals, NetworkMeasure, Score, EnergyMeasure } from '.';

export interface Synthesis {
  pages: SynthesisLine[];
  total: SynthesisBase;
}

export interface SynthesisLine extends SynthesisBase {
  url: string;
  shortUrl: string;
}

export interface SynthesisBase {
  sScroll: SynthesisCommon;
  sClick: SynthesisCommon;
  sPage: SynthesisCommon;
}

export interface SynthesisCommon {
  count: number;
  network: NetworkMeasure;
  ges: ResTotals;
  wu: ResTotals;
  adpe: ResTotals;
  energy: EnergyMeasure;
  carbonSrv: GES;
  carbonUsr: GES;
  score?: Score;
}
