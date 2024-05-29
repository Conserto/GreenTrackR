<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import { GesResults, HistoricResults } from 'src/components/GES/results';
  import { Button, Histogram, LoadingWheel, Modal, ResDetail } from 'src/components';
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
  let showModal = false;

  let loading = false;
  let loadGes = false;
  let measureAcquisition = new MeasureAcquisition();
  let currentMeasure: Measure | null;
  let histoDatas: HistoData[] = [];

  let serverSearch = SEARCH_AUTO;
  let userSearch = SEARCH_AUTO;
  let updateHistoryTab: any;

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
    showModal = true;
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
<ZoneSimulation on:submitSimulation={handleSimulation} />
{#if currentDisplayedTab === TabType.ResultTab}
  {#if currentMeasure && !loading}
    <GesResults measure={currentMeasure} />
    <div class="detail-container">
      {#if loadGes}
        <div class="loading-ges">
          <LoadingWheel />
        </div>
      {:else if currentMeasure?.complete}
        <div class="detail request">
          <ResDetail
            datas={currentMeasure.networkMeasure}
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
