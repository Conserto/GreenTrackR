<script lang="ts">
  import type { Measure } from 'src/interface';
  import { formatNbRequest, formatNumber, formatSizeTransferred, translate } from 'src/utils';
  import { SynthesisSrv } from 'src/service/synthesis.service';
  import { AdpIcon, EauIcon, ElecIcon, GesIcon } from 'src/assets/icons';

  // Props definition
  export let datas: Measure[];
  export let caption: string = '';
  export let description: string = '';
  export let className: string = '';

  // Initialize the synthesis service and process the measurement data
  let srv = new SynthesisSrv();
  const synthesis = srv.getSynthesis(datas);

  /**
   * Configuration for table column groups
   * - scroll: Measurements taken during scroll interactions
   * - click: Measurements taken during click interactions
   * - page: Overall page measurements
   */
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

  // Helper functions for safe data display
  const hasData = (section: any): boolean => section && section.count > 0;

  const safeNum = (val: any): string => {
    if (val === undefined || val === null || isNaN(val)) return '-';
    return formatNumber(val);
  };

  const safeSize = (size: any, unc: any): string => {
    if (size === undefined || size === null) return '-';
    return formatSizeTransferred(size, unc ?? 0);
  };

  const safeReq = (nb: any, cache: any): string => {
    if (nb === undefined || nb === null) return '-';
    return formatNbRequest(nb, cache ?? 0);
  };
</script>

<div class="synthesis-container {className}">
  <table class="table">
    <caption>
      {caption}
      <span class="visually-hidden">{description}</span>
    </caption>

    <thead>
    <!-- First header row: Group headers -->
    <tr>
      <th scope="col" colspan="1"></th>
      <th class="scroll" scope="col" colspan="6">
        {translate('synTabHeadScroll')}
      </th>
      <th scope="col" colspan="6">
        {translate('synTabHeadClick')}
      </th>
      <th class="page" scope="col" colspan="5">
        {translate('synTabHeadPage')}
      </th>
    </tr>

    <!-- Second header row: Individual column headers -->
    <tr>
      <th scope="col" colspan="1">
        {translate('synTabHeadUrl')}
      </th>
      {#each heads as head}
        {#if (head.count)}
          <th class="{head.classe}" scope="col" colspan="1">
            {translate('synTabHeadCount')}
          </th>
        {/if}
        <th class="{head.classe}" scope="col" colspan="1">
          {translate('synTabHeadSize')}
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          {translate('synTabHeadRequest')}
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          {translate('synTabHeadGes')}
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          {translate('synTabHeadScore')}
        </th>
        <th class="{head.classe}" scope="col" colspan="1">
          {translate('synTabHeadKpi')}
        </th>
      {/each}
    </tr>
    </thead>

    <tbody>
    {#each synthesis.pages as page, index}
      <tr class:even={index % 2 === 0}>
        <!-- URL column -->
        <td>
          <span class="table--url">{page.url || '-'}</span>
        </td>

        <!-- ========== SCROLL MEASUREMENTS ========== -->
        {#if hasData(page.sScroll)}
          <td class="scroll">{page.sScroll.count}</td>
          <td class="scroll">
            {safeSize(page.sScroll.network?.network?.size, page.sScroll.network?.network?.sizeUncompress)}
          </td>
          <td class="scroll">
            {safeReq(page.sScroll.network?.nbRequest, page.sScroll.network?.nbRequestCache)}
          </td>
          <td class="scroll">
            <div class="kpi">
              <img src="{GesIcon}" class="icoGes" alt="" />
              {safeNum(page.sScroll.ges?.pageTotal)}
            </div>
          </td>
          {#if page.sScroll.score?.value}
            <td
              class="scroll"
              style="background-color: {page.sScroll.score.color}; color: {page.sScroll.score.textColor}"
            >
              {safeNum(page.sScroll.score.value)} ({page.sScroll.score.gradeLetter})
            </td>
          {:else}
            <td class="scroll">-</td>
          {/if}
          <td class="scroll">
            <div class="kpi">
              <img src="{EauIcon}" class="icoWu" alt="" />
              {safeNum(page.sScroll.wu?.pageTotal)}
            </div>
            <div class="kpi">
              <img src="{AdpIcon}" class="icoAdp" alt="" />
              {safeNum(page.sScroll.adpe?.pageTotal)}
            </div>
            <div class="kpi">
              <img src="{ElecIcon}" class="icoElec" alt="" />
              {safeNum(page.sScroll.energy?.kWhPage)}
            </div>
          </td>
        {:else}
          <td class="scroll">-</td>
          <td class="scroll">-</td>
          <td class="scroll">-</td>
          <td class="scroll">-</td>
          <td class="scroll">-</td>
          <td class="scroll">-</td>
        {/if}

        <!-- ========== CLICK MEASUREMENTS ========== -->
        {#if hasData(page.sClick)}
          <td>{page.sClick.count}</td>
          <td>
            {safeSize(page.sClick.network?.network?.size, page.sClick.network?.network?.sizeUncompress)}
          </td>
          <td>
            {safeReq(page.sClick.network?.nbRequest, page.sClick.network?.nbRequestCache)}
          </td>
          <td>
            <div class="kpi">
              <img src="{GesIcon}" class="icoGes" alt="" />
              {safeNum(page.sClick.ges?.pageTotal)}
            </div>
          </td>
          {#if page.sClick.score?.value}
            <td style="background-color: {page.sClick.score.color}; color: {page.sClick.score.textColor}">
              {safeNum(page.sClick.score.value)} ({page.sClick.score.gradeLetter})
            </td>
          {:else}
            <td>-</td>
          {/if}
          <td>
            <div class="kpi">
              <img src="{EauIcon}" class="icoWu" alt="" />
              {safeNum(page.sClick.wu?.pageTotal)}
            </div>
            <div class="kpi">
              <img src="{AdpIcon}" class="icoAdp" alt="" />
              {safeNum(page.sClick.adpe?.pageTotal)}
            </div>
            <div class="kpi">
              <img src="{ElecIcon}" class="icoElec" alt="" />
              {safeNum(page.sClick.energy?.kWhPage)}
            </div>
          </td>
        {:else}
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        {/if}

        <!-- ========== PAGE MEASUREMENTS ========== -->
        {#if hasData(page.sPage)}
          <td class="page">
            {safeSize(page.sPage.network?.network?.size, page.sPage.network?.network?.sizeUncompress)}
          </td>
          <td class="page">
            {safeReq(page.sPage.network?.nbRequest, page.sPage.network?.nbRequestCache)}
          </td>
          <td class="page">
            <div class="kpi">
              <img src="{GesIcon}" class="icoGes" alt="" />
              {safeNum(page.sPage.ges?.pageTotal)}
            </div>
          </td>
          {#if page.sPage.score?.value}
            <td
              class="page"
              style="background-color: {page.sPage.score.color}; color: {page.sPage.score.textColor}"
            >
              {safeNum(page.sPage.score.value)} ({page.sPage.score.gradeLetter})
            </td>
          {:else}
            <td class="page">-</td>
          {/if}
          <td class="page">
            <div class="kpi">
              <img src="{EauIcon}" class="icoWu" alt="" />
              {safeNum(page.sPage.wu?.pageTotal)}
            </div>
            <div class="kpi">
              <img src="{AdpIcon}" class="icoAdp" alt="" />
              {safeNum(page.sPage.adpe?.pageTotal)}
            </div>
            <div class="kpi">
              <img src="{ElecIcon}" class="icoElec" alt="" />
              {safeNum(page.sPage.energy?.kWhPage)}
            </div>
          </td>
        {:else}
          <td class="page">-</td>
          <td class="page">-</td>
          <td class="page">-</td>
          <td class="page">-</td>
          <td class="page">-</td>
        {/if}
      </tr>
    {/each}
    </tbody>

    <!-- Table footer with totals -->
    <tfoot>
    <tr>
      <th>{translate('synTabFootTotal')}</th>

      <!-- ========== SCROLL TOTALS ========== -->
      {#if hasData(synthesis.total.sScroll)}
        <th class="scroll">{synthesis.total.sScroll.count}</th>
        <th class="scroll">
          {safeSize(synthesis.total.sScroll.network?.network?.size, synthesis.total.sScroll.network?.network?.sizeUncompress)}
        </th>
        <th class="scroll">
          {safeReq(synthesis.total.sScroll.network?.nbRequest, synthesis.total.sScroll.network?.nbRequestCache)}
        </th>
        <th class="scroll">
          <div class="kpi">
            <img src="{GesIcon}" class="icoGes" alt="" />
            {safeNum(synthesis.total.sScroll.ges?.pageTotal)}
          </div>
        </th>
        {#if synthesis.total.sScroll.score?.value}
          <th
            class="scroll"
            style="background-color: {synthesis.total.sScroll.score.color}; color: {synthesis.total.sScroll.score.textColor}"
          >
            {safeNum(synthesis.total.sScroll.score.value)} ({synthesis.total.sScroll.score.gradeLetter})
          </th>
        {:else}
          <th class="scroll">-</th>
        {/if}
        <th class="scroll">
          <div class="kpi">
            <img src="{EauIcon}" class="icoWu" alt="" />
            {safeNum(synthesis.total.sScroll.wu?.pageTotal)}
          </div>
          <div class="kpi">
            <img src="{AdpIcon}" class="icoAdp" alt="" />
            {safeNum(synthesis.total.sScroll.adpe?.pageTotal)}
          </div>
          <div class="kpi">
            <img src="{ElecIcon}" class="icoElec" alt="" />
            {safeNum(synthesis.total.sScroll.energy?.kWhPage)}
          </div>
        </th>
      {:else}
        <th class="scroll">-</th>
        <th class="scroll">-</th>
        <th class="scroll">-</th>
        <th class="scroll">-</th>
        <th class="scroll">-</th>
        <th class="scroll">-</th>
      {/if}

      <!-- ========== CLICK TOTALS ========== -->
      {#if hasData(synthesis.total.sClick)}
        <th>{synthesis.total.sClick.count}</th>
        <th>
          {safeSize(synthesis.total.sClick.network?.network?.size, synthesis.total.sClick.network?.network?.sizeUncompress)}
        </th>
        <th>
          {safeReq(synthesis.total.sClick.network?.nbRequest, synthesis.total.sClick.network?.nbRequestCache)}
        </th>
        <th>
          <div class="kpi">
            <img src="{GesIcon}" class="icoGes" alt="" />
            {safeNum(synthesis.total.sClick.ges?.pageTotal)}
          </div>
        </th>
        {#if synthesis.total.sClick.score?.value}
          <th style="background-color: {synthesis.total.sClick.score.color}; color: {synthesis.total.sClick.score.textColor}">
            {safeNum(synthesis.total.sClick.score.value)} ({synthesis.total.sClick.score.gradeLetter})
          </th>
        {:else}
          <th>-</th>
        {/if}
        <th>
          <div class="kpi">
            <img src="{EauIcon}" class="icoWu" alt="" />
            {safeNum(synthesis.total.sClick.wu?.pageTotal)}
          </div>
          <div class="kpi">
            <img src="{AdpIcon}" class="icoAdp" alt="" />
            {safeNum(synthesis.total.sClick.adpe?.pageTotal)}
          </div>
          <div class="kpi">
            <img src="{ElecIcon}" class="icoElec" alt="" />
            {safeNum(synthesis.total.sClick.energy?.kWhPage)}
          </div>
        </th>
      {:else}
        <th>-</th>
        <th>-</th>
        <th>-</th>
        <th>-</th>
        <th>-</th>
        <th>-</th>
      {/if}

      <!-- ========== PAGE TOTALS ========== -->
      {#if hasData(synthesis.total.sPage)}
        <th class="page">
          {safeSize(synthesis.total.sPage.network?.network?.size, synthesis.total.sPage.network?.network?.sizeUncompress)}
        </th>
        <th class="page">
          {safeReq(synthesis.total.sPage.network?.nbRequest, synthesis.total.sPage.network?.nbRequestCache)}
        </th>
        <th class="page">
          <div class="kpi">
            <img src="{GesIcon}" class="icoGes" alt="" />
            {safeNum(synthesis.total.sPage.ges?.pageTotal)}
          </div>
        </th>
        {#if synthesis.total.sPage.score?.value}
          <th
            class="page"
            style="background-color: {synthesis.total.sPage.score.color}; color: {synthesis.total.sPage.score.textColor}"
          >
            {safeNum(synthesis.total.sPage.score.value)} ({synthesis.total.sPage.score.gradeLetter})
          </th>
        {:else}
          <th class="page">-</th>
        {/if}
        <th class="page">
          <div class="kpi">
            <img src="{EauIcon}" class="icoWu" alt="" />
            {safeNum(synthesis.total.sPage.wu?.pageTotal)}
          </div>
          <div class="kpi">
            <img src="{AdpIcon}" class="icoAdp" alt="" />
            {safeNum(synthesis.total.sPage.adpe?.pageTotal)}
          </div>
          <div class="kpi">
            <img src="{ElecIcon}" class="icoElec" alt="" />
            {safeNum(synthesis.total.sPage.energy?.kWhPage)}
          </div>
        </th>
      {:else}
        <th class="page">-</th>
        <th class="page">-</th>
        <th class="page">-</th>
        <th class="page">-</th>
        <th class="page">-</th>
      {/if}
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

    caption {
      font-weight: bold;
      padding-inline-start: 1rem;
      text-align: left;
    }

    div.kpi {
      white-space: nowrap;

      img {
        &.icoWu, &.icoAdp, &.icoElec, &.icoGes {
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
</style>