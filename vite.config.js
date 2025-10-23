import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000000, // 1MB di limite per sicurezza
    rollupOptions: {
      output: {
        manualChunks: {
          // Sposta React e ReactDOM in un chunk separato
          'react-vendor': ['react', 'react-dom'],
          // Esempio: se usi librerie grandi, spostale in chunk separati
          'chart-lib': ['chart.js'],
          'router': ['react-router-dom'],
        },
      },
    },
  },
})