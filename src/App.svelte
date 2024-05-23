<script lang="ts">
  import logo from '/images/logo.png';
  import { AutoScroll, Evaluation, Parcours, Parameter } from 'src/pages';
  import { Alert, Tab, Footer, Button } from 'src/components';
  import { getLocalStorageObject, translate } from './utils';
  import { AlertTypeEnum, ButtonTypeEnum } from './enum';
  import { paramTokenCo2 } from './const';
  import { Modal } from './components';

  export let tabs = [
    {
      translateKey: 'tabEvaluation',
      name: translate('evaluationTab'),
      id: 'evaluation-tab',
      component: Evaluation,
      description: translate('evaluationTabDescription')
    },
    {
      translateKey: 'tabAutoScroll',
      name: translate('scrollAnalysisTab'),
      id: 'analysis-scroll-tab',
      component: AutoScroll,
      description: translate('scrollTabDescription'),
      beta: true,
    },
    {
      translateKey: 'tabJourney',
      name: translate('userJourneyTab'),
      id: 'journey-tab',
      component: Parcours,
      description: translate('userJourneyTabDescription'),
      beta: true,
    },
    {
      translateKey: 'tabParameter',
      name: translate('parameterTab'),
      id: 'parameter-tab',
      component: Parameter,
    },
  ];
  export let activeTabId = 'evaluation-tab';
  let showModal = false;
  function handleClick(event: CustomEvent) {
    activeTabId = event.detail.id;
  }
</script>

<header role="banner" class="flex-col-center">
  <img src={logo} alt="GreenTrackR Conserto" />
  {#if !getLocalStorageObject(paramTokenCo2)}
    <div>
      <Alert message="errorNoToken" alertType={AlertTypeEnum.ERROR} />
    </div>
  {/if}
  <div class="nav nav-tabs" id="myTab" role="tablist">
    {#each tabs as tab}
      <Tab
        on:clickTab={handleClick}
        isActive={activeTabId === tab.id}
        id={tab.id}
        name={tab.name}
        translateKey={tab.translateKey}
      />
    {/each}
  </div>
</header>

<main role="main" class="app-container">
  {#each tabs as tab}
    {#if activeTabId === tab.id}
      {#if activeTabId !== 'parameter-tab' }
        <h1 class="plugin-title">{translate('noContentPhraseEvaluation')}
          {#if tab.description}
            <button type="button" class="modaltrigger" on:click={() => (showModal = true)}><svg role="img" aria-label="{translate('globalInfo')}" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
            </svg></button>
          {/if}
        </h1>
        {#if tab.description}
          <Modal dialogLabelKey="globalInfo" bind:showModal cssClass="infos">
            {tab.description}
            <div><Button
              on:buttonClick={() => (showModal = false)}
              buttonType={ButtonTypeEnum.SECONDARY}
              translateKey="closePopup"
            /></div>
          </Modal>
        {/if}
      {/if}
      <div class="tab-panel" role="tabpanel" aria-label={`${tab.name}`}>

        {#if tab.beta}
          <Alert message="betaMessage"/>
        {/if}
        <svelte:component this={tab.component} />
      </div>
    {/if}
  {/each}
</main>
<Footer />

<style>
  .app-container {
    justify-content: start;
    margin: 0 var(--spacing--xl) 0 var(--spacing--xl);
  }

  .nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-left: 0;
    margin: 0;
    list-style: none;
  }

  .tab-panel {
    text-align: center;
  }

  .plugin-title {
    font-size: var(--font-size--xxl);
    color: var(--color--green);
    text-align: center;
  }
  .modaltrigger {
      background-color: unset;
      border-color: transparent;
  }
</style>
