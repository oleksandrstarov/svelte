import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
  },
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
