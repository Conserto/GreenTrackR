<script lang="ts">
  import { ButtonTypeEnum, RequestAction } from 'src/enum';
  import { CheckIcon } from 'src/assets/icons';
  import { cleanCache, logDebug, reloadCurrentTab, sendChromeMsg, translate } from 'src/utils';
  import type { Measure } from 'src/interface';
  import { MeasureAcquisition } from 'src/service/MeasureAcquisition.service';
  import { SEARCH_AUTO } from 'src/const/key.const';
  import { Button, LoadingWheel } from 'src/components/html';
  import { ZoneSimulation } from 'src/components/page';
  import { JourneyResults } from 'src/components/results';

  let onGoingAnalysis = false;
  let measureAcquisition = new MeasureAcquisition();
  let serverSearch = SEARCH_AUTO;
  let userSearch = SEARCH_AUTO;

  let results: Measure[] = [];

  const handleAnalysis = () => {
    onGoingAnalysis = !onGoingAnalysis;
    if (onGoingAnalysis) {
      logDebug('onCompleted add');
      chrome.runtime.onMessage.addListener(handleRuntimeMsg);
      measureAcquisition.applyLatest();
      reloadCurrentTab();
      chrome.webNavigation.onCompleted.addListener(onPageLoaded);
    } else {
      logDebug('onCompleted remove');
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
    logDebug('Page Loaded');
    onActionSave();
    sendChromeMsg({ action: RequestAction.LISTEN_EVENT });
  };

  const onActionSave = async (component?: string) => {
    logDebug('Save ' + component);
    await measureAcquisition.getNetworkMeasure(false);
    const measure = await measureAcquisition.getGESMeasure(serverSearch, userSearch);
    if (component) {
      measure.action = component;
    }
    if (measure) {
      results = [...results, measure];
    }
    measureAcquisition.applyLatest();
  };

  const handleSimulation = async (event: any) => {
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    serverSearch = countryCodeSelected;
    userSearch = userCountryCodeSelected;
  };
</script>

<div class="flex-center">
  <Button
    on:buttonClick={handleAnalysis}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={onGoingAnalysis ? 'stopJourneyButton' : 'startJourneyButton'}
  />

  <Button
    disabled={onGoingAnalysis}
    on:buttonClick={resetUserJourney}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetJourneyButton"
  />
  <Button
    on:buttonClick={handleClearCache}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
  />
</div>
<p class="info-mix">{translate('infoMix')}</p>
<ZoneSimulation on:submitSimulation={handleSimulation} />

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
