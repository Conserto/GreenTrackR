<script lang="ts">
  import { translate } from 'src/utils/utils';
  import type { TableData } from 'src/interface/table.interface';
  import Button from './Button.svelte';
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';

  export let columnHeaders: TableHeader[];
  export let rowHeaders: TableHeader[] = null;
  export let datas: TableData[];

  const dispatch = createEventDispatcher();
</script>

<div class="table-container">
  <table class="table">
    <thead>
    <tr>
      {#if columnHeaders?.length > 0}
        {#each columnHeaders as columnHeader}
          <th scope="col">{translate(columnHeader.translateKey)}</th>
        {/each}
      {/if}
    </tr>
    </thead>
    <tbody>
    {#each datas as data, index}
      <tr class:even={index % 2 === 0}>
        {#if rowHeaders?.length > 0}
          <td>{translate(rowHeaders[index]?.translateKey)}</td>
        {/if}

        {#if columnHeaders?.length > 0}
          {#each columnHeaders as header, colNumber}
            {#if (rowHeaders?.length > 0 && colNumber !== 0) || !rowHeaders}
              <td style={data[header.id]?.style}>
                {#if data[header.id]?.action}
                  <Button
                    on:buttonClick={() => dispatch('actionClicked', { data })}
                    buttonType={ButtonTypeEnum.SECONDARY}
                    translateKey={data[header.id]?.content}
                  />
                {:else}
                  {translate(data[header.id]?.content)}
                {/if}
              </td>
            {/if}
          {/each}
        {:else}
          <td style={data[index]?.style}>{translate(data[index]?.content)}</td>
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
