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
    let carbonSrv = 0, adpeSrv = 0, wuSrv = 0;
    let carbonUsr = 0, adpeUsr = 0, wuUsr = 0;
    let carbonNet = 0, adpeNet = 0, wuNet = 0;
    measures.forEach(m => {
      nbRequest += m.networkMeasure.nbRequest;
      nbRequestCache += m.networkMeasure.nbRequestCache;
      netSize += m.networkMeasure.network.size;
      netSizeUnc += m.networkMeasure.network.sizeUncompress;
      carbonSrv += m.serverGES?.carbonIntensity ?? 0;
      carbonUsr += m.userGES?.carbonIntensity ?? 0;
      carbonNet += m.networkGES?.carbonIntensity ?? 0;
      wuSrv += m.serverGES?.wu ?? 0;
      wuUsr += m.userGES?.wu ?? 0;
      wuNet += m.networkGES?.wu ?? 0;
      adpeSrv += m.serverGES?.adpe ?? 0;
      adpeUsr += m.userGES?.adpe ?? 0;
      adpeNet += m.networkGES?.adpe ?? 0;
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
      adpe: adpeUsr / count,
      wu: wuUsr / count,
      countryCode: 'none',
      countryName: 'none'
    };
    const gesSrv: GES = {
      carbonIntensity: carbonSrv / count,
      adpe: adpeSrv / count,
      wu: wuSrv / count,
      countryCode: 'none',
      countryName: 'none'
    };
    const gesNet: GES = {
      carbonIntensity: carbonNet / count,
      adpe: adpeNet / count,
      wu: wuNet / count,
      countryCode: 'none',
      countryName: 'none'
    };
    //     GES -> Calcul obligatoire -> besoin carbon, moyenne
    const { ges, wu, adpe, energy } = this.gesService.getEnergyAndResources(
      net.network,
      net.nbRequest,
      gesSrv,
      gesUsr,
      gesNet
    );
    return {
      count: count,
      carbonSrv: gesSrv,
      carbonUsr: gesUsr,
      network: net,
      ges: ges,
      wu: wu,
      adpe: adpe,
      energy: energy,
      score: this.scoreService.getScore(ges.pageTotal)
    };
  }

}
