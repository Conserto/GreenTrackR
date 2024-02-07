<script lang="ts">
  import { ButtonTypeEnum } from 'src/enum';
  import type { Action as ActionInterface } from 'src/interface';
  import logo from '/icons/128.png';

  import { Actions } from 'src/lib/share';
  import { Results } from 'src/lib/share/GES';

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
  <img src={logo} alt="Conserto" class="rounded" />
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
