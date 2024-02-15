<script lang="ts">
  import { translate } from 'src/utils/utils';
  import { WarnIcon } from 'src/assets/icons';
  export let message: string;
</script>

<div class="alert" aria-describedby="Zone d'information" role="alert">
  <WarnIcon />
  <p class="development-message">{translate(message)}</p>
</div>

<style lang="scss">
  .alert {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 var(--spacing--md);
    color: #0d479a;
    background-color: #cfe2ff;
    border-radius: var(--border-radius--slight);
    margin: var(--spacing--md) 0;
    font-size: smaller;

    p {
      margin-left: var(--spacing--md);
    }
  }
</style>
