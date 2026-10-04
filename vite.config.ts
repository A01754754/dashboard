import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // MapLibre 6 loads its own worker; Vite's dep optimizer breaks it in dev mode.
  optimizeDeps: { exclude: ['maplibre-gl'] },
})
