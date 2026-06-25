import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="relative z-[1] mx-auto flex min-h-[70vh] max-w-[680px] flex-col items-center justify-center px-5 text-center">
      <div className="font-serif text-[5rem] leading-none text-ink">404</div>
      <h1 className="mt-4 font-serif text-2xl text-ink">Halaman tidak ditemukan.</h1>
      <p className="mt-3 text-ink-secondary">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-[30px] bg-ink px-6 py-3 text-[0.88rem] font-medium text-white transition-transform hover:-translate-y-0.5"
      >
        ← Kembali ke beranda
      </Link>
    </main>
  )
}
