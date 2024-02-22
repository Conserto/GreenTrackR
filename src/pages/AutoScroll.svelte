<script lang="ts">
  import { Button, LoadingWheel, Input, Select } from 'src/components';
  import { ButtonTypeEnum, InputTypeEnum, RequestAction, ScrollInputType } from 'src/enum';
  import { cleanCache, sendChromeMsg } from 'src/utils/chrome.utils';
  import { toHistoFormattedDatas, translate } from 'src/utils/utils';
  import { onDestroy, onMount } from 'svelte';
  import { MeasureAcquisition } from 'src/utils/classes/MeasureAcquisition';
  import Histogram from 'src/components/Histogram.svelte';
  import GesResults from 'src/components/GES/results/GesResults.svelte';

  const scrollTypes = [
    { label: 'Px', value: ScrollInputType.PIXEL },
    { label: '%', value: ScrollInputType.PERCENT },
  ];
  let currentScrollType = ScrollInputType.PERCENT;
  let scrollValue = 10;
  let viewportPixels = 0;
  let totalPagePixels = 0;

  let loading = false;
  let measureAcquisition = new MeasureAcquisition();
  let currentMeasure: Measure = null;
  let histoDatas: HistoData[] = [];

  onMount(() => {
    chrome.runtime.onMessage.addListener(handleRuntimeMsg);
    sendChromeMsg({ action: RequestAction.SEND_PAGE_HEIGHT });
  });

  onDestroy(() => {
    chrome.runtime.onMessage.removeListener(handleRuntimeMsg);
  });

  const handleRuntimeMsg = async (message) => {
    if (message.type === 'pageHeight') {
      totalPagePixels = message.totalHeight;
      viewportPixels = message.viewportHeight;
    } else if (message.autoScrollDone) {
      loading = true;
      await measureAcquisition.getNetworkMeasure(false);
      currentMeasure = await measureAcquisition.getGESMeasure('auto', 'auto');
      loading = false;
      histoDatas = toHistoFormattedDatas(currentMeasure);
    }
  };

  const handleAutoScroll = () => {
    loading = false;
    const value =
      currentScrollType === ScrollInputType.PIXEL
        ? scrollValue
        : ((totalPagePixels - viewportPixels) * scrollValue) / 100;
    sendChromeMsg({ action: RequestAction.SCROLL_TO, value });
  };

  const handleResetData = () => {
    cleanCache();
    currentMeasure = null;
  };
</script>

<p class="pixel-indicator">
  {`${translate('pixelDisplayed')} ${viewportPixels}px.`}
</p>
<p class="input-label">
  {#if currentScrollType === ScrollInputType.PIXEL}
    {translate('autoscrollPxInput')}
  {:else}
    {translate('autoscrollPercentInput')}
  {/if}
</p>

<div class="flex-center input-container">
  <Input type={InputTypeEnum.NUMBER} name="scrollValue" bind:value={scrollValue} />
  <Select bind:selectedValue={currentScrollType} selectValues={scrollTypes} />
</div>

<div class="flex-center buttons-container">
  <Button
    disabled={!scrollValue}
    on:buttonClick={handleAutoScroll}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'launchAnalysisButtonWithAutoScrollButton'}
  />
  <Button
    on:buttonClick={handleResetData}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetDataResultButton"
  />
  <Button
    on:buttonClick={() => sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP })}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="backToTop"
  />
</div>

{#if currentMeasure && !loading}
  <GesResults measure={currentMeasure} />
  <div class="histo-container">
    <Histogram datas={histoDatas} yLabel="greenhouseGasesEmissionDefault" yLabel2="energyDefault" />
  </div>
{/if}
{#if loading === true}
  <LoadingWheel />
{/if}

<style lang="scss">
  .pixel-indicator {
    font-style: italic;
    font-weight: bold;
    text-align: center;
    margin: var(--spacing--md) 0;
  }
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
