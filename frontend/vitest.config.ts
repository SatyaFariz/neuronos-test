import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      exclude: [
        './tailwind.config.js',
        './postcss.config.js',
        './vite.config.ts',
        './vitest.config.ts',
        './src/main.tsx',
        './dist'
      ],
    },
  },
});