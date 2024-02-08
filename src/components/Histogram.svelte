<script lang="ts">
  import { translate } from 'src/utils/utils';
  import type { HistoData } from 'src/interface';

  export let datas: HistoData[];
  export let yLabel: string;

  $: datasLength = datas.length;
  $: svgWidth = datas.length * 125;
  const svgHeight = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  $: width = svgWidth - margin.left - margin.right;
  $: height = svgHeight - margin.top - margin.bottom;

  function calculateBarHeight(value) {
    const yScale = height / Math.max(...datas.map((d) => d.value));
    return value * yScale;
  }
</script>

<svg width={svgWidth} height={svgHeight + 150}>
  {#each datas as { label, value, color }, i}
    <g>
      <rect
        style:fill={color}
        x={(i * width) / datasLength + margin.left}
        y={svgHeight - calculateBarHeight(value) - margin.bottom}
        width={width / datasLength - 5}
        height={calculateBarHeight(value)}
      />
      <text
        transform={`rotate(-90) translate(${-svgHeight - 35},${(i * width) / datasLength + margin.left + width / (2 * datasLength)})`}
        text-anchor="middle">{translate(label)}</text
      >
      <text
        x={(i * width) / datasLength + margin.left + width / (2 * datasLength)}
        y={svgHeight - calculateBarHeight(value) - margin.bottom - 5}
        text-anchor="middle">{value}</text
      >
      <text
        transform={`rotate(-90) translate(${-svgHeight / 2},${margin.left - 15})`}
        text-anchor="middle">{translate(yLabel)}</text
      >
    </g>
  {/each}
</svg>

<style>
</style>
