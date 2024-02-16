<script lang="ts">
  import { Button, LoadingWheel, Input, Select } from 'src/components';
  import { ButtonTypeEnum, InputTypeEnum, ScrollInputType } from 'src/enum';
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
  const viewportPixels = window.innerHeight;
  let totalPagePixels = 0;

  let loading = false;
  let measureAcquisition = new MeasureAcquisition();
  let currentMeasure: Measure = null;
  let histoDatas: HistoData[] = [];

  onMount(() => {
    chrome.runtime.onMessage.addListener(handleRuntimeMsg);
    sendChromeMsg({ action: 'sendPageHeight' });
  });

  onDestroy(() => {
    chrome.runtime.onMessage.removeListener(handleRuntimeMsg);
  });

  const handleRuntimeMsg = async (message) => {
    if (message.type === 'pageHeight') {
      totalPagePixels = message.height;
    } else if (message.autoScrollDone) {
      loading = true;
      await measureAcquisition.getNetworkMeasure();
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
    sendChromeMsg({ action: 'scrollTo', value });
  };

  const handleResetData = () => {
    cleanCache();
    currentMeasure = null;
  };
</script>

<div class="tab-panel" role="tabpanel" aria-labelledby="User journey tab">
  <div class="flex-center">
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
      on:buttonClick={() => sendChromeMsg({ action: 'scrollToTop' })}
      buttonType={ButtonTypeEnum.SECONDARY}
      translateKey="backToTop"
    />
  </div>
  <p class="pixel-indicator">{`${translate('pixelDisplayed')} ${viewportPixels}px`}</p>
  <p class="pixel-indicator">
    {translate('autoscrollPxInput')}
    <!-- {translate("autoscrollPercentInput")}  -->
  </p>

  <div class="flex-center input-container">
    <Input type={InputTypeEnum.NUMBER} name="scrollValue" bind:value={scrollValue} />
    <Select bind:selectedValue={currentScrollType} selectValues={scrollTypes} />
  </div>

  {#if currentMeasure && !loading}
    <GesResults measure={currentMeasure} />
    <div class="histo-container">
      <Histogram datas={histoDatas} yLabel="greenhouseGasesEmissionDefault" />
    </div>
  {:else if loading === true}
    <div class="loading-wheel">
      <LoadingWheel />
    </div>
  {/if}
</div>

<style lang="scss">
  .pixel-indicator {
    font-style: italic;
    font-weight: bold;
    text-align: center;
    margin: 1em 0 0 0;
  }
  .input-container {
    margin-bottom: var(--spacing--xl);
  }
  .loading-wheel {
    margin: var(--spacing--xl);
  }
  .histo-container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
  }
</style>
