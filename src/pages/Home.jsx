import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import articles from '../data/articles.js'
import { projects, experiences } from '../data/portfolio.js'
import { tagColorClass, getExcerpt, sortPinnedFirst } from '../lib/helpers.js'

const accentBar = {
  mint: 'before:bg-accent-mint',
  coral: 'before:bg-accent-coral',
  red: 'before:bg-accent-red',
  amber: 'before:bg-accent-amber',
}

function Pill({ children }) {
  return (
    <span className="rounded-[20px] bg-black/5 px-2.5 py-1 text-[0.72rem] text-ink-secondary">
      {children}
    </span>
  )
}

function TagBadge({ label, color }) {
  return (
    <span className={`mb-4 mr-2 inline-block rounded-[20px] px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.06em] ${tagColorClass(color)}`}>
      {label}
    </span>
  )
}

export default function Home() {
  const latest = sortPinnedFirst(articles).slice(0, 3)
  useReveal([])

  return (
    <main className="relative z-[1] mx-auto max-w-[780px] px-5 pb-20">
      {/* Hero */}
      <section id="home" className="flex min-h-screen flex-col justify-center pt-20">
        <div className="mb-6 inline-flex animate-fadeUp items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-accent-blue before:h-0.5 before:w-5 before:rounded before:bg-accent-blue before:content-['']">
          Available for work
        </div>
        <h1 className="mb-6 animate-fadeUp font-serif text-[clamp(3rem,8vw,5.5rem)] leading-[1.05] tracking-[-0.03em] text-ink">
          A happy<br />
          <em className="italic text-accent-coral">Fresh Graduate</em>
          <br />
          with intent.
        </h1>
        <p className="mb-10 max-w-[520px] animate-fadeUp text-[1.1rem] leading-[1.7] text-ink-secondary">
          Fresh graduate with a background in economics, data analysis, software development and hands on
          operational experience. Certified in Occupational Health &amp; Safety (AK3 Umum – BNSP &amp; Kemnaker).
          Seeking to grow in Indonesia's mining and resource industry.
        </p>
        <div className="flex animate-fadeUp flex-wrap gap-3">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 rounded-[30px] bg-ink px-6 py-3 text-[0.88rem] font-medium text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#222]"
          >
            See my work →
          </a>
          <Link
            to="/blog"
            className="glass inline-flex items-center gap-2 rounded-[30px] px-6 py-3 text-[0.88rem] font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
          >
            ✦ Read my writing
          </Link>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20">
        <div className="section-label mb-10 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ink-muted">
          Latest Project
        </div>
        <div className="reveal grid gap-4">
          {projects.map((p, i) => (
            <div
              key={i}
              className={`glass relative overflow-hidden rounded-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] ${p.featured ? 'grid grid-cols-[1fr_auto] items-start gap-6 max-[600px]:grid-cols-1' : ''}`}
            >
              <div>
                <div>
                  {p.tags.map((t, j) => (
                    <TagBadge key={j} label={t.label} color={t.color} />
                  ))}
                </div>
                <h3 className="mb-2 text-[1.2rem] font-medium tracking-[-0.01em] text-ink">{p.title}</h3>
                <p className="text-[0.92rem] leading-[1.6] text-ink-secondary">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>
              {p.featured && (
                <div className="select-none font-serif text-[4rem] leading-none text-black/5 max-[600px]:hidden">
                  {p.number}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20">
        <div className="reveal mb-10 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ink-muted">
          Experience
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
          {experiences.map((ex, i) => (
            <div
              key={i}
              className={`glass reveal relative overflow-hidden rounded-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:content-[''] ${accentBar[ex.accent]}`}
            >
              <div className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.06em] text-ink-muted">{ex.period}</div>
              <h3 className="mb-1 text-[1.05rem] font-medium text-ink">{ex.title}</h3>
              <div className="mb-3 text-[0.9rem] text-ink-secondary">{ex.company}</div>
              <p className="text-[0.85rem] leading-[1.6] text-ink-secondary">{ex.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section id="writing" className="py-20">
        <div className="reveal mb-10 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ink-muted">
          My Latest Writing
        </div>
        <div className="grid gap-0.5">
          {latest.map((a) => (
            <Link
              key={a.slug}
              to={`/blog/${a.slug}`}
              className="glass reveal mb-2 grid grid-cols-[1fr_auto] items-center gap-5 rounded-sm2 px-7 py-6 text-ink shadow-card transition-all hover:translate-x-1.5 hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="mb-1.5 flex items-center gap-2.5">
                  {a.isPinned && <span className="text-[0.7rem]">📌</span>}
                  <span className={`rounded-[20px] px-2.5 py-[3px] text-[0.7rem] font-medium uppercase tracking-[0.06em] ${tagColorClass(a.tagColor)}`}>
                    {a.tag}
                  </span>
                  <span className="text-[0.78rem] text-ink-muted">{a.date}</span>
                </div>
                <h3 className="mb-1 text-[1rem] font-medium tracking-[-0.01em]">{a.title}</h3>
                <p className="text-[0.84rem] leading-[1.5] text-ink-secondary">{getExcerpt(a.body, 110)}</p>
              </div>
              <span className="text-[1.2rem] text-ink-muted">→</span>
            </Link>
          ))}
        </div>
        <Link to="/blog" className="reveal mt-4 inline-flex items-center gap-2 text-[0.85rem] font-medium text-accent-blue transition-all hover:gap-3">
          Semua tulisan →
        </Link>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="glass reveal relative grid grid-cols-[auto_1fr] items-center gap-12 overflow-hidden rounded-[28px] p-[52px] shadow-soft max-[600px]:grid-cols-1 max-[600px]:p-9 max-[600px]:text-center">
          <div
            className="h-[120px] w-[120px] flex-shrink-0 rounded-full border-[3px] border-white/90 bg-cover shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-[600px]:mx-auto"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/profile.JPG)` }}
          />
          <div>
            <h2 className="mb-2.5 font-serif text-[2rem] tracking-[-0.03em] text-ink">Hi, I'm Tyo Pratama Priyanto Putra.</h2>
            <p className="mb-5 text-[0.95rem] leading-[1.7] text-ink-secondary">
              An economics graduate from IAIN Kediri with a GPA of 3.56, certified in Occupational Health &amp; Safety
              (AK3 Umum), and currently managing family owned agricultural operations in East Java. My background spans
              financial analysis, real field operations, data and software engineering.
            </p>
            <p className="mb-5 text-[0.95rem] leading-[1.7] text-ink-secondary">
              I'm looking to transition into Indonesia's mining and resource industry, where I can bring my analytical
              mindset, operational discipline, and K3 certification to contribute meaningfully from day one. Open to
              general roles, operations support, and planning positions.
            </p>
            <a
              href="mailto:tyopriyantoputra@gmail.com"
              className="inline-flex items-center gap-2 rounded-[30px] border border-black/[0.08] bg-black/[0.06] px-5 py-2.5 text-[0.88rem] font-medium text-ink transition-all hover:bg-ink hover:text-white"
            >
              ✉ tyopriyantoputra@gmail.com
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
