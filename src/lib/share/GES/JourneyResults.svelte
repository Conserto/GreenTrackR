<script lang="ts">
  import { Units } from 'src/const/units.const';
  import type { Measure } from 'src/interface';
  import { formatDate, formatNumber, translate } from 'src/utils/utils';

  export let measures: Measure[];
</script>

<div class="journey-result-container">
  <h4 class="table-caption">{translate('messageResults')}</h4>
  <table class="journey-result-table">
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Url</th>
        <th scope="col">{translate('sizeTransferred')}</th>
        <th scope="col">{translate('nbRequest')}</th>
        <th scope="col">{translate('gesDataCenter')}</th>
        <th scope="col">{translate('gesNetwork')}</th>
        <th scope="col">{translate('gesDevice')}</th>
        <th scope="col">{translate('gesTotal')}</th>
        <th scope="col">{translate('gesScore')}</th>
        <th scope="col">{translate('gesGrade')}</th>
        <th scope="col">{translate('gesZone')}</th>
        <th scope="col">{translate('gesIntensity')}</th>
      </tr>
    </thead>
    <tbody>
      {#each measures as measure}
        <tr>
          <td>{formatDate(measure.date)}</td>
          <td>{measure.url}</td>
          <td>{`${measure.network.size} ${Units.pageSize}`} </td>
          <td>{measure.nbRequest}</td>
          <td>{`${formatNumber(measure.ges.dataCenterTotal)} ${Units.carbonEmissions}`}</td>
          <td>{`${formatNumber(measure.ges.networkTotal)} ${Units.carbonEmissions}`}</td>
          <td>{`${formatNumber(measure.ges.deviceTotal)} ${Units.carbonEmissions}`}</td>
          <td>{`${formatNumber(measure.ges.websiteTotal)} ${Units.carbonEmissions}`}</td>
          <td style:background-color={measure.score.color}>{formatNumber(measure.score.value)}</td>
          <td style:background-color={measure.score.color}>{measure.score.gradeLetter}</td>
          <td>{`${measure.cityName}, ${measure.zone}`}</td>
          <td>{`${measure.carbonIntensity} ${Units.carbonIntensity}`}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .journey-result-container {
    width: 100%;
    overflow: auto;
    margin-bottom: 20px;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 8px;

    .journey-result-table {
      border-collapse: collapse;
      thead {
        border-bottom: 4px solid var(--background-color--primary);
        text-transform: uppercase;
        background-color: #f9fafb;

        th {
          padding: 12px 24px;
        }
      }

      tbody {
        tr {
          border-bottom: solid #e0e9ec;
        }

        td {
          text-align: center;
          padding: 16px 24px;
        }
      }
    }
  }
  .table-caption {
    text-align: center;
  }
</style>
