<span class="loader"></span>

<style>
  .loader {
    width: 48px;
    height: 48px;
    display: inline-block;
    position: relative;
    margin-block: var(--spacing--xl);
  }
  .loader::after,
  .loader::before {
    content: '';
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid var(--color--green);
    position: absolute;
    left: 0;
    top: 0;
    animation: animloader 2s linear infinite;
  }
  .loader::after {
    animation-delay: 1s;
  }

  @keyframes animloader {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>
