<script lang="ts">
  import type { Measure } from 'src/interface';
  import { formatGesMeasuresForTable, translate } from 'src/utils/utils';
  import { SynthesisTable, Table } from 'src/components';
  import { gesTableHeaders } from 'src/const';

  export let measures: Measure[];

  const dataFormatted = formatGesMeasuresForTable(measures);
</script>

<h4 class="table-caption">Résumé du parcours</h4>
<SynthesisTable datas={measures} />
<h4 class="table-caption">{translate('messageResults')}</h4>
<Table columnHeaders={gesTableHeaders} datas={dataFormatted} />

<style lang="scss">
  .table-caption {
    text-align: center;
  }
</style>
