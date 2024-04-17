<script lang="ts">
  import { Units } from 'src/const';
  import type { Measure } from 'src/interface';
  import Tooltip from '../Tooltip.svelte';

  export let measure: Measure | undefined;
</script>

<div class="ges-equivalent">
  <span><Tooltip translateKey="greenhouseGasesEmission" /> :</span>
  <span
    class="ges-equivalent_value"
    style:color={measure?.score?.textColor}
    style:background-color={measure?.score?.color}
  >{measure?.ges?.pageTotal?.toFixed(2)} {Units.carbonEmissions}</span>
</div>

<div class="wu-equivalent">
  <span><Tooltip translateKey="wuEquivalent" /> :</span>
  <span class="wu-equivalent_value"
  >{measure?.wu?.pageTotal?.toFixed(2)} {Units.waterUse}</span>
</div>

<div class="adpe-equivalent">
  <span><Tooltip translateKey="adpeEquivalent" /> :</span>
  <span class="adpe-equivalent_value"
  >{measure?.adpe?.pageTotal?.toFixed(2)} {Units.adpeUnit}</span>
</div>

<style lang="scss">
  .wu-equivalent_value {
      background-color: #95d1e5;
  }
  .adpe-equivalent_value {
      background-color: #ef893d;
  }

  .ges-equivalent, .wu-equivalent, .adpe-equivalent {
    display: flex;
    align-items: center;
    font-weight: var(--font-weight--bold);
    font-size: var(--font-size--sm);

    &_value {
      margin-left: var(--spacing--md);
      padding: var(--spacing--sm) var(--spacing--xl);
      border-radius: var(--border-radius--round);
    }
  }
</style>
