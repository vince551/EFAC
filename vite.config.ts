import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'efac-react-entry',
      transformIndexHtml() {
        return [{ tag: 'script', attrs: { type: 'module', src: '/src/boot.ts' }, injectTo: 'body' }]
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['efac.jpg'],
      manifest: {
        name: 'EFAC Scholar Platform',
        short_name: 'EFAC',
        description: 'Education For All Children — scholar platform',
        theme_color: '#07111f',
        background_color: '#07111f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/efac.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: '/efac.jpg', sizes: '512x512', type: 'image/jpeg' }
        ]
      }
    })
  ]
})
