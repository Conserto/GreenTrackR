<script lang="ts">
  import type { Measure } from '../interface';
  import { filterMeasure, filterMeasurePage, formatSize, sumRequest } from '../utils';

  export let datas: Measure[];

  const scroll = filterMeasure(datas, 'scroll');
  const clic = filterMeasure(datas, 'click');
  const page = filterMeasurePage(datas);
  const netTotal = sumRequest(datas);

</script>

<div class="synthese-container">
  <p>Nombre de scroll : {scroll.length}</p>
  <p>Nombre de clic : {clic.length}</p>
  <p>Nombre de page : {page.length}</p>
  <p>Total request : {netTotal.nbRequest} ({netTotal.nbRequestCache})</p>
  <p>Total taille : {formatSize(netTotal.network.size)} / {formatSize(netTotal.network.sizeUncompress)}</p>
</div>

<style lang="scss">

</style>
