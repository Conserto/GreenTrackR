<script lang="ts">
  import { getSurHead, translate } from 'src/utils';
  import type { TableData, TableHeader } from 'src/interface/table.interface';
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import { AdpIcon, EauIcon, ElecIcon, GesIcon } from 'src/assets/icons';
  import { Button } from 'src/components/html';

  // Props definition
  export let columnHeaders: TableHeader[] = [];
  export let datas: Map<string, TableData>[] = [];
  export let caption: string = '';
  export let description: string = '';
  export let className: string = '';

  // Event dispatcher for communicating with parent components
  const dispatch = createEventDispatcher();

  // Generate super-headers from column definitions
  const surHeads = getSurHead(columnHeaders);
</script>

<div class="table-container {className}">
  <table class="table">
    <caption>
      {caption}
      <span class="visually-hidden">{description}</span>
    </caption>

    <thead>
    <!-- Super-headers row (grouped headers) -->
    <tr>
      {#each surHeads as [key, value]}
        <th
          id="surHead{key}"
          colspan="{value.colspan}"
          class="{value.class}"
          aria-hidden={!value.translateKey || null}
        >
          {#if value.icon === 'AdpIcon'}
            <img src="{AdpIcon}" alt="" class="surHeadImg" />
          {:else if value.icon === 'EauIcon'}
            <img src="{EauIcon}" alt="" class="surHeadImg" />
          {:else if value.icon === 'ElecIcon'}
            <img src="{ElecIcon}" alt="" class="surHeadImg" />
          {:else if value.icon === 'GesIcon'}
            <img src="{GesIcon}" alt="" class="surHeadImg" />
          {/if}
          {translate(value.translateKey)}
        </th>
      {/each}
    </tr>

    <!-- Individual column headers row -->
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
          {#each columnHeaders as header}
            <td
              headers="surHead{header.groupHead} header{header.id}"
              style={data.get(header.id)?.style}
              class="{header.class}"
            >
              {#if data.get(header.id)?.action}
                <Button
                  on:buttonClick={() => dispatch('actionClicked', { data })}
                  buttonType={ButtonTypeEnum.SECONDARY}
                  translateKey={data.get(header.id)?.content ?? ""}
                />
              {:else if data.get(header.id)?.contentHtml}
                {@html data.get(header.id)?.contentHtml}
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
    box-shadow: var(--box-shadow--sm);
    border-radius: 8px;

    .bold {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .table {
      border-collapse: collapse;
      width: 100%;

      thead {
        border-bottom: 2px solid var(--color--green, #2e7d32);
        text-transform: uppercase;
        background-color: var(--color--light, #f5f5f5);
        position: sticky;
        top: 0;

        th {
          padding: 0.5rem 1rem;

          img.surHeadImg {
            height: 1.2em;
            margin-right: 0.2em;
            vertical-align: middle;
          }
        }
      }

      tbody {
        td {
          text-align: center;
          padding: 0.75rem 1rem;
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