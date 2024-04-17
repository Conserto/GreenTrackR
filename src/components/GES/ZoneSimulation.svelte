<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { getLocalStorageObject, translate } from 'src/utils/utils';
  import { codeZone } from 'src/assets/data/codeZone';

  import { Alert, Select } from 'src/components';
  import { SEARCH_AUTO } from '../../const/key.const';
  import Tooltip from '../Tooltip.svelte';
  import { AlertTypeEnum } from '../../enum';
  import { paramTokenCo2 } from '../../const';
  import { logInfo } from '../../utils/log';

  let zonesOptions: any[], countryCodeSelected: string, userCountryCodeSelected: string;
  const dispatch = createEventDispatcher();
  let checked = false;

  onMount(async () => {
    zonesOptions = [
      { label: 'Automatique', value: SEARCH_AUTO },
      ...codeZone.map((zone) => ({ label: zone.countryName, value: zone.zone }))
    ];
  });

  function checkToken(event) {
    checked = !checked;
    setTimeout(() => event.target.checked = checked, 0);
    logInfo('Checked ' + checked);
    if (checked && !getLocalStorageObject(paramTokenCo2)) {
      document.getElementById('simulation-data-token').style.display = 'block';
    } else {
      document.getElementById('simulation-data-token').style.display = 'none';
    }
  }

  function handleSubmitSimulation() {
    dispatch('submitSimulation', {
      countryCodeSelected,
      userCountryCodeSelected,
      checked
    });
  }
</script>


<form class="zone-simulation">
  <div class="simulation-select simulation-region">
    <span class="simulation-select__label">{translate('serverRegionLabel')}</span>
    <Select bind:selectedValue={countryCodeSelected} selectValues={zonesOptions}
            name="simulation-server-region-label" style="max-width: 48%" on:selectChange={handleSubmitSimulation} />
  </div>
  <div class="simulation-select simulation-user">
    <span class="simulation-select__label">{translate('serverUserLabel')}</span>
    <Select bind:selectedValue={userCountryCodeSelected} selectValues={zonesOptions}
            name="simulation-user-region-label" style="max-width: 48%" on:selectChange={handleSubmitSimulation} />
  </div>
  <div class="simulation-case simulation-live">
    <span class="simulation-case__label"><Tooltip translateKey="{translate('liveDatas')}" top="{true}" /></span>
    <input type="checkbox" name="simulation-data-live-label" checked={checked} on:click|preventDefault={checkToken} />
  </div>
</form>
<div id="simulation-data-token">
  <Alert message="errorNoToken" alertType={AlertTypeEnum.ERROR} />
</div>


<style lang="scss">

  #simulation-data-token {
    display: none;
  }

  .simulation-select, .simulation-case {
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
