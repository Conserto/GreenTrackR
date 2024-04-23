import { GESService, ScoreService } from '.';
import type { GES, Measure, NetworkMeasure, Synthesis, SynthesisCommon, SynthesisLine } from '../interface';
import { filterMeasure, formatShortUrl } from '../utils';

export class SynthesisSrv {
  private gesService: GESService;
  private scoreService: ScoreService;

  constructor() {
    this.gesService = new GESService();
    this.scoreService = new ScoreService();
  }

  getSynthesis(measures: Measure[]): Synthesis {
    let syntLine: SynthesisLine[] = [];
    const filterByPage = Object.groupBy(measures, ({ url }) => url ?? '');
    for (let index in Object.entries(filterByPage)) {
      const mes: Measure[] | undefined = Object.values(filterByPage)[index];
      if (mes) {
        const { calScroll, calClick, calPage } = this.getSyntCommon(mes);
        const url = Object.keys(filterByPage)[index];
        syntLine.push({
          sScroll: calScroll,
          sClick: calClick,
          sPage: calPage,
          url: url,
          shortUrl: formatShortUrl(url)
        });
      }
    }
    const { calScroll, calClick, calPage } = this.getSyntCommon(measures);
    return {
      pages: syntLine,
      total: {
        sScroll: calScroll,
        sClick: calClick,
        sPage: calPage
      }
    };
  }

  getSyntCommon(measures: Measure[]) {
    const scroll = filterMeasure(measures, 'scroll');
    const click = filterMeasure(measures, 'click');
    const calScroll = this.calcSyntCommon(scroll);
    const calClick = this.calcSyntCommon(click);
    const calPage = this.calcSyntCommon(measures);
    return { calScroll, calClick, calPage };
  }

  calcSyntCommon(measures: Measure[]): SynthesisCommon {
    let count = measures.length;
    let nbRequest = 0, nbRequestCache = 0, netSize = 0, netSizeUnc = 0;
    let carbonSrv = 0, carbonUsr = 0;
    measures.forEach(m => {
      nbRequest += m.networkMeasure.nbRequest;
      nbRequestCache += m.networkMeasure.nbRequestCache;
      netSize += m.networkMeasure.network.size;
      netSizeUnc += m.networkMeasure.network.sizeUncompress;
      carbonSrv += m.serverGES?.carbonIntensity ?? 0;
      carbonUsr += m.userGES?.carbonIntensity ?? 0;
    });
    const net: NetworkMeasure = {
      nbRequest: nbRequest,
      nbRequestCache: nbRequestCache,
      network: {
        size: netSize,
        sizeUncompress: netSizeUnc
      }
    };
    const gesUsr: GES = {
      carbonIntensity: carbonUsr / count,
      countryCode: 'none',
      countryName: 'none'
    };
    const gesSrv: GES = {
      carbonIntensity: carbonSrv / count,
      countryCode: 'none',
      countryName: 'none'
    };
    //     GES -> Calcul obligatoire -> besoin carbon, moyenne
    const ges = this.gesService.getEnergyAndResources(
      net.network,
      net.nbRequest,
      gesSrv,
      gesUsr
    );
    return {
      count: count,
      carbonSrv: gesSrv,
      carbonUsr: gesUsr,
      network: net,
      ges: ges.ges,
      score: this.scoreService.getScore(ges.ges.pageTotal)
    };
  }

}
