<script lang="ts">
  import { InputTypeEnum } from 'src/enum';
  import { translate } from 'src/utils/utils';

  export let name: string;
  export let value: string;
  export let translateKey: string;
  export let type: InputType;
</script>

<div class="input-wrapper">
  <label for={name}>{translate(translateKey)}</label>
  {#if type === InputTypeEnum.Text}
    <input class="input" type="text" {name} bind:value />
  {:else if type === InputTypeEnum.Number}
    <input class="input" type="number" {name} bind:value />
  {/if}
</div>

<style lang="scss">
</style>
