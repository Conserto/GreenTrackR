<script lang="ts">
  import { translate } from 'src/utils/utils';
  import type { Measure } from 'src/interface';
  import { Units } from 'src/const';

  export let measure: Measure;
  const sizeUnCompressKo = Math.round(measure.network.sizeUncompress / 1000);
</script>

<div class="emissions-infos">
  <p class="emissions-infos_label">{translate('infoMix')}</p>
  <div class="emissions-infos_data">
    <div class="data country">
      <span class="data-label">{translate('gesZone')}</span>
      <span class="data-value">{`${measure.cityName}, ${measure.zone}`}</span>
    </div>
    <div class="data intensity">
      <span class="data-label">{translate('gesIntensity')}</span>
      <span class="data-value">{measure.carbonIntensity} {Units.carbonIntensity}</span>
    </div>
    <div class="data page-size">
      <span class="data-label">{translate('sizeTransferredBytes')}</span>
      <span class="data-value">{sizeUnCompressKo} {Units.pageSize}</span>
    </div>
    <div class="data request-number">
      <span class="data-label">{translate('nbRequest')}</span>
      <span class="data-value">{measure.nbRequest}</span>
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
