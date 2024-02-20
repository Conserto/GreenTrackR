<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { CarIcon, PhoneIcon } from 'src/assets/icons';
  import { NUMBER_OF_VISITS, CAR_AVERAGE_CO2, PHONE_AVERAGE_CO2 } from 'src/const/measure.const';
  import { Input } from 'src/components';
  import { InputTypeEnum } from 'src/enum';

  export let measure: any;

  let visitsNumber = NUMBER_OF_VISITS >= 1 ? NUMBER_OF_VISITS : 1000;

  $: carEquivalent = ((measure.ges.websiteTotal / CAR_AVERAGE_CO2) * visitsNumber).toFixed(2);
  $: phoneEquivalent = ((measure.ges.websiteTotal / PHONE_AVERAGE_CO2) * visitsNumber).toFixed(2);
</script>

<p class="label-equivalent">
  <Input
    type={InputTypeEnum.NUMBER}
    name="numberVisit"
    bind:value={visitsNumber}
    translateKey="eitherFor"
  />
  &nbsp;
  {translate('visitEquivalent')}
</p>
<div class="values-equivalent flex-center">
  <div class="car-equivalent">
    <img class="car-icon" src={CarIcon} alt="car" />
    <span>{carEquivalent} {translate('carIndicator')}</span>
  </div>

  <span>&nbsp;ou&nbsp;</span>
  <div class="phone-equivalent">
    <img class="phone-icon" src={PhoneIcon} alt="phone" />
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

  .label-equivalent,
  .values-equivalent {
    font-weight: var(--font-weight--bold);
    font-size: var(--font-size--sm);
  }

  .car-equivalent,
  .phone-equivalent {
    display: flex;
    align-items: center;
  }
</style>
