<script lang="ts">
  import type { Measure } from 'src/interface';

  import { CO2Equivalent, VisitsEquivalent } from 'src/components/GES/';

  export let measure: Measure;
</script>

<div class="flex-center">
  <CO2Equivalent {measure} />
  <VisitsEquivalent {measure} />
</div>

<style lang="scss">
</style>
