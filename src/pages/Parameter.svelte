<script lang="ts">
  import { getLocalStorageObject, setLocalStorageObject, translate, translateDescription } from 'src/utils/utils';
  import { ButtonTypeEnum, InputTypeEnum } from '../enum';
  import { Input } from '../components';
  import Button from '../components/Button.svelte';
  import { onMount } from 'svelte';
  import { paramRetry, paramTokenCo2 } from '../const';
  import { VITE_MAX_HAR_RETRIES_DEFAULT } from '../const/config.const';
  import { logDebug } from '../utils/log';

  let co2TokenStr: string;
  let nbRetry: number;
  let nbRetryStr: string;

  onMount(() => {
    co2TokenStr = getLocalStorageObject(paramTokenCo2) ?? '';
    nbRetry = getLocalStorageObject(paramRetry) ?? VITE_MAX_HAR_RETRIES_DEFAULT;
    logDebug(`nbRetry=${nbRetry} / co2TokenStr=${co2TokenStr}`);
    nbRetryStr = nbRetry.toString();
  });

  const onSaveParameters = () => {
    setLocalStorageObject(paramTokenCo2, co2TokenStr);
    setLocalStorageObject(paramRetry, nbRetry);
    location.reload();
  };

</script>

<h1 class="plugin-title">{translate('paramTabTitle')}</h1>

<div class="parameter-container">
  <div class="parameter">
    <p>{translate('paramTokenCo2Description')}
      <a
        href="{translateDescription('paramTokenCo2Description')}">{translateDescription('paramTokenCo2Description')}</a>
    </p>
    <Input
      type={InputTypeEnum.TEXT}
      name="co2Token"
      bind:value={co2TokenStr}
      translateKey="paramCo2TokenLabel"
    />
  </div>
  <div class="parameter">
    <p>{translate('paramRetryDescription')}</p>
    <Input
      type={InputTypeEnum.NUMBER}
      name="nbRetry"
      bind:value={nbRetryStr}
      translateKey="paramNbRetryLabel"
    />
  </div>
</div>

<Button
  on:buttonClick={onSaveParameters}
  buttonType={ButtonTypeEnum.PRIMARY}
  translateKey="paramBtnSave"
  tooltip={true}
/>

<style lang="scss">
  .plugin-title {
    font-size: var(--font-size--xxl);
    color: var(--color--green);
    text-align: center;
  }

  div.parameter-container {
    max-width: 95%;
    min-width: 80%;
    justify-content: flex-start;
    padding-bottom: 1em;

    & div.parameter {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      margin-top: var(--spacing--md);
      margin-bottom: var(--spacing--md);
      box-shadow: var(--box-shadow--md);
      padding: var(--spacing--xxl);
      max-width: 90%;
    }
  }

</style>
