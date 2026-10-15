
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function NotFound() {
  const { language } = useLanguage()
  const isId = language === 'id'

  const content = {
    id: {
      title: 'Halaman tidak ditemukan.',
      description:
        'Halaman yang Anda cari tidak ada atau sudah dipindahkan.',
      back: '← Kembali ke beranda',
    },
    en: {
      title: 'Page not found.',
      description:
        'The page you are looking for does not exist or has been moved.',
      back: '← Back to home',
    },
  }

  const text = content[isId ? 'id' : 'en']

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-[680px] flex-col items-center justify-center px-5 py-12 text-center">
      {/* Ilustrasi dengan background blob abstrak */}
      <div className="relative mx-auto mb-5 w-full max-w-[420px]">
        {/* Blob putih di belakang ilustrasi */}
        <div
          aria-hidden="true"
          className = "absolute left-[14%] top-[12%] h-[72%] w-[78%] bg-[#f6f4ef]"
          style={{
            borderRadius:
              '63% 37% 48% 52% / 42% 48% 52% 58%',
            transform: 'rotate(-12deg)',
          }}
        />

        {/* SVG bersilangan dengan blob */}
        <div
          className="relative z-10 aspect-[4/3] w-full bg-center bg-contain bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/404error.svg')",
          }}
          role="img"
          aria-label="404 error illustration"
        />
      </div>

      <div className="font-serif text-[7rem] font-normal leading-none tracking-[-0.04em] text-accent">
        404
      </div>

      <h1 className="mt-4 font-serif text-[2rem] font-normal text-ink">
        {text.title}
      </h1>

      <p className="mt-3 text-ink-secondary">
        {text.description}
      </p>

      <Link to="/" className="btn btn-solid mt-7">
        {text.back}
      </Link>
    </main>
  )
}
