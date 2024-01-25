<script lang="ts">
  import logo from '/icons/Logo_GreenTrackr.png';
  import Actions from '../../share/Actions.svelte';
  import Results from '../../share/GES/Results.svelte';
  const actions = [
    {
      id: 'launchAnalysis',
      typeButton: 'principal',
      className: 'launchAnalysis',
      translateKey: 'launchAnalysisButton',
      component: Results,
    },
    {
      id: 'saveAnalysis',
      typeButton: 'secondary',
      className: 'saveAnalysis',
      translateKey: 'saveAnalysisButton',
    },
    {
      id: 'viewHistory',
      typeButton: 'secondary',
      className: 'viewHistory',
      translateKey: 'viewHistoryButton',
    },
    {
      id: 'clearBrowserCache',
      typeButton: 'secondary',
      className: 'clearBrowserCache',
      translateKey: 'clearBrowserCacheButton',
    },
  ];
</script>

<div
  class="tab-pane fade show active"
  id="evaluation"
  role="tabpanel"
  aria-labelledby="evaluation-tab"
>
  <img src={logo} width="300" alt="Conserto" class="rounded" />
  <Actions {actions} />
</div>

<style>
  .tab-pane {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
</style>
