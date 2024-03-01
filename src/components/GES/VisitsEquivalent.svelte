<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { CarIcon, PhoneIcon } from 'src/assets/icons';
  import { NUMBER_OF_VISITS, CAR_AVERAGE_CO2, PHONE_AVERAGE_CO2 } from 'src/const/measure.const';
  import { Input } from 'src/components';
  import { InputTypeEnum } from 'src/enum';

  export let measure: any;

  let visitsNumber = NUMBER_OF_VISITS >= 1 ? NUMBER_OF_VISITS : 1000;

  $: carEquivalent = ((measure.ges.pageTotal / CAR_AVERAGE_CO2) * visitsNumber).toFixed(2);
  $: phoneEquivalent = ((measure.ges.pageTotal / PHONE_AVERAGE_CO2) * visitsNumber).toFixed(2);
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
    <img class="car-icon" src={CarIcon} alt="car" loading="lazy" />
    <span>{carEquivalent} {translate('carIndicator')}</span>
  </div>

  <p>ou</p>
  <div class="equivalent-container">
    <img class="phone-icon" src={PhoneIcon} alt="phone" loading="lazy" />
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
