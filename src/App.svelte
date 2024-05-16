<script lang="ts">
  import logo from '/images/logo.png';
  import { AutoScroll, Evaluation, Parcours, Parameter } from 'src/pages';
  import { Alert, Tab, Footer } from 'src/components';
  import { getLocalStorageObject, translate } from './utils';
  import { AlertTypeEnum } from './enum';
  import { paramTokenCo2 } from './const';

  export let tabs = [
    {
      translateKey: 'tabEvaluation',
      name: 'Evaluation',
      id: 'evaluation-tab',
      component: Evaluation,
    },
    {
      translateKey: 'tabAutoScroll',
      name: 'Scroll analysis',
      id: 'analysis-scroll-tab',
      component: AutoScroll,
      beta: true,
    },
    {
      translateKey: 'tabJourney',
      name: 'User journey',
      id: 'journey-tab',
      component: Parcours,
      beta: true,
    },
    {
      translateKey: 'tabParameter',
      name: 'Parameter',
      id: 'parameter-tab',
      component: Parameter,
    },
  ];
  export let activeTabId = 'evaluation-tab';

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

<main class="app-container">
  {#if activeTabId !== 'parameter-tab' }
    <h1 class="plugin-title">{translate('noContentPhraseEvaluation')}</h1>
  {/if}
  {#each tabs as tab}
    {#if activeTabId === tab.id}
      {#if tab.beta}
        <Alert message="betaMessage"/>
      {/if}
      <div class="tab-panel" role="tabpanel" aria-labelledby={`${tab.name} tab content`}>
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
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
  }

  .plugin-title {
    font-size: var(--font-size--xxl);
    color: var(--color--green);
    text-align: center;
  }
</style>
