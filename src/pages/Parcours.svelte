<script lang="ts">
  import { browser } from 'wxt/browser';
  import { ButtonTypeEnum, RequestAction } from 'src/enum';
  import { CheckIcon } from 'src/assets/icons';
  import { cleanCache, logDebug, reloadCurrentTab, sendChromeMsg, translate } from 'src/utils';
  import type { Measure } from 'src/interface';
  import { MeasureAcquisition } from 'src/service/MeasureAcquisition.service';
  import { SEARCH_AUTO } from 'src/const/key.const';
  import { Button, LoadingWheel } from 'src/components/html';
  import { ZoneSimulation } from 'src/components/page';
  import { JourneyResults } from 'src/components/results';
  import { onDestroy } from 'svelte';

  // State management
  export let unavailable = false;
  let onGoingAnalysis = false;
  let measureAcquisition = new MeasureAcquisition();
  let serverSearch = SEARCH_AUTO;
  let userSearch = SEARCH_AUTO;
  let results: Measure[] = [];

  // Track last processed URL and component to avoid duplicate measurements
  let lastProcessedComponent = '';

  /**
   * Handler for runtime messages from content script
   * Processes saveAnalysis requests triggered by user interactions
   */
  const handleRuntimeMsg = async (message: any) => {
    if (message.saveAnalysis) {
      const component = message.component || 'page';
      const currentTime = Date.now();

      // ANTI-DUPLICATE: Prevent duplicate events within 500ms of same component
      // This handles cases where click/scroll events might fire multiple times
      if (component === lastProcessedComponent &&
        (currentTime - lastProcessedTime) < 500) {
        logDebug('Skipping duplicate ' + component + ' event');
        return;
      }

      lastProcessedComponent = component;
      lastProcessedTime = currentTime;

      await onActionSave(component);
    }
  };

  // Track last processed URL to avoid duplicate measurements
  let lastProcessedUrl = '';
  let lastProcessedTime = 0;

  /**
   * Handler for webNavigation.onCompleted events
   * Triggered when a page finishes loading
   * CRITICAL: Restarts recording after page reload since content script resets
   *
   * @param details - Navigation details (tabId, frameId, url)
   */
  const onPageLoaded = (details?: { tabId?: number; frameId?: number; url?: string }) => {
    // Only process main frame (frameId === 0) if details provided
    if (details && details.frameId !== 0) {
      return;
    }

    logDebug('Page Loaded' + (details?.url ? ': ' + details.url : ''));

    // CRITICAL FIX: Restart recording after page reload
    // The content script is reloaded with isRecording = false by default
    // We must explicitly send START_RECORDING to continue tracking
    if (onGoingAnalysis) {
      logDebug('Restarting recording after page reload');
      sendChromeMsg({ action: 'START_RECORDING' });
    }

    // ANTI-DUPLICATE: Only save if URL changed or enough time passed (>1 second)
    // This prevents duplicate measurements from multiple navigation events
    const currentUrl = details?.url || '';
    const currentTime = Date.now();
    const timeDiff = currentTime - lastProcessedTime;

    if (currentUrl !== lastProcessedUrl || timeDiff > 1000) {
      lastProcessedUrl = currentUrl;
      lastProcessedTime = currentTime;

      // Save measurement for the newly loaded page
      onActionSave();
    } else {
      logDebug('Skipping duplicate page load event');
    }
  };

  /**
   * Callback wrapper for DevTools network navigation listener
   * @param url - The URL that was navigated to
   */
  const onPageLoadedCallback = (url: string) => onPageLoaded({ frameId: 0, url });

  /**
   * Toggle analysis on/off
   * Manages the complete lifecycle of the recording session
   */
  const handleAnalysis = async () => {
    onGoingAnalysis = !onGoingAnalysis;

    if (onGoingAnalysis) {
      logDebug('Analysis Started - Setting up listeners');

      // Reset duplicate detection trackers
      lastProcessedUrl = '';
      lastProcessedTime = 0;
      lastProcessedComponent = '';

      // 1. Add message listener immediately to catch all events
      browser.runtime.onMessage.addListener(handleRuntimeMsg);

      // 2. Setup navigation listeners
      // Priority: webNavigation API (standard) > DevTools network API (fallback)
      if (browser.webNavigation?.onCompleted) {
        // Firefox & Chrome - Standard API
        browser.webNavigation.onCompleted.addListener(onPageLoaded);
      } else if (browser.devtools?.network?.onNavigated) {
        // DevTools fallback for environments without webNavigation
        browser.devtools.network.onNavigated.addListener(onPageLoadedCallback);
      }

      // 3. Apply latest measurement settings
      measureAcquisition.applyLatest();

      // 4. Reload the current tab to start fresh
      // This ensures content script is loaded and ready
      // After reload, onPageLoaded will trigger and send START_RECORDING
      await reloadCurrentTab();

    } else {
      logDebug('Analysis Stopped - Cleaning up');

      // 1. Stop recording in content script immediately
      sendChromeMsg({ action: 'STOP_RECORDING' });

      // 2. Remove runtime message listener
      browser.runtime.onMessage.removeListener(handleRuntimeMsg);

      // 3. Remove navigation listeners
      if (browser.webNavigation?.onCompleted) {
        browser.webNavigation.onCompleted.removeListener(onPageLoaded);
      }
      // Note: DevTools network listener cannot be easily removed
      // but STOP_RECORDING ensures no data is collected
    }
  };

  /**
   * Clear browser cache
   * Removes cached resources to ensure accurate measurements
   */
  const handleClearCache = () => {
    cleanCache();
  };

  /**
   * Reset the user journey
   * Clears all collected measurements and cache
   */
  const resetUserJourney = () => {
    results = [];
    cleanCache();
  };

  /**
   * Save measurement data
   * Collects network and GES (greenhouse gas emissions) metrics
   *
   * @param component - Optional component identifier (scroll, click, etc.)
   */
  const onActionSave = async (component?: string) => {
    const receive = document.querySelector<HTMLElement>('.received');
    if (receive) {
      receive.style.display = '';
    }

    logDebug('Save ' + (component || 'page'));

    // Collect network measurements
    await measureAcquisition.getNetworkMeasure(false);

    // Calculate GES (environmental impact) measurements
    const measure = await measureAcquisition.getGESMeasure(serverSearch, userSearch);

    // Tag measurement with action type if provided
    if (component) {
      measure.action = component;
    }

    // Add measurement to results
    if (measure) {
      results = [...results, measure];
    }

    // Show feedback to user
    if (receive) {
      receive.style.display = 'block';
    }

    // Apply latest settings for next measurement
    measureAcquisition.applyLatest();
  };

  /**
   * Handle simulation settings change
   * Updates server and user location for carbon intensity calculations
   *
   * @param event - Custom event containing country code selections
   */
  const handleSimulation = async (event: CustomEvent<{
    countryCodeSelected: string;
    userCountryCodeSelected: string;
  }>) => {
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    serverSearch = countryCodeSelected;
    userSearch = userCountryCodeSelected;
  };

  /**
   * Cleanup on component destroy
   * Ensures all listeners are properly removed
   */
  onDestroy(() => {
    if (onGoingAnalysis) {
      browser.runtime.onMessage.removeListener(handleRuntimeMsg);
      if (browser.webNavigation?.onCompleted) {
        browser.webNavigation.onCompleted.removeListener(onPageLoaded);
      }
    }
  });
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
  <div class="flex-center received">
    <CheckIcon />
    <p>{translate('receivedResults')}</p>
  </div>
{/if}

{#if results.length && !onGoingAnalysis}
  <JourneyResults measures={results} />
{/if}

<style lang="scss">
  div.received {
    display: none;
  }
  .in-progress-text {
    text-align: center;
  }
</style>