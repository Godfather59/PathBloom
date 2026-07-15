import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const removeCrossOrigin = () => ({
  name: 'remove-crossorigin',
  enforce: 'post',
  closeBundle() {
    const htmlPath = resolve(__dirname, 'dist', 'index.html');
    if (existsSync(htmlPath)) {
      let html = readFileSync(htmlPath, 'utf-8');
      html = html
        .replace(/\s*crossorigin(=["'][^"']*["'])?/gi, '')
        .replace(/<link\s+rel="modulepreload"[^>]*>\s*/gi, '');
      writeFileSync(htmlPath, html, 'utf-8');
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    removeCrossOrigin(),
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
