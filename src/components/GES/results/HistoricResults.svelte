<script lang="ts">
  import { gesTableHeaders, savedMeasures } from 'src/const';
  import { ButtonTypeEnum } from 'src/enum';
  import type { Measure } from 'src/interface';
  import { Table, Button, Modal } from 'src/components';
  import { export_data } from 'src/utils/service';
  import {
    formatGesMeasuresForTable,
    getLocalStorageObject,
    setLocalStorageObject,
    translate,
  } from 'src/utils/utils';
  import { SvelteComponent, onMount } from 'svelte';

  let formattedData: TableData[] = [];
  let measures: Measures[] = [];
  let showPopUp = false;

  onMount(() => {
    measures = getLocalStorageObject(savedMeasures) ?? [];
    formattedData = formatGesMeasuresForTable(measures).map((measure) => ({
      ...measure,
      action: {
        content: 'deleteButton',
        action: true,
      },
    }));
  });

  const handleExport = () => {
    export_data(measures);
  };

  const handleDeleteMeasure = (event) => {
    const data = event.detail.data;
    formattedData = formattedData.filter((d) => d !== data);
    measures = measures.filter((m) => m.date !== data.date.content);
    setLocalStorageObject(savedMeasures, measures);
  };

  const handleDeleteAll = () => {
    localStorage.removeItem(savedMeasures);
    formattedData = [];
    showPopUp = false;
  };
</script>

<h2>{translate('titleHistory')}</h2>
<div class="flex-center">
  <Button
    on:buttonClick={handleExport}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="exportButton"
    disabled={!formattedData.length}
  />
  <Button
    on:buttonClick={() => (showPopUp = true)}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="deleteAllButton"
    disabled={!formattedData.length}
  />
</div>
<Table
  columnHeaders={[...gesTableHeaders, { id: 'action', translateKey: '' }]}
  datas={formattedData}
  on:actionClicked={handleDeleteMeasure}
/>
<h4>{translate('messageResultsAnalysis')}</h4>

{#if showPopUp}
  <Modal>
    <div class="modal">
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
  .modal {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
