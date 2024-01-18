import './assets/styles/app.css';
import App from './App.svelte';
import inspectTags from './utils/i18n';
const targetElement = window.document.getElementById('app');

if (targetElement) {
  const app = new App({
    target: targetElement,
    props: {
    },
  });
}
document.addEventListener('DOMContentLoaded', function () {
  inspectTags();
});
