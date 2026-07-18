import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Sourcemaps are invaluable in dev but ship readable source (including
    // code comments) to anyone who opens devtools in production. Vite's
    // `mode` is 'production' for `vite build` and 'development' for `vite
    // dev`/`vite build --mode development`.
    sourcemap: mode !== 'production',
  },
}))
