<script lang="ts">
  import { getSurHead, translate } from 'src/utils';
  import type { TableData, TableHeader } from 'src/interface/table.interface';
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import { AdpIcon, EauIcon, ElecIcon, GesIcon } from 'src/assets/icons';
  import { Button } from 'src/components/html';

  export let columnHeaders: TableHeader[] = [];
  export let datas: Map<string, TableData>[] = [];
  export let caption: string = '';
  export let description: string = '';
  const dispatch = createEventDispatcher();
  const surHeads = getSurHead(columnHeaders);
</script>

<div class="table-container">
  <table class="table">
    <caption>
      {caption}
      <span class="visually-hidden">{description}</span>
    </caption>
    <thead>
    <tr>
      {#each surHeads as [key, value]}
        <th id="surHead{key}" colspan="{value.colspan}" class="{value.class}" aria-hidden={!value.translateKey || null}>
          {#if ('AdpIcon' === value.icon)}
            <img src="{AdpIcon}" alt="" class="surHeadImg" />
          {:else if ('EauIcon' === value.icon)}
            <img src="{EauIcon}" alt="" class="surHeadImg" />
          {:else if ('ElecIcon' === value.icon)}
            <img src="{ElecIcon}" alt="" class="surHeadImg" />
          {:else if ('GesIcon' === value.icon)}
            <img src="{GesIcon}" alt="" class="surHeadImg" />
          {/if}
          {translate(value.translateKey)}
        </th>
      {/each}
    </tr>
    <tr>
      {#if columnHeaders.length > 0}
        {#each columnHeaders as columnHeader}
          <th id="header{columnHeader.id}" class="{columnHeader.class}">
            {translate(columnHeader.translateKey)}
          </th>
        {/each}
      {/if}
    </tr>
    </thead>
    <tbody>
    {#each datas as data, index}
      <tr class:even={index % 2 === 0}>

        {#if columnHeaders.length > 0}
          {#each columnHeaders as header, colNumber}
            <td headers="surHead{header.groupHead} header{header.id}" style={data.get(header.id)?.style}
                class="{header.class}">
              {#if data.get(header.id)?.action}
                <Button
                  on:buttonClick={() => dispatch('actionClicked', { data })}
                  buttonType={ButtonTypeEnum.SECONDARY}
                  translateKey={data.get(header.id)?.content ?? ""}
                />
              {:else if data.get(header.id)?.detail}
                {data.get(header.id)?.content}
              {:else}
                {translate(data.get(header.id)?.content)}
              {/if}
            </td>
          {/each}
        {/if}
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .table-container {
    width: 100%;
    overflow: auto;
    box-shadow: var(--box-shadow--sm), var(--box-shadow--sm);
    border-radius: 8px;

    .bold {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .table {
      border-collapse: collapse;

      thead {
        border-bottom: var(--spacing--xs) solid var(--color--green);
        text-transform: uppercase;
        background-color: var(--color--light);
        position: sticky;
        top: 0;

        th {
          padding: var(--spacing--md) var(--spacing--xl);

          img.surHeadImg {
            height: 1.2em;
            margin-right: 0.2em;
          }

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
</style>
