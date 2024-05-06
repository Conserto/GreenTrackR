<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { translate } from 'src/utils/utils';
  import { codeZone } from 'src/assets/data/codeZone';

  import { Select } from 'src/components';
  import { SEARCH_AUTO } from '../../const/key.const';

  let zonesOptions: any[], countryCodeSelected: string, userCountryCodeSelected: string;
  const dispatch = createEventDispatcher();

  onMount(async () => {
    zonesOptions = [
      { label: 'Automatique', value: SEARCH_AUTO },
      ...codeZone.map((zone) => ({ label: zone.countryName, value: zone.zone }))
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
    <label for="simulation-server-region-label" class="simulation-select__label">{translate('serverRegionLabel')}</label>
    <Select bind:selectedValue={countryCodeSelected} selectValues={zonesOptions}
            name="simulation-server-region-label" style="max-width: 48%" on:selectChange={handleSubmitSimulation} />
  </div>
  <div class="simulation-select simulation-user">
    <label for="simulation-user-region-label" class="simulation-select__label">{translate('serverUserLabel')}</label>
    <Select bind:selectedValue={userCountryCodeSelected} selectValues={zonesOptions}
            name="simulation-user-region-label" style="max-width: 48%" on:selectChange={handleSubmitSimulation} />
  </div>
</form>


<style lang="scss">

  .simulation-select {
    display: block;
    width: 100%;
    margin: var(--spacing--md) 0;

    &__label {
      display: inline-block;
      width: 48%;
      text-align: right;
      padding-right: 1em;
    }

  }
</style>
