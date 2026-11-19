import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // ส่งทุก request ที่ขึ้นต้นด้วย /api ไปที่ Express server (ระบบกลาง)
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
