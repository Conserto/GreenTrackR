<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import { translate, translateDescription } from 'src/utils/utils';

  export let translateKey: string;
  export let buttonType: ButtonTypeEnum;
  export let disabled: boolean = false;
  export let tooltip: boolean = false;

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
  class={'button'}>{translate(translateKey)}
  {#if (tooltip)}
    <span class="tooltipbtn">{translateDescription(translateKey)}</span>
  {/if}
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
    position: relative;
    display: inline-block;

    &:hover {
      .tooltipbtn {
        visibility: visible;
      }
    }

    &:disabled {
      cursor: default;
      pointer-events: none;
      opacity: 0.4;
    }

    &.primary {
      color: var(--color--white);
      background: var(--color--green);

      &:hover {
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

    .tooltipbtn {
      visibility: hidden;
      color: var(--color--white);
      background-color: var(--color--grey);
      text-align: center;
      padding: 5px;
      border-radius: 6px;
      position: absolute;
      z-index: 1;
      bottom: 110%;
      left: -30%;
      right: -30%;
      white-space: normal;
    }

  }
</style>
