<!-- BLoc parent contenant les référence a tous les componenats 'Score', ValeurGES...-->
<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { onMount } from 'svelte';
  import { InputTypeEnum } from 'src/enum';
  import type { Measure, Score, TableHeader, TableData } from 'src/interface';
  import { MeasureAcquisition } from 'src/utils/classes/MeasureAcquisition';
  import { Input, Select, Button, Table, LoadingWheel } from 'src/lib/share/atoms';
  import {
    GES,
    ScoreTag,
    VisitsEquivalent,
    EmissionInformations,
    ZoneSimulation,
  } from 'src/lib/share/GES/components';

  let loading = true;
  let measureAcquisition = new MeasureAcquisition();
  let measure = measureAcquisition.measure;
  let score: Score,
    countryCodeSelected: string,
    userCountryCodeSelected: string,
    dataFormatted: { hourGEs: TableData; carbonIntensity: TableData }[] = [],
    columnHeaders: TableHeader[],
    rowHeaders: TableHeader[];

  onMount(async () => {
    await measureAcquisition.getNetworkMeasure();
    measure = await measureAcquisition.getGESMeasure('auto', 'auto');

    score = measure.score;
    loading = false;
  });

  $: dataFormatted = measure?.hourlyCarbonData?.reduce(
    (acc, hourCarbonData) => {
      //We want all our results on one line
      acc[0][hourCarbonData.date.getTime()] = { content: hourCarbonData.carbonIntensity };
      return acc;
    },
    [[]],
  );

  $: columnHeaders = [
    {
      id: 'columnLabel',
      translateKey: measure.hourlyCarbonData?.[0]?.date?.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    },
    ...(measure?.hourlyCarbonData || []).map((hourCarbonData) => ({
      id: hourCarbonData.date?.getTime(),
      translateKey: hourCarbonData.date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })),
  ];

  rowHeaders = [
    {
      id: 'carbonIntensity',
      translateKey: 'carbonIntensity',
    },
  ];

  async function getMeasure(event) {
    loading = true;
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    await measureAcquisition.getNetworkMeasure();
    measure = await measureAcquisition.getGESMeasure(countryCodeSelected, userCountryCodeSelected);
    loading = false;
  }
</script>

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
  <div class="ges-table">
    <Table datas={dataFormatted} {rowHeaders} {columnHeaders} />
  </div>
{:else if loading === true}
  <div class="loading-wheel">
    <LoadingWheel />
  </div>
{/if}

<style lang="scss">
  .ges-table {
    width: 80%;
    overflow: auto;
  }
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
</style>
