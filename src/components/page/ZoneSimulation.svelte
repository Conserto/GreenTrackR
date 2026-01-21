<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formatSimulationLabel, translate } from 'src/utils';
  import { codeZone } from 'src/assets/data/codeZone';
  import { Select } from 'src/components/html';
  import { SEARCH_AUTO } from 'src/const/key.const';

  const dispatch = createEventDispatcher();

  // CRITICAL: ALWAYS initialize with a default value
  export let countryCodeSelected: string = SEARCH_AUTO;
  export let userCountryCodeSelected: string = SEARCH_AUTO;

  // Immediate initialization (safer than onMount)
  const zonesOptions = [
    { label: 'Automatique', value: SEARCH_AUTO },
    ...codeZone.map((zone) => ({
      label: formatSimulationLabel(zone),
      value: zone.zoneAlpha2
    }))
  ];

  function handleSubmitSimulation() {
    dispatch('submitSimulation', {
      countryCodeSelected,
      userCountryCodeSelected
    });
  }
</script>

<form class="zone-simulation">
  <div class="simulation-select simulation-region">
    <label for="simulation-server-region-label" class="simulation-select__label">
      {translate('serverRegionLabel')}
    </label>
    <Select
      bind:selectedValue={countryCodeSelected}
      selectValues={zonesOptions}
      name="simulation-server-region-label"
      style="max-width: 100%"
      on:selectChange={handleSubmitSimulation}
    />
  </div>

  <div class="simulation-select simulation-user">
    <label for="simulation-user-region-label" class="simulation-select__label">
      {translate('serverUserLabel')}
    </label>
    <Select
      bind:selectedValue={userCountryCodeSelected}
      selectValues={zonesOptions}
      name="simulation-user-region-label"
      style="max-width: 100%"
      on:selectChange={handleSubmitSimulation}
    />
  </div>
</form>