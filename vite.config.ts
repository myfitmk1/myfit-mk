
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // КЛУЧНО: Ова осигурува дека клучот е достапен и на GitHub Pages
  const apiKey = "AIzaSyAhFtkZkZnnKpWg5ZeAyoiS2_1WBWUbDiI";
  
  return {
    base: './', 
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})
