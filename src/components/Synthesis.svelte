<script lang="ts">
  import type { Measure } from '../interface';
  import Tooltip from './Tooltip.svelte';
  import { formatNbRequest, formatNumber, formatSizeTransferred, translate } from '../utils';
  import { SynthesisSrv } from '../service/synthesis.service';
  import { AdpIcon, EauIcon, ElecIcon } from '../assets/icons';

  export let datas: Measure[];

  let srv = new SynthesisSrv();
  const synthesis = srv.getSynthesis(datas);

  const heads = [
    {
      classe: 'scroll',
      count: true
    },
    {
      classe: 'click',
      count: true
    },
    {
      classe: 'page'
    }
  ];

</script>

<!-- TODO trop de code répété, faire un générateur) -->
<div class="synthesis-container">
  <table class="table">
    <thead>
    <tr>
      <th scope="col" colspan="1"></th>
      <th class="scroll" scope="col" colspan="6">
        <Tooltip translateKey='synTabHeadScroll' />
      </th>
      <th scope="col" colspan="6">
        <Tooltip translateKey='synTabHeadClick' />
      </th>
      <th class="page" scope="col" colspan="5">
        <Tooltip translateKey='synTabHeadPage' />
      </th>
    </tr>
    <tr>
      <th scope="col" colspan="1">
        <Tooltip translateKey='synTabHeadUrl' />
      </th>
      {#each heads as head}
        {#if (head.count)}
          <th class="{head.classe}" scope="col" colspan="1">
            <Tooltip translateKey='synTabHeadCount' />
          </th>
        {/if}
        <th class="{head.classe}" scope="col" colspan="1">
          <Tooltip translateKey='synTabHeadSize' />
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          <Tooltip translateKey='synTabHeadRequest' />
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          <Tooltip translateKey='synTabHeadGes' />
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          <Tooltip translateKey='synTabHeadScore' />
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          <Tooltip translateKey='synTabHeadKpi' />
        </th>
        <!--<th class="{head.classe}" scope="col" colspan="1">
          <Tooltip translateKey='synTabHeadGrade' />
        </th>-->
      {/each}
    </tr>
    </thead>
    <tbody>
    {#each synthesis.pages as page, index}
      <tr class:even={index % 2 === 0}>
        <td>
          <Tooltip value={page.shortUrl} tooltipValue={page.url} />
        </td>
        <td class="scroll">{page.sScroll.count}</td>
        <td
          class="scroll">{formatSizeTransferred(page.sScroll.network.network.size, page.sScroll.network.network.sizeUncompress)}</td>
        <td class="scroll">{formatNbRequest(page.sScroll.network.nbRequest, page.sScroll.network.nbRequestCache)}</td>
        <td class="scroll">{formatNumber(page.sScroll.ges.pageTotal)}</td>
        {#if page.sScroll.score?.value}
          <td class="scroll"
              style="background-color: {page.sScroll.score?.color}; color: {page.sScroll.score?.textColor}">{formatNumber(page.sScroll.score.value)}
            ({page.sScroll.score.gradeLetter})
          </td>
          <!--<td class="scroll"
              style="background-color: {page.sScroll.score?.color}; color: {page.sScroll.score?.textColor}">{page.sScroll.score.gradeLetter}</td>-->
        {:else }
          <td class="scroll"></td>
          <!--<td class="scroll"></td>-->
        {/if}
        <td class="scroll">
          <div class="kpi"><img src="{EauIcon}" class="icoWu" alt="water_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sScroll.wu.pageTotal)}"
                     tooltipValue={translate("wuEquivalent")} />
          </div>
          <div class="kpi"><img src="{AdpIcon}" class="icoAdp" alt="adp_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sScroll.adpe.pageTotal)}"
                     tooltipValue={translate("adpeEquivalent")} />
          </div>
          <div class="kpi"><img src="{ElecIcon}" class="icoElec" alt="elec_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sScroll.energy.kWhPage)}"
                     tooltipValue={translate("energyEquivalent")} />
          </div>
        </td>
        <td>{page.sClick.count}</td>
        <td>{formatSizeTransferred(page.sClick.network.network.size, page.sClick.network.network.sizeUncompress)}</td>
        <td>{formatNbRequest(page.sClick.network.nbRequest, page.sClick.network.nbRequestCache)}</td>
        <td>{formatNumber(page.sClick.ges.pageTotal)}</td>
        {#if page.sClick.score?.value}
          <td
            style="background-color: {page.sClick.score?.color}; color: {page.sClick.score?.textColor}">{formatNumber(page.sClick.score.value)}
            ({page.sClick.score.gradeLetter})
          </td>
          <!--<td
            style="background-color: {page.sClick.score?.color}; color: {page.sClick.score?.textColor}">{page.sClick.score.gradeLetter}</td>-->
        {:else }
          <td></td>
          <!--<td></td>-->
        {/if}
        <td>
          <div class="kpi"><img src="{EauIcon}" class="icoWu" alt="water_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sClick.wu.pageTotal)}"
                     tooltipValue={translate("wuEquivalent")} />
          </div>
          <div class="kpi"><img src="{AdpIcon}" class="icoAdp" alt="adp_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sClick.adpe.pageTotal)}"
                     tooltipValue={translate("adpeEquivalent")} />
          </div>
          <div class="kpi"><img src="{ElecIcon}" class="icoElec" alt="elec_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sClick.energy.kWhPage)}"
                     tooltipValue={translate("energyEquivalent")} />
          </div>
        </td>
        <td
          class="page">{formatSizeTransferred(page.sPage.network.network.size, page.sPage.network.network.sizeUncompress)}</td>
        <td class="page">{formatNbRequest(page.sPage.network.nbRequest, page.sPage.network.nbRequestCache)}</td>
        <td class="page">{formatNumber(page.sPage.ges.pageTotal)}</td>
        {#if page.sPage.score?.value}
          <td class="page"
              style="background-color: {page.sPage.score?.color}; color: {page.sPage.score?.textColor}">{formatNumber(page.sPage.score.value)}
            ({page.sPage.score.gradeLetter})
          </td>
          <!--<td class="page"
              style="background-color: {page.sPage.score?.color}; color: {page.sPage.score?.textColor}">{page.sPage.score.gradeLetter}</td>-->
        {:else }
          <td class="page"></td>
          <!--<td class="page"></td>-->
        {/if}
        <td class="page">
          <div class="kpi"><img src="{EauIcon}" class="icoWu" alt="water_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sPage.wu.pageTotal)}"
                     tooltipValue={translate("wuEquivalent")} />
          </div>
          <div class="kpi"><img src="{AdpIcon}" class="icoAdp" alt="adp_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sPage.adpe.pageTotal)}"
                     tooltipValue={translate("adpeEquivalent")} />
          </div>
          <div class="kpi"><img src="{ElecIcon}" class="icoElec" alt="elec_icon" />
            <Tooltip top="{true}" value="{formatNumber(page.sPage.energy.kWhPage)}"
                     tooltipValue={translate("energyEquivalent")} />
          </div>
        </td>
      </tr>
    {/each}
    </tbody>
    <tfoot>
    <tr>
      <th>
        <Tooltip translateKey='synTabFootTotal' top="{true}" />
      </th>
      <th class="scroll">{synthesis.total.sScroll.count}</th>
      <th
        class="scroll">{formatSizeTransferred(synthesis.total.sScroll.network.network.size, synthesis.total.sScroll.network.network.sizeUncompress)}</th>
      <th
        class="scroll">{formatNbRequest(synthesis.total.sScroll.network.nbRequest, synthesis.total.sScroll.network.nbRequestCache)}</th>
      <th class="scroll">{formatNumber(synthesis.total.sScroll.ges.pageTotal)}</th>
      {#if synthesis.total.sScroll.score?.value}
        <th class="scroll"
            style="background-color: {synthesis.total.sScroll.score?.color}; color: {synthesis.total.sScroll.score?.textColor}">{formatNumber(synthesis.total.sScroll.score.value)}
          ({synthesis.total.sScroll.score.gradeLetter})
        </th>
        <!--<th class="scroll"
            style="background-color: {synthesis.total.sScroll.score?.color}; color: {synthesis.total.sScroll.score?.textColor}">{synthesis.total.sScroll.score.gradeLetter}</th>-->
      {:else }
        <th class="scroll"></th>
        <!--<th class="scroll"></th>-->
      {/if}
      <th class="scroll">
        <div class="kpi"><img src="{EauIcon}" class="icoWu" alt="water_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sScroll.wu.pageTotal)}"
                   tooltipValue={translate("wuEquivalent")} />
        </div>
        <div class="kpi"><img src="{AdpIcon}" class="icoAdp" alt="adp_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sScroll.adpe.pageTotal)}"
                   tooltipValue={translate("adpeEquivalent")} />
        </div>
        <div class="kpi"><img src="{ElecIcon}" class="icoElec" alt="elec_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sScroll.energy.kWhPage)}"
                   tooltipValue={translate("energyEquivalent")} />
        </div>
      </th>
      <th>{synthesis.total.sClick.count}</th>
      <th>{formatSizeTransferred(synthesis.total.sClick.network.network.size, synthesis.total.sClick.network.network.sizeUncompress)}</th>
      <th>{formatNbRequest(synthesis.total.sClick.network.nbRequest, synthesis.total.sClick.network.nbRequestCache)}</th>
      <th>{formatNumber(synthesis.total.sClick.ges.pageTotal)}</th>
      {#if synthesis.total.sClick.score?.value}
        <th
          style="background-color: {synthesis.total.sClick.score?.color}; color: {synthesis.total.sClick.score?.textColor}">{formatNumber(synthesis.total.sClick.score.value)}
          ({synthesis.total.sClick.score.gradeLetter})
        </th>
        <!--<th
          style="background-color: {synthesis.total.sClick.score?.color}; color: {synthesis.total.sClick.score?.textColor}">{synthesis.total.sClick.score.gradeLetter}</th>-->
      {:else }
        <th></th>
        <!--<th></th>-->
      {/if}
      <th>
        <div class="kpi"><img src="{EauIcon}" class="icoWu" alt="water_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sClick.wu.pageTotal)}"
                   tooltipValue={translate("wuEquivalent")} />
        </div>
        <div class="kpi"><img src="{AdpIcon}" class="icoAdp" alt="adp_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sClick.adpe.pageTotal)}"
                   tooltipValue={translate("adpeEquivalent")} />
        </div>
        <div class="kpi"><img src="{ElecIcon}" class="icoElec" alt="elec_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sClick.energy.kWhPage)}"
                   tooltipValue={translate("energyEquivalent")} />
        </div>
      </th>
      <th
        class="page">{formatSizeTransferred(synthesis.total.sPage.network.network.size, synthesis.total.sPage.network.network.sizeUncompress)}</th>
      <th
        class="page">{formatNbRequest(synthesis.total.sPage.network.nbRequest, synthesis.total.sPage.network.nbRequestCache)}</th>
      <th class="page">{formatNumber(synthesis.total.sPage.ges.pageTotal)}</th>
      {#if synthesis.total.sPage.score?.value}
        <th class="page"
            style="background-color: {synthesis.total.sPage.score?.color}; color: {synthesis.total.sPage.score?.textColor}">{formatNumber(synthesis.total.sPage.score.value)}
          ({synthesis.total.sPage.score.gradeLetter})
        </th>
        <!--<th class="page"
            style="background-color: {synthesis.total.sPage.score?.color}; color: {synthesis.total.sPage.score?.textColor}">{synthesis.total.sPage.score.gradeLetter}</th>-->
      {:else }
        <th class="page"></th>
        <!--<th class="page"></th>-->
      {/if}
      <th class="scroll">
        <div class="kpi"><img src="{EauIcon}" class="icoWu" alt="water_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sPage.wu.pageTotal)}"
                   tooltipValue={translate("wuEquivalent")} />
        </div>
        <div class="kpi"><img src="{AdpIcon}" class="icoAdp" alt="adp_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sPage.adpe.pageTotal)}"
                   tooltipValue={translate("adpeEquivalent")} />
        </div>
        <div class="kpi"><img src="{ElecIcon}" class="icoElec" alt="elec_icon" />
          <Tooltip top="{true}" value="{formatNumber(synthesis.total.sPage.energy.kWhPage)}"
                   tooltipValue={translate("energyEquivalent")} />
        </div>
      </th>
    </tr>
    </tfoot>
  </table>
</div>

<style lang="scss">
  .synthesis-container {
    width: 100%;
    overflow: auto;
    box-shadow: var(--box-shadow--sm), var(--box-shadow--sm);
    border-radius: 8px;
    padding-bottom: 0.5em;

    div.kpi {
      white-space: nowrap;

      img {
        &.icoWu, &.icoAdp, &.icoElec {
          width: 1em;
          margin-right: 0.2em;
        }
      }
    }

    .table {
      border-collapse: collapse;

      td, th {
        &.scroll, &.page {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      thead {
        border-bottom: var(--spacing--xs) solid var(--color--green);
      }

      tfoot {
        border-top: var(--spacing--xs) solid var(--color--green);
      }

      thead, tfoot {
        text-transform: uppercase;
        background-color: var(--color--light);
        position: sticky;
        top: 0;

        th {
          padding: var(--spacing--md) var(--spacing--xl);
        }
      }

      tbody {
        td {
          text-align: center;
          padding: var(--spacing--lg) var(--spacing--xl);
        }
      }
    }
  }

  .even {
    background-color: var(--color--light-grey);
  }
</style>
