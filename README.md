# Tyo — Portfolio (React + Vite)

Migrasi total dari situs statis HTML/CSS/JS ke **React + Vite + Tailwind CSS**, dengan struktur modular, routing `react-router-dom`, dan siap deploy ke **GitHub Pages**.

## ✨ Fitur

- **Vite + React 18** — dev server cepat & build teroptimasi.
- **react-router-dom** dengan `Layout` + `<Outlet/>` — Navbar & Footer persisten di semua halaman.
- **Routing:**
  - `/` — Home / Portfolio
  - `/blog` — Daftar artikel (dengan filter tag)
  - `/blog/:slug` — Artikel detail (Clean URL)
  - `/admin` — Login + dashboard (demo, sisi browser)
  - `*` — Halaman 404
- **Tailwind CSS** + **@tailwindcss/typography** (`prose`) untuk keterbacaan ala Medium.
- Konten blog dipindah dari `articles.json` → modul React `src/data/articles.js`.
- Desain asli dipertahankan: glassmorphism, ambient blobs, font DM Serif Display / DM Sans / Lora.
- Konfigurasi SPA GitHub Pages (`base` + `404.html` redirect) agar refresh & deep-link tidak error.

## 🚀 Menjalankan secara lokal

```bash
npm install
npm run dev      # buka http://localhost:5173
```

## 🏗️ Build

```bash
npm run build    # output ke folder dist/
npm run preview  # pratinjau hasil build
```

## 🌐 Deploy ke GitHub Pages

### 1. Atur `base`

Buka `vite.config.js` dan set konstanta `BASE`:

- **Project site** (`https://<user>.github.io/<repo>/`): `const BASE = '/<repo>/'`
- **User site / custom domain** (`https://<user>.github.io/`): `const BASE = '/'`

Lalu sesuaikan juga `base` di dalam `public/404.html` (variabel `base`) agar sama.

### 2a. Deploy manual via paket `gh-pages`

```bash
npm run deploy
```

Ini mem-build lalu mem-push folder `dist/` ke branch `gh-pages`. Di Settings → Pages, pilih branch `gh-pages`.

### 2b. Atau otomatis via GitHub Actions

Workflow `.github/workflows/deploy.yml` sudah disertakan. Cukup push ke branch `main`, lalu di **Settings → Pages → Source** pilih **GitHub Actions**.

## 🔌 Routing SPA di GitHub Pages

GitHub Pages tidak punya server-side routing. Saat user me-refresh `/blog/some-slug`, GitHub mengembalikan `404.html`. File `public/404.html` menyimpan URL yang diminta lalu mengalihkan ke `index.html`, dan skrip kecil di `index.html` mengembalikan URL aslinya via History API — sehingga React Router me-render route yang benar. `.nojekyll` disertakan agar GitHub Pages tidak memproses ulang aset.

## 📁 Struktur

```
src/
  components/   ArticleBody, BackgroundBlobs, Navbar, Footer
  context/      AuthContext (demo auth untuk /admin)
  data/         articles.js (konten blog), portfolio.js (projects & experience)
  hooks/        useReveal (animasi scroll)
  layouts/      RootLayout (Navbar + Outlet + Footer)
  lib/          helpers
  pages/        Home, BlogList, Article, Admin, NotFound
  App.jsx       definisi router
  main.jsx      entry point
```

## 🔐 Catatan Admin

Halaman `/admin` adalah demo client-side (kredensial `admin` / `admin123`). Karena hosting statis, ini **bukan** keamanan sungguhan — untuk admin nyata tambahkan backend/auth (Supabase, Firebase, Auth0, dll).
