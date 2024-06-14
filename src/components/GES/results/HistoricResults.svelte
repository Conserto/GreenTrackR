<script lang="ts">
  import { gesTableHeaders } from 'src/const';
  import { ButtonTypeEnum } from 'src/enum';
  import { Button, Modal, Table } from 'src/components';
  import { export_data } from 'src/service';
  import { formatGesMeasuresForTable, getLocalStorageObject, setLocalStorageObject, translate } from 'src/utils';
  import { onMount } from 'svelte';
  import type { Measure, TableData } from 'src/interface';

  let formattedData: Map<string, TableData>[];
  let measures: Measure[] = [];
  let showModal = false;
  export let saveName: string;

  onMount(() => {
    updateHistory();
  });

  const handleExport = () => {
    export_data(measures);
  };

  export const updateHistory = () => {
    measures = getLocalStorageObject(saveName) ?? [];
    let btn = new Map<string, TableData>;
    btn.set('action', { content: 'deleteButton', action: true });
    formattedData = formatGesMeasuresForTable(measures, btn);
  };

  const handleDeleteMeasure = (event: any) => {
    const data = event.detail.data;
    formattedData = formattedData.filter((d) => d !== data);
    measures = measures.filter((m) => m.date !== data.get('date').content);
    setLocalStorageObject(saveName, measures);
  };

  const handleDeleteAll = () => {
    localStorage.removeItem(saveName);
    formattedData = [];
    showModal = false;
  };
</script>

<Table
  columnHeaders={[...gesTableHeaders, { id: 'action', translateKey: 'action', class: 'bold'}]}
  datas={formattedData}
  caption={translate('messageResultsAnalysis')}
  description={translate('descriptionResultsAnalysis')}
  on:actionClicked={handleDeleteMeasure}
/>
<div class="flex-center">
  <Button
    on:buttonClick={handleExport}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="exportButton"
    disabled={!formattedData?.length}
  />
  <Button
    on:buttonClick={() => (showModal = true)}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="deleteAllButton"
    disabled={!formattedData?.length}
  />
</div>

<Modal dialogLabelKey="deleteAllTitle" bind:showModal>
  <h2>{translate('deleteAllConfirmMessage')}</h2>
  <div>
    <Button
      on:buttonClick={() => (showModal = false)}
      buttonType={ButtonTypeEnum.SECONDARY}
      translateKey="cancelButton"
    />
    <Button
      on:buttonClick={handleDeleteAll}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey="deleteAllButton"
    />
  </div>
</Modal>

<style lang="scss">
  h2 {
    text-align: center;
  }
</style>
