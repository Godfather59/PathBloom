import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    typeof process !== 'undefined' &&
      process.env &&
      process.env.ANALYZE &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/bundle-analysis.html',
      }),
  ].filter(Boolean),
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replace(/\\/g, '/');
          if (
            moduleId.includes('/node_modules/react/') ||
            moduleId.includes('/node_modules/react-dom/')
          ) {
            return 'vendor';
          }
          if (moduleId.includes('/node_modules/')) {
            return 'dependencies';
          }
          if (moduleId.includes('/src/logic/i18n.js')) {
            return 'translations';
          }
          if (moduleId.includes('/src/logic/')) {
            if (moduleId.includes('/src/logic/Person.js')) {
              return 'person';
            }
            if (moduleId.includes('/src/logic/GameEngine.js')) {
              return 'engine';
            }
            if (moduleId.includes('/src/logic/Events.js')) {
              return 'events';
            }
            if (moduleId.includes('/src/logic/Job.js')) {
              return 'jobs';
            }
            return 'game-logic';
          }
          if (moduleId.includes('/src/components/')) {
            return 'components';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: 'esbuild',
  },
});
