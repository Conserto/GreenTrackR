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
  button {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .nav-link {
    margin-bottom: -1px;
    background: 0 0;
    border: var(--border-width--thin) solid transparent;
    border-top-left-radius: var(--border-radius--slight);
    border-top-right-radius: var(--border-radius--slight);
    cursor: pointer;
  }

  .nav-link.active {
    color: var(--color--primary);
    background-color: var(--color--light);
    border-color: var(--color--grey-light) var(--color--grey-light) var(--color--light);
  }
  .nav-link {
    display: block;
    padding: var(--spacing--sm) var(--spacing--lg);
    color: var(--color--grey);
    text-decoration: none;
    transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out;
  }
</style>
