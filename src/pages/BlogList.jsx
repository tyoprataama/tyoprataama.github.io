import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles } from '../api/articles.js'
import { tagColorClass, getExcerpt, sortPinnedThenDate, dateTimeLabel } from '../lib/helpers.js'

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
    <main className="mx-auto max-w-[780px] px-6 pb-28 pt-36">
      <div className="mb-12">
        <div className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink-muted">
          — The journal
        </div>
        <h1 className="mt-5 font-serif text-[clamp(2.4rem,6vw,3.6rem)] font-normal tracking-[-0.03em] text-ink">
          Writing
        </h1>
        <p className="mt-3 max-w-[440px] text-ink-secondary">
          Pikiran tentang karir, kehidupan, dan hal-hal di antaranya.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...tags].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full border px-4 py-1.5 text-[0.8rem] transition-all ${
              filter === t
                ? 'border-transparent bg-ink text-paper'
                : 'border-line text-ink-secondary hover:border-line2 hover:text-ink'
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
        <div>
          {filtered.map((a) => (
            <Link
              key={a.slug}
              to={`/blog/${a.slug}`}
              className="group grid grid-cols-[1fr_auto] items-center gap-6 border-t border-line px-2 py-8 text-ink transition-all last:border-b hover:bg-surface hover:px-4"
            >
              <div>
                <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                  {a.isPinned && (
                    <span className="rounded-full bg-accent-soft px-2 py-[3px] text-[0.65rem] font-medium uppercase tracking-[0.08em] text-accent">
                      Pinned
                    </span>
                  )}
                  <span className={`rounded-full px-2.5 py-[3px] text-[0.7rem] font-medium uppercase tracking-[0.06em] ${tagColorClass(a.tagColor)}`}>
                    {a.tag}
                  </span>
                  <span className="text-[0.74rem] text-ink-muted">{dateTimeLabel(a)}</span>
                </div>
                <h2 className="mb-1.5 font-serif text-[1.55rem] font-normal leading-tight tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                  {a.title}
                </h2>
                <p className="max-w-[560px] text-[0.9rem] leading-[1.6] text-ink-secondary">{getExcerpt(a.body)}</p>
              </div>
              <span className="self-start pt-2 text-[1.3rem] text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">↗</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
