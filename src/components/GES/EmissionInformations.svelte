<script lang="ts">
  import { formatSize, translate } from 'src/utils/utils';
  import type { Measure } from 'src/interface';
  import { Units } from 'src/const';

  export let measure: Measure | undefined;
</script>

<div class="emissions-infos">
  <p class="info-mix">{translate('infoMix')}</p>
  <div class="emissions-infos_data">
    <div>
      <span class="data-label">{translate('gesZone')}</span>
      <span class="data-value">{measure?.serverGES?.cityName
        ? `${measure?.serverGES.cityName}, ${measure?.serverGES.countryName}`
        : measure?.serverGES?.countryName}</span>
    </div>
    <div>
      <span class="data-label">{translate('gesUserZone')}</span>
      <span class="data-value">{measure?.userGES?.cityName
        ? `${measure?.userGES.cityName}, ${measure?.userGES.countryName}`
        : measure?.userGES?.countryName}</span>
    </div>
    <div>
      <span class="data-label">{translate('sizeTransferredBytes')}</span>
      <span class="data-value">{formatSize(measure?.networkMeasure.network.size)} {Units.pageSize}
        / {formatSize(measure?.networkMeasure.network.sizeUncompress)} {Units.pageSize}</span>
    </div>
    <div>
      <span class="data-label">{translate('gesIntensity')}</span>
      <span class="data-value">{measure?.serverGES?.carbonIntensity} {Units.carbonIntensity}</span>
    </div>
    <div>
      <span class="data-label">{translate('gesUserIntensity')}</span>
      <span class="data-value">{measure?.userGES?.carbonIntensity} {Units.carbonIntensity}</span>
    </div>
    <div>
      <span class="data-label">{translate('nbRequest')}</span>
      <span class="data-value">{measure?.networkMeasure.nbRequest} ({measure?.networkMeasure.nbRequestCache})</span>
    </div>
  </div>
</div>

<style lang="scss">
  .emissions-infos {
    grid-column: span 2;
    padding: var(--spacing--xl);

    &_data {
      display: grid;
      gap: var(--spacing--lg);
      grid-template-rows: auto auto;
      grid-template-columns: auto auto auto;
      // Resize when more infos are displayed
      // grid-template-columns: auto auto auto auto;
    }
  }

  .info-mix {
    text-align: center;
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
