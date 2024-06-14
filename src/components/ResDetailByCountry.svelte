<script lang="ts">
  import type { Measure } from '../interface';
  import { formatEmission, formatSizeTransferredWithUnit, formatUriOnly, translate } from 'src/utils';
  import Button from './Button.svelte';
  import { ButtonTypeEnum } from '../enum';

  export let measure: Measure;
  export let captionKey: string = '';

  let fullUrl = false;

  const switchUrl = async () => {
    fullUrl = !fullUrl;
  };
</script>

<h2 class="card__title">{translate(captionKey)}</h2>


{#if measure.detailResourcesGes}
  <ul class="detail-country-container">
    {#each measure.detailResourcesGes as detail, index}
      <li>
        <details id='level1' class:even={index % 2 === 0}>
          <summary class="data">
            <span class="import">{detail.ges?.display}</span>
            <span>{formatEmission(detail.ges)}</span>
            <span class="import">{detail.hitReal} {translate("resDetCountTitleHit")}</span>
            <span>{detail.hit} {translate("resDetCountTitleResources")}</span>
          </summary>
          <ul>
            {#each detail.hostnames as host, index2}
              <li>
                <details id='level2' class:even={index2 % 2 === 0}>
                  <summary class="data">
                    <span class="import">{host.hostname}</span>
                    <span>{formatSizeTransferredWithUnit(host.sizeTotal.size, host.sizeTotal.sizeUncompress)}</span>
                    <span class="import">{host.details.length} {translate("resDetCountTitleHit")}</span>
                  </summary>
                  <ul>
                    {#each host.details as req, index3}
                      <li id='level3' class="data {index3 % 2 === 0 ? 'even' : ''}">
                        <span class="import">{req.resource}</span>
                        <span class:hide={!fullUrl}>{req.url}</span>
                        <span class:hide={fullUrl}>{formatUriOnly(req.url)}</span>
                        <span
                          class="import">{formatSizeTransferredWithUnit(req.size.size, req.size.sizeUncompress)}</span>
                        {#if req.cache}
                          <span>{translate("resDetHostDTitleCache")}</span>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                </details>
              </li>
            {/each}
          </ul>
        </details>
      </li>
    {/each}
  </ul>
  {#if fullUrl}
    <Button
      on:buttonClick={switchUrl}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey={'resDetCountrySwitchUrlHide'}
    />
  {:else }
    <Button
      on:buttonClick={switchUrl}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey={'resDetCountrySwitchUrlShow'}
    />
  {/if}
{/if}

<style lang="scss">
  ul {
    padding-inline-start: 0;
    list-style-type: '';
  }

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

    #level2 {
      padding-left: 1rem;
    }

    #level3 {
      padding-left: 2rem;
    }

    li.even, details.even summary {
      background-color: var(--color--light-grey);
    }
  }
</style>