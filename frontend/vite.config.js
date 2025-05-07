

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

})
