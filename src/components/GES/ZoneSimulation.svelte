<script lang="ts">
  import { onMount } from 'svelte';
  import { translate } from 'src/utils/utils';
  import { createEventDispatcher } from 'svelte';
  import { codeZone } from 'src/assets/data/codeZone';

  import { MeasureAcquisition } from 'src/utils/service/MeasureAcquisition.service';

  import { Select, Button } from 'src/components';
  import { ButtonTypeEnum } from 'src/enum';

  let zonesOptions, countryCodeSelected, userCountryCodeSelected;
  const dispatch = createEventDispatcher();

  onMount(async () => {
    zonesOptions = [
      { label: 'Automatique', value: 'auto' },
      ...codeZone.map((zone) => ({ label: zone.countryName, value: zone.zone })),
    ];
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
    <Select bind:selectedValue={countryCodeSelected} selectValues={zonesOptions} />
  </div>
  <div class="simulation-select simulation-user">
    <span class="simulation-select__label">{translate('serverUserLabel')}</span>
    <Select bind:selectedValue={userCountryCodeSelected} selectValues={zonesOptions} />
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
