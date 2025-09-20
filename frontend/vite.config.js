

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // Plugin Vite pour Tailwind v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  esbuild: {
    jsxInject: `import React from 'react'`, // <- injecte automatiquement React partout
  },
server: {
    proxy: {
      // Proxy pour les requêtes vers votre API backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Retirer le préfixe /api si nécessaire (selon votre configuration backend)
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Proxy pour les requêtes vers extensions.aitopia.ai
      '/extensions-api': {
        target: 'https://extensions.aitopia.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/extensions-api/, '')
      }
    }
  }
})
