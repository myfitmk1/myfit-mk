import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // ОВА Е КЛУЧНОТО: Додаваме релативна патека за да работи на GitHub Pages
    base: './',
    plugins: [react()],
    define: {
      'process.env': env
    }
  }
})