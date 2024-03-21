<script lang="ts">
  import { Button, LoadingWheel } from 'src/components';
  import { ButtonTypeEnum, RequestAction } from 'src/enum';
  import { CheckIcon } from 'src/assets/icons';
  import { translate, translateDescription } from 'src/utils/utils';
  import type { Measure } from 'src/interface';
  import { JourneyResults } from 'src/components/GES/results';
  import { cleanCache, reloadCurrentTab, sendChromeMsg } from 'src/utils/chrome.utils';
  import { MeasureAcquisition } from 'src//service/MeasureAcquisition.service';
  import { logInfo } from '../utils/log';
  import { SEARCH_AUTO } from '../const/key.const';
  import { Tooltip } from 'flowbite-svelte';

  let onGoingAnalysis = false;
  let measureAcquisition = new MeasureAcquisition();

  let results: Measure[] = [];

  const handleAnalysis = () => {
    onGoingAnalysis = !onGoingAnalysis;
    if (onGoingAnalysis) {
      logInfo('onCompleted add');
      chrome.runtime.onMessage.addListener(handleRuntimeMsg);
      measureAcquisition.applyLatest();
      reloadCurrentTab();
      chrome.webNavigation.onCompleted.addListener(onPageLoaded);
    } else {
      logInfo('onCompleted remove');
      chrome.runtime.onMessage.removeListener(handleRuntimeMsg);
      chrome.webNavigation.onCompleted.removeListener(onPageLoaded);
    }
  };

  const handleRuntimeMsg = async (message: any) => {
    if (message.saveAnalysis) {
      await onActionSave(message.component);
    }
  };

  const handleClearCache = async () => {
    cleanCache();
  };

  const resetUserJourney = () => {
    results = [];
    cleanCache();
  };

  /**
   * Called when the page document is fully loaded
   */
  const onPageLoaded = () => {
    logInfo('Page Loaded');
    onActionSave();
    sendChromeMsg({ action: RequestAction.LISTEN_EVENT });
  };

  const onActionSave = async (component?: string) => {
    logInfo('Save ' + component);
    await measureAcquisition.getNetworkMeasure(false);
    const measure = await measureAcquisition.getGESMeasure(SEARCH_AUTO, SEARCH_AUTO);
    if (component) {
      measure.url += ` (${component})`;
    }
    if (measure) {
      results = [...results, measure];
    }
    measureAcquisition.applyLatest();
  };
</script>

<div class="flex-center">
  <Button
    on:buttonClick={handleAnalysis}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={onGoingAnalysis ? 'stopJourneyButton' : 'startJourneyButton'}
  />
  <Tooltip>{translateDescription(onGoingAnalysis ? 'stopJourneyButton' : 'startJourneyButton')}</Tooltip>
  <Button
    disabled={onGoingAnalysis}
    on:buttonClick={resetUserJourney}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetJourneyButton"
  />
  <Tooltip>{translateDescription('resetJourneyButton')}</Tooltip>
  <Button
    on:buttonClick={handleClearCache}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
  />
  <Tooltip>{translateDescription('clearBrowserCacheButton')}</Tooltip>
</div>

{#if onGoingAnalysis}
  <LoadingWheel />
  <p class="in-progress-text">{translate('analysisInProgress')}</p>

  {#if results.length}
    <div class="flex-center">
      <CheckIcon />
      <p>{translate('receivedResults')}</p>
    </div>
  {/if}
{/if}
{#if results.length && !onGoingAnalysis}
  <JourneyResults measures={results} />
{/if}

<style lang="scss">
  .in-progress-text {
    text-align: center;
  }
</style>
