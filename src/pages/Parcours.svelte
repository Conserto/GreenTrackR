<script lang="ts">
  import { Button, LoadingWheel } from 'src/components';
  import { ButtonTypeEnum } from 'src/enum';
  import { CheckIcon } from 'src/assets/icons';
  import { translate } from 'src/utils/utils';
  import { MeasureAcquisition } from 'src/utils/classes/MeasureAcquisition';
  import type { Measure } from 'src/interface';
  import { JourneyResults } from 'src/components/GES/results';
  import { cleanCache } from 'src/utils/chrome.utils';

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
    cleanCache();
  };

  /**
   * Called when the page document is fully loaded
   */
  const onPageLoaded = async (details) => {
    const measureAcquisition = new MeasureAcquisition();
    await measureAcquisition.getNetworkMeasure(false);
    const measure = await measureAcquisition.getGESMeasure('auto', 'auto');
    if (measure) {
      results = [...results, measure];
    }
  };
</script>

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

{#if onGoingAnalysis}
  <LoadingWheel />
  <p class="in-progress-text">{translate('analysisInProgress')}</p>

  {#if results.length}
    <div class="flex-center">
      <CheckIcon />
      <p>{translate('firstResults')}</p>
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
