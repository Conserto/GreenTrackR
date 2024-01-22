<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let isActive: boolean;
  export let id: string;
  export let name: string;
  export let translateKey: string;

  function handleClickTab() {
    dispatch('clickTab', { id });
  }
</script>

<li class="nav-tab" role="presentation">
  <button
    class:active={isActive}
    class="nav-link"
    {id}
    type="button"
    role="tab"
    aria-controls={name}
    aria-selected="true"
    data-i18n={translateKey}
    on:click={handleClickTab}
  >
  </button>
</li>

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
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }

  .nav-link.active {
    color: rgb(96, 128, 108) !important;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
  .nav-link {
    display: block;
    padding: 0.5rem 1rem;
    color: rgb(91, 91, 91) !important;
    text-decoration: none;
    transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out;
  }
</style>
