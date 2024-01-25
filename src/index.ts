import './assets/styles/app.css';
import App from './App.svelte';
const targetElement = window.document.getElementById('app');

if (targetElement) {
  const app = new App({
    target: targetElement,
    props: {},
  });
}
