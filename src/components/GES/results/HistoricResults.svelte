<script lang="ts">
  import { gesTableHeaders } from 'src/const';
  import { ButtonTypeEnum } from 'src/enum';
  import { Button, Modal, Table } from 'src/components';
  import { export_data } from 'src/service';
  import { formatGesMeasuresForTable, getLocalStorageObject, setLocalStorageObject, translate } from 'src/utils/utils';
  import { onMount } from 'svelte';
  import type { Measure, TableData } from '../../../interface';

  let formattedData: Map<string, TableData>[];
  let measures: Measure[] = [];
  let showPopUp = false;
  export let saveName: string;

  onMount(() => {
    measures = getLocalStorageObject(saveName) ?? [];
    let btn = new Map<string, TableData>;
    btn.set('action', { content: 'deleteButton', action: true });
    formattedData = formatGesMeasuresForTable(measures, btn);
  });

  const handleExport = () => {
    export_data(measures);
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
    showPopUp = false;
  };
</script>

<h4>{translate('messageResultsAnalysis')}</h4>
<Table
  columnHeaders={[...gesTableHeaders, { id: 'action', translateKey: 'action' }]}
  datas={formattedData}
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
    on:buttonClick={() => (showPopUp = true)}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="deleteAllButton"
    disabled={!formattedData?.length}
  />
</div>

{#if showPopUp}
  <Modal>
    <div class="flex-col-center">
      <h2>{translate('deleteAllConfirmMessage')}</h2>
      <div class="flex-center">
        <Button
          on:buttonClick={() => (showPopUp = false)}
          buttonType={ButtonTypeEnum.SECONDARY}
          translateKey="cancelButton"
        />
        <Button
          on:buttonClick={handleDeleteAll}
          buttonType={ButtonTypeEnum.PRIMARY}
          translateKey="OK"
        />
      </div>
    </div>
  </Modal>
{/if}

<style lang="scss">
  h2,
  h4 {
    text-align: center;
  }
</style>
