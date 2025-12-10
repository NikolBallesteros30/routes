import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    // set a relative base for static hosting (helps on Render / other hosts)
    base: isProduction ? './' : '/',
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        // normalize the path resolution for CI/environments
        sassVariables: path.resolve(__dirname, 'src/quasar-variables.sass')
      })
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src')
      }
    },
    // ensure Sass/SCSS imports can resolve files under src during build (fixes "Can't find stylesheet to import.")
    css: {
      preprocessorOptions: {
        // for .sass (indented syntax)
        sass: {
          includePaths: [path.resolve(__dirname, 'src')],
          indentedSyntax: true
        },
        // for .scss
        scss: {
          includePaths: [path.resolve(__dirname, 'src')]
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // explicitly disable sourcemaps in production to avoid build failures in some CI environments
      sourcemap: isProduction ? false : true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'pinia'],
            'quasar': ['quasar']
          }
        }
      }
    },
    // ensure NODE_ENV is defined during build
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    server: {
      port: Number(process.env.PORT) || 5173,
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
      port: Number(process.env.PORT) || 5173,
      host: true,
      allowedHosts: [
        'proteccion-de-rutas.onrender.com',
        '.onrender.com'
      ],
      cors: true
    }
  }
})

