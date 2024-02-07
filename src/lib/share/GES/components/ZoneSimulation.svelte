<script lang="ts">
  import { onMount } from 'svelte';
  import { translate } from 'src/utils/utils';
  import { createEventDispatcher } from 'svelte';
  import { zonesLabels as zonesLabelsFile } from 'src/assets/data/zones';

  import { MeasureAcquisition } from 'src/utils/classes/MeasureAcquisition.ts';

  import { Select, Button } from 'src/lib/share/atoms';

  let zonesOptions, countryCodeSelected, userCountryCodeSelected;
  const dispatch = createEventDispatcher();

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
      [{ label: 'Automatique', value: 'auto' }],
    );
  });

  function handleSubmitSimulation() {
    dispatch('submitSimulation', {
      countryCodeSelected,
      userCountryCodeSelected,
    });
  }
</script>

<form class="zone-simulation" on:submit|preventDefault={handleSubmitSimulation}>
  <div class="simulation-select simulation-region">
    <span class="simulation-select__label">{translate('serverRegionLabel')}</span>
    <Select
      bind:selectedValue={countryCodeSelected}
      selectValues={zonesOptions}
      translateDefaultKey="serverRegionLabel"
    />
  </div>
  <div class="simulation-select simulation-user">
    <span class="simulation-select__label">{translate('serverUserLabel')}</span>
    <Select
      bind:selectedValue={userCountryCodeSelected}
      selectValues={zonesOptions}
      translateDefaultKey="serverUserLabel"
    />
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
