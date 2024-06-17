<script lang="ts">
  import type { Measure } from 'src/interface';
  import { formatGesMeasuresForTable, translate } from 'src/utils';
  import { SynthesisTable, Table } from 'src/components/journey';
  import { gesTableHeaders } from 'src/const';

  export let measures: Measure[];

  const dataFormatted = formatGesMeasuresForTable(measures);
</script>

<SynthesisTable datas={measures} caption={translate('messageResults')} description={translate('descriptionResults')} />
<br />

<Table caption={translate('messageResultsDetail')} description={translate('descriptionResultsDetail')}
       columnHeaders={gesTableHeaders} datas={dataFormatted} />