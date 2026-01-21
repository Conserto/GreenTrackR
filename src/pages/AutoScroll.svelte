<script lang="ts">
  import { browser } from 'wxt/browser';
  import { tick } from 'svelte';
  import { ButtonTypeEnum, RequestAction, ScrollInputType } from 'src/enum';
  import {
    cleanCache,
    getLocalStorageObject,
    getTabId,
    logDebug,
    logErr,
    logInfo,
    reloadCurrentTab,
    sendChromeMsg,
    sendMessageAndWait,
    setLocalStorageObject,
    toHistoFormattedDatas,
    translate
  } from 'src/utils';
  import { onDestroy, onMount } from 'svelte';
  import { MeasureAcquisition } from 'src/service/MeasureAcquisition.service';
  import { PAGE_HEIGHT } from 'src/const/action.const';
  import { SEARCH_AUTO } from 'src/const/key.const';
  import type { HistoData, Measure } from 'src/interface';
  import { savedScrollMeasures } from 'src/const';
  import { Button, LoadingWheel, Select } from 'src/components/html';
  import { Modal, ZoneSimulation } from 'src/components/page';
  import { GesResults, HistoricResults } from 'src/components/results';
  import { Histogram, ResDetailByCountry, ResDetailByType, Summary } from 'src/components/cards';

  enum TabType {
    ResultTab,
    HistoricTab,
    None,
  }

  let currentDisplayedTab = TabType.None;
  let showModal = false;

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

  let myTabId: number = 0;

  /**
   * Récupère la hauteur de page via sendMessageAndWait
   */
  const fetchPageHeight = async () => {
    logInfo('[AutoScroll] Fetching page height...');

    try {
      const response = await sendMessageAndWait<{
        pageHeight?: number;
        viewportHeight?: number;
        data?: {
          pageHeight?: number;
          viewportHeight?: number;
        };
      }>({ action: RequestAction.SEND_PAGE_HEIGHT });

      if (response) {
        const pageHeight = response.pageHeight ?? response.data?.pageHeight ?? 0;
        const viewHeight = response.viewportHeight ?? response.data?.viewportHeight ?? 0;

        if (pageHeight > 0) {
          totalPagePixels = pageHeight;
          viewportPixels = viewHeight;
          logInfo(`[AutoScroll] Page height fetched: ${totalPagePixels}x${viewportPixels}`);
        }
      }
    } catch (e) {
      logErr(`[AutoScroll] fetchPageHeight error: ${e}`);
    }
  };

  /**
   * Lance le scroll et attend la fin via délai
   */
  const handleAutoScroll = async () => {
    // Si on n'a pas encore la hauteur de page, la récupérer
    if (totalPagePixels === 0) {
      await fetchPageHeight();
    }

    // Reset et afficher loading
    currentMeasure = null;
    loading = true;
    currentDisplayedTab = TabType.None;

    // Force Svelte à mettre à jour le DOM pour afficher le loading
    await tick();

    let value: number;
    if (currentScrollType === ScrollInputType.PIXEL) {
      value = scrollValue;
    } else {
      const scrollableHeight = totalPagePixels - viewportPixels;
      value = (scrollableHeight * scrollValue) / 100;
    }

    logInfo(`[AutoScroll] Scroll to: ${value}px (${scrollValue}%)`);

    // Envoie la commande de scroll
    sendChromeMsg({ action: RequestAction.SCROLL_TO, value });

    // Attendre que le scroll se termine
    const estimatedTime = Math.max(1500, (value / 200) * 100 + 1000);
    logInfo(`[AutoScroll] Waiting ${estimatedTime}ms`);

    await new Promise(resolve => setTimeout(resolve, estimatedTime));

    // Faire la mesure
    logInfo('[AutoScroll] Starting measurement');
    try {
      await measureAcquisition.getNetworkMeasure(false);
      currentMeasure = await measureAcquisition.getGESMeasure(serverSearch, userSearch);
      histoDatas = toHistoFormattedDatas(currentMeasure);
      currentDisplayedTab = TabType.ResultTab;
      logInfo('[AutoScroll] Measurement complete');
    } catch (e) {
      logErr(`[AutoScroll] Measurement error: ${e}`);
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    myTabId = getTabId();
    logInfo(`[AutoScroll] onMount - tabId: ${myTabId}`);

    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    cleanCache();
    fetchPageHeight();
  });

  onDestroy(() => {});

  const handleCleanCache = () => {
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });
    cleanCache();
    currentDisplayedTab = TabType.None;
    currentMeasure = null;
    reloadCurrentTab();
  };

  const handleResetMeasure = () => {
    logInfo('[Reset] Nettoyage complet et remontée en haut...');

    // A. On dit au navigateur d'arrêter de mémoriser la position du scroll
    browser.devtools.inspectedWindow.eval("history.scrollRestoration = 'manual'");

    // B. On ordonne la remontée immédiate
    sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP });

    // C. On vide l'état de l'application
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
    histoDatas = [];
    cleanCache();
    measureAcquisition.applyLatest();

    // D. On recharge la page (ce qui appliquera le "manual" du point A)
    reloadCurrentTab();
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
    showModal = true;
  };

  const handleSimulation = async (event: any) => {
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    serverSearch = countryCodeSelected;
    userSearch = userCountryCodeSelected;
  };
</script>

<label for="scrollValue" class="input-label">
  {#if currentScrollType === ScrollInputType.PIXEL}
    {translate('autoscrollPxInput')}
  {:else}
    {translate('autoscrollPercentInput')}
  {/if}
</label>

<div class="flex-center input-container">
  <input type="number" name="scrollValue" class="generic-input" id="scrollValue" bind:value={scrollValue} />
  <label for="scroll-value" class="visually-hidden">{translate("unitLabel")}</label>
  <Select bind:selectedValue={currentScrollType} selectValues={scrollTypes} name="scroll-value" />
</div>

<div class="flex-center buttons-container">
  <Button
    disabled={!scrollValue || loading}
    on:buttonClick={handleAutoScroll}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'launchAnalysisButtonWithAutoScrollButton'}
  />
  <Button
    on:buttonClick={onSaveCurrentMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="saveAnalysisButton"
    disabled={!currentMeasure}
  />
  <Button
    on:buttonClick={() => (currentDisplayedTab = TabType.HistoricTab)}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="viewHistoryButton"
  />
  <Button
    on:buttonClick={handleCleanCache}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
  />
  <Button
    on:buttonClick={handleResetMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="resetMeasure"
  />
  <Button
    on:buttonClick={handleRefresh}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="refresh"
  />
  <Button
    on:buttonClick={() => sendChromeMsg({ action: RequestAction.SCROLL_TO_TOP })}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="backToTop"
  />
</div>
<p class="info-mix">{translate('infoMix')}</p>
<ZoneSimulation on:submitSimulation={handleSimulation} />

<!-- Loading affiché quand loading=true -->
{#if loading}
  <LoadingWheel />
{:else if currentDisplayedTab === TabType.ResultTab && currentMeasure}
  <GesResults measure={currentMeasure} caption="gesEquivalentCaption" />
  <div class="detail-container">
    {#if currentMeasure?.complete}
      <div class="detail summary">
        <Summary
          measure={currentMeasure}
          captionKey="resSumCaption"
        />
      </div>
      <div class="detail request">
        <ResDetailByType
          measure={currentMeasure}
          caption={translate("resDetCaption")}
          description={translate("resDetCaptionDescription")}
        />
      </div>
      <div class="detail histo">
        <Histogram
          datas={histoDatas}
          chartLabel="barChartGES"
          yLabel="greenhouseGasesEmissionDefault"
          yLabel2="energyDefault"
        />
      </div>
      <div class="detail request">
        <ResDetailByCountry
          measure={currentMeasure}
          captionKey="resDetCountCaption"
        />
      </div>
    {/if}
  </div>
{:else if currentDisplayedTab === TabType.HistoricTab}
  <HistoricResults saveName="{savedScrollMeasures}" bind:updateHistory={updateHistoryTab} />
{/if}

<Modal dialogLabelKey="saveAnalysisTitle" bind:showModal>
  <h2>{translate('saveAnalysis')}</h2>
  <Button
    on:buttonClick={() => (showModal = false)}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey="closePopup"
  />
</Modal>

<style lang="scss">
  .input-label {
    text-align: center;
  }

  .input-container {
    margin-bottom: var(--spacing--xl);
  }

  .detail-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .detail {
      overflow: auto;
      margin: var(--spacing--md);
      margin-right: 0;
      padding-top: var(--spacing--xxl);
      box-shadow: var(--box-shadow--md);

      &.request {
        padding-left: 1em;
        padding-right: 1em;
      }
    }
  }

  .buttons-container {
    margin-bottom: var(--spacing--xl);
  }
</style>