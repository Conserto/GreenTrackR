<script lang="ts">
  import type { ButtonTypeEnum } from 'src/enum';
  import Button from './Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Action as ActionInterface } from 'src/interface';

  const dispatch = createEventDispatcher();

  export let action: ActionInterface;

  function handleActionClick() {
    dispatch('clickAction', { actionId: action.id });
  }
</script>

<Button
  on:buttonClick={handleActionClick}
  buttonType={action.buttonType}
  translateKey={action.translateKey}
/>

<style>
</style>
