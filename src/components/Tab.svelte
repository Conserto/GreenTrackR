<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { createEventDispatcher } from 'svelte';

  export let isActive: boolean;
  export let id: string;
  export let name: string;
  export let translateKey: string;

  const dispatch = createEventDispatcher();

  function handleClickTab() {
    dispatch('clickTab', { id });
  }
</script>

<div class="nav-tab" role="presentation">
  <button
    class:active={isActive}
    class="nav-link"
    {id}
    type="button"
    role="tab"
    aria-controls={name}
    aria-selected="true"
    on:click={handleClickTab}
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
