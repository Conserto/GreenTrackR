<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import { translate } from 'src/utils';

  export let translateKey: string;
  export let buttonType: ButtonTypeEnum;
  export let disabled: boolean = false;
  export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';

  const dispatch = createEventDispatcher();

  function handleButtonClick() {
    dispatch('buttonClick');
  }
</script>

<button
  type="{type}"
  on:click={handleButtonClick}
  {disabled}
  class:primary={buttonType === ButtonTypeEnum.PRIMARY}
  class:secondary={buttonType === ButtonTypeEnum.SECONDARY}
  class={'button'}>{translate(translateKey)}
</button>

<style lang="scss">
  /* Bootstrap Button Base Styles */
  .button {
    margin: var(--spacing--xs);
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
    transition: color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
    cursor: pointer;
    display: inline-block;

    &:disabled {
      cursor: default;
      pointer-events: none;
      opacity: 0.4;
    }

    &.primary {
      color: var(--color--white);
      background: var(--color--green);

      &:hover, &:focus {
        background: var(--color-dark-green);
      }
    }

    &.secondary {
      color: var(--color--white);
      background-color: var(--color--grey);

      &:hover {
        background-color: var(--color--dark-grey);
      }
    }
  }
</style>
