<script lang="ts">
  import type { Measure } from '../interface';
  import { formatEmission, formatSizeTransferredWithUnit, formatUriOnly, translate } from '../utils';
  import Button from './Button.svelte';
  import { ButtonTypeEnum } from '../enum';

  export let measure: Measure;
  export let captionKey: string = '';
  const hide = 'display: none';

  let fullUrl = hide;
  let lightUrl = '';

  const switchUrl = async () => {
    fullUrl = fullUrl === '' ? hide : '';
    lightUrl = lightUrl === '' ? hide : '';
  };
</script>

<h2 class="card__title">{translate(captionKey)}</h2>

<div class="detail-country-container">

  {#if measure.detailResourcesGes}
    {#each measure.detailResourcesGes as detail, index}
      <details id='level1' class:even={index % 2 === 0}>
        <summary class="data">
          <span class="import">{detail.ges?.display}</span>
          <span>{formatEmission(detail.ges)}</span>
          <span class="import">{detail.hit} {translate("resDetCountTitleHit")}</span>
        </summary>

        {#each detail.hostnames as host, index2}
          <details id='level2' class:even={index2 % 2 === 0}>
            <summary class="data">
              <span class="import">{host.hostname}</span>
              <span>{formatSizeTransferredWithUnit(host.sizeTotal.size, host.sizeTotal.sizeUncompress)}</span>
              <span class="import">{host.details.length} {translate("resDetCountTitleHit")}</span>
            </summary>

            {#each host.details as req, index3}
              <div id='level3' class="data {index3 % 2 === 0 ? 'even' : ''}">
                <span class="import">{req.resource}</span>
                <span style="{fullUrl}">{req.url}</span>
                <span style="{lightUrl}">{formatUriOnly(req.url)}</span>
                <span class="import">{formatSizeTransferredWithUnit(req.size.size, req.size.sizeUncompress)}</span>
                {#if req.cache}
                  <span>{translate("resDetHostDTitleCache")}</span>
                {/if}
              </div>
            {/each}
          </details>
        {/each}

      </details>
    {/each}
    <Button
      on:buttonClick={switchUrl}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey={'resDetCountrySwitchUrl'}
    />
  {/if}
</div>

<style lang="scss">

  .detail-country-container {

    text-align: left;

    span {
      &.import {
        color: var(--color--green);
        font-weight: bold;
      }
    }

    .data {
      span {
        padding: calc(var(--spacing--xs) / 2);
      }
    }

    details#level2 {
      padding-left: 1rem;
    }

    div#level3 {
      padding-left: 2rem;
    }

    div.even {
      background-color: var(--color--light-grey);
    }

    details.even summary {
      background-color: var(--color--light-grey);
    }
  }
</style>