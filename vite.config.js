import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/autocomplete-api': {
        target: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/autocomplete-api/, ''),
      },
      '/details-api': {
        target: 'https://maps.googleapis.com/maps/api/place/details/json',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/details-api/, ''),
      },
    },
  },
});
