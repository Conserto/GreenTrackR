<script lang="ts">
  import { getLocalStorageObject, logDebug, setLocalStorageObject, translate } from 'src/utils';
  import { ButtonTypeEnum, InputTypeEnum } from 'src/enum';
  import { onMount } from 'svelte';
  import { paramRetry, paramTokenCo2 } from 'src/const';
  import { VITE_MAX_HAR_RETRIES_DEFAULT } from 'src/const/config.const';
  import { Button, Input } from 'src/components/html';
  import { Alert, Modal } from 'src/components/page';

  export let unavailable = false;

  let showModal = false;

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
    setLocalStorageObject(paramTokenCo2, co2TokenStr.trim());
    setLocalStorageObject(paramRetry, nbRetryStr);
    showModal = true;
  };
</script>

<div class="page-content">
  <h1 class="plugin-title">{translate('paramTabTitle')}</h1>

  <div class="parameter-container">
    <div class="parameter">

      <!-- Alert EN DEHORS du div grisé -->
      {#if unavailable}
        <Alert message="unavailableMessage" />
      {/if}

      <div class="parameter-content" class:disabled={unavailable}>
        <p>{translate('paramTokenCo2Description')}
          <a href="{translate('paramTokenCo2URL')}" target="_blank">{translate('paramTokenCo2URL')}</a>
        </p>
        <Input
          type={InputTypeEnum.TEXT}
          name="co2Token"
          bind:value={co2TokenStr}
          translateKey="paramCo2TokenLabel"
        />
      </div>
    </div>

    <div class="parameter">
      <div class="parameter-content">
        <p>{translate('paramRetryDescription')}</p>
        <Input
          type={InputTypeEnum.NUMBER}
          name="nbRetry"
          bind:value={nbRetryStr}
          translateKey="paramNbRetryLabel"
        />
      </div>
    </div>
  </div>

  <Modal dialogLabelKey="paramSaveTitle" bind:showModal>
    <h2>{translate('paramSaveMessage')}</h2>
    <Button
      on:buttonClick={() => (location.reload())}
      buttonType={ButtonTypeEnum.PRIMARY}
      translateKey="paramSavePopup"
    />
  </Modal>

  <Button
    on:buttonClick={onSaveParameters}
    buttonType={ButtonTypeEnum.PRIMARY}
    translateKey="paramBtnSave"
  />
</div>

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

  .parameter-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.disabled {
      filter: grayscale(100%) opacity(0.5);
      pointer-events: none;
    }
  }
</style>