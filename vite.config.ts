import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { crx } from '@crxjs/vite-plugin';
import manifest from './extension/manifest.json';

const viteManifestHackIssue846: any & { renderCrxManifest: (manifest: any, bundle: any) => void } =
  {
    // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
    name: 'manifestHackIssue846',
    renderCrxManifest(_manifest: any, bundle: { [x: string]: any; }) {
      bundle['manifest.json'] = bundle['.vite/manifest.json'];
      bundle['manifest.json'].fileName = 'manifest.json';
      delete bundle['.vite/manifest.json'];
    },
  };

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      // add any html pages here
      input: {
        // output file at '/index.html'
        index: 'src/index.html',
      },
    },
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
  envDir: 'src/',
  plugins: [svelte(), viteManifestHackIssue846, crx({ manifest })],
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
  },
});
