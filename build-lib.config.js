import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],

    build: {
        lib: {
            entry: resolve(__dirname, 'src/lib/ui-components/index.js'),
            name: 'TicketsUIComponents',
            fileName: (format) => `tickets-ui-components.${format}.js`
        },

        rollupOptions: {
            // Asegurar que las dependencias externas no se incluyan en el bundle
            external: ['vue', 'vue-router', 'pinia'],

            output: {
                // Proporcionar variables globales para las dependencias externas
                globals: {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    pinia: 'Pinia'
                },

                // Configuración para diferentes formatos
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') {
                        return 'tickets-ui-components.css'
                    }
                    return assetInfo.name
                }
            }
        },

        // Generar source maps para debugging
        sourcemap: true,

        // Optimizaciones para librerías
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },

    // Configuración para desarrollo
    server: {
        port: 3001,
        open: false
    }
})
