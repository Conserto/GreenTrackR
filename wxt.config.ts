import { defineConfig } from 'wxt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  srcDir: 'src',

  modules: ['@wxt-dev/module-svelte'],

  manifest: {
    name: 'GreenTrackR',
    description: "Web sustainability and environmental footprint analysis tool",
    version: '2.2.3',
    default_locale: 'fr',

    // Required permissions for core features
    permissions: [
      'tabs',
      'activeTab',
      'scripting',
      'browsingData',
      'storage',
      'webNavigation',
      'webRequest',
    ],

    // Grants access to all URLs for content script injection
    host_permissions: [
      '<all_urls>'
    ],

    // DevTools page configuration
    // This enables browser.devtools.* APIs in the devtools panel
    devtools_page: 'devtools.html',
  },

  vite: () => ({
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
  }),
});