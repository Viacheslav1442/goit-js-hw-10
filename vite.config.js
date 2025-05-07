import { defineConfig } from 'vite';
import { globSync } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src', // Коренева папка проєкту тепер src
    build: {
      sourcemap: true,
      rollupOptions: {
        input: globSync('./src/*.html'), // правильний шлях до HTML-файлів
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist', // оскільки root — це src, вихідна папка повинна бути на рівень вище
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      FullReload(['src/**/*.html']), // слухаємо всі HTML-файли у src
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});