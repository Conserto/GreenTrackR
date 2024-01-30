<script lang="ts">
  import { MeasureAcquisition } from 'src/utils/classes/MeasureAcquisition.ts';
  import { zonesLabels as zonesLabelsFile } from 'src/assets/data/zones';
  import { onMount } from 'svelte';
  import { translate } from 'src/utils/utils';

  import Select from '../Select.svelte';
  import Button from '../Button.svelte';

  let zonesOptions;

  onMount(async () => {
    const zones = await MeasureAcquisition.getZones();

    zonesOptions = zones.reduce(
      (acc, countryZone) => {
        countryZone.zones.map((zoneValue) => {
          const zoneLabel = `${zoneValue} / ${zonesLabelsFile[zoneValue]?.zoneName}`;
          acc = [...acc, { label: zoneLabel, value: zoneValue }];
          return acc;
        }, []);

        return acc;
      },
      [{ label: 'Selectionnez votre zone', value: 'default' }],
    );
  });

  function handleSubmitSimulation(e) {
    console.info('submitted', e);
  }
</script>

<form class="zone-simulation" on:submit|preventDefault={handleSubmitSimulation}>
  <div class="simulation-select simulation-region">
    <span class="simulation-select__label">{translate('serverRegionLabel')}</span>
    <Select selectValues={zonesOptions} translateDefaultKey="serverRegionLabel" />
  </div>
  <div class="simulation-select simulation-user">
    <span class="simulation-select__label">{translate('serverUserLabel')}</span>
    <Select selectValues={zonesOptions} translateDefaultKey="serverUserLabel" />
  </div>
  <Button translateKey="validateRegionButton"></Button>
</form>

<style lang="scss">
  .zone-simulation {
    display: grid;
    flex-wrap: wrap;
    /* flex-direction: column; */
    justify-items: center;
  }

  .simulation-select {
    display: flex;
    flex-wrap: wrap;
    justify-self: stretch;
    justify-content: space-around;
    margin: var(--spacing--md) 0;

    &__label {
      margin-right: var(--spacing--xl);
    }
  }
</style>
