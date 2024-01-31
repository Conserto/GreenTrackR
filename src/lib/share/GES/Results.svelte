<!-- BLoc parent contenant les référence a tous les componenats 'Score', ValeurGES...-->
<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { onMount } from 'svelte';
  import { InputTypeEnum } from 'src/enum';
  import type { Measure, Score } from 'src/interface';
  import { MeasureAcquisition } from '../../../utils/classes/MeasureAcquisition';
  import GES from './components/GES.svelte';
  import ScoreTag from './components/ScoreTag.svelte';
  import VisitsEquivalent from './components/VisitsEquivalent.svelte';
  import EmissionInformations from './components/EmissionInformations.svelte';
  // import ZoneSimulation from './ZoneSimulation.svelte';
  let score: Score, measure: Measure;
  onMount(async () => {
    const measureAcquisition = new MeasureAcquisition();
    await measureAcquisition.getNetworkMeasure();
    measure = await measureAcquisition.getGESMeasure();

    score = measure.score;
  });
</script>

{#if score}
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
  <!-- <div class="zone-simulation__wrapper">
    <ZoneSimulation />
  </div> -->
{/if}

<style lang="scss">
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
</style>
