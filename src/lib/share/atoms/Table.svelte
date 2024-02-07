<script lang="ts">
  import { Units } from 'src/const';
  import { translate } from 'src/utils/utils';
  import type { TableData } from 'src/interface/table.interface';

  export let columnHeaders: TableHeader[];
  export let rowHeaders: TableHeader[];
  export let datas: TableData[];
</script>

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
      <tr>
        {#if rowHeaders?.length > 0}
          <td>{translate(rowHeaders[index]?.translateKey)}</td>
        {/if}

        {#if columnHeaders?.length > 0}
          {#each columnHeaders as header, colNumber}
            {#if rowHeaders?.length > 0 && colNumber !== 0}
              <td style={data[header.id]?.style}>{translate(data[header.id]?.content)}</td>
            {:else if !rowHeaders}
              <td style={data[header.id]?.style}>{translate(data[header.id]?.content)}</td>
            {/if}
          {/each}
        {:else}
          <td style={data[index]?.style}>{translate(data[index]?.content)}</td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  .table {
    overflow: auto;
    border-spacing: initial;

    margin: var(--spacing--md) auto;

    th,
    td {
      text-align: center;
      border: solid 1px var(--color--primary);
      padding: var(--spacing--lg);
    }
    thead {
      text-transform: uppercase;
      background-color: var(--color--light);
      font-size: var(--font-size--sm);
    }
  }
</style>
