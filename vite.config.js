import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        sassVariables: 'src/quasar-variables.sass'
      })
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src')
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'pinia'],
            'quasar': ['quasar']
          }
        }
      }
    },
    server: {
      port: 5173,
      host: true,
      allowedHosts: [
        'proteccion-de-rutas.onrender.com',
        '.onrender.com',
        'localhost',
        '127.0.0.1'
      ],
      cors: true
    },
    preview: {
      port: 5173,
      host: true,
      allowedHosts: [
        'proteccion-de-rutas.onrender.com',
        '.onrender.com'
      ],
      cors: true
    }
  }
})

