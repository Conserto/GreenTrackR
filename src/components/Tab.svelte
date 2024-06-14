<script lang="ts">
  import { translate } from 'src/utils';
  import { createEventDispatcher } from 'svelte';

  export let isActive: boolean;
  export let id: string;
  export let name: string;
  export let translateKey: string;

  const dispatch = createEventDispatcher();
  function handleClickTab() {
    dispatch('clickTab', { id });
  }
  function handleKeydown(e : KeyboardEvent) {
    const tabList = (e.currentTarget as HTMLElement).closest('[role="tablist"]')!;
    const tabs = [...tabList.querySelectorAll('[role="tab"]')] as HTMLButtonElement[];
    const currentTab: HTMLButtonElement = tabList.querySelector('[role="tab"][aria-selected="true"]')!;
    let currentIndex = tabs.indexOf(currentTab);
    if (e.key === 'ArrowRight') {
      currentIndex++;
      if (currentIndex === tabs.length) {
        currentIndex = 0;
      }
    } else if (e.key === 'ArrowLeft') {
      currentIndex--;
      if (currentIndex === -1) {
        currentIndex = tabs.length -1;
      }
    } else if (e.key === 'Home') {
      currentIndex = 0
    } else if (e.key === 'End') {
      currentIndex = tabs.length -1
    }
    const newlySelectedTab = tabs[currentIndex].id;
    tabs[currentIndex].focus();
    dispatch('clickTab', { id:newlySelectedTab});
  }
</script>

<div class="nav-tab" role="presentation">
  <button
    class:active={isActive}
    class="nav-link"
    {id}
    type="button"
    role="tab"
    tabindex="{isActive ? 0 : -1}"
    aria-controls={name}
    aria-selected="{isActive}"
    on:click={handleClickTab}
    on:keydown={handleKeydown}
  >
    {translate(translateKey)}
  </button>
</div>

<style>
    .nav-link {
        background: var(---color--white);
        cursor: pointer;
        border: none;
        padding: var(--spacing--sm) var(--spacing--lg);
        color: var(--color--dark-grey);
        font-family: inherit;
        font-size: inherit;
        font-weight: bold;
    }

    .nav-link.active {
        color: var(--color--green);
        border-bottom: var(--border-width--normal) solid transparent;
        border-color: var(--color--green);
    }
</style>
