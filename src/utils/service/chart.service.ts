/*import { GESService } from '.';
import type { CarbonData, GES, Measure } from '../../interface';
import { getAverageValue } from '../utils';

export class ChartService {
  private chart: any;
  private chartAutoScroll: any;
  private gesService: GESService;

  constructor(
    userGES: GES,
    headers: Headers,
    codeCountry: string,
    measure: Measure,
    analysisType: string,
  ) {
    this.gesService = new GESService();
    this.buildChart(userGES, headers, codeCountry, measure, analysisType);
  }

  //Change type + put enum for Analysis Type
  async buildChart(
    userGES: GES,
    headers: Headers,
    codeCountry: string,
    measure: Measure,
    analysisType: string,
  ) {
    //if (codeCountry !== undefined && INTENSITY !== undefined) {

    //if (dailyCarbonData === undefined) {
    let dailyCarbonData = await fetch(
      `${import.meta.env.VITE_CARBON_API_URL}/daily/${codeCountry}/${new Date().toJSON().slice(0, 10)}`,
      {
        headers: headers,
      },
    ).then((res) => res.json());

    let dataMap = this.getDataMapped(dailyCarbonData, userGES, measure);
    let { labels, carbonIntensities, dailyCarbonFormattedData } = this.getDailyCarbonFormattedData(
      dailyCarbonData,
      userGES,
      measure,
    );

    const context = this.getContext(analysisType);
    const carbonIntensityMax = Math.floor(Math.max(...carbonIntensities) + 1);
    let power = this.getPower(carbonIntensityMax);
    const { minValue, maxValue } = this.getMinMaxValues(dailyCarbonData);

    let carbonIntensitiesData = carbonIntensities.map(
      (carbonIntensity: number) => carbonIntensity * Math.pow(10, power),
    );
    const averageValue = getAverageValue(carbonIntensitiesData);

    if (analysisType === 'GESEvaluation') {
      if (dailyCarbonData.length >= 0)
        this.chart = this.bootstrapChart(
          context,
          labels,
          carbonIntensitiesData,
          minValue,
          maxValue,
          dataMap,
          power,
          averageValue,
          carbonIntensityMax,
        );
    } else if (analysisType === 'AutoScroll') {
      if (dailyCarbonData.length >= 0)
        this.chartAutoScroll = this.bootstrapChart(
          context,
          labels,
          carbonIntensitiesData,
          minValue,
          maxValue,
          dataMap,
          power,
          averageValue,
          carbonIntensityMax,
        );
    }
  }

  //C'est un tri afin d'acceder plus rapidement aux données (afin d'avoir le GES en fonction de l'intensité carbone)
  getDataMapped(dailyCarbonData: CarbonData[], userGES: GES, measure: Measure) {
    let dataMap: number[] = [];

    dailyCarbonData.forEach((carbonDataDay: CarbonData) => {
      //TODO: rename calc + change foreach e map
      dataMap[
        this.gesService.getGESTotals(
          carbonDataDay,
          userGES,
          measure.network,
          measure.nbRequest,
        ).websiteTotal
      ] = carbonDataDay.carbonIntensity;
    });

    return dataMap;
  }

  getDailyCarbonFormattedData(dailyCarbonData: CarbonData[], userGES: GES, measure: Measure) {
    let labels: string[] = [''];
    let carbonIntensities: number[] = [];
    const dailyCarbonFormattedData = dailyCarbonData
      .filter((carbonDataDay: CarbonData) => carbonDataDay.carbonIntensity !== undefined)
      .map((carbonDataDay: CarbonData) => {
        //Definition des labels (Axe X du graphique, qui sera l'heure)
        carbonDataDay.date && labels.push(carbonDataDay.date?.toString().slice(11, 19));
        carbonIntensities.push(carbonDataDay.carbonIntensity);
        return {
          carbonIntensity: this.gesService.getGESTotals(
            carbonDataDay,
            userGES,
            measure.network,
            measure.nbRequest,
          ).websiteTotal,
          date: carbonDataDay.date,
        };
      });

    return { labels, carbonIntensities, dailyCarbonFormattedData };
  }

  getContext(analysisType: string) {
    let ctx;
    if (analysisType === 'GESEvaluation') {
      ctx = document.getElementById('myChart');
    } else {
      ctx = document.getElementById('myChartAutoScroll');
    }

    return ctx;
  }

  getMinMaxValues(dailyCarbonData: CarbonData[]) {
    let minValue: CarbonData, maxValue: CarbonData;

    // Min and Max algorithm, (a,b) -> a.carbonfactor and b.carbonfactor
    if (dailyCarbonData.length <= 0) {
      minValue = { carbonIntensity: 0, date: null };
      maxValue = { carbonIntensity: 0, date: null };
    } else {
      minValue = dailyCarbonData[0];
      maxValue = dailyCarbonData[0];
      dailyCarbonData.forEach((dayCarbonData: CarbonData) => {
        if (
          dayCarbonData.carbonIntensity &&
          dayCarbonData.carbonIntensity > maxValue.carbonIntensity
        ) {
          maxValue = dayCarbonData;
        }
        if (
          dayCarbonData.carbonIntensity &&
          dayCarbonData.carbonIntensity < minValue.carbonIntensity
        ) {
          minValue = dayCarbonData;
        }
      });
    }

    return { minValue, maxValue };
  }

  bootstrapChart(
    context: HTMLElement | null,
    labels: string[],
    carbonIntensitiesData: number[],
    minValue: CarbonData,
    maxValue: CarbonData,
    datamap: number[],
    power: number,
    moyenne: number,
    max: number,
  ) {
    let langTime = {
      // Translations
      fr: 'Heures',
      en: 'Hours',
    };

    let langTitle = {
      // Translations
      fr: 'Profil Journalier',
      en: 'Daily profile',
    };

    let i18nTime = () => {
      var languageinfo = navigator.language ? navigator.language : navigator.userLanguage;
      if (languageinfo.split('-')[0] == 'fr') {
        return langTime['fr'];
      } else {
        return langTime['en'];
      }
      // Extract lang here
    };
    let i18nTitle = () => {
      var languageinfo = navigator.language ? navigator.language : navigator.userLanguage;
      if (languageinfo.split('-')[0] == 'fr') {
        return langTitle['fr'];
      } else {
        return langTitle['en'];
      }
      // Extract lang here
    };
    return new Chart(context, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: carbonIntensitiesData,
            borderWidth: 5,
            tension: 0.3,
            fill: true,
            label: 'GES de la dernière heure de la journée',

            //Permet de créer un gradient de couleur entre 2 valeurs
            backgroundColor: function (context) {
              let gradient = context.chart.ctx.createLinearGradient(0, 0, context.chart.width, 0);
              let data = context.dataset.data;
              for (let i = 0; i < data.length - 1; i++) {
                const startColor = getColor(data[i], 0.5);
                const endColor = getColor(data[i + 1], 0.5);
                gradient.addColorStop(i / (data.length - 1), startColor);
                gradient.addColorStop((i + 1) / (data.length - 1), endColor);
              }
              return gradient;
            },
            borderColor: function (context) {
              let gradient = context.chart.ctx.createLinearGradient(0, 0, context.chart.width, 0);
              let data = context.dataset.data;
              for (let i = 0; i < data.length - 1; i++) {
                const startColor = getColor(data[i], 1);
                const endColor = getColor(data[i + 1], 1);
                gradient.addColorStop(i / (data.length - 1), startColor);
                gradient.addColorStop((i + 1) / (data.length - 1), endColor);
              }
              return gradient;
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text:
              i18nTitle() +
              ' : [Min : ' +
              Math.round((minValue.carbonIntensity + Number.EPSILON) * 100) / 100 +
              ' (' +
              minValue.date?.toString().slice(11, 19) +
              ') |' +
              ' Moy : ' +
              Math.round((moyenne + Number.EPSILON) * 100) / 100 +
              ' |' +
              ' Max : ' +
              Math.round((maxValue.carbonIntensity + Number.EPSILON) * 100) / 100 +
              ' (' +
              maxValue.date?.toString().slice(11, 19) +
              ')]',
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `[GES ; Carbon intensity (gCO2eq/kWh)] : (${ctx.raw} ; ${datamap[ctx.raw]})`,
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: max * Math.pow(10, power),
            title: {
              display: true,
              text: 'GES',
            },
          },
          x: {
            title: {
              display: true,
              text: i18nTime(),
            },
          },
        },
      },
    });
  }

  //TODO: rewrite and rename this function
  getPower(max: number) {
    let power = 0;
    if (max < 1) {
      let tmp = max;
      while (tmp < 1) {
        tmp *= 10;
        power += 1;
      }
    }
    return power;
  }
  destroyChartsIfExist(analysisType: string) {
    if (this.chart != null && analysisType === 'GESEvaluation') {
      this.chart.destroy();
    }

    if (this.chartAutoScroll != null && analysisType === 'AutoScroll') {
      this.chartAutoScroll.destroy();
    }
  }
}*/
