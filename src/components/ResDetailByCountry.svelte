<script lang="ts">
  import type { Measure } from '../interface';
  import {
    formatEmission,
    formatSizeTransferred,
    formatSizeTransferredWithUnit,
    formatUriOnly,
    translate
  } from '../utils';

  export let measure: Measure;
  export let captionKey: string = '';
</script>

<h2 class="card__title">{translate(captionKey)}</h2>

<div class="detail-country-container">
  <div class="title">
    <!--<span class="title">{translate("resDetCountTitleCountry")}</span>-->
    <!--<span class="title">{translate("resDetCountTitleMix")}</span>
    <span class="title">{translate("resDetCountTitleHit")}</span>-->
  </div>

  {#if measure.detailResourcesGes}
    {#each measure.detailResourcesGes as detail, index}
      <details id='level1' class:even={index % 2 === 0}>
        <summary class="data">
          <span class="import">{detail.ges?.display}</span>
          <span class="import"> / </span>
          <span>{formatEmission(detail.ges)}</span>
          <span class="import"> / </span>
          <span class="import">{detail.hit} {translate("resDetCountTitleHit")}</span>
        </summary>
        <div class="title inner">
<!--          <span class="title">{translate("resDetHostTitleHost")}</span>
          <span class="title">{translate("resDetHostTitleSize")}</span>
          <span class="title">{translate("resDetHostTitleHit")}</span>-->
        </div>

        {#each detail.hostnames as host, index2}
          <details id='level2' class:even={index2 % 2 === 0}>
            <summary class="data">
              <span class="import">{host.hostname}</span>
              <span class="import"> / </span>
              <span>{formatSizeTransferredWithUnit(host.sizeTotal.size, host.sizeTotal.sizeUncompress)}</span>
              <span class="import"> / </span>
              <span class="import">{host.details.length} {translate("resDetCountTitleHit")}</span>
            </summary>
            <div class="title inner">
<!--              <span class="title">{translate("resDetHostDTitleResource")}</span>
              <span class="title">{translate("resDetHostDTitleUrl")}</span>
              <span class="title">{translate("resDetHostDTitleSize")}</span>
              <span class="title">{translate("resDetHostDTitleCache")}</span>-->
            </div>

            {#each host.details as req, index3}
              <div id='level3' class="data {index3 % 2 === 0 ? 'even' : ''}">
                <span class="import">{req.resource}</span>
                <span class="import"> / </span>
                <!--<span class="fullurl">{req.url}</span>-->
                <span>{formatUriOnly(req.url)}</span>
                <span class="import"> / </span>
                <span class="import">{formatSizeTransferredWithUnit(req.size.size, req.size.sizeUncompress)}</span>
                {#if req.cache}
                  <span class="import"> / </span>
                  <span >{translate("resDetHostDTitleCache")}</span>
                {/if}
              </div>
            {/each}
          </details>
        {/each}

      </details>
    {/each}
  {/if}
</div>

<style lang="scss">

  .detail-country-container {

    text-align: left;

    span.import {
      color: var(--color--green);
      font-weight: bold;
    }

    div.title {
      // border-bottom: var(--spacing--xxs) solid var(--color--green);
      background-color: var(--color--light);
      color: var(--color--green);

      span {
        padding: calc(var(--spacing--xs) / 2);
        font-size: large;
        font-weight: bold;

        &:not(:first-child) {
          /*border-left-style: groove;*/
        }
      }
    }

    .data {
      span {
        padding: calc(var(--spacing--xs) / 2);

        &:not(:first-child) {
          /*border-left-style: groove;*/
        }
      }
    }

    details#level2, details#level1 div.title.inner {
      padding-left: 1rem;
    }

    div#level3, details#level2 div.title.inner {
      padding-left: 2rem;
    }

    div.even, span.even {
      background-color: var(--color--light-grey);
    }

    details.even summary {
      background-color: var(--color--light-grey);
    }
  }
</style>