<script lang="ts">
  import logo from '/icons/128.png';
  import { Button, LoadingWheel } from 'src/lib/share/atoms';
  import { Alert, Footer, EmptyContent } from 'src/lib/share';
  import { ButtonTypeEnum } from 'src/enum';
  import { CheckIcon } from 'src/assets/icons';
  import { translate } from 'src/utils/utils';
  import { MeasureAcquisition } from 'src/utils/classes/MeasureAcquisition';
  import type { Measure } from 'src/interface';
  import { JourneyResults } from 'src/lib/share/GES';

  let onGoingAnalysis = false;
  let resultsAvailable = false;

  let results: Measure[] = [];

  const handleAnalysis = () => {
    onGoingAnalysis = !onGoingAnalysis;
    if (onGoingAnalysis) {
      chrome.webNavigation.onCompleted.addListener(onPageLoaded);
    } else {
      chrome.webNavigation.onCompleted.removeListener(onPageLoaded);
    }
  };
  const resetUserJourney = () => {
    results = [];
  };

  /**
   * Called when the page document is fully loaded
   */
  const onPageLoaded = async (details) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!details.url || details.frameId !== 0 || details.tabId !== tabs[0].id) {
      return;
    }

    const measureAcquisition = new MeasureAcquisition();
    await measureAcquisition.getNetworkMeasure(false);
    const measure = await measureAcquisition.getGESMeasure('auto', 'auto');
    if (measure) {
      results = [...results, measure];
    }
  };
</script>

<div class="tab-panel" role="tabpanel" aria-labelledby="User journey tab">
  <img src={logo} alt="Logo green tracker" />
  <div class="flex-center">
    <Button
      on:buttonClick={handleAnalysis}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey={onGoingAnalysis ? 'stopJourneyButton' : 'launchAnalysisButton'}
    />
    <Button
      disabled={onGoingAnalysis}
      on:buttonClick={resetUserJourney}
      buttonType={ButtonTypeEnum.SECONDARY}
      translateKey="resetJourneyButton"
    />
  </div>
  <Alert message="betaMessage" />

  {#if onGoingAnalysis}
    <LoadingWheel />
    <p class="in-progress-text">{translate('analysisInProgress')}</p>

    {#if results.length}
      <div class="flex-center">
        <CheckIcon />
        <p>{translate('firstResults')}</p>
      </div>
    {/if}
  {:else}
    <EmptyContent isActive={true} />
  {/if}
  {#if results.length && !onGoingAnalysis}
    <JourneyResults measures={results} />
  {/if}
</div>
<Footer />

<style lang="scss">
  .tab-panel {
    height: 93%;
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
    margin: 0 var(--spacing--xl) 0 var(--spacing--xl);

    .in-progress-text {
      text-align: center;
    }
  }
</style>
