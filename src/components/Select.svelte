<script lang="ts">
  import { SEARCH_AUTO } from '../const/key.const';
  import { createEventDispatcher } from 'svelte';

  export let selectedValue = SEARCH_AUTO;
  export let selectValues: any[] = [];
  export let name: string;
  export let style: string | undefined;
  const dispatch = createEventDispatcher();

  function handleSelectChange() {
    dispatch('selectChange', {
      selectedValue
    });
  }
</script>

<select class="generic-input" {name} id="{name}" bind:value={selectedValue} style="{style ? style : ''}" on:change={handleSelectChange}>
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
