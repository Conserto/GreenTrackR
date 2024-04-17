import type { GES, ResTotals, NetworkMeasure, Score } from '.';

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
  carbonSrv: GES;
  carbonUsr: GES;
  score?: Score;
}
