<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { WarnIcon } from 'src/assets/icons';
  import { AlertTypeEnum } from 'src/enum';
  export let message: string;
  export let alertType: AlertTypeEnum = AlertTypeEnum.INFO;
</script>

<div class={`flex-center alert ${alertType}`}>
  <WarnIcon />
  <p class="development-message">{translate(message)}</p>
</div>

<style lang="scss">
  .alert {
    padding: 0 var(--spacing--md);
    border-radius: var(--border-radius--slight);
    margin: var(--spacing--md) 0;
    font-size: smaller;

    p {
      margin-left: var(--spacing--md);
    }
  }
  .info {
    color: #2e5aac;
    background-color: #eef2fa;
  }
  .warning {
    color: #b95000;
    background-color: #fff4ec;
  }
  .error {
    color: #da1414;
    background-color: #feefef;
  }
</style>
