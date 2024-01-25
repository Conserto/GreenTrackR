<!-- BLoc parent contenant les référence a tous les componenats 'Score', ValeurGES...-->
<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { MeasureAcquisition } from '../../../utils/classes/MeasureAcquisition';
  import ScoreTag from './components/ScoreTag.svelte';
  onMount(async () => {
    const measureAcquisition = new MeasureAcquisition();
    await measureAcquisition.getNetworkMeasure();
    await measureAcquisition.getGESMeasure();
  });
</script>

<div class="results">
  <ScoreTag />
</div>

<style>
  .results {
    margin-top: 12px;
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
</style>
