<script lang="ts">
  export let isActive: boolean;
</script>

<div class="empty-content" class:active={isActive}>
  <p class="empty-content-message">{chrome.i18n.getMessage('nocontentPhraseEvaluation')}</p>
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
    font-size: 2.5rem;
    font-weight: bold;
    color: rgb(96, 128, 108);
    font-family: system-ui;
  }
</style>
