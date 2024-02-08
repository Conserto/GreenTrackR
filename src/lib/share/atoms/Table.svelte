<script lang="ts">
  import { Units } from 'src/const';
  import { translate } from 'src/utils/utils';
  import type { TableData } from 'src/interface/table.interface';
  import Button from './Button.svelte';
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';

  export let columnHeaders: TableHeader[];
  export let rowHeaders: TableHeader[];
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
    height: 42%;
    overflow: auto;
    margin-bottom: var(--spacing--xl);
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 8px;

    .table {
      border-collapse: collapse;
      thead {
        border-bottom: var(--spacing--xs) solid var(--background-color--primary);
        text-transform: uppercase;
        background-color: #f9fafb;
        position: sticky;
        top: 0;

        th {
          padding: var(--spacing--md) var(--spacing--xl);
        }
      }

      tbody {
        tr {
          border-bottom: solid #e0e9ec;
        }

        td {
          text-align: center;
          padding: var(--spacing--lg) var(--spacing--xl);
        }
      }
    }
  }
  .even {
    background-color: #eff0f1;
  }
</style>
