import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticleBySlug, fetchArticles } from '../api/articles.js'
import ArticleBody from '../components/ArticleBody.jsx'
import { tagColorClass, resolveImageSrc, dateTimeLabel } from '../lib/helpers.js'
import { useLanguage } from '../context/LanguageContext.jsx'

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
  const { language } = useLanguage()
  const [article, setArticle] = useState(undefined) // undefined = loading, null = tidak ada
  const [related, setRelated] = useState([])
  const progress = useScrollProgress()
  const wantsEnglish = language === 'en'
  const hasEnglishTitle = !!article?.titleEn
  const hasEnglishBody = Array.isArray(article?.bodyEn) && article.bodyEn.length > 0
  const showEnglish = wantsEnglish && (hasEnglishTitle || hasEnglishBody || !!article?.subtitleEn)
  const displayTitle = showEnglish && hasEnglishTitle ? article.titleEn : article?.title
  const displaySubtitle = showEnglish && article?.subtitleEn ? article.subtitleEn : article?.subtitle
  const displayTag = showEnglish && article?.tagEn ? article.tagEn : article?.tag
  const displayBody = showEnglish && hasEnglishBody ? article.bodyEn : article?.body

  useEffect(() => {
    let alive = true
    fetchArticleBySlug(slug)
      .then((a) => alive && setArticle(a))
      .catch(() => alive && setArticle(null))
    fetchArticles()
      .then((all) => alive && setRelated(all.filter((a) => a.slug !== slug && a.slugEn !== slug).slice(0, 3)))
      .catch(console.error)
    return () => {
      alive = false
    }
  }, [slug])

  useEffect(() => {
    if (!article) return
    const title = `${(language === 'en' && article.titleEn) ? article.titleEn : article.title} · Tyo Pratama Priyanto Putra`
    document.title = title
    const descriptionSource = (language === 'en' && article.subtitleEn) ? article.subtitleEn : article.subtitle
    const description = String(descriptionSource || article.title || 'Artikel oleh Tyo Pratama Priyanto Putra').replace(/<[^>]*>/g, '').slice(0, 160)
    let meta = document.head.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `https://tyoprataama.github.io${window.location.pathname}`
  }, [article, language])

  if (article === undefined) {
    return (
      <main className="mx-auto max-w-[680px] px-6 py-40 text-center text-ink-muted">Memuat…</main>
    )
  }

  if (!article) {
    return (
      <main className="mx-auto max-w-[680px] px-6 py-40 text-center">
        <h2 className="font-serif text-[2rem] font-normal text-ink">{language === 'en' ? 'Article not found.' : 'Artikel tidak ditemukan.'}</h2>
        <p className="mt-3 text-ink-secondary">{language === 'en' ? 'The article may have been moved or does not exist.' : 'Artikel yang Anda cari tidak ada atau sudah dipindahkan.'}</p>
        <Link to="/blog" className="mt-6 inline-block font-medium text-accent">← {language === 'en' ? 'Back to all writing' : 'Kembali ke semua tulisan'}</Link>
      </main>
    )
  }

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[300] h-0.5 bg-accent"
        style={{ width: `${progress}%` }}
      />

      <article className="mx-auto max-w-[680px] animate-fadeUp px-6 pb-28 pt-36">
        {/* Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-[0.78rem] text-ink-muted">
          <Link to="/blog" aria-label={language === 'en' ? 'Back to articles' : 'Kembali ke daftar tulisan'} className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-base text-ink transition-colors hover:bg-panel">←</Link>
          <Link to="/" className="transition-colors hover:text-ink">{language === 'en' ? 'Home' : 'Beranda'}</Link>
          <span className="text-[0.65rem]">›</span>
          <Link to="/blog" className="transition-colors hover:text-ink">{language === 'en' ? 'Writing' : 'Tulisan'}</Link>
          <span className="text-[0.65rem]">›</span>
          <span>{displayTag}</span>
        </div>

        {/* Header */}
        <header  className = "mb-12" >
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span className={`rounded-full px-2.5 py-[3px] text-[0.7rem] font-medium uppercase tracking-[0.05em] ${tagColorClass(article.tagColor)}`}>
              {displayTag}
            </span>
            <span className="text-[0.5rem] text-ink-muted">●</span>
            <span className="text-[0.8rem] text-ink-muted">{dateTimeLabel(article, language)}</span>
            <span className="text-[0.5rem] text-ink-muted">●</span>
            <span className="text-[0.8rem] text-ink-muted">{Number.parseInt(String(article.readTime || '').match(/\d+/)?.[0] || '0', 10)} {language === 'en' ? 'min read' : 'menit baca'}</span>
            </div>
          <h1 className="mb-5 font-serif text-[clamp(2rem,5vw,3.2rem)] font-normal leading-[1.08] tracking-[-0.03em] text-ink">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-[1.15rem] leading-[1.65] text-ink-secondary">{displaySubtitle}</p>
          )}
          {wantsEnglish && !hasEnglishTitle && !hasEnglishBody && (
            <p className="mt-4 rounded-lg border border-line bg-panel px-4 py-3 text-xs text-ink-muted">🇮🇩 English translation is not available yet. This article is shown in Indonesian.</p>
          )}
        <div className="my-9 flex items-center gap-3 text-ink-muted before:h-px before:flex-1 before:bg-line before:content-[''] after:h-px after:flex-1 after:bg-line after:content-['']">
          <span className="text-[0.7rem] tracking-[0.2em] text-accent">✦ ✦ ✦</span>
        </div>
        </header>



        {/* Hero image */}
        {article.urlPicture && (
          <div className="mb-10">
            <img src={resolveImageSrc(article.urlPicture)} alt={article.title} className="w-full rounded-lg" />
          </div>
        )}

        {/* Body */}
        <ArticleBody blocks={Array.isArray(displayBody) ? displayBody : []} />

        {/* Footer */}
        <div className="mt-[72px] border-t border-line pt-10">
          <div className="mb-10 flex items-center gap-5 rounded-lg border border-line bg-panel p-6">
            <div
              className="h-[52px] w-[52px] flex-shrink-0 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/profile.JPG)` }}
            />
            <div>
              <h4 className="font-serif text-[1.05rem] font-normal text-ink">Tyo Pratama Priyanto Putra</h4>
              <p className="text-[0.82rem] leading-[1.5] text-ink-muted">
                {language === 'en' ? 'Writing, technology, and everything in between.' : 'Menulis, teknologi, dan hal-hal di antaranya.'}
              </p>
            </div>
          </div>

          <div className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">{language === 'en' ? 'More Articles' : 'Artikel Lainnya'}</div>
          <div className="grid gap-2.5">
            {related.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                className="group flex items-center justify-between rounded-lg border border-line bg-surface px-5 py-4 text-ink transition-all hover:translate-x-1 hover:border-line2"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-accent">
                    {language === 'en' && a.tagEn ? a.tagEn : a.tag}
                  </span>
                  <span className="font-serif text-[1.02rem]">{language === 'en' && a.titleEn ? a.titleEn : a.title}</span>
                </div>
                <span className="ml-3 flex-shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">→</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
