<script lang="ts">
  import logo from '/images/logo.png';
  import { AutoScroll, Evaluation, Parcours, Help } from 'src/pages';
  import { Alert, Tab, Footer } from 'src/components';
  import { translate } from './utils/utils';

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
      translateKey: 'tabHelp',
      name: 'Help',
      id: 'help-tab',
      component: Help,
    },
  ];
  export let activeTabId = 'evaluation-tab';

  function handleClick(event) {
    activeTabId = event.detail.id;
  }
</script>

<header class="flex-col-center">
  <img src={logo} alt="Logo green tracker" />
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

<div class="app-container">
  {#if activeTabId !== 'help-tab'}
    <h1 class="plugin-title">{translate('nocontentPhraseEvaluation')}</h1>
  {/if}
  {#each tabs as tab}
    {#if activeTabId == tab.id}
      {#if tab.beta}
        <Alert message="betaMessage" />
      {/if}
      <div class="tab-panel" role="tabpanel" aria-labelledby={`${tab.name} tab content`}>
        <svelte:component this={tab.component} />
      </div>
    {/if}
  {/each}
</div>
<Footer />

<style>
  .app-container {
    justify-content: start;
    margin: 0 var(--spacing--xl) 0 var(--spacing--xl);
  }

  .nav {
    display: flex;
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
    margin: 0 var(--spacing--xl) 0 var(--spacing--xl);
  }

  .plugin-title {
    font-size: var(--font-size--xxl);
    color: var(--color--green);
    text-align: center;
  }
</style>
