import './assets/styles/app.scss';
import App from './App.svelte';
const targetElement = window.document.getElementById('app');

if (targetElement) {
  const app = new App({
    target: targetElement,
    props: {},
  });
}
