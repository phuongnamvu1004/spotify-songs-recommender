import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: '0.0.0.0',  // Expose to all network interfaces
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Express server
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})

