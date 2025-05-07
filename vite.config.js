import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: './', // якщо index.html знаходиться в корені проекту
    build: {
      sourcemap: true,
      rollupOptions: {
        input: './index.html', // вказуємо правильний шлях до index.html
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'; // модули з node_modules окремо
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
      outDir: './dist', // вихідна папка dist
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      FullReload(['./index.html']), // слухаємо зміни в index.html
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});