<script lang="ts">
  import logo from '/icons/Logo_GreenTrackr.png';
  import Actions from '../share/Actions.svelte';
  import Results from '../share/GES/Results.svelte';
  import { ButtonTypeEnum } from 'src/enum';
  import type { Action as ActionInterface } from 'src/interface';
  const actions: ActionInterface[] = [
    {
      id: 'launchAnalysis',
      buttonType: ButtonTypeEnum.PRIMARY,
      translateKey: 'launchAnalysisButton',
      component: Results,
    },
    {
      id: 'saveAnalysis',
      buttonType: ButtonTypeEnum.SECONDARY,
      translateKey: 'saveAnalysisButton',
    },
    {
      id: 'viewHistory',
      buttonType: ButtonTypeEnum.SECONDARY,
      translateKey: 'viewHistoryButton',
    },
    {
      id: 'clearBrowserCache',
      buttonType: ButtonTypeEnum.SECONDARY,
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
