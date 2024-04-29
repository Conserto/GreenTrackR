<script lang="ts">

  import { translate, translateDescription } from '../utils';

  export let translateKey: string | undefined = undefined;
  export let value: string | undefined = undefined;
  export let tooltipValue: string | undefined = undefined;
  export let top: boolean = false;
  let sclass = top ? 'top' : '';
</script>

{#if !translateKey && !value && !tooltipValue}
<div></div>
{:else if translateKey}
  <div class="tooltip">{translate(translateKey)}
    <span class="tooltiptext {sclass}">{translateDescription(translateKey)}</span>
  </div>
{:else }
  <div class="tooltip">{value}
    {#if tooltipValue}
      <span class="tooltiptext {sclass}">{tooltipValue}</span>
    {/if}
  </div>
{/if}

<style lang="scss">

  .tooltip {
    position: relative;
    display: inline-block;

    &:hover, &:focus {
      .tooltiptext {
        visibility: visible;
      }
    }

    .tooltiptext {
      visibility: hidden;
      color: var(--color--white);
      background-color: var(--color--grey);
      text-align: center;
      padding: 5px;
      border-radius: 6px;
      position: absolute;
      z-index: 1;
      top: 100%;
      left: 50%;
      margin-left: -60px;
      text-transform: none;

      &.top {
        bottom: 100%;
        top: auto;
      }
    }
  }

</style>
