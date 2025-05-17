import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    allowedHosts: ['sudden-ag-compiler-strain.trycloudflare.com'],
=======
    allowedHosts: ['memorial-knock-go-mas.trycloudflare.com'],
>>>>>>> c9e01a5 (add: カーソルの色を変更)
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
  },
})
