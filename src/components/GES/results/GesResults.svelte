<script lang="ts">
  import type { Measure } from 'src/interface';
  import { CO2Equivalent, OtherEquivalent, ScoreTag } from 'src/components/GES';
  import VisitsEquivalent from 'src/components/GES/VisitsEquivalent.svelte';
  import { AlertTypeEnum } from 'src/enum';
  import { Alert } from 'src/components/index';
  import { translate } from 'src/utils';

  export let measure: Measure | undefined;
  export let caption: string = '';
</script>

<div class="results-container">
  <h2 class="card__title">{translate(caption)}</h2>
  <div class="score-container">
    {#if measure?.complete}
      <ScoreTag score={measure?.score} />
      <CO2Equivalent {measure} />
      <VisitsEquivalent {measure} />
    {:else}
      <Alert message="noFullData" alertType={AlertTypeEnum.WARNING} />
    {/if}
  </div>
  <OtherEquivalent
    measure={measure}
    caption={translate("othEquivalentCaption")}
  />
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
    padding-bottom: var(--spacing--xl);

    h2 {
      font-weight: bold;
      font-size: var(--font-size--xl);
      text-align: center;
      color: var(--color--green);
    }

    .score-container {
      display: flex;
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;
      gap: var(--spacing--xl);
    }
  }


</style>
