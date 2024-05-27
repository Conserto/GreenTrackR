<script lang="ts">
  import { Units } from 'src/const';
  import type { Measure } from 'src/interface';
  import { translate } from '../../utils';

  export let measure: Measure | undefined;
</script>

<div class="ges-equivalent">
  <span>{translate("greenhouseGasesEmission")}</span>
  <span
    class="ges-equivalent_value"
    style:color={measure?.score?.textColor}
    style:background-color={measure?.score?.color}
  >{measure?.ges?.pageTotal?.toFixed(2)} {Units.carbonEmissions}</span>
</div>

<div class="energy-equivalent">
  <span>{translate("energyEquivalent")}</span>
  <span class="energy-equivalent_value"
  >{measure?.energy?.kWhPage?.toFixed(2)} {Units.energy}</span>
</div>

<div class="wu-equivalent">
  <span>{translate("wuEquivalent")}</span>
  <span class="wu-equivalent_value"
  >{measure?.wu?.pageTotal?.toFixed(2)} {Units.waterUse}</span>
</div>

<div class="adpe-equivalent">
  <span>{translate("adpeEquivalent")}</span>
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

  .energy-equivalent_value {
    background-color: #f1bb00;
  }

  .ges-equivalent, .wu-equivalent, .adpe-equivalent, .energy-equivalent {
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
