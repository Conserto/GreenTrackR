<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import { GesResults, HistoricResults } from 'src/components/GES/results';
  import { Button, Histogram, LoadingWheel, Modal } from 'src/components';
  import { ZoneSimulation } from 'src/components/GES';
  import { getLocalStorageObject, setLocalStorageObject, toHistoFormattedDatas, translate } from 'src/utils/utils';
  import { savedMeasures } from 'src/const';
  import { cleanCache, reloadCurrentTab } from 'src/utils/chrome.utils';
  import { MeasureAcquisition } from 'src//service/MeasureAcquisition.service';
  import { SEARCH_AUTO } from '../const/key.const';
  import type { HistoData, Measure } from '../interface';

  enum TabType {
    ResultTab,
    HistoricTab,
    None,
  }

  let currentDisplayedTab = TabType.None;
  let showPopUp = false;

  let loading = false;
  let loadGes = false;
  let measureAcquisition = new MeasureAcquisition();
  let currentMeasure: Measure | null;
  let histoDatas: HistoData[] = [];

  let serverSearch = SEARCH_AUTO;
  let userSearch = SEARCH_AUTO;
  let updateHistoryTab;

  const onResetMeasure = () => {
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
    measureAcquisition.applyLatest();
  };

  const onCleanCache = () => {
    cleanCache();
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
    reloadCurrentTab();
  };

  const onRefresh = () => {
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
    reloadCurrentTab();
  };

  const onSaveCurrentMeasure = () => {
    const lsMeasures = getLocalStorageObject(savedMeasures);
    setLocalStorageObject(
      savedMeasures,
      lsMeasures ? [...lsMeasures, currentMeasure] : [currentMeasure]
    );
    if (currentDisplayedTab === TabType.HistoricTab) {
      updateHistoryTab();
    }
    showPopUp = true;
  };

  const handleRunAnalysis = async () => {
    currentDisplayedTab = TabType.ResultTab;
    loading = true;
    await measureAcquisition.getNetworkMeasure(false);
    currentMeasure = await measureAcquisition.getGESMeasure(serverSearch, userSearch);
    loading = false;
    histoDatas = toHistoFormattedDatas(currentMeasure);
  };

  const handleSimulation = async (event: any) => {
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    serverSearch = countryCodeSelected;
    userSearch = userCountryCodeSelected;
  };
</script>

<div class="flex-center">
  <Button
    on:buttonClick={handleRunAnalysis}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'launchAnalysisButton'}
    tooltip={true}
  />
  <Button
    on:buttonClick={onSaveCurrentMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="saveAnalysisButton"
    disabled={!currentMeasure}
    tooltip={true}
  />
  <Button
    on:buttonClick={() => (currentDisplayedTab = TabType.HistoricTab)}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="viewHistoryButton"
    tooltip={true}
  />
  <Button
    on:buttonClick={onCleanCache}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
    tooltip={true}
  />
  <Button
    on:buttonClick={onResetMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetMeasure"
    disabled={!currentMeasure}
    tooltip={true}
  />
  <Button
    on:buttonClick={onRefresh}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="refresh"
    tooltip={true}
  />
</div>
<ZoneSimulation on:submitSimulation={handleSimulation} />
{#if currentDisplayedTab === TabType.ResultTab}
  {#if currentMeasure && !loading}
    <GesResults measure={currentMeasure} />
    <div class="histo-container">
      {#if loadGes}
        <div class="loading-ges">
          <LoadingWheel />
        </div>
      {:else if currentMeasure?.complete}
        <Histogram
          datas={histoDatas}
          yLabel="greenhouseGasesEmissionDefault"
          yLabel2="energyDefault"
        />
      {/if}
    </div>
  {:else if loading === true}
    <div class="loading-wheel">
      <LoadingWheel />
    </div>
  {/if}
{:else if currentDisplayedTab === TabType.HistoricTab}
  <HistoricResults saveName="{savedMeasures}" bind:updateHistory={updateHistoryTab} />
{/if}
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

<style lang="scss">
  .modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .loading-wheel {
    margin: var(--spacing--xl);
  }

  .loading-ges {
    $margin-y: var(--spacing--xxxl);
    margin: $margin-y 0 $margin-y 0;
  }

  .histo-container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
  }
</style>
