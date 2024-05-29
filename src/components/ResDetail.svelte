<script lang="ts">
  import type { NetworkMeasure } from '../interface';
  import { formatNumber, formatSize } from '../utils';
  import { Units } from '../const';

  export let datas: NetworkMeasure;
  export let caption: string = '';
  export let description: string = '';
  const totRequest = datas.nbRequest + datas.nbRequestCache;
</script>

<div class="table-container">
  <table class="table">
    <caption>
      {caption}
      <span class="visually-hidden">{description}</span>
    </caption>
    <thead>
    <tr>
      <th></th>
      <th colspan="3" class="server">Server : Request</th>
      <th colspan="2">Network : Size page</th>
      <th colspan="2" class="client">Client : Size page</th>
    </tr>
    <tr>
      <th></th>
      <th class="server">Cache</th>
      <th class="server">Cache miss</th>
      <th class="server">Percent</th>
      <th>Compress</th>
      <th>Percent</th>
      <th class="client">Uncompress</th>
      <th class="client">Percent</th>
    </tr>
    </thead>
    <tbody>
    {#each datas.detail as detail, index}
      <tr class:even={index % 2 === 0}>
        <td>{detail.resource}</td>
        <td class="server">{detail.nbRequestCache}</td>
        <td class="server">{detail.nbRequest}</td>
        <td class="server">{formatNumber(100 * (detail.nbRequest + detail.nbRequestCache) / totRequest)}%</td>
        <td>{formatSize(detail.network.size)}{Units.pageSize}</td>
        <td>{detail.network.size ? formatNumber(100 * detail.network.size / datas.network.size) : 0}%</td>
        <td class="client">{formatSize(detail.network.sizeUncompress)}{Units.pageSize}</td>
        <td class="client">{detail.network.sizeUncompress ? formatNumber(100 * detail.network.sizeUncompress / datas.network.sizeUncompress) : 0}%</td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .table-container {
    box-shadow: var(--box-shadow--sm), var(--box-shadow--sm);
    border-radius: 8px;
    .bold {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .table {
      border-collapse: collapse;

      td, th {
        &.server, &.client {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      thead {
        border-bottom: var(--spacing--xs) solid var(--color--green);
        background-color: var(--color--light);
        position: sticky;
        top: 0;

        th {
          padding: var(--spacing--md) var(--spacing--xl);

        }
      }

      tbody {
        td {
          text-align: center;
          padding: var(--spacing--lg) var(--spacing--xl);
        }
      }
    }
  }
  caption {
    font-weight: bold;
    padding-inline-start: 1rem;
    text-align: left;
  }
  .even {
    background-color: var(--color--light-grey);
  }
</style>