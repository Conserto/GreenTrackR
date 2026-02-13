import { defineConfig } from 'wxt';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  srcDir: 'src',

  modules: ['@wxt-dev/module-svelte'],

  manifestVersion: process.env.TARGET == "firefox" ? 2 : 3,

  manifest: {
    name: 'GreenTrackR',
    description: '__MSG_extDesc__',
    version: pkg.version,
    default_locale: 'fr',

    // Required permissions for core features
    permissions: ['tabs', 'activeTab', 'scripting', 'browsingData', 'webNavigation', 'webRequest'],

    // Grants access to all URLs for content script injection
    host_permissions: ['<all_urls>'],

    // Specific firefox
    browser_specific_settings: {
      gecko: {
        id: 'greentrackr@conserto.pro',
        // @ts-ignore
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },

    // DevTools page configuration
    // This enables browser.devtools.* APIs in the devtools panel
    devtools_page: 'devtools.html',

    icons: {
      16: 'images/icon-16.png',
      32: 'images/icon-32.png',
      48: 'images/icon-48.png',
      64: 'images/icon-64.png',
      128: 'images/icon-128.png',
      512: 'images/icon-512.png',
    },
      
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