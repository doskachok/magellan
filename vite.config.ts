/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Keep the CRA-style variable names so CI secrets (REACT_APP_BASE_URL) keep working.
  envPrefix: 'REACT_APP_',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      // Registration and the web manifest are handled by serviceWorkerRegistration.js and public/manifest.json.
      injectRegister: false,
      manifest: false,
      injectManifest: {
        // Locale JSON is precached with the code that uses it: left to the runtime cache, a stale copy of a
        // namespace outlives an update and new keys render untranslated until the next reload.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,woff2,json}'],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    passWithNoTests: true,
  },
});
