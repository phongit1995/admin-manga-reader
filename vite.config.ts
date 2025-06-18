import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
      {
        find: '@src',
        replacement: path.resolve(process.cwd(), 'src'),
      },
      {
        find: '@api',
        replacement: path.resolve(process.cwd(), 'src/api'),
      },
      {
        find: '@pages',
        replacement: path.resolve(process.cwd(), 'src/pages'),
      },
      {
        find: '@components',
        replacement: path.resolve(process.cwd(), 'src/components'),
      },
      {
        find: '@sections',
        replacement: path.resolve(process.cwd(), 'src/sections'),
      },
      {
        find: '@layouts',
        replacement: path.resolve(process.cwd(), 'src/layouts'),
      },
      {
        find: '@utils',
        replacement: path.resolve(process.cwd(), 'src/utils'),
      },
      {
        find: '@config',
        replacement: path.resolve(process.cwd(), 'src/config'),
      },
      {
        find: '@types',
        replacement: path.resolve(process.cwd(), 'src/types'),
      },
      {
        find: '@services',
        replacement: path.resolve(process.cwd(), 'src/services'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
