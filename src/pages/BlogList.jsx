import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles } from '../api/articles.js'
import { tagColorClass, getExcerpt, sortPinnedFirst, sortPinnedThenDate, dateTimeLabel } from '../lib/helpers.js'

export default function BlogList() {
  const [articles, setArticles] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error)
  }, [])

  const tags = useMemo(() => [...new Set(articles.map((a) => a.tag))], [articles])

  const filtered = sortPinnedThenDate(
    filter === 'all' ? articles : articles.filter((a) => a.tag === filter),
  )

  return (
    <main className="relative z-[1] mx-auto max-w-[760px] px-6 pb-24 pt-28">
      <div className="mb-10">
        <h1 className="font-serif text-[clamp(2.2rem,6vw,3.2rem)] tracking-[-0.03em] text-ink">
          My <em className="italic text-accent-coral">Writing</em>
        </h1>
        <p className="mt-2 text-ink-secondary">Pikiran tentang karir, kehidupan, dan hal-hal di antaranya.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {['all', ...tags].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-[30px] border px-4 py-1.5 text-[0.82rem] font-medium transition-all ${
              filter === t
                ? 'border-ink bg-ink text-white'
                : 'border-black/[0.08] bg-white/60 text-ink-secondary hover:bg-white'
            }`}
          >
            {t === 'all' ? 'Semua' : t}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-ink-muted">Belum ada artikel di kategori ini.</div>
      ) : (
        <div className="grid gap-2.5">
          {filtered.map((a, i) => (
            <Link
              key={a.slug}
              to={`/blog/${a.slug}`}
              className={`glass group grid grid-cols-[1fr_auto] items-center gap-5 rounded-card px-7 py-6 text-ink shadow-card transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_36px_rgba(0,0,0,0.08)] ${
                i === 0 ? 'ring-1 ring-accent-blue/10' : ''
              }`}
            >
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2.5">
                  {a.isPinned && (
                    <span className="rounded-[20px] bg-accent-amber/10 px-2 py-[3px] text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-accent-amber">
                      Pinned
                    </span>
                  )}
                  {i === 0 && !a.isPinned && (
                    <span className="rounded-[20px] bg-accent-blue/10 px-2 py-[3px] text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-accent-blue">
                      Latest
                    </span>
                  )}
                  <span className={`rounded-[20px] px-2.5 py-[3px] text-[0.7rem] font-medium uppercase tracking-[0.06em] ${tagColorClass(a.tagColor)}`}>
                    {a.tag}
                  </span>
                  <span className="text-[0.78rem] text-ink-muted">{dateTimeLabel(a)}</span>
                </div>
                <h2 className="mb-1 font-serif text-[1.25rem] leading-snug tracking-[-0.01em] text-ink">{a.title}</h2>
                <p className="text-[0.86rem] leading-[1.55] text-ink-secondary">{getExcerpt(a.body)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="whitespace-nowrap text-[0.75rem] text-ink-muted">{a.readTime}</span>
                <span className="text-[1.1rem] text-ink-muted transition-transform group-hover:translate-x-1">↗</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
