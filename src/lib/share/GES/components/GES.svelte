<script lang="ts">
  import type { Measure } from 'src/interface';

  import { CO2Equivalent, VisitsEquivalent } from 'src/lib/share/GES/components';

  export let measure: Measure;
</script>

<div class="ges-value">
  <CO2Equivalent {measure} />
  <VisitsEquivalent {measure} />
</div>

<style lang="scss">
  .ges-value {
    display: grid;
    width: 100%;
    grid-template-columns: auto auto;
    gap: var(--spacing--lg);
    align-items: center;
  }
</style>
