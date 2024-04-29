<script lang="ts">
  import { translate } from 'src/utils/utils';
  export let dialogLabelKey: string;
  export let showModal: boolean;
  let dialog: HTMLDialogElement;
  $: if (dialog && showModal) dialog.showModal();
  $: if (dialog && !showModal) dialog.close();
</script>

<dialog
  bind:this={dialog}
  aria-label="{translate(dialogLabelKey)}" >
    <slot />
</dialog>
<style>
    dialog {
        text-align: center;
    }
    ::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>