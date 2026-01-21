<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import {
    cleanCache,
    getLocalStorageObject,
    reloadCurrentTab,
    setLocalStorageObject,
    toHistoFormattedDatas,
    translate
  } from 'src/utils';
  import { savedMeasures } from 'src/const';
  import { MeasureAcquisition } from 'src/service/MeasureAcquisition.service';
  import { SEARCH_AUTO } from 'src/const/key.const';
  import type { HistoData, Measure } from 'src/interface';
  import { Button, LoadingWheel } from 'src/components/html';
  import { Modal, ZoneSimulation } from 'src/components/page';
  import { GesResults, HistoricResults } from 'src/components/results';
  import { Histogram, ResDetailByCountry, ResDetailByType, Summary } from 'src/components/cards';

  enum TabType {
    ResultTab,
    HistoricTab,
    None,
  }

  let currentDisplayedTab = TabType.None;
  let showModal = false;

  let loading = false;
  let loadGes = false;
  let measureAcquisition = new MeasureAcquisition();
  let currentMeasure: Measure | null;
  let histoDatas: HistoData[] = [];

  let serverSearch = SEARCH_AUTO;
  let userSearch = SEARCH_AUTO;

  // Key to force a re-render of the HistoricResults component
  let historyKey = 0;

  // Flag to handle the first run after a reset
  let isFirstAnalysisAfterReset = false;

  // Resetting the service completely to avoid filtering bugs [cite: 10]
  const onResetMeasure = () => {
    currentMeasure = null;
    currentDisplayedTab = TabType.None;

     // Re-create the instance to wipe internal state (latest, retry counts, etc.) [cite: 11]
    measureAcquisition = new MeasureAcquisition();

     // Force a refresh on the next analysis [cite: 12]
    isFirstAnalysisAfterReset = true;
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
    // Increment to force an update if we are currently on the history tab
    historyKey++;
    showModal = true;
  };

  // [cite_start] Logic to run the analysis, handling the forced refresh if needed [cite: 18]
  const handleRunAnalysis = async () => {
    console.log('🎯 [DEBUG] Starting analysis...');
    console.log('🎯 [DEBUG] isFirstAnalysisAfterReset:', isFirstAnalysisAfterReset);
    console.log('🎯 [DEBUG] measureAcquisition instance:', measureAcquisition);

    currentDisplayedTab = TabType.ResultTab;
    loading = true;

    const shouldForceRefresh = isFirstAnalysisAfterReset;
    console.log('🎯 [DEBUG] shouldForceRefresh:', shouldForceRefresh);

    await measureAcquisition.getNetworkMeasure(shouldForceRefresh);

    if (isFirstAnalysisAfterReset) {
      isFirstAnalysisAfterReset = false;
    }

    currentMeasure = await measureAcquisition.getGESMeasure(serverSearch, userSearch);
    console.log('🎯 [DEBUG] Analysis complete, measure:', currentMeasure);

    loading = false;
    histoDatas = toHistoFormattedDatas(currentMeasure);
  };

  const handleViewHistory = () => {
    // Increment to trigger a component remount
    historyKey++;
    currentDisplayedTab = TabType.HistoricTab;
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
  />
  <Button
    on:buttonClick={onSaveCurrentMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="saveAnalysisButton"
    disabled={!currentMeasure}
  />
  <Button
    on:buttonClick={handleViewHistory}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="viewHistoryButton"
  />
  <Button
    on:buttonClick={onCleanCache}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
  />
  <Button
    on:buttonClick={onResetMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetMeasure"
    disabled={!currentMeasure}
  />
  <Button
    on:buttonClick={onRefresh}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="refresh"
  />
</div>
<p class="info-mix">{translate('infoMix')}</p>
<ZoneSimulation on:submitSimulation={handleSimulation} />
{#if currentDisplayedTab === TabType.ResultTab}
  {#if currentMeasure && !loading}
    <GesResults measure={currentMeasure} caption="gesEquivalentCaption" />
    <div class="detail-container">
      {#if loadGes}
        <div class="loading-ges">
          <LoadingWheel />
        </div>
      {:else if currentMeasure?.complete}
        <div class="detail summary">
          <Summary
            measure={currentMeasure}
            captionKey="resSumCaption"
          />
        </div>
        <div class="detail request">
          <ResDetailByType
            measure={currentMeasure}
            caption={translate("resDetCaption")}
            description={translate("resDetCaptionDescription")}
          />
        </div>
        <div class="detail histo">
          <Histogram
            datas={histoDatas}
            chartLabel="barChartGES"
            yLabel="greenhouseGasesEmissionDefault"
            yLabel2="energyDefault"
          />
        </div>
        <div class="detail request">
          <ResDetailByCountry
            measure={currentMeasure}
            captionKey="resDetCountCaption"
          />
        </div>
      {/if}
    </div>
  {:else if loading === true}
    <div class="loading-wheel">
      <LoadingWheel />
    </div>
  {/if}
{:else if currentDisplayedTab === TabType.HistoricTab}
  {#key historyKey}
    <HistoricResults saveName={savedMeasures} />
  {/key}
{/if}
<Modal dialogLabelKey="saveAnalysisTitle" bind:showModal>
  <h2>{translate('saveAnalysis')}</h2>
  <Button
    on:buttonClick={() => (showModal = false)}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey="closePopup"
  />
</Modal>

<style lang="scss">
  .loading-wheel {
    margin: var(--spacing--xl);
  }

  .loading-ges {
    $margin-y: var(--spacing--xxxl);
    margin: $margin-y 0 $margin-y 0;
  }

  .detail-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .detail {
      overflow: auto;
      margin: var(--spacing--md);
      margin-right: 0;
      padding-top: var(--spacing--xxl);
      box-shadow: var(--box-shadow--md);
      &.request {
        padding-left: 1em;
        padding-right: 1em;
      }
    }
  }
</style>