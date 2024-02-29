<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import { HistoricResults, GesResults } from 'src/components/GES/results';
  import { Button, Modal, LoadingWheel, Histogram } from 'src/components';
  import { ZoneSimulation } from 'src/components/GES';
  import {
    formatNumber,
    getLocalStorageObject,
    setLocalStorageObject,
    toHistoFormattedDatas,
    translate,
  } from 'src/utils/utils';
  import { savedMeasures } from 'src/const';
  import { cleanCache } from 'src/utils/chrome.utils';
  import { MeasureAcquisition } from 'src/utils/service/MeasureAcquisition.service';

  enum TabType {
    ResultTab,
    HistoricTab,
    None,
  }

  let currentDisplayedTab = TabType.None;
  let showPopUp = false;

  let loading = false;
  let loadGes = false;
  let measureAcquisition = new MeasureAcquisition();
  let currentMeasure: Measure = null;
  let histoDatas: HistoData[] = [];

  const onResetMeasure = () => {
    currentMeasure = null;
    currentDisplayedTab = TabType.None;
    cleanCache();
  };

  const onSaveCurrentMeasure = () => {
    const lsMeasures = getLocalStorageObject(savedMeasures);
    setLocalStorageObject(
      savedMeasures,
      lsMeasures ? [...lsMeasures, currentMeasure] : [currentMeasure],
    );
    showPopUp = true;
  };

  const handleRunAnalysis = async () => {
    currentDisplayedTab = TabType.ResultTab;
    loading = true;
    await measureAcquisition.getNetworkMeasure();
    currentMeasure = await measureAcquisition.getGESMeasure('auto', 'auto');

    loading = false;
    histoDatas = toHistoFormattedDatas(currentMeasure);
  };

  const handleSimulation = async (event) => {
    loadGes = true;
    const { countryCodeSelected, userCountryCodeSelected } = event.detail;
    await measureAcquisition.getNetworkMeasure();
    currentMeasure = await measureAcquisition.getGESMeasure(
      countryCodeSelected,
      userCountryCodeSelected,
    );
    histoDatas = toHistoFormattedDatas(currentMeasure);
    loadGes = false;
  };
</script>

<div class="flex-center">
  <Button
    on:buttonClick={handleRunAnalysis}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey={'launchAnalysisButton'}
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
    on:buttonClick={onResetMeasure}
    buttonType={ButtonTypeEnum.SECONDARY}
    translateKey="clearBrowserCacheButton"
    disabled={!currentMeasure}
  />
</div>
<div class="flex-column-center">
  {#if currentDisplayedTab === TabType.ResultTab}
    {#if currentMeasure && !loading}
      <GesResults measure={currentMeasure} />
      <ZoneSimulation on:submitSimulation={handleSimulation} />
      <div class="histo-container">
        {#if loadGes}
          <div class="loading-ges">
            <LoadingWheel />
          </div>
        {:else}
          <Histogram
            datas={histoDatas}
            yLabel="greenhouseGasesEmissionDefault"
            yLabel2="energyDefault"
          />
        {/if}
      </div>
    {:else if loading === true}
      <div class="loading-wheel">
        <LoadingWheel />
      </div>
    {/if}
  {:else if currentDisplayedTab === TabType.HistoricTab}
    <HistoricResults />
  {/if}
</div>
{#if showPopUp}
  <Modal>
    <div class="modal">
      <h2>{translate('saveAnalysis')}</h2>
      <Button
        on:buttonClick={() => (showPopUp = false)}
        buttonType={ButtonTypeEnum.PRIMARY}
        translateKey="closePopup"
      />
    </div>
  </Modal>
{/if}

<style lang="scss">
  .modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .loading-wheel {
    margin: var(--spacing--xl);
  }
  .loading-ges {
    $margin-y: var(--spacing--xxxl);
    margin: $margin-y 0 $margin-y 0;
  }
  .histo-container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
  }
</style>
