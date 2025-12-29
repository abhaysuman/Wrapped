import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Our 2025 Wrapped',
        short_name: 'Us 2025',
        description: 'A year in review for my favorite person',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone', // <--- THIS REMOVES THE BROWSER BARS
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'p1.jpg', // We will use one of your photos as the app icon
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'p1.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
})