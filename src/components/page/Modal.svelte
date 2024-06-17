<script lang="ts">
  import { translate } from 'src/utils';
  export let dialogLabelKey: string;
  export let showModal: boolean;
  export let cssClass: string = 'default';
  let dialog: HTMLDialogElement;
  $: if (dialog && showModal) dialog.showModal();
  $: if (dialog && !showModal) dialog.close();
</script>

<dialog
  class="{cssClass}"
  bind:this={dialog}
  aria-label="{translate(dialogLabelKey)}">
  <slot />
</dialog>
<style>
    dialog {
        border-color: var(--color--grey)
    }

    .default {
        text-align: center;
    }

    ::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>