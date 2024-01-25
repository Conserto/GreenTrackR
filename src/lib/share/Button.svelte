<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let translateKey: string;
  export let className: string;
  function handleButtonClick() {
    dispatch('buttonClick');
  }
</script>

<button on:click={handleButtonClick} class={'btn btn-secondary btn-sm ' + className}
  >{chrome.i18n.getMessage(translateKey)}</button
>

<style>
  /* Bootstrap Button Base Styles */
  .btn {
    margin: 4px;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
    cursor: pointer;
  }

  /* Bootstrap Secondary Button Styles */
  .secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
  }

  .secondary:hover {
    color: #fff;
    background-color: #5c636a;
    border-color: #565e64;
  }

  /* Bootstrap Small Button Styles */
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
  }

  .principal {
    /* Vos styles personnalisés ici */
    color: #fff;
    background: rgb(96, 128, 108);
  }

  .principal:hover {
    color: #212529;
  }
</style>
