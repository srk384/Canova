import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allows access from other devices
    port: 5173,       // Use your preferred port
  },
})
