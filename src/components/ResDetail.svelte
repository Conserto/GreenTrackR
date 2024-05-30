<script lang="ts">
  import type { Measure, NetworkMeasure } from '../interface';
  import { formatNumber, formatSize, translate } from '../utils';
  import { Units } from '../const';

  export let measure: Measure;
  export let caption: string = '';
  export let description: string = '';
  const network = measure.networkMeasure;
  const totRequest = network.nbRequest + network.nbRequestCache;
  const srvCity = measure.serverGES?.display || '-';
  const cliCity = measure.userGES?.display || '-';
  const netCity = srvCity.split(',')[0] + " -- " + cliCity.split(',')[0];
  const mixSrv = measure.serverGES?.carbonIntensity ? measure.serverGES?.carbonIntensity + Units.carbonIntensity : '-';
  const mixNet = measure.networkGES?.carbonIntensity ? measure.networkGES?.carbonIntensity + Units.carbonIntensity : '-';
  const mixCli = measure.userGES?.carbonIntensity ? measure.userGES?.carbonIntensity + Units.carbonIntensity : '-';
</script>

<div class="table-container">
  <table class="table">
    <caption>
      <h3>{caption}</h3>
      <span class="visually-hidden">{description}</span>
    </caption>
    <thead>
    <tr>
      <th aria-hidden="true"></th>
      <th id="thServer" colspan="3" scope="col" class="server">{translate("resDetTitleServer")}</th>
      <th id="thNetwork" colspan="2" scope="col" >{translate("resDetTitleNetwork")}</th>
      <th id="thClient" colspan="2" scope="col" class="client">{translate("resDetTitleClient")}</th>
    </tr>
    <tr>
      <th aria-hidden="true"></th>
      <th id="thServerCache" scope="col" class="subtitle server">{translate("resDetSubTitleServerCache")}</th>
      <th id="thServerCacheMiss" scope="col" class="subtitle server">{translate("resDetSubTitleServerCacheMiss")}</th>
      <th id="thServerPercent" scope="col" class="subtitle server">{translate("resDetSubTitleServerPercent")}</th>
      <th id="thNetworkCompress" scope="col" class="subtitle">{translate("resDetSubTitleNetworkCompress")}</th>
      <th id="thNetworkPercent" scope="col" class="subtitle">{translate("resDetSubTitleNetworkPercent")}</th>
      <th id="thClientUncompressed" scope="col" class="subtitle client">{translate("resDetSubTitleCliUncompress")}</th>
      <th id="thClientPercent" scope="col" class="subtitle client">{translate("resDetSubTitleCliPercent")}</th>
    </tr>
    </thead>
    <tbody>
    {#each network.detail as detail, index}
      <tr class:even={index % 2 === 0}>
        <th id="thResourceName" scope="row">{detail.resource}</th>
        <td headers="thServer thServerCache thResourceName" class="server">{detail.nbRequestCache}</td>
        <td headers="thServer thServerCacheMiss thResourceName" class="server">{detail.nbRequest}</td>
        <td headers="thServer thServerPercent thResourceName" class="server">{formatNumber(100 * (detail.nbRequest + detail.nbRequestCache) / totRequest)}%</td>
        <td headers="thNetwork thNetworkCompress thResourceName">{formatSize(detail.network.size)}{Units.pageSize}</td>
        <td headers="thNetwork thNetworkPercent thResourceName">{detail.network.size ? formatNumber(100 * detail.network.size / network.network.size) : 0}%</td>
        <td headers="thClient thClientUncompressed thResourceName" class="client">{formatSize(detail.network.sizeUncompress)}{Units.pageSize}</td>
        <td headers="thClient thClientPercent thResourceName" class="client">{detail.network.sizeUncompress ? formatNumber(100 * detail.network.sizeUncompress / network.network.sizeUncompress) : 0}%</td>
      </tr>
    {/each}
    </tbody>
    <tfoot>
    <tr>
      <th id="thTotal" scope="row">{translate("resDetTitleTotal")}</th>
      <td headers="thServer thServerCache thTotal" class="server">{network.nbRequestCache}</td>
      <td headers="thServer thServerCacheMiss thTotal" class="server">{network.nbRequest}</td>
      <td headers="thServer thServerPercent thTotal" class="server">100%</td>
      <td headers="thNetwork thNetworkCompress thTotal">{formatSize(network.network.size)}{Units.pageSize}</td>
      <td headers="thNetwork thNetworkPercent thTotal">100%</td>
      <td headers="thClient thClientUncompressed thTotal" class="client">{formatSize(network.network.sizeUncompress)}{Units.pageSize}</td>
      <td headers="thClient thClientPercent thTotal" class="client">100%</td>
    </tr>
    <tr class="even">
      <th id="thLocation" scope="row">{translate("resDetTitleLocation")}</th>
      <td headers="thServer thLocation" class="server" colspan="3">{srvCity}</td>
      <td headers="thNetwork thLocation" colspan="2">{netCity}</td>
      <td headers="thClient thLocation" class="client" colspan="2">{cliCity}</td>
    </tr>
    <tr>
      <th id="thEnergy" scope="row">{translate("resDetTitleEnergy")}</th>
      <td headers="thServer thEnergy" class="server" colspan="3">{mixSrv}</td>
      <td headers="thNetwork thEnergy" colspan="2">{mixNet}</td>
      <td headers="thClient thEnergy" class="client" colspan="2">{mixCli}</td>
    </tr>
    </tfoot>
  </table>
</div>

<style lang="scss">
  .table-container {

    caption h3{
      font-weight: bold;
      font-size: var(--font-size--xl);
      text-align: center;
      color: var(--color--green);
    }

    .table {
      border-collapse: collapse;

      th {
        color: var(--color--green);

        &.subtitle {
          color: inherit;
          font-weight: normal;
          font-style: italic;
          border-left-style: groove;
          padding-right: 0.1em;
          padding-left: 0.1em;
        }
      }

      td, th {
        padding: calc(var(--spacing--xs) / 2);

        &:not(:first-child) {
          border-left-style: groove;
        }

        &.server, &.client {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      thead {
        border-bottom: var(--spacing--xs) solid var(--color--green);
        background-color: var(--color--light);
      }

      tfoot {
        border-top: var(--spacing--xs) solid var(--color--green);
        background-color: var(--color--light);
      }

      tbody td {
        text-align: center;
      }
      tbody th {
        font-weight: normal;
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