<script lang="ts">
  import { translate } from 'src/utils';
  import { CarIcon, PhoneIcon } from 'src/assets/icons';
  import { CAR_AVERAGE_CO2, NUMBER_OF_VISITS, PHONE_AVERAGE_CO2 } from 'src/const/measure.const';
  import { InputTypeEnum } from 'src/enum';
  import type { Measure } from 'src/interface';
  import { Input } from 'src/components/html';

  export let measure: Measure | undefined;

  let visitsNumber = NUMBER_OF_VISITS >= 1 ? NUMBER_OF_VISITS : 1000;

  $: carEquivalent = (((measure?.ges?.pageTotal ? measure.ges.pageTotal : 0) / CAR_AVERAGE_CO2) * visitsNumber).toFixed(2);
  $: phoneEquivalent = (((measure?.ges?.pageTotal ? measure.ges.pageTotal : 0) / PHONE_AVERAGE_CO2) * visitsNumber).toFixed(2);
</script>

<div class="visit-eq-container">
  <Input
    type={InputTypeEnum.NUMBER}
    name="numberVisit"
    bind:value={visitsNumber}
    translateKey="eitherFor"
  />
  <p>{translate('visitEquivalent')}</p>
  <div class="equivalent-container">
    <img class="car-icon" src={CarIcon} alt="" loading="lazy" />
    <span>{carEquivalent} {translate('carIndicator')}</span>
  </div>

  <p>ou</p>
  <div class="equivalent-container">
    <img class="phone-icon" src={PhoneIcon} alt="" loading="lazy" />
    <span>{phoneEquivalent} {translate('smartphoneIndicator')}</span>
  </div>
</div>

<style lang="scss">
  .car-icon,
  .phone-icon {
    width: var(--img_icon_size--size);
    height: var(--img_icon_size--size);
    margin: var(--spacing--xs);
  }

  .visit-eq-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing--sm);
    font-weight: var(--font-weight--bold);
    font-size: var(--font-size--sm);
  }

  .equivalent-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
