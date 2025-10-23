// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000000, // 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          react: ['react', 'react-dom'],

          // Routing
          router: ['react-router-dom'],

          // UI framework
          bootstrap: ['bootstrap', 'react-bootstrap', 'bootstrap-icons', 'react-bootstrap-icons'],

          // Calendari pesanti
          calendar: [
            'react-big-calendar',
            '@fullcalendar/react',
            '@fullcalendar/daygrid'
          ],

          // Utility
          utils: ['axios', 'date-fns', 'react-modal', 'react-spinners'],
        },
      },
    },
  },
})