<script lang="ts">
  import type { Measure } from 'src/interface';
  import { CO2Equivalent, EmissionInformations, ScoreTag } from 'src/components/GES';
  import VisitsEquivalent from '../VisitsEquivalent.svelte';

  export let measure: Measure | undefined;
</script>

<div class="results-container">
  <div class="score-container">
    {#if measure?.complete}
      <ScoreTag score={measure?.score} />
      <CO2Equivalent {measure} />
      <VisitsEquivalent {measure} />
    {:else}
      <div>TODO MESSAGE</div>
    {/if}
  </div>
  <div class="ges-infos">
    <EmissionInformations {measure} />
  </div>
</div>

<style lang="scss">
  .results-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    margin-top: var(--spacing--md);
    margin-bottom: var(--spacing--md);
    box-shadow: var(--box-shadow--md);
    padding-top: var(--spacing--xxl);
  }

  .score-container {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap;
    gap: var(--spacing--xl);
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
