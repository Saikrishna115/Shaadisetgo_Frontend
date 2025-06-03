import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
// Vite + TypeScript-compatible way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
});
