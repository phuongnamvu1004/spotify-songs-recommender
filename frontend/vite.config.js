import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
require("dotenv").config();

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: '0.0.0.0',  // Expose to all network interfaces
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:3000', // Express server
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})

