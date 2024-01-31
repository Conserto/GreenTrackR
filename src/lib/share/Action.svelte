<script lang="ts">
  import type { ButtonTypeEnum } from 'src/enum';
  import { createEventDispatcher } from 'svelte';
  import type { Action as ActionInterface } from 'src/interface';

  import { Button } from 'src/lib/share/atoms';

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
