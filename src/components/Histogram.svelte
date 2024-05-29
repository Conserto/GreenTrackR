<script lang="ts">
  import { translate } from 'src/utils/utils';
  import type { HistoData } from 'src/interface';

  export let datas: HistoData[];
  export let yLabel: string;
  export let yLabel2: string | null = null;
  export let chartLabel: string;

  const svgHeight = 300;
  const margin = { top: 40, right: 20, bottom: 40, left: 40 };

  $: datasLength = datas.length;
  $: svgWidth = datas.length * 70;
  $: fullSvgWidth = yLabel2 ? svgWidth * 2 : svgWidth;

  $: width = svgWidth - margin.left - margin.right;
  $: height = svgHeight - margin.top - margin.bottom;
  $: maxDatasValue = Math.max(...datas.map((d) => d.value));
  $: maxDatasValue2 = Math.max(...datas.map((d) => d.value2));

  function calculateBarHeight(value: number, max: number) {
    const yScale = height / max;
    return value * yScale;
  }
</script>
<h3>{translate(chartLabel)}</h3>
<svg width={fullSvgWidth} height={svgHeight + 75} aria-labelledby="title">
  <title id="title">{translate(chartLabel)}</title>
  <defs>
    <pattern id="pattern-0" patternUnits="userSpaceOnUse" width="6" height="6"><g fill='hsl(0 0% 100% / .6)'><circle cx='3' cy='3' r='3'/><circle cx='13' cy='13' r='3'/></g>
    </pattern>
    <pattern id="pattern-1" width="2" height="2" stroke="white" stroke-width="2"
             patternTransform="rotate(45) scale(2)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="2"></line>
      <line x1="0" y1="0" x2="2" y2="0"></line>
    </pattern>
    <pattern id="pattern-2"
             x="2" y="2" width="4" height="4" stroke="white"
             patternUnits="userSpaceOnUse" >
      <circle cx="2" cy="2" r="2" />
    </pattern>
    <pattern id="pattern-3"
             x="0" y="0" width="4" height="4" stroke="white"
             patternUnits="userSpaceOnUse">
      <polygon points="0 0, 4 4, 0 4"/></pattern>
    <mask id="mask-0" x="0" y="0" width="1" height="1" >
      <rect x="0" y="0" width="1000" height="1000" fill="url(#pattern-0)" />
    </mask>
    <mask id="mask-1" x="0" y="0" width="1" height="1">
      <rect x="0" y="0" width="1000" height="1000" fill="url(#pattern-1)"></rect>
    </mask>
    <mask id="mask-2" x="0" y="0" width="1" height="1">
      <rect x="0" y="0" width="1000" height="1000" fill="url(#pattern-2)"></rect>
    </mask>
    <mask id="mask-3" x="0" y="0" width="1" height="1">
      <rect x="0" y="0" width="1000" height="1000" fill="url(#pattern-3)"></rect>
    </mask>
</defs>
<g role="table">
{#each datas as { label, value, value2, color }, i}
    <g role="row">
      <rect
        fill="{color}"
        mask="url(#mask-{i})"
        x={(i * width) / datasLength + margin.left}
        y={svgHeight - calculateBarHeight(value, maxDatasValue) - margin.bottom}
        width={width / datasLength - 5}
        height={calculateBarHeight(value, maxDatasValue)} />
      <text
        role="cell"
        x={(i * width) / datasLength + margin.left + width / (2 * datasLength)}
        y={svgHeight - calculateBarHeight(value, maxDatasValue) - margin.bottom - 5}
        text-anchor="middle">{value.toFixed(2)}</text>
    </g>
    {#if yLabel2}
      <g role="row">
        <rect
          fill={color}
          mask="url(#mask-{i})"
          x={(i * width) / datasLength + margin.left + svgWidth}
          y={svgHeight - calculateBarHeight(value2, maxDatasValue2) - margin.bottom}
          width={width / datasLength - 5}
          height={calculateBarHeight(value2, maxDatasValue2)}
        />
        <text
          role="cell"
          x={(i * width) / datasLength + margin.left + width / (2 * datasLength) + svgWidth}
          y={svgHeight - calculateBarHeight(value2, maxDatasValue2) - margin.bottom - 5}
          text-anchor="middle">{value2.toFixed(2)}</text
        >
      </g>
    {/if}
    <g role="row"
      transform={`translate(${fullSvgWidth / 5 + (i % 2) * (fullSvgWidth / 2.5)}, ${svgHeight - 40 + (Math.floor(i / 2) + 1) * 35})`}>
      <rect width="20" height="20" fill={color} mask="url(#mask-{i})" />
      <text role="columnheader" x="25" y="15">{translate(label)}</text>
    </g>
  {/each}
  </g>
  <text
    transform={`rotate(-90) translate(${-svgHeight / 2},${margin.left - 15})`}
    text-anchor="middle">{translate(yLabel)}</text
  >
  <text
    transform={`rotate(-90) translate(${-svgHeight / 2},${margin.left + svgWidth - 15})`}
    text-anchor="middle">{yLabel2 ? translate(yLabel2) : ""}</text
  >
</svg>
<style lang="scss">
    h3{
        font-weight: bold;
        font-size: var(--font-size--xl);
        text-align: center;
        color: var(--color--green);
    }
</style>