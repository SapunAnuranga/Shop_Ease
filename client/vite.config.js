import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'myshop.test',   // custom domain bind
    port: 5173,            // frontend port
    proxy: {
      '/api': {
        target: 'http://myshop.test:5000', // backend URL with same domain
        changeOrigin: true,
      },
    },
  },
})
