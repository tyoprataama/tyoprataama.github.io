import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ────────────────────────────────────────────────────────────────
// GitHub Pages base path.
//
// • If you deploy to a PROJECT site  -> https://<user>.github.io/<repo>/
//   set BASE = '/<repo>/'   (e.g. '/portfolio/'). Must start & end with '/'.
//
// • If you deploy to a USER site      -> https://<user>.github.io/
//   or use a custom domain            -> https://example.com/
//   set BASE = '/'
//
// This single value is reused by the router (basename) and the 404 redirect,
// so you only change it here.
// ────────────────────────────────────────────────────────────────
const BASE = '/'

export default defineConfig({
  base: BASE,
  plugins: [react()],
})
