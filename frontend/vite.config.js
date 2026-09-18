import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-[hash].js',
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: 'assets/asset-[hash][extname]',
      },
    },
  },
})