<script lang="ts">
  import { translate, formatNumber } from 'src/utils/utils';
  import { onMount } from 'svelte';
  import { InputTypeEnum } from 'src/enum';
  import type { Measure, Score, TableHeader, TableData, HistoData } from 'src/interface';
  import { MeasureAcquisition } from 'src/utils/classes/MeasureAcquisition';
  import { Input, Select, Button, Table, LoadingWheel, Histogram } from 'src/components';
  import {
    GES,
    ScoreTag,
    VisitsEquivalent,
    EmissionInformations,
    ZoneSimulation,
  } from 'src/components/GES';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let loading = true;
  let loadGes = false;
  let measureAcquisition = new MeasureAcquisition();
  let measure = measureAcquisition.measure;
  let score: Score,
    countryCodeSelected: string,
    userCountryCodeSelected: string,
    dataFormatted: HistoData[] = [];

  onMount(async () => {
    await measureAcquisition.getNetworkMeasure();
    measure = await measureAcquisition.getGESMeasure('auto', 'auto');

    loading = false;
    updateResultsDatas();
  });

  async function getMeasure(event) {
    loadGes = true;
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    await measureAcquisition.getNetworkMeasure();
    measure = await measureAcquisition.getGESMeasure(countryCodeSelected, userCountryCodeSelected);
    updateResultsDatas();
    loadGes = false;
  }
  const updateResultsDatas = () => {
    if (measure) {
      score = measure.score;
      dataFormatted = [
        {
          label: 'dataCenterTotal',
          value: formatNumber(measure.ges.dataCenterTotal),
          color: '#86665f',
        },
        { label: 'networkTotal', value: formatNumber(measure.ges.networkTotal), color: '#7b7aab' },
        { label: 'deviceTotal', value: formatNumber(measure.ges.deviceTotal), color: '#5e806d' },
        { label: 'websiteTotal', value: formatNumber(measure.ges.websiteTotal), color: '#535481' },
      ];
      dispatch('measureUpdated', { measure });
    }
  };
</script>

<div class="results-container">
  {#if score && !loading}
    <div class="results">
      <div class="score-tag__wrapper">
        <span class="score-tag__label">{translate('gesScore')} : </span>
        <ScoreTag {score} />
      </div>
      <div class="ges-infos">
        <GES {measure} />
        <EmissionInformations {measure} />
      </div>
    </div>
    <div class="zone-simulation__wrapper">
      <ZoneSimulation on:submitSimulation={getMeasure} />
    </div>
    <div class="histo-container">
      {#if loadGes}
        <div class="loading-ges">
          <LoadingWheel />
        </div>
      {:else}
        <Histogram datas={dataFormatted} yLabel="greenhouseGasesEmissionDefault" />
      {/if}
    </div>
  {:else if loading === true}
    <div class="loading-wheel">
      <LoadingWheel />
    </div>
  {/if}
</div>

<style lang="scss">
  .results-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .score-tag {
      &__wrapper {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
      }

      &__label {
        margin-right: var(--spacing--lg);
        font-weight: var(--font-weight--bold);
      }
    }
    .results {
      margin-top: var(--spacing--md);
      margin-bottom: var(--spacing--md);
      display: flex;
      flex-wrap: wrap;
      width: 75%;
      box-shadow: var(--box-shadow--md);
      padding: var(--spacing--xl);
    }

    .ges-infos {
      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: var(--spacing--md);
      justify-content: start;
      width: 100%;
      margin: var(--spacing--xs) 0;
    }

    .loading-wheel {
      margin: var(--spacing--xl);
    }

    .loading-ges {
      $margin-y: 50px;
      margin: $margin-y 0 $margin-y 0;
    }

    .histo-container {
      width: 100%;
      overflow-x: auto;
      display: flex;
      justify-content: center;
    }
  }
</style>
