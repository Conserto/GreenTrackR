<script lang="ts">
  import { SEARCH_AUTO } from '../const/key.const';

  export let selectedValue = SEARCH_AUTO;
  export let selectValues: any[] = [];
</script>

<select class="generic-input" bind:value={selectedValue}>
  {#each selectValues as selectValue}
    <option value={selectValue.value}>
      {selectValue.label}
    </option>
  {/each}
</select>

<style lang="scss">
  option {
    font-weight: bold;
  }
</style>
