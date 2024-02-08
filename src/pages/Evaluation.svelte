<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import logo from '/icons/128.png';
  import { Results, HistoricResults } from 'src/components/GES/results';
  import { EmptyContent, Footer, Button, Modal } from 'src/components';
  import { getLocalStorageObject, setLocalStorageObject, translate } from 'src/utils/utils';
  import { savedMeasures } from 'src/const';

  enum TabType {
    ResultTab,
    HistoricTab,
    None,
  }

  let currentDisplayedTab = TabType.None;
  let currentMeasure = null;
  let showPopUp = false;

  const onMeasureUpdated = (event) => {
    currentMeasure = event.detail.measure;
  };

  const onResetMeasure = () => {
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
  };

  const onSaveCurrentMeasure = () => {
    const lsMeasures = getLocalStorageObject(savedMeasures);
    setLocalStorageObject(
      savedMeasures,
      lsMeasures ? [...lsMeasures, currentMeasure] : [currentMeasure],
    );
    showPopUp = true;
  };
</script>

<div
  class="tab-pane fade show active"
  id="evaluation"
  role="tabpanel"
  aria-labelledby="evaluation-tab"
>
  <img src={logo} alt="Conserto" class="rounded" />
  <div class="flex-center">
    <Button
      on:buttonClick={() => (currentDisplayedTab = TabType.ResultTab)}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey={'launchAnalysisButton'}
    />
    <Button
      on:buttonClick={onSaveCurrentMeasure}
      buttonType={ButtonTypeEnum.SECONDARY}
      translateKey="saveAnalysisButton"
      disabled={!currentMeasure}
    />
    <Button
      on:buttonClick={() => (currentDisplayedTab = TabType.HistoricTab)}
      buttonType={ButtonTypeEnum.SECONDARY}
      translateKey="viewHistoryButton"
    />
    <Button
      on:buttonClick={onResetMeasure}
      buttonType={ButtonTypeEnum.SECONDARY}
      translateKey="clearBrowserCacheButton"
      disabled={!currentMeasure}
    />
  </div>
  {#if currentDisplayedTab === TabType.ResultTab}
    <Results on:measureUpdated={onMeasureUpdated} />
  {:else if currentDisplayedTab === TabType.HistoricTab}
    <HistoricResults />
  {:else}
    <EmptyContent />
  {/if}
</div>
{#if showPopUp}
  <Modal>
    <div class="modal">
      <h2>{translate('saveAnalysis')}</h2>
      <Button
        on:buttonClick={() => (showPopUp = false)}
        buttonType={ButtonTypeEnum.PRIMARY}
        translateKey="closePopup"
      />
    </div>
  </Modal>
{/if}
<Footer />

<style>
  .tab-pane {
    height: 93%;
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
    margin: 0 var(--spacing--xl) 0 var(--spacing--xl);
  }
  .modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
</style>
