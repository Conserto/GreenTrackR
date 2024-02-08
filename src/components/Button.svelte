<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import { translate } from 'src/utils/utils';

  export let translateKey: string;
  export let buttonType: ButtonTypeEnum;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  function handleButtonClick() {
    dispatch('buttonClick');
  }
</script>

<button
  on:click={handleButtonClick}
  {disabled}
  class:primary={buttonType === ButtonTypeEnum.PRIMARY}
  class:secondary={buttonType === ButtonTypeEnum.SECONDARY}
  class={'button'}>{translate(translateKey)}</button
>

<style lang="scss">
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

    &:disabled {
      cursor: default;
      pointer-events: none;
      opacity: 0.4;
    }

    &.primary {
      color: var(--color--light);
      background: var(--background-color--primary);

      &:hover {
        background: var(--button_hover-background-color--primary);
      }
    }

    &.secondary {
      color: var(--color--light);
      background-color: var(--button_background-color--secondary);

      &:hover {
        background-color: var(--button_hover_background-color--secondary);
      }
    }
  }
</style>
