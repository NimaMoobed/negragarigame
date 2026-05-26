import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the app works whether served at "/" or under a subpath like "/negragarigame/"
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-32.png',
        'apple-touch-icon.png',
        'designs/**/*.png',
      ],
      manifest: {
        name:        'رنگ‌آمیزی هنر نگارگری ایرانی',
        short_name:  'نگارگری',
        description: 'اپ رنگ‌آمیزی طرح‌های اصیل نگارگری، تذهیب و گل‌و‌مرغ ایرانی — با پالت ۱۲ رنگ سنتی',
        lang:        'fa',
        dir:         'rtl',
        start_url:   '/',
        scope:       '/',
        display:     'standalone',
        orientation: 'any',
        background_color: '#F6EFDD',
        theme_color:      '#0F7A6E',
        categories:  ['entertainment', 'lifestyle', 'games'],
        icons: [
          { src: 'icons/icon-72.png',           sizes: '72x72',   type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-96.png',           sizes: '96x96',   type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-128.png',          sizes: '128x128', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-144.png',          sizes: '144x144', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-152.png',          sizes: '152x152', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-256.png',          sizes: '256x256', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-384.png',          sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Pre-cache all built assets + designs
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,  // Service worker disabled in dev for easier debugging
      },
    }),
  ],
});
