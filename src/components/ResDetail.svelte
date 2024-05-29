<script lang="ts">
  import type { NetworkMeasure } from '../interface';
  import { formatNumber, formatSize, translate } from '../utils';

  export let datas: NetworkMeasure;
</script>

<div>
  <table>
    <tr>
      <th></th>
      <th colspan="3">Server : Request</th>
      <th colspan="2">Network : Size page</th>
      <th colspan="2">Client : Size page</th>
    </tr>
    <tr>
      <th></th>
      <th>Cache</th>
      <th>Cache miss</th>
      <th>Percent</th>
      <th>Compress</th>
      <th>Percent</th>
      <th>Uncompress</th>
      <th>Percent</th>
    </tr>
    {#each datas.detail as detail}
      <tr>
      <td>{detail.resource}</td>
      <td>{detail.nbRequestCache}</td>
      <td>{detail.nbRequest}</td>
      <td>{formatNumber(100 * (detail.nbRequest + detail.nbRequestCache) / (datas.nbRequest + datas.nbRequestCache))}%</td>
      <td>{formatSize(detail.network.size)}kB</td>
      <td>{detail.network.size ? formatNumber(100 * detail.network.size / datas.network.size) : 0}%</td>
      <td>{formatSize(detail.network.sizeUncompress)}kB</td>
      <td>{detail.network.sizeUncompress ? formatNumber(100 * detail.network.sizeUncompress / datas.network.sizeUncompress) : 0}%</td>
      </tr>
    {/each}
  </table>
</div>
