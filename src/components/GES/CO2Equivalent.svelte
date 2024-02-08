<script lang="ts">
  import { Units } from 'src/const';
  import type { Measure } from 'src/interface';
  import { translate } from 'src/utils/utils';

  export let measure: Measure;
</script>

<div class="ges-equivalent">
  <span>{translate('greenhouseGasesEmission')} :</span>
  <span
    class="ges-equivalent_value"
    style:color={measure.score.textColor}
    style:background-color={measure.score.color}
    >{measure.ges.websiteTotal.toFixed(2)} {Units.carbonEmissions}</span
  >
</div>

<style lang="scss">
  .ges-equivalent {
    font-weight: var(--font-weight--bold);
    font-size: var(--font-size--sm);
    &_value {
      margin-left: var(--spacing--md);
      padding: var(--spacing--sm) var(--spacing--xl);
      border-radius: var(--border-radius--round);
    }
  }
</style>
