<script lang="ts">
  import type { Measure } from 'src/interface';
  import { formatGesMeasuresForTable, translate } from 'src/utils/utils';
  import { Synthese, Table } from 'src/components';
  import { gesTableHeaders } from 'src/const';

  export let measures: Measure[];

  const dataFormatted = formatGesMeasuresForTable(measures);
</script>

<h4 class="table-caption">{translate('messageResults')}</h4>
<Table columnHeaders={gesTableHeaders} datas={dataFormatted} />
<Synthese datas={measures} />

<style lang="scss">
  .table-caption {
    text-align: center;
  }
</style>
