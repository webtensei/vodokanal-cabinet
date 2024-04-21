import { resolve } from 'path';
import type { ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const currentEnv = loadEnv(mode, process.cwd());
  console.log('Current mode:', command);
  console.log('Current environment configuration:', currentEnv);
  return defineConfig({
    plugins: [
      react(),
      // если захочется сократить импорты
      // AutoImport({
      //   imports: ['react', 'react-router-dom'],
      //   dts: './src/auto-imports.d.ts',
      //   dirs: ['src/store'],
      //   eslintrc: {
      //     enabled: true, // Default `false`
      //     filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      //   },
      // }),
    ],
    // 项目部署的基础路径,
    base: currentEnv.VITE_PUBLIC_PATH,
    mode,
    resolve: {
      // 别名
      alias: {
        '@': resolve(__dirname, './src'),
        '@shared': resolve(__dirname, './src/shared'),
        '@entities': resolve(__dirname, './src/entities'),
        '@features': resolve(__dirname, './src/features'),
        '@widgets': resolve(__dirname, './src/widgets'),
        '@pages': resolve(__dirname, './src/pages'),
        '@app': resolve(__dirname, './src/app'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://xxxxxx.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        sass: {},
      },
    },
    build: {
      outDir: mode === 'docker' ? 'dist' : 'docs',
      sourcemap: mode !== 'production',
      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: false,
      //   },
      // },
    },
  });
};
