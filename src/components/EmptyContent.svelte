<script lang="ts">
  import { translate } from 'src/utils/utils';

  export let isActive: boolean;
</script>

<div class="empty-content" class:active={isActive}>
  <p class="empty-content-message">{translate('nocontentPhraseEvaluation')}</p>
</div>

<style>
  .empty-content {
    display: none;
  }

  .empty-content.active {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }
  .empty-content-message {
    max-width: 600px;
    text-align: center;
    font-size: var(--font-size--xxl);
    font-weight: bold;
    color: var(--color--primary);
    font-family: system-ui;
  }
</style>
