<script lang="ts">
  import { InputTypeEnum } from 'src/enum';
  import { translate } from 'src/utils/utils';

  export let name: string;
  export let value: string;
  export let translateKey: string | undefined = undefined;
  export let type: InputTypeEnum;
</script>

<div class="input-wrapper">
  <label>{translate(translateKey)}
    {#if type === InputTypeEnum.TEXT}
      <input class="generic-input" type="text" {name} bind:value />
    {:else if type === InputTypeEnum.NUMBER}
      <input class="generic-input" type="number" {name} bind:value />
    {/if}
  </label>

</div>
