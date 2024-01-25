<script lang="ts">
  import AutoScroll from '../pages/AutoScroll.svelte';
  import Evaluation from '../pages/Evaluation/Evaluation.svelte';
  import Help from '../pages/Help.svelte';
  import Parcours from '../pages/Parcours.svelte';
  import Tab from './Tab.svelte';
  export let tabs = [
    {
      translateKey: 'tabEvaluation',
      name: 'evaluation',
      id: 'evaluation-tab',
      component: Evaluation,
    },
    {
      translateKey: 'tabAutoScroll',
      name: 'analysis-scroll',
      id: 'analysis-scroll-tab',
      component: AutoScroll,
    },
    {
      translateKey: 'tabJourney',
      name: 'journey',
      id: 'journey-tab',
      component: Parcours,
    },
    {
      translateKey: 'tabHelp',
      name: 'helpUser',
      id: 'help-tab',
      component: Help,
    },
  ];
  export let activeTabId = 'evaluation-tab';

  function handleClick(event) {
    activeTabId = event.detail.id;
  }
</script>

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

{#each tabs as tab}
  {#if activeTabId == tab.id}
    <svelte:component this={tab.component} />
  {/if}
{/each}

<style>
  .nav {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin: 0;
    list-style: none;
  }

  .nav-tabs {
    margin-bottom: -1px;
    background: 0 0;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
  .tab-content {
    display: none;
    justify-content: center;
  }

  .tab-content.active {
    display: flex;
  }
</style>
