<script lang="ts">
  import { InputTypeEnum } from 'src/enum';
  import { translate } from 'src/utils';

  export let name: string;
  export let placeholder: string | undefined = undefined;
  export let value: number | string;
  export let translateKey: string;
  export let type: InputTypeEnum;
</script>

<div class="input-wrapper">
  <label for="{name}">{translate(translateKey)}
    {#if type === InputTypeEnum.TEXT}
      <input {placeholder} class="generic-input" type="text" {name} id="{name}" bind:value />
    {:else if type === InputTypeEnum.NUMBER}
      <input {placeholder} class="generic-input" type="number" {name} id="{name}" bind:value />
    {/if}
  </label>

</div>
