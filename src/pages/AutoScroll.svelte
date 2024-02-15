<script lang="ts">
  import { Button, LoadingWheel } from 'src/components';
  import Results from 'src/components/GES/results/Results.svelte';
  import Input from 'src/components/Input.svelte';
  import Select from 'src/components/Select.svelte';
  import { ButtonTypeEnum, InputTypeEnum, ScrollInputType } from 'src/enum';
  import { sendChromeMsg, translate } from 'src/utils/utils';
  import { onDestroy, onMount } from 'svelte';

  const scrollTypes = [
    { label: 'Px', value: ScrollInputType.PIXEL },
    { label: '%', value: ScrollInputType.PERCENT },
  ];
  let currentScrollType = ScrollInputType.PERCENT;
  let displayResults = false;
  let scrollValue = 10;
  const viewportPixels = window.innerHeight;
  let totalPagePixels = 0;

  onMount(() => {
    chrome.runtime.onMessage.addListener(handleRuntimeMsg);
    sendChromeMsg({ action: 'sendPageHeight' });
  });

  onDestroy(() => {
    chrome.runtime.onMessage.removeListener(handleRuntimeMsg);
  });

  const handleResultDisplay = (visible: boolean) => {
    if (visible) {
      if (displayResults) {
        displayResults = false;
      }
      displayResults = visible;
    } else {
      displayResults = visible;
    }
  };

  const handleRuntimeMsg = (message) => {
    if (message.type === 'pageHeight') {
      totalPagePixels = message.height;
    } else if (message.autoScrollDone) {
      displayResults = true;
    }
  };

  const handleAutoScroll = () => {
    displayResults = false;
    const value =
      currentScrollType === ScrollInputType.PIXEL
        ? scrollValue
        : ((totalPagePixels - viewportPixels) * scrollValue) / 100;
    sendChromeMsg({ action: 'scrollTo', value });
  };
</script>

<div class="tab-panel" role="tabpanel" aria-labelledby="User journey tab">
  <div class="flex-center">
    <Button
      disabled={!scrollValue}
      on:buttonClick={() => handleAutoScroll()}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey={'launchAnalysisButtonWithAutoScrollButton'}
    />
    <Button
      on:buttonClick={() => (displayResults = false)}
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

  {#if displayResults}
    <Results forceRefresh={false} />
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
</style>
