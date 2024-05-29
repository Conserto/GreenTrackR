<script lang="ts">
  import { Units } from 'src/const';
  import type { Measure } from 'src/interface';
  import { translate } from '../../utils';

  export let measure: Measure | undefined;
  export let caption: string = '';
</script>

<div class="other-equivalent">
  <h3>{translate(caption)}</h3>
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
</div>

<style lang="scss">

  .other-equivalent {
    padding: 0.5em;

    h3{
      font-weight: bold;
      font-size: var(--font-size--xl);
      text-align: center;
      color: var(--color--green);
    }

    .wu-equivalent_value {
      background-color: #95d1e5;
    }

    .adpe-equivalent_value {
      background-color: #ef893d;
    }

    .energy-equivalent_value {
      background-color: #f1bb00;
    }

    .wu-equivalent, .adpe-equivalent, .energy-equivalent {
      display: flex;
      align-items: center;
      font-weight: var(--font-weight--bold);
      font-size: var(--font-size--sm);
      padding-bottom: .5rem;

      &_value {
        margin-left: var(--spacing--md);
        padding: var(--spacing--sm) var(--spacing--xl);
        border-radius: var(--border-radius--round);
      }
    }
  }

</style>
