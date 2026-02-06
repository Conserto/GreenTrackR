import '../../assets/styles/app.scss';
import '../../assets/styles/components.scss';
import '../../assets/styles/root.scss';
import App from './App.svelte';

const targetElement = window.document.getElementById('app');

if (targetElement) {
  new App({
    target: targetElement,
    props: {},
  });
}
