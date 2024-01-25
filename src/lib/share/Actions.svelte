<script lang="ts">
  import Results from './GES/Results.svelte';
  import Action from './Action.svelte';
  import EmptyContent from './EmptyContent.svelte';

  export let actions: string;
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
      <Action
        on:clickAction={handleActionClick}
        actionId={action.id}
        className={action.className + ' ' + action.typeButton}
        translateKey={action.translateKey}
      />
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

  .action-results-content {
    width: 100%;
    display: none;
    justify-content: center;
  }

  .action-results-content.active {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
