<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { formatSimulationLabel, translate } from 'src/utils';
  import { codeZone } from 'src/assets/data/codeZone';

  import { Select } from 'src/components/html';
  import { SEARCH_AUTO } from 'src/const/key.const';

  let zonesOptions: any[], countryCodeSelected: string, userCountryCodeSelected: string;
  const dispatch = createEventDispatcher();

  onMount(async () => {
    zonesOptions = [
      { label: 'Automatique', value: SEARCH_AUTO },
      ...codeZone.map((zone) => ({ label: formatSimulationLabel(zone), value: zone.zoneAlpha2 }))
    ];
  });

  function handleSubmitSimulation() {
    dispatch('submitSimulation', {
      countryCodeSelected,
      userCountryCodeSelected
    });
  }
</script>


<form class="zone-simulation">
  <div class="simulation-select simulation-region">
    <label for="simulation-server-region-label"
           class="simulation-select__label">{translate('serverRegionLabel')}</label>
    <Select bind:selectedValue={countryCodeSelected} selectValues={zonesOptions}
            name="simulation-server-region-label" style="max-width: 100%" on:selectChange={handleSubmitSimulation} />
  </div>
  <div class="simulation-select simulation-user">
    <label for="simulation-user-region-label" class="simulation-select__label">{translate('serverUserLabel')}</label>
    <Select bind:selectedValue={userCountryCodeSelected} selectValues={zonesOptions}
            name="simulation-user-region-label" style="max-width: 100%" on:selectChange={handleSubmitSimulation} />
  </div>
</form>

<style lang="scss">

  .simulation-select {
    display: block;
    width: 100%;
    margin: var(--spacing--md) 0;

    &__label {
      display: inline-block;
      padding-right: 1em;
    }

  }
</style>
