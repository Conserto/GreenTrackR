import { GESService, ScoreService } from '.';
import type {
  GES,
  Measure,
  NetworkMeasure,
  SimpleGES,
  Synthesis,
  SynthesisCommon,
  SynthesisLine
} from '../interface';
import { filterMeasure } from 'src/utils';

export class SynthesisSrv {
  private gesService: GESService;
  private scoreService: ScoreService;

  constructor() {
    this.gesService = new GESService();
    this.scoreService = new ScoreService();
  }

  /**
   * Deduplicate measures based on URL, action, and timestamp proximity
   * Removes duplicate measurements that occur within 1 second of each other
   */
  private deduplicateMeasures(measures: Measure[]): Measure[] {
    const seen = new Set<string>();
    const deduplicated: Measure[] = [];

    for (const measure of measures) {
      // Create a unique key based on URL, action, and rounded timestamp (1-second precision)
      const timestamp = Math.floor(measure.date.getTime() / 1000); // Round to seconds
      const key = `${measure.url}|${measure.action || 'page'}|${timestamp}`;

      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(measure);
      }
    }

    return deduplicated;
  }

  getSynthesis(measures: Measure[]): Synthesis {
    // Deduplicate measures before processing
    const uniqueMeasures = this.deduplicateMeasures(measures);

    let syntLine: SynthesisLine[] = [];
    const filterByPage = Object.groupBy(uniqueMeasures, ({ url }) => url ?? '');

    for (let index in Object.entries(filterByPage)) {
      const mes: Measure[] | undefined = Object.values(filterByPage)[index];
      if (mes) {
        const { calScroll, calClick, calPage } = this.getSyntCommon(mes);
        const url = Object.keys(filterByPage)[index];
        syntLine.push({
          sScroll: calScroll,
          sClick: calClick,
          sPage: calPage,
          url: url
        });
      }
    }

    const { calScroll, calClick, calPage } = this.getSyntCommon(uniqueMeasures);
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

  /**
   * Returns an empty SynthesisCommon object for when there's no data
   */
  getEmptySynthesisCommon(): SynthesisCommon {
    return {
      count: 0,
      carbonSrv: {
        carbonIntensity: 0,
        adpe: 0,
        wu: 0,
        countryCode: 'none',
        countryName: 'none',
        display: 'none'
      },
      carbonUsr: {
        carbonIntensity: 0,
        adpe: 0,
        wu: 0,
        countryCode: 'none',
        countryName: 'none',
        display: 'none'
      },
      network: {
        nbRequest: 0,
        nbRequestCache: 0,
        detail: [],
        network: {
          size: 0,
          sizeUncompress: 0
        }
      },
      ges: {
        dataCenterTotal: 0,
        networkTotal: 0,
        deviceTotal: 0,
        pageTotal: 0
      },
      wu: {
        dataCenterTotal: 0,
        networkTotal: 0,
        deviceTotal: 0,
        pageTotal: 0
      },
      adpe: {
        dataCenterTotal: 0,
        networkTotal: 0,
        deviceTotal: 0,
        pageTotal: 0
      },
      energy: {
        kWhDataCenter: 0,
        kWhNetwork: 0,
        kWhDevice: 0,
        kWhPage: 0
      },
      score: undefined
    };
  }

  calcSyntCommon(measures: Measure[]): SynthesisCommon {
    // Protection against empty arrays - avoid division by zero
    if (!measures || measures.length === 0) {
      return this.getEmptySynthesisCommon();
    }

    let count = measures.length;
    let nbRequest = 0, nbRequestCache = 0, netSize = 0, netSizeUnc = 0;
    let carbonSrv = 0, adpeSrv = 0, wuSrv = 0;
    let carbonUsr = 0, adpeUsr = 0, wuUsr = 0;
    let carbonNet = 0, adpeNet = 0, wuNet = 0;

    measures.forEach(m => {
      nbRequest += m.networkMeasure?.nbRequest ?? 0;
      nbRequestCache += m.networkMeasure?.nbRequestCache ?? 0;
      netSize += m.networkMeasure?.network?.size ?? 0;
      netSizeUnc += m.networkMeasure?.network?.sizeUncompress ?? 0;
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
      detail: [],
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
      countryName: 'none',
      display: 'none'
    };

    const gesSrv: GES = {
      carbonIntensity: carbonSrv / count,
      adpe: adpeSrv / count,
      wu: wuSrv / count,
      countryCode: 'none',
      countryName: 'none',
      display: 'none'
    };

    const gesNet: SimpleGES = {
      carbonIntensity: carbonNet / count,
      adpe: adpeNet / count,
      wu: wuNet / count
    };

    // GES -> Calcul obligatoire -> besoin carbon, moyenne
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