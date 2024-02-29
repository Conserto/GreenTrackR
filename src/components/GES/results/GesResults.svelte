<script lang="ts">
  import { translate } from 'src/utils/utils';
  import type { Measure } from 'src/interface';
  import { GES, ScoreTag, EmissionInformations } from 'src/components/GES';

  export let measure: Measure = null;
</script>

<div class="results-container">
  <div class="score-tag__wrapper">
    <span class="score-tag__label">{translate('gesScore')} : </span>
    <ScoreTag score={measure.score} />
  </div>
  <div class="ges-infos">
    <GES {measure} />
    <EmissionInformations {measure} />
  </div>
</div>

<style lang="scss">
  .results-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin-top: var(--spacing--md);
    margin-bottom: var(--spacing--md);
    box-shadow: var(--box-shadow--md);
    padding-top: var(--spacing--xxl);
  }
  .score-tag {
    &__wrapper {
      display: flex;
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;
    }

    &__label {
      margin-right: var(--spacing--lg);
      font-weight: var(--font-weight--bold);
    }
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
