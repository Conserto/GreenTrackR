<script lang="ts">
  import type { NetworkMeasure } from '../interface';
  import { formatNumber, formatSize, translate } from '../utils';
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
      <th class="fist"></th>
      <th colspan="3" class="server">{translate("resDetTitleServer")}</th>
      <th colspan="2">{translate("resDetTitleNetwork")}</th>
      <th colspan="2" class="client">{translate("resDetTitleClient")}</th>
    </tr>
    <tr>
      <th class="fist"></th>
      <th class="subtitle server">{translate("resDetSubTitleServerCache")}</th>
      <th class="subtitle server">{translate("resDetSubTitleServerCacheMiss")}</th>
      <th class="subtitle server">{translate("resDetSubTitleServerPercent")}</th>
      <th class="subtitle">{translate("resDetSubTitleNetworkCompress")}</th>
      <th class="subtitle">{translate("resDetSubTitleNetworkPercent")}</th>
      <th class="subtitle client">{translate("resDetSubTitleCliUncompress")}</th>
      <th class="subtitle client">{translate("resDetSubTitleCliPercent")}</th>
    </tr>
    </thead>
    <tbody>
    {#each datas.detail as detail, index}
      <tr class:even={index % 2 === 0}>
        <td class="fist">{detail.resource}</td>
        <td class="server">{detail.nbRequestCache}</td>
        <td class="server">{detail.nbRequest}</td>
        <td class="server">{formatNumber(100 * (detail.nbRequest + detail.nbRequestCache) / totRequest)}%</td>
        <td>{formatSize(detail.network.size)}{Units.pageSize}</td>
        <td>{detail.network.size ? formatNumber(100 * detail.network.size / datas.network.size) : 0}%</td>
        <td class="client">{formatSize(detail.network.sizeUncompress)}{Units.pageSize}</td>
        <td
          class="client">{detail.network.sizeUncompress ? formatNumber(100 * detail.network.sizeUncompress / datas.network.sizeUncompress) : 0}
          %
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .table-container {

    .table {
      border-collapse: collapse;

      th.subtitle {
        font-weight: normal;
        font-style: oblique;
        border-left-style: groove;
        padding-right: 0.1em;
        padding-left: 0.1em;
      }

      td, th {
        border-left-style: groove;

        &.fist {
          border-left-style: none;
        }

        &.server, &.client {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      thead {
        border-bottom: var(--spacing--xs) solid var(--color--green);
        background-color: var(--color--light);
      }

      tbody {
        td {
          text-align: center;
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