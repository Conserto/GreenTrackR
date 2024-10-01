<script lang="ts">
  import type { Measure } from 'src/interface';
  import { formatGesMeasuresForTable, translate } from 'src/utils';
  import { SynthesisTable, Table } from 'src/components/journey';
  import { gesTableHeaders } from 'src/const';
  import { ButtonTypeEnum } from '../../enum';
  import { Button } from '../html';

  export let measures: Measure[];

  const dataFormatted = formatGesMeasuresForTable(measures);
  let shortUrl = true;

  const switchUrl = () => {
    shortUrl = !shortUrl;
  };
</script>

<SynthesisTable className="{shortUrl ? 'hide--url' : ''}" datas={measures} caption={translate('messageResults')} description={translate('descriptionResults')} />
<br />

<Table className="{shortUrl ? 'hide--url' : ''}" caption={translate('messageResultsDetail')} description={translate('descriptionResultsDetail')}
       columnHeaders={gesTableHeaders} datas={dataFormatted} />
<p>
  <Button
    on:buttonClick={switchUrl}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'switchUrlShow'}
  />
</p>