<script lang="ts">
  import Button from './Button.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let className: string;
  export let translateKey: string;
  export let actionId: string;
  function handleActionClick() {
    dispatch('clickAction', { actionId });
  }
</script>

<Button on:buttonClick={handleActionClick} {translateKey} {className} />

<style>
</style>
