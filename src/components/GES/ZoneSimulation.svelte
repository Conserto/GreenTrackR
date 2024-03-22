<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { translate } from 'src/utils/utils';
  import { codeZone } from 'src/assets/data/codeZone';

  import { Button, Select } from 'src/components';
  import { ButtonTypeEnum } from 'src/enum';
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

<form class="zone-simulation" on:submit|preventDefault={handleSubmitSimulation}>
  <div class="simulation-select simulation-region">
    <span class="simulation-select__label">{translate('serverRegionLabel')}</span>
    <Select bind:selectedValue={countryCodeSelected} selectValues={zonesOptions} name="simulation-server-region-label" />
  </div>
  <div class="simulation-select simulation-user">
    <span class="simulation-select__label">{translate('serverUserLabel')}</span>
    <Select bind:selectedValue={userCountryCodeSelected} selectValues={zonesOptions} name="simulation-user-region-label" />
  </div>
  <Button translateKey="validateRegionButton" buttonType={ButtonTypeEnum.SECONDARY}></Button>
</form>

<style lang="scss">
  .zone-simulation {
    display: grid;
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
