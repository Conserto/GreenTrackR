<script lang="ts">
  import { formatGesMeasuresForTable, getSurHead, translate, translateDescription } from 'src/utils/utils';
  import type { TableData, TableHeader } from 'src/interface/table.interface';
  import Button from './Button.svelte';
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import Tooltip from './Tooltip.svelte';

  export let columnHeaders: TableHeader[] = [];
  export let datas: Map<string, TableData>[] = [];

  const dispatch = createEventDispatcher();
  const surHeads = getSurHead(columnHeaders);
</script>

<div class="table-container">
  <table class="table">
    <thead>
    <tr>
        {#each surHeads as [key, value]}
          <th scope="col" colspan="{value.colspan}" class="{value.class}">
            <Tooltip translateKey={value.translateKey} />
          </th>
        {/each}
    </tr>
    <tr>
      {#if columnHeaders.length > 0}
        {#each columnHeaders as columnHeader}
          <th scope="col" class="{columnHeader.class}">
            <Tooltip translateKey={columnHeader.translateKey} />
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
            <td style={data.get(header.id)?.style} class="{header.class}">
              {#if data.get(header.id)?.action}
                <Button
                  on:buttonClick={() => dispatch('actionClicked', { data })}
                  buttonType={ButtonTypeEnum.SECONDARY}
                  translateKey={data.get(header.id)?.content ?? ""}
                />
              {:else if data.get(header.id)?.detail}
                <Tooltip
                  top={true}
                  value={data.get(header.id)?.content}
                  tooltipValue={data.get(header.id)?.detail} />
              {:else}
                {translate(data.get(header.id)?.content)}
              {/if}
            </td>
          {/each}
          <!--        {:else}
                    <td style={data.?.style}>{translate(data.get(index)?.content)}</td>-->
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

    th, td {
      &.bold {
        background-color: rgba(0, 0, 0, 0.1);
      }
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

  .even {
    background-color: var(--color--light-grey);
  }
</style>
