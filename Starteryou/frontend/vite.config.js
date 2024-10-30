import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@backend': path.resolve(__dirname, '../backend/src'),
      '@config': path.resolve(__dirname, '../backend/config'),  // Points to backend config
      '@hooks': path.resolve(__dirname, '../backend/src/hooks'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  }
})