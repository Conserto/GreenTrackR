<script lang="ts">
  import { Results } from 'src/lib/share/GES';
  import { Action, EmptyContent } from 'src/lib/share';
  import type { Action as ActionInterface } from 'src/interface';

  export let actions: ActionInterface[];
  // var that we will toggle so we can be sure component will be re render even if we click consecutively on same action
  let forceRerender: boolean = true;
  let actionClicked: string;

  function handleActionClick(event) {
    forceRerender = !forceRerender;
    actionClicked = event.detail.actionId;
  }
</script>

<div class="actions">
  <div class="actions-btn">
    {#each actions as action}
      <Action on:clickAction={handleActionClick} {action} />
    {/each}
  </div>

  <div class="actions-results">
    {#each actions as action}
      {#key forceRerender}
        {#if actionClicked === action.id}
          <svelte:component this={action.component} />
        {/if}
      {/key}
    {/each}
  </div>
</div>
<EmptyContent isActive={!actionClicked} />

<style>
  .actions {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }

  .actions-btn {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }

  .actions-results {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
