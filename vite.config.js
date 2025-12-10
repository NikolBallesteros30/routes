import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  // detect possible quasar variables file (.sass or .scss) in project
  const candidateFiles = [
    path.resolve(__dirname, 'src/quasar-variables.sass'),
    path.resolve(__dirname, 'src/quasar-variables.scss'),
    path.resolve(__dirname, 'src/styles/quasar-variables.sass'),
    path.resolve(__dirname, 'src/styles/quasar-variables.scss')
  ]
  const sassVariablesPath = candidateFiles.find(p => fs.existsSync(p))
  if (!sassVariablesPath) {
    // warning only — avoid hard failure in CI; instruct user to add the file or install sass
    console.warn('[vite.config] quasar-variables not found. Create src/quasar-variables.(sass|scss) and run `npm i -D sass` to avoid import errors.')
  }
  
  return {
    // set a relative base for static hosting (helps on Render / other hosts)
    base: isProduction ? './' : '/',
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      // pass sassVariables only when the file exists
      quasar(sassVariablesPath ? { sassVariables: sassVariablesPath } : {})
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src')
      }
    },
    // ensure Sass/SCSS imports can resolve files under src and node_modules during build
    css: {
      preprocessorOptions: {
        // for .sass (indented syntax)
        sass: {
          includePaths: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
          indentedSyntax: true
        },
        // for .scss
        scss: {
          includePaths: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')]
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

