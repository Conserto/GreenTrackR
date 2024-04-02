<script lang="ts">

  export let value: string;
  export let tooltipValue: string | undefined;
</script>

<div class="tooltip">{value}
  {#if tooltipValue}
    <span class="tooltiptext">{tooltipValue}</span>
  {/if}
</div>

<style lang="scss">
  /* Tooltip container */
  .tooltip {
    position: relative;
    display: inline-block;

    &:hover {
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
      bottom: 100%;
      left: 50%;
      margin-left: -60px;
    }

  }

</style>
