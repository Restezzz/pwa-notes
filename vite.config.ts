import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://fonts.googleapis.com/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 дней
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'PWA Заметки',
        short_name: 'Заметки',
        description: 'Приложение для заметок с офлайн-доступом',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/note-icon192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/note-icon512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/note-icon512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
