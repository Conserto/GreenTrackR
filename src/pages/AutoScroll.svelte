<script lang="ts">
  import { Button, Input, LoadingWheel, Select } from 'src/components';
  import { ButtonTypeEnum, InputTypeEnum, RequestAction, ScrollInputType } from 'src/enum';
  import { cleanCache, reloadCurrentTab, sendChromeMsg } from 'src/utils/chrome.utils';
  import { toHistoFormattedDatas, translate } from 'src/utils/utils';
  import { onDestroy, onMount } from 'svelte';
  import { MeasureAcquisition } from 'src//service/MeasureAcquisition.service';
  import Histogram from 'src/components/Histogram.svelte';
  import GesResults from 'src/components/GES/results/GesResults.svelte';
  import { PAGE_HEIGHT } from '../const/action.const';
  import { SEARCH_AUTO } from '../const/key.const';
  import type { HistoData, Measure } from '../interface';
  import { ZoneSimulation } from '../components/GES';

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
    currentMeasure = null;
  };

  const handleResetMeasure = () => {
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    currentMeasure = null;
    cleanCache();
    measureAcquisition.applyLatest();
  };

  const handleRefresh = () => {
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    currentMeasure = null;
    reloadCurrentTab();
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
