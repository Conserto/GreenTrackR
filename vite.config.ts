import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { crx } from '@crxjs/vite-plugin';
import manifest from './extension/manifest.json';

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
  plugins: [
    svelte(),
    crx({ manifest }),
  ],
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
  },
});
