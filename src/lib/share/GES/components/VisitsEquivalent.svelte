<!-- Bloc contenant VisitEquivalent et CO2Equivalent -->
<script lang="ts">
  import { translate } from 'src/utils/utils';
  import carIcon from '/icons/car.png';
  import phoneIcon from '/icons/phone.png';

  import { NUMBER_OF_VISITS, CAR_AVERAGE_CO2, PHONE_AVERAGE_CO2 } from 'src/const/measure.const';
  import { Input } from 'src/lib/share/atoms';
  import { InputTypeEnum } from 'src/enum';
  export let measure: any;

  const carEquivalent = ((measure.ges.websiteTotal / CAR_AVERAGE_CO2) * NUMBER_OF_VISITS).toFixed(
    2,
  );
  const phoneEquivalent = (
    (measure.ges.websiteTotal / PHONE_AVERAGE_CO2) *
    NUMBER_OF_VISITS
  ).toFixed(2);
</script>

<!-- Bloc 'Soit pour XXX visite de l'equivalent de XX km en voiture ou XX smartphones chargés -->
<div class="visits-equivalent">
  <span class="label-equivalent"
    >{translate('eitherFor')}
    <Input
      type={InputTypeEnum.TEXT}
      name="numberVisit"
      translateKey="visitEquivalent"
      value={NUMBER_OF_VISITS >= 1 ? NUMBER_OF_VISITS : 1000}
    />

    {translate('visitEquivalent')}</span
  >
  <div class="values-equivalent">
    <div class="car-equivalent">
      <img class="car-icon" src={carIcon} alt="car" />
      <span>{carEquivalent} {translate('carIndicator')}</span>
    </div>

    <span>&nbsp;ou&nbsp;</span>
    <div class="phone-equivalent">
      <img class="phone-icon" src={phoneIcon} alt="phone" />
      <span>{phoneEquivalent} {translate('smartphoneIndicator')}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .car-icon,
  .phone-icon {
    width: var(--img_icon_size--size);
    height: var(--img_icon_size--size);
    margin: var(--spacing--xs);
  }

  .label-equivalent {
    font-weight: var(--font-weight--bold);
    font-size: var(--font-size--sm);
  }

  .values-equivalent {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-weight: var(--font-weight--bold);
    font-size: var(--font-size--sm);
  }

  .car-equivalent,
  .phone-equivalent {
    display: flex;
    align-items: center;
  }
</style>
