import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticleBySlug, fetchArticles } from '../api/articles.js'
import ArticleBody from '../components/ArticleBody.jsx'
import { tagColorClass } from '../lib/helpers.js'

// Scroll-reading progress bar.
function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1)
      setProgress(scrolled * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

export default function Article() {
 const { slug } = useParams()
const [article, setArticle] = useState(undefined) // undefined = loading, null = tidak ada
const [related, setRelated] = useState([])
const progress = useScrollProgress()

useEffect(() => {
  let alive = true
  fetchArticleBySlug(slug)
    .then((a) => alive && setArticle(a))
    .catch(() => alive && setArticle(null))
  fetchArticles()
    .then((all) => alive && setRelated(all.filter((a) => a.slug !== slug).slice(0, 3)))
    .catch(console.error)
  return () => { alive = false }
}, [slug])

useEffect(() => {
  if (article) document.title = `${article.title} — TYO`
  return () => { document.title = 'Tyo — Portfolio' }
}, [article])

// Loading state — data masih diambil dari Supabase.
if (article === undefined) {
  return (
    <main className="relative z-[1] mx-auto max-w-[680px] px-6 py-32 text-center text-ink-muted">
      Memuat…
    </main>
  )
}

// Error state — slug tidak ditemukan.
if (!article) {
  return (
    <main className="relative z-[1] mx-auto max-w-[680px] px-6 py-32 text-center">
      <h2 className="font-serif text-[2rem] text-ink">Artikel tidak ditemukan.</h2>
      <p className="mt-3 text-ink-secondary">Artikel yang Anda cari tidak ada atau sudah dipindahkan.</p>
      <Link to="/blog" className="mt-6 inline-block text-accent-blue">← Kembali ke semua tulisan</Link>
    </main>
  )
}

  return (
    <>
      {/* Reading progress */}
      <div className="fixed left-0 top-0 z-[200] h-0.5 bg-accent-blue transition-[width] duration-100" style={{ width: `${progress}%` }} />

      <article className="relative z-[1] mx-auto max-w-[680px] animate-fadeUp px-6 pb-28 pt-28">
        {/* Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-[0.78rem] text-ink-muted">
          <Link to="/" className="transition-colors hover:text-ink">Home</Link>
          <span className="text-[0.65rem]">›</span>
          <Link to="/blog" className="transition-colors hover:text-ink">Writing</Link>
          <span className="text-[0.65rem]">›</span>
          <span>{article.tag}</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-5 flex items-center gap-2.5">
            <span className={`rounded-[20px] px-2.5 py-[3px] text-[0.7rem] font-medium uppercase tracking-[0.05em] ${tagColorClass(article.tagColor)}`}>
              {article.tag}
            </span>
            <span className="text-[0.5rem] text-ink-muted">●</span>
            <span className="text-[0.8rem] text-ink-muted">{article.date}</span>
            <span className="text-[0.5rem] text-ink-muted">●</span>
            <span className="text-[0.8rem] text-ink-muted">{article.readTime} baca</span>
          </div>
          <h1 className="mb-5 font-serif text-[clamp(1.9rem,5vw,2.8rem)] leading-[1.15] tracking-[-0.03em] text-ink">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="font-lora text-[1.15rem] italic leading-[1.65] text-ink-secondary">{article.subtitle}</p>
          )}
        </header>

        {/* Divider */}
        <div className="my-9 flex items-center gap-3 text-ink-muted before:h-px before:flex-1 before:bg-black/[0.07] before:content-[''] after:h-px after:flex-1 after:bg-black/[0.07] after:content-['']">
          <span className="text-[0.7rem] tracking-[0.2em]">✦ ✦ ✦</span>
        </div>

        {/* Hero image (only when the article defines one) */}
        {article.picture && article.urlPicture && (
          <div className="mb-10">
            <img src={article.urlPicture} alt={article.title} className="w-full rounded-2xl" />
          </div>
        )}

        {/* Body */}
        <ArticleBody blocks={article.body} />

        {/* Footer */}
        <div className="mt-[72px] border-t border-black/[0.07] pt-10">
          <div className="mb-10 flex items-center gap-5 rounded-2xl border border-white/90 bg-white/80 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <div
              className="h-[52px] w-[52px] flex-shrink-0 rounded-full bg-cover"
              style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/profile.JPG)` }}
            />
            <div>
              <h4 className="text-[0.92rem] font-medium text-ink">Tyo Pratama Priyanto Putra</h4>
              <p className="text-[0.82rem] leading-[1.5] text-ink-muted">
                Super Human · Menulis, teknologi, dan hal-hal di antaranya.
              </p>
            </div>
          </div>

          <div className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ink-muted">Artikel Lainnya</div>
          <div className="grid gap-2.5">
            {related.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                className="group flex items-center justify-between rounded-sm2 border border-black/[0.07] bg-white/70 px-5 py-4 text-ink transition-all hover:translate-x-1 hover:bg-white"
              >
                <div className="flex flex-col gap-1">
                  <span className={`text-[0.68rem] font-medium uppercase tracking-[0.05em] ${tagColorClass(a.tagColor)} bg-transparent px-0`}>
                    {a.tag}
                  </span>
                  <span className="text-[0.88rem]">{a.title}</span>
                </div>
                <span className="ml-3 flex-shrink-0 text-ink-muted transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
