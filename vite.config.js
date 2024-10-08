import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/place-api': {
        target: 'https://maps.googleapis.com/maps/api/place/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/place-api/, ''),
      },
    },
  },
});
