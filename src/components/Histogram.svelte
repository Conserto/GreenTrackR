<script lang="ts">
  import { translate } from 'src/utils/utils';
  import type { HistoData } from 'src/interface';

  export let datas: HistoData[];
  export let yLabel: string;
  export let yLabel2: string | null = null;

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

<div>
  <svg width={fullSvgWidth} height={svgHeight + 75}>
    {#each datas as { label, value, value2, color }, i}
      <g>
        <rect
          style:fill={color}
          x={(i * width) / datasLength + margin.left}
          y={svgHeight - calculateBarHeight(value, maxDatasValue) - margin.bottom}
          width={width / datasLength - 5}
          height={calculateBarHeight(value, maxDatasValue)} />
        <text
          x={(i * width) / datasLength + margin.left + width / (2 * datasLength)}
          y={svgHeight - calculateBarHeight(value, maxDatasValue) - margin.bottom - 5}
          text-anchor="middle">{value.toFixed(2)}</text>
      </g>
      {#if yLabel2}
        <g>
          <rect
            style:fill={color}
            x={(i * width) / datasLength + margin.left + svgWidth}
            y={svgHeight - calculateBarHeight(value2, maxDatasValue2) - margin.bottom}
            width={width / datasLength - 5}
            height={calculateBarHeight(value2, maxDatasValue2)}
          />
          <text
            x={(i * width) / datasLength + margin.left + width / (2 * datasLength) + svgWidth}
            y={svgHeight - calculateBarHeight(value2, maxDatasValue2) - margin.bottom - 5}
            text-anchor="middle">{value2.toFixed(2)}</text
          >
        </g>
      {/if}
      <g
        transform={`translate(${fullSvgWidth / 5 + (i % 2) * (fullSvgWidth / 2.5)}, ${svgHeight - 40 + (Math.floor(i / 2) + 1) * 35})`}
      >
        <rect width="20" height="20" fill={color} />
        <text x="25" y="15">{translate(label)}</text>
      </g>
    {/each}
    <text
      transform={`rotate(-90) translate(${-svgHeight / 2},${margin.left - 15})`}
      text-anchor="middle">{translate(yLabel)}</text
    >
    <text
      transform={`rotate(-90) translate(${-svgHeight / 2},${margin.left + svgWidth - 15})`}
      text-anchor="middle">{yLabel2 ? translate(yLabel2) : ""}</text
    >
  </svg>
</div>
