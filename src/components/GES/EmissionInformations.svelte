<script lang="ts">
  import { formatNumber, formatSize, translate } from 'src/utils/utils';
  import type { Measure } from 'src/interface';
  import { Units } from 'src/const';

  export let measure: Measure;
</script>

<div class="emissions-infos">
  <p>{translate('infoMix')}</p>
  <div class="emissions-infos_data">
    <div>
      <span class="data-label">{translate('gesZone')}</span>
      <span class="data-value"
        >{measure.cityName ? `${measure.cityName}, ${measure.zone}` : measure.zone}</span
      >
    </div>
    <div>
      <span class="data-label">{translate('sizeTransferredBytesCompressed')}</span>
      <span class="data-value">{formatSize(measure.network.size)} {Units.pageSize}</span>
    </div>
    <div>
      <span class="data-label">{translate('gesIntensity')}</span>
      <span class="data-value">{measure.carbonIntensity} {Units.carbonIntensity}</span>
    </div>
    <div>
      <span class="data-label">{translate('nbRequest')}</span>
      <span class="data-value">{measure.nbRequest}</span>
    </div>
    <div>
      <span class="data-label">{translate('DOM')}</span>
      <span class="data-value">{measure.dom}</span>
    </div>
    <div>
      <span class="data-label">{translate('sizeTransferredBytesUncompressed')}</span>
      <span class="data-value">{formatSize(measure.network.sizeUncompress)} {Units.pageSize}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .emissions-infos {
    grid-column: span 2;

    &_data {
      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: auto auto auto auto;
    }
  }

  .data-label {
    font-weight: var(--font-weight--bold);
    margin-bottom: var(--spacing--sm);
  }

  .data-label,
  .data-value {
    display: flex;
    text-align: center;
    justify-content: center;
    width: 100%;
  }
</style>
