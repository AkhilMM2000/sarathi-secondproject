import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['dcb8-117-206-177-202.ngrok-free.app', 'localhost', 'your-other-allowed-hosts.com']
  }
})
