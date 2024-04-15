<script lang="ts">
  import { Button, Input, LoadingWheel, Modal, Select } from 'src/components';
  import { ButtonTypeEnum, InputTypeEnum, RequestAction, ScrollInputType } from 'src/enum';
  import { cleanCache, reloadCurrentTab, sendChromeMsg } from 'src/utils/chrome.utils';
  import { getLocalStorageObject, setLocalStorageObject, toHistoFormattedDatas, translate } from 'src/utils/utils';
  import { onDestroy, onMount } from 'svelte';
  import { MeasureAcquisition } from 'src//service/MeasureAcquisition.service';
  import Histogram from 'src/components/Histogram.svelte';
  import GesResults from 'src/components/GES/results/GesResults.svelte';
  import { PAGE_HEIGHT } from '../const/action.const';
  import { SEARCH_AUTO } from '../const/key.const';
  import type { HistoData, Measure } from '../interface';
  import { ZoneSimulation } from '../components/GES';
  import { HistoricResults } from '../components/GES/results';
  import { savedScrollMeasures } from '../const';

  enum TabType {
    ResultTab,
    HistoricTab,
    None,
  }

  let currentDisplayedTab = TabType.None;
  let showPopUp = false;

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
    showPopUp = true;
  };

  const handleSimulation = async (event: any) => {
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    serverSearch = countryCodeSelected;
    userSearch = userCountryCodeSelected;
  };
</script>

<p class="input-label">
  {#if currentScrollType === ScrollInputType.PIXEL}
    {translate('autoscrollPxInput')}
  {:else}
    {translate('autoscrollPercentInput')}
  {/if}
</p>

<div class="flex-center input-container">
  <Input type={InputTypeEnum.NUMBER} name="scrollValue" bind:value={scrollValue} />
  <Select bind:selectedValue={currentScrollType} selectValues={scrollTypes} name="scroll-value" />
</div>

<div class="flex-center buttons-container">
  <Button
    disabled={!scrollValue}
    on:buttonClick={handleAutoScroll}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'launchAnalysisButtonWithAutoScrollButton'}
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
    on:buttonClick={handleCleanCache}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
    tooltip={true}
  />
  <Button
    on:buttonClick={handleResetMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetMeasure"
    tooltip={true}
  />
  <Button
    on:buttonClick={handleRefresh}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="refresh"
    tooltip={true}
  />
  <Button
    on:buttonClick={() => sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP })}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="backToTop"
    tooltip={true}
  />
</div>
<ZoneSimulation on:submitSimulation={handleSimulation} />
{#if currentDisplayedTab === TabType.ResultTab}
  {#if currentMeasure && !loading}
    <GesResults measure={currentMeasure} />
    <div class="histo-container">
      {#if currentMeasure?.complete}
        <Histogram datas={histoDatas} yLabel="greenhouseGasesEmissionDefault" yLabel2="energyDefault" />
      {/if}
    </div>
  {/if}
  {#if loading === true}
    <LoadingWheel />
  {/if}
{:else if currentDisplayedTab === TabType.HistoricTab}
  <HistoricResults saveName="{savedScrollMeasures}" bind:updateHistory={updateHistoryTab} />
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

  .input-label {
    text-align: center;
  }

  .input-container {
    margin-bottom: var(--spacing--xl);
  }

  .histo-container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
  }

  .buttons-container {
    margin-bottom: var(--spacing--xl);
  }
</style>
