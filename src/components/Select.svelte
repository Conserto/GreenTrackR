<script lang="ts">
  export let selectedValue = 'auto';
  export let selectValues = [];
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
