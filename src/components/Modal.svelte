<div class="overlay">
  <div class="modal">
    <slot />
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: var(--spacing--xl);
    border: var(--border-width--thin) solid #ccc;
    box-shadow: var(--box-shadow--sm);
    z-index: 1000;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
</style>
