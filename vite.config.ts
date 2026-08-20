import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [
    {
      name: 'efac-runtime-entry',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module', src: '/src/boot.ts' },
            injectTo: 'body',
          },
        ];
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['efac.jpg'],
      manifest: {
        name: 'EFAC Scholar Hub',
        short_name: 'EFAC',
        description: 'Education For All Children — Scholar Hub',
        theme_color: '#07111f',
        background_color: '#07111f',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/efac.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: '/efac.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      },
    }),
  ],
});
