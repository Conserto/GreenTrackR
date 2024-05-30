<script lang="ts">
  import { Units } from 'src/const';
  import type { Measure } from 'src/interface';
  import { translate } from '../../utils';

  export let measure: Measure | undefined;
  export let caption: string = '';
</script>

<h2 class="card__title">{translate(caption)}</h2>
<div class="other-equivalent">
  <p class="energy-equivalent">
    <span>{translate("energyEquivalent")}</span>
    <span class="energy-equivalent_value"
    >{measure?.energy?.kWhPage?.toFixed(2)} {Units.energy}</span>
  </p>

  <p class="wu-equivalent">
    <span>{translate("wuEquivalent")}</span>
    <span class="wu-equivalent_value"
    >{measure?.wu?.pageTotal?.toFixed(2)} {Units.waterUse}</span>
  </p>

  <p class="adpe-equivalent">
    <span>{translate("adpeEquivalent")}</span>
    <span class="adpe-equivalent_value"
    >{measure?.adpe?.pageTotal?.toFixed(2)} {Units.adpeUnit}</span>
  </p>
</div>

<style lang="scss">

  .other-equivalent {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.5em;

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
      font-weight: var(--font-weight--bold);
      font-size: var(--font-size--sm);
      padding-block-end: .5rem;
      margin-block: 0;
      @media screen and (max-width: 40rem) {
          display: flex;
          flex-direction: column;
      }
      &_value {
        margin-left: var(--spacing--md);
        padding: var(--spacing--sm) var(--spacing--xl);
        border-radius: var(--border-radius--round);
      }
    }
  }

</style>
