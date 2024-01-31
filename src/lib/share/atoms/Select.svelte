<script lang="ts">
  export let selectedValue = 'default';
  export let selectValues = [];
</script>

<select bind:value={selectedValue}>
  {#each selectValues as selectValue}
    <option value={selectValue.value}>
      {selectValue.label}
    </option>
  {/each}
</select>

<style lang="scss">
</style>
