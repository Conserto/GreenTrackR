<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import { translate } from 'src/utils/utils';

  const dispatch = createEventDispatcher();

  export let translateKey: string;
  export let buttonType: ButtonTypeEnum;
  function handleButtonClick() {
    dispatch('buttonClick');
  }
</script>

<button
  on:click={handleButtonClick}
  class:primary={buttonType === ButtonTypeEnum.PRIMARY}
  class:secondary={buttonType === ButtonTypeEnum.SECONDARY}
  class={'button'}>{translate(translateKey)}</button
>

<style>
  /* Bootstrap Button Base Styles */
  .button {
    margin: var(--spacing--xs);
    display: inline-block;
    font-weight: var(--font-weight--normal);
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: var(--border-width--thin) solid transparent;
    padding: var(--spacing--xs) var(--spacing--md);
    font-size: var(--font-size--md);
    line-height: 1.5;
    border-radius: var(--border-radius--slight);
    transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
    cursor: pointer;
  }
  .primary {
    /* Vos styles personnalisés ici */
    color: var(--color--light);
    background: var(--button_background-color--primary);
  }

  .primary:hover {
    color: #212529;
    background: var(--button_hover-background-color--primary);
  }

  /* Bootstrap Secondary Button Styles */
  .secondary {
    color: var(--color--light);
    background-color: var(--button_background-color--secondary);
    border-color: var(--button_border-color--secondary);
  }

  .secondary:hover {
    color: var(--color--light);
    background-color: var(--button_hover_background-color--secondary);
    border-color: var(--button_hover_border-color--secondary);
  }
</style>
