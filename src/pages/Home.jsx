import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { fetchArticles } from '../api/articles.js'
import { fetchHomeContent, DEFAULT_HOME_CONTENT, fetchProjects, fetchExperiences } from '../api/homeContent.js'
import { projects as staticProjects, experiences as staticExperiences } from '../data/portfolio.js'
import { sortPinnedThenDate, getExcerpt } from '../lib/helpers.js'
import Pagination from '../components/Pagination.jsx'
import StaticPagination from '../components/StaticPagination.jsx'
import { resolveImageSrc } from '../lib/helpers.js'

function renderHeroTitle(text) {
  const parts = String(text || '').split(/(#.*?#|\*.*?\*)/g).filter(Boolean)
  return parts.map((part, index) => {
    if (part.startsWith('#') && part.endsWith('#') && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={index} className="u">{part.slice(1, -1)}</em>
    }
    return <span key={index}>{part}</span>
  })
}

const scrollTo = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Home() {
  const [articles, setArticles] = useState([])
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT)
  const [projects, setProjects] = useState(staticProjects)
  const [experiences, setExperiences] = useState(staticExperiences)
  const [projectPage, setProjectPage] = useState(1)
  const [experiencePage, setExperiencePage] = useState(1)
  const savedScrollY = useRef(null)
  const previousPages = useRef({ projectPage, experiencePage })
  const ITEMS_PER_PAGE = 3

  const changeProjectPage = page => { if (page !== projectPage) savedScrollY.current = window.scrollY; setProjectPage(page) }
  const changeExperiencePage = page => { if (page !== experiencePage) savedScrollY.current = window.scrollY; setExperiencePage(page) }
  useLayoutEffect(() => {
    if (savedScrollY.current !== null && (previousPages.current.projectPage !== projectPage || previousPages.current.experiencePage !== experiencePage)) {
      window.scrollTo(0, savedScrollY.current)
      savedScrollY.current = null
    }
    previousPages.current = { projectPage, experiencePage }
  }, [projectPage, experiencePage])

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error)
    fetchHomeContent().then(setContent).catch(console.error)
    fetchProjects().then(rows => {
      if (rows.length) { setProjects(rows.filter(p => p.isVisible).map(p => ({
        id: p.id, title: p.title, desc: p.description, tech: p.stack || [], links: p.projectUrl,
        category: p.category, imageUrl: p.imageUrl, isPinned: p.isPinned, sortOrder: p.sortOrder,
      }))); setProjectPage(1) }
    }).catch(console.error)
    fetchExperiences().then(rows => {
      if (rows.length) { setExperiences(rows.filter(e => e.isVisible).map(e => ({
        id: e.id, title: e.role, company: e.company, period: e.period, desc: e.description, isPinned: e.isPinned, sortOrder: e.sortOrder,
      }))); setExperiencePage(1) }
    }).catch(console.error)
  }, [])
  const latest = sortPinnedThenDate(articles).slice(0, 3)
  const orderedProjects = [...projects].sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  const orderedExperiences = [...experiences].sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  const projectPages = Math.ceil(orderedProjects.length / ITEMS_PER_PAGE)
  const experiencePages = Math.ceil(orderedExperiences.length / ITEMS_PER_PAGE)
  const visibleProjects = orderedProjects.slice((projectPage - 1) * ITEMS_PER_PAGE, projectPage * ITEMS_PER_PAGE)
  const visibleExperiences = orderedExperiences.slice((experiencePage - 1) * ITEMS_PER_PAGE, experiencePage * ITEMS_PER_PAGE)
  useReveal([articles, content, projects, experiences, projectPage, experiencePage])
  const { hero, about, facts, contact } = content

  return <>
    <section className="hero" id="home">
      <div className="wrap hero-grid">
        <div>
          <div className="lead-eyebrow fade"><span className="dot" /><span className="eyebrow">{hero.eyebrow}</span></div>
          <h1 className="fade hero-title">{renderHeroTitle(hero.titleText || [hero.titleLine1, hero.titleLine2, hero.emphasis1, hero.titleLine3, hero.emphasis2].filter(Boolean).join(' '))}</h1>
          <p className="sub fade">{hero.subtitle}</p>
          <div className="actions fade">
            <a href="#work" className="btn btn-solid" onClick={scrollTo('work')}>{hero.workButton} <span className="arw">↗</span></a>
            <Link to="/blog" className="btn btn-line">{hero.blogButton}</Link>
          </div>
        </div>
        <aside className="fade">
          <div className="meta"><div className="k">Based in</div><div className="v">{hero.basedIn}</div></div>
          <div className="meta"><div className="k">Focus</div><div className="v">{hero.focus}</div></div>
        </aside>
      </div>
    </section>
    <div className="wrap"><hr className="rule" /></div>

    <section className="section" id="work"><div className="wrap">
      <div className="shead sr"><h2>Selected work</h2><span className="no">01 / Projects</span></div>
      <div>{visibleProjects.map((p, i) => <div className="work-item sr" key={p.id || p.title || i}>
        <div className="wmain"><h3>{p.title}</h3>{p.category && <p className="text-xs uppercase tracking-wide text-ink-muted">{p.category}</p>}<p>{p.desc}</p>
          <div className="stack">{(p.tech || []).map((t) => <span key={t}>{t}</span>)}</div>
          {p.links && <a className="btn btn-line wbtn" href={p.links} target="_blank" rel="noreferrer">View project <span className="arw">↗</span></a>}
        </div><div className="wnum">{String((projectPage - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, '0')}</div>
      </div>)}</div>
      <StaticPagination currentPage={projectPage} totalPages={projectPages} onPageChange={changeProjectPage} />
    </div></section>

    <section className="section" id="about"><div className="wrap">
      <div className="shead sr"><h2>About</h2><span className="no">02 / Profile</span></div>
      <div className="about"><div className="body sr"><p>{about.profile}</p><p className="small">{about.details}</p>
        <div className="facts">{facts.map((f, i) => <div className="f" key={f.k || i}><div className="k">{f.k}</div><div className="v">{f.v} <small>{f.s}</small></div></div>)}</div>
      </div></div>
    </div></section>

    <section className="section" id="experience"><div className="wrap">
      <div className="shead sr"><h2>Experience</h2><span className="no">03 / Journey</span></div>
      <div>{visibleExperiences.map((ex, i) => <div className="exp sr" key={ex.id || `${ex.title}-${i}`}><div className="when">{ex.period}</div><div><div className="role">{ex.title}</div><div className="org">{ex.company}</div><div className="desc">{ex.desc}</div></div></div>)}</div>
      <StaticPagination currentPage={experiencePage} totalPages={experiencePages} onPageChange={changeExperiencePage} />
    </div></section>

    {latest.length > 0 && <section className="section" id="writing"><div className="wrap">
      <div className="shead sr"><h2>Writing</h2><span className="no">04 / Notes</span></div>
      <div className="writing">{latest.map(a => <Link className="wrow sr" key={a.slug} to={`/blog/${a.slug}`}><div className="wtop"><span className="tag">{a.tag}</span><span className="rt">{a.readTime}</span></div><h3>{a.title}</h3><p className="wex">{getExcerpt(a.body)}</p></Link>)}</div>
      <Link to="/blog" className="morelink">Read all writing →</Link>
    </div></section>}

    <section className="contact" id="contact"><div className="wrap">
      {contact.profileImage && <div className="avatar sr"><img src={String(contact.profileImage).startsWith('http') ? resolveImageSrc(contact.profileImage) : `${import.meta.env.BASE_URL}${String(contact.profileImage).replace(/^\//, '')}`} alt="Profile" onError={e => { e.currentTarget.style.display = 'none' }} /></div>}
      <span className="eyebrow sr">{contact.eyebrow}</span><h2 className="sr">{contact.titleLead} <em>{contact.titleEmphasis}</em></h2><br />
      <a href={`mailto:${contact.email}`} className="mail sr">{contact.email}</a>
    </div></section>
  </>
}
