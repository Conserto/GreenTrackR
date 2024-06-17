<script lang="ts">
  import { InputTypeEnum } from 'src/enum';
  import { translate } from 'src/utils';

  export let name: string;
  export let value: number | string;
  export let translateKey: string;
  export let type: InputTypeEnum;
</script>

<div class="input-wrapper">
  <label for="{name}">{translate(translateKey)}
    {#if type === InputTypeEnum.TEXT}
      <input class="generic-input" type="text" {name} id="{name}" bind:value />
    {:else if type === InputTypeEnum.NUMBER}
      <input class="generic-input" type="number" {name} id="{name}" bind:value />
    {/if}
  </label>

</div>
