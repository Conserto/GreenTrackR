<script lang="ts">
  import type { Measure } from 'src/interface';
  import { formatSize, translate } from 'src/utils';
  import { Units } from 'src/const';

  export let measure: Measure;
  export let captionKey: string = '';

</script>

<h2 class="card__title">{translate(captionKey)}</h2>

<div class="summary-container">
  <ul>
    <li><p><span>{translate("resSumEmpSrv")}</span>{measure.serverGES?.display ?? "-"}</p></li>
    <li><p><span>{translate("resSumEmpCli")}</span>{measure.userGES?.display ?? "-"}</p>
      <hr>
    </li>
    <li><p>
      <span>{translate("resSumNbRes")}</span>{measure.networkMeasure.nbRequest + measure.networkMeasure.nbRequestCache}
    </p></li>
    <li><p><span>{translate("resSumNbSrv")}</span>{measure.detailResources?.length ?? "-"}</p>
    <li><p><span>{translate("resSumNbCountry")}</span>{measure.detailResourcesGes?.length ?? "-"}</p>
      <hr>
    </li>
    <li><p>
      <span>{translate("resSumSizeNetwork")}</span>{formatSize(measure.networkMeasure.network.size)} {Units.pageSize}
    </p></li>
    <li><p>
      <span>{translate("resSumSizeClient")}</span>{formatSize(measure.networkMeasure.network.sizeUncompress)} {Units.pageSize}
    </p></li>
  </ul>
</div>

<style lang="scss">

  .summary-container {
    padding-right: 1rem;
    text-align: left;

    ul {
      hr {
        border: 0;
        height: 2px;
        background: var(--color--green) 3;
        background-image: linear-gradient(to right, white, var(--color--green), white);
      }

      li {
        list-style-type: circle;

        &::marker {
          color: var(--color--green);
          font-size: x-large;
        }

        color: var(--color--green);
        font-weight: bold;

        span {
          color: var(--color--grey);
        }
      }
    }
  }
</style>