<script lang="ts">
  import { Button, LoadingWheel, Modal, ResDetail, Select } from 'src/components';
  import { ButtonTypeEnum, RequestAction, ScrollInputType } from 'src/enum';
  import { cleanCache, reloadCurrentTab, sendChromeMsg } from 'src/utils/chrome.utils';
  import { getLocalStorageObject, setLocalStorageObject, toHistoFormattedDatas, translate } from 'src/utils/utils';
  import { onDestroy, onMount } from 'svelte';
  import { MeasureAcquisition } from 'src//service/MeasureAcquisition.service';
  import Histogram from 'src/components/Histogram.svelte';
  import GesResults from 'src/components/GES/results/GesResults.svelte';
  import { PAGE_HEIGHT } from '../const/action.const';
  import { SEARCH_AUTO } from '../const/key.const';
  import type { HistoData, Measure } from '../interface';
  import { OtherEquivalent, ZoneSimulation } from '../components/GES';
  import { HistoricResults } from '../components/GES/results';
  import { savedScrollMeasures } from '../const';

  enum TabType {
    ResultTab,
    HistoricTab,
    None,
  }

  let currentDisplayedTab = TabType.None;
  let showModal = false;

  const scrollTypes = [
    { label: 'Px', value: ScrollInputType.PIXEL },
    { label: '%', value: ScrollInputType.PERCENT }
  ];
  let currentScrollType = ScrollInputType.PERCENT;
  let scrollValue = 100;
  let viewportPixels = 0;
  let totalPagePixels = 0;
  let serverSearch = SEARCH_AUTO;
  let userSearch = SEARCH_AUTO;
  let updateHistoryTab: any;

  let loading = false;
  let measureAcquisition = new MeasureAcquisition();
  let currentMeasure: Measure | null;
  let histoDatas: HistoData[] = [];

  onMount(() => {
    chrome.runtime.onMessage.addListener(handleRuntimeMsg);
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    cleanCache();
    sendChromeMsg({ action: RequestAction.SEND_PAGE_HEIGHT });
  });

  onDestroy(() => {
    chrome.runtime.onMessage.removeListener(handleRuntimeMsg);
  });

  const handleRuntimeMsg = async (message: any) => {
    if (message.type === PAGE_HEIGHT) {
      totalPagePixels = message.totalHeight;
      viewportPixels = message.viewportHeight;
    } else if (message.autoScrollDone) {
      loading = true;
      await measureAcquisition.getNetworkMeasure(false);
      currentMeasure = await measureAcquisition.getGESMeasure(serverSearch, userSearch);
      loading = false;
      histoDatas = toHistoFormattedDatas(currentMeasure);
      currentDisplayedTab = TabType.ResultTab;
    }
  };

  const handleAutoScroll = () => {
    currentMeasure = null;
    loading = true;
    const value =
      currentScrollType === ScrollInputType.PIXEL
        ? scrollValue
        : ((totalPagePixels - viewportPixels) * scrollValue) / 100;
    sendChromeMsg({ action: RequestAction.SCROLL_TO, value });
  };

  const handleCleanCache = () => {
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    cleanCache();
    currentDisplayedTab = TabType.None;
    currentMeasure = null;
  };

  const handleResetMeasure = () => {
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
    cleanCache();
    measureAcquisition.applyLatest();
  };

  const handleRefresh = () => {
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
    reloadCurrentTab();
  };

  const onSaveCurrentMeasure = () => {
    const lsMeasures = getLocalStorageObject(savedScrollMeasures);
    setLocalStorageObject(
      savedScrollMeasures,
      lsMeasures ? [...lsMeasures, currentMeasure] : [currentMeasure]
    );
    if (currentDisplayedTab === TabType.HistoricTab) {
      updateHistoryTab();
    }
    showModal = true;
  };

  const handleSimulation = async (event: any) => {
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    serverSearch = countryCodeSelected;
    userSearch = userCountryCodeSelected;
  };
</script>

<label for="scrollValue" class="input-label">
  {#if currentScrollType === ScrollInputType.PIXEL}
    {translate('autoscrollPxInput')}
  {:else}
    {translate('autoscrollPercentInput')}
  {/if}
</label>

<div class="flex-center input-container">
  <input type="number" name="scrollValue" class="generic-input" id="scrollValue" bind:value={scrollValue} />
  <label for="scroll-value" class="visually-hidden">{translate("unitLabel")}</label>
  <Select bind:selectedValue={currentScrollType} selectValues={scrollTypes} name="scroll-value" />
</div>

<div class="flex-center buttons-container">
  <Button
    disabled={!scrollValue}
    on:buttonClick={handleAutoScroll}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'launchAnalysisButtonWithAutoScrollButton'}
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
    on:buttonClick={handleCleanCache}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
  />
  <Button
    on:buttonClick={handleResetMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetMeasure"
  />
  <Button
    on:buttonClick={handleRefresh}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="refresh"
  />
  <Button
    on:buttonClick={() => sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP })}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="backToTop"
  />
</div>
<p class="info-mix">{translate('infoMix')}</p>
<ZoneSimulation on:submitSimulation={handleSimulation} />
{#if currentDisplayedTab === TabType.ResultTab}
  {#if currentMeasure && !loading}
    <GesResults measure={currentMeasure} caption="gesEquivalentCaption" />
    <div class="detail-container">
      {#if currentMeasure?.complete}
        <div class="detail other">
          <OtherEquivalent
            measure={currentMeasure}
            caption={translate("othEquivalentCaption")}
          />
        </div>
        <div class="detail request">
          <ResDetail
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
      {/if}
    </div>
  {/if}
  {#if loading === true}
    <LoadingWheel />
  {/if}
{:else if currentDisplayedTab === TabType.HistoricTab}
  <HistoricResults saveName="{savedScrollMeasures}" bind:updateHistory={updateHistoryTab} />
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

  .input-label {
    text-align: center;
  }

  .input-container {
    margin-bottom: var(--spacing--xl);
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

  .buttons-container {
    margin-bottom: var(--spacing--xl);
  }
</style>
