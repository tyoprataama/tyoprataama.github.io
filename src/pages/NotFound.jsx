import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-[680px] flex-col items-center justify-center px-5 text-center">
      <div className="font-serif text-[7rem] font-normal leading-none tracking-[-0.04em] text-accent">404</div>
      <h1 className="mt-4 font-serif text-[2rem] font-normal text-ink">Halaman tidak ditemukan.</h1>
      <p className="mt-3 text-ink-secondary">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        to="/"
        className="btn btn-solid mt-7"
      >
        ← Kembali ke beranda
      </Link>
    </main>
  )
}
