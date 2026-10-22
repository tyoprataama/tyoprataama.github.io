import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { fetchArticles } from '../api/articles.js'
import { fetchHomeContent, DEFAULT_HOME_CONTENT, fetchProjects, fetchExperiences } from '../api/homeContent.js'
import { projects as staticProjects, experiences as staticExperiences } from '../data/portfolio.js'
import { sortPinnedThenDate, getExcerpt } from '../lib/helpers.js'
import Pagination from '../components/Pagination.jsx'
import StaticPagination from '../components/StaticPagination.jsx'
import DocumentModal from '../components/DocumentModal.jsx'
import { resolveImageSrc } from '../lib/helpers.js'
import { useLanguage } from '../context/LanguageContext.jsx'

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
  const { language } = useLanguage()
  const isEn = language === 'en'
  const localized = (obj, key) => obj?.[isEn ? key : `${key}Id`] || obj?.[key] || ''
  const [articles, setArticles] = useState([])
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT)
  const [projects, setProjects] = useState(staticProjects)
  const [experiences, setExperiences] = useState(staticExperiences)
  const [projectPage, setProjectPage] = useState(1)
  const [experiencePage, setExperiencePage] = useState(1)
  const [activeDocumentItem, setActiveDocumentItem] = useState(null)
  const savedScrollY = useRef(null)
  const previousPages = useRef({ projectPage, experiencePage })
  const ITEMS_PER_PAGE = 3

  

const changeProjectPage = page => {
  if (page === projectPage) return;

  savedScrollY.current = null;
  setProjectPage(page);

  requestAnimationFrame(() => {
    document.getElementById('work')?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
  });
};

const changeExperiencePage = page => {
  if (page === experiencePage) return;

  savedScrollY.current = null;
  setExperiencePage(page);

  requestAnimationFrame(() => {
    document.getElementById('experience')?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
  });
};




  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error)
    fetchHomeContent().then(setContent).catch(console.error)
    fetchProjects({ includeHidden: false }).then(rows => {
      if (rows.length) { setProjects(rows.filter(p => p.isVisible).map(p => ({
        id: p.id, title: p.title, titleId: p.titleId, desc: p.description, descId: p.descriptionId, categoryId: p.categoryId, tech: p.stack || [], links: p.projectUrl, documents: Array.isArray(p.documents) ? p.documents.filter(doc => typeof doc === 'string' ? !!doc : !!(doc?.url || doc?.publicUrl || doc?.fileUrl || doc?.href)).map(doc => typeof doc === 'string' ? { title: '', url: doc, source: 'link' } : { ...doc, url: doc.url || doc.publicUrl || doc.fileUrl || doc.href }) : [], documentTitle: p.documentTitle || '', documentTitleId: p.documentTitleId || p.documentTitle || '', documentTitleEn: p.documentTitleEn || '',
        category: p.category, imageUrl: p.imageUrl, isPinned: p.isPinned, sortOrder: p.sortOrder,
      }))); setProjectPage(1) }
    }).catch(console.error)
    fetchExperiences({ includeHidden: false }).then(rows => {
      if (rows.length) { setExperiences(rows.filter(e => e.isVisible).map(e => ({
        id: e.id, title: e.role, titleId: e.roleId, company: e.company, companyId: e.companyId, period: e.period, periodId: e.periodId, desc: e.description, descId: e.descriptionId, documents: Array.isArray(e.documents) ? e.documents.filter(doc => typeof doc === 'string' ? !!doc : !!(doc?.url || doc?.publicUrl || doc?.fileUrl || doc?.href)).map(doc => typeof doc === 'string' ? { title: '', url: doc, source: 'link' } : { ...doc, url: doc.url || doc.publicUrl || doc.fileUrl || doc.href }) : [], documentTitle: e.documentTitle || '', documentTitleId: e.documentTitleId || e.documentTitle || '', documentTitleEn: e.documentTitleEn || '', isPinned: e.isPinned, sortOrder: e.sortOrder,
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
          <div className="lead-eyebrow fade" aria-label={isEn ? 'Portfolio owner identity' : 'Identitas pemilik portofolio'}><span className="dot" /><span className="eyebrow">Tyo Pratama Priyanto Putra | {localized(hero, 'eyebrow')}</span></div>
          <h1 className="fade hero-title">{renderHeroTitle(localized(hero, 'titleText') || [hero.titleLine1, hero.titleLine2, hero.emphasis1, hero.titleLine3, hero.emphasis2].filter(Boolean).join(' '))}</h1>
          <p className="sub fade">{localized(hero, 'subtitle')}</p>
          <div className="actions fade">
            <a href="#work" className="btn btn-solid" onClick={scrollTo('contact')}>{localized(hero, 'workButton')} <span className="arw">↗</span></a>
            <Link to="/blog" className="btn btn-line">{localized(hero, 'blogButton')}</Link>
          </div>
        </div>
        <aside className="fade">
          <div className="meta"><div className="k">{isEn ? 'Based in' : 'Berlokasi di'}</div><div className="v">{localized(hero, 'basedIn')}</div></div>
          <div className="meta"><div className="k">{isEn ? 'Focus' : 'Fokus'}</div><div className="v">{localized(hero, 'focus')}</div></div>
        </aside>
      </div>
    </section>
    <div className="wrap"><hr className="rule" /></div>

    <section className="section" id="about"><div className="wrap">
      <div className="shead sr"><h2>{isEn ? 'About' : 'Tentang'}</h2><span className="no">01 / {isEn ? 'Profile' : 'Profil'}</span></div>
      <div className="about"><div className="body sr"><p>{localized(about, 'profile')}</p><p className="small">{localized(about, 'details')}</p>
        <div className="facts">{facts.map((f, i) => <div className="f" key={f.k || i}><div className="k">{!isEn && f.kId ? f.kId : f.k}</div><div className="v">{!isEn && f.vId ? f.vId : f.v} <small>{!isEn && f.sId ? f.sId : f.s}</small></div></div>)}</div>
      </div></div>
    </div></section>

    <section className="section" id="work"><div className="wrap">
      <div className="shead sr"><h2>{isEn ? 'Selected project' : 'Proyek pilihan'}</h2><span className="no">02 / {isEn ? 'Projects' : 'Proyek'}</span></div>
      <div>{visibleProjects.map((p, i) => <div className="work-item sr" key={p.id || p.title || i}>
        <div className="wmain"><h3>{!isEn && p.titleId ? p.titleId : p.title}</h3>{(!isEn && p.categoryId ? p.categoryId : p.category) && <p className="text-xs uppercase tracking-wide text-ink-muted">{!isEn && p.categoryId ? p.categoryId : p.category}</p>}<p>{!isEn && p.descId ? p.descId : p.desc}</p>
          <div className="stack">{(p.tech || []).map((t) => <span key={t}>{t}</span>)}</div>
          <div className="work-actions">{p.links && <a className="btn btn-line wbtn" href={p.links} target="_blank" rel="noreferrer">{isEn ? 'View project' : 'Lihat proyek'} <span className="arw">↗</span></a>}{Array.isArray(p.documents) && p.documents.some(doc => doc?.url) && <button type="button" className="btn btn-line wbtn" onClick={() => setActiveDocumentItem({ item: p, kind: 'document' })}>{isEn ? 'View documents' : 'Lihat dokumen'} <span className="arw">↗</span></button>}</div>
        </div><div className="wnum">{String((projectPage - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, '0')}</div>
      </div>)}</div>
      <StaticPagination currentPage={projectPage} totalPages={projectPages} onPageChange={changeProjectPage} />
    </div></section>


    <section className="section" id="experience"><div className="wrap">
      <div className="shead sr"><h2>{isEn ? 'Experience' : 'Pengalaman'}</h2><span className="no">03 / {isEn ? 'Journey' : 'Perjalanan'}</span></div>
      <div>{visibleExperiences.map((ex, i) => <div className="exp sr" key={ex.id || `${ex.title}-${i}`}><div className="when">{!isEn && ex.periodId ? ex.periodId : ex.period}</div><div><div className="role">{!isEn && ex.titleId ? ex.titleId : ex.title}</div><div className="org">{!isEn && ex.companyId ? ex.companyId : ex.company}</div><div className="desc">{!isEn && ex.descId ? ex.descId : ex.desc}</div>{Array.isArray(ex.documents) && ex.documents.some(doc => doc?.url) && <div className="experience-actions"><button type="button" className="btn btn-line wbtn" onClick={() => setActiveDocumentItem({ item: ex, kind: 'certificate' })}>{isEn ? 'View certificate' : 'Lihat sertifikat'} <span className="arw">↗</span></button></div>}</div></div>)}</div>
      <StaticPagination currentPage={experiencePage} totalPages={experiencePages} onPageChange={changeExperiencePage} />
    </div></section>

    {latest.length > 0 && <section className="section" id="writing"><div className="wrap">
      <div className="shead sr"><h2>{isEn ? 'Writing' : 'Tulisan'}</h2><span className="no">04 / {isEn ? 'Notes' : 'Catatan'}</span></div>
      <div className="writing">{latest.map(a => <Link className="wrow sr" key={a.slug} to={`/blog/${a.slug}`}><div className="wtop"><span className="tag">{isEn && a.tagEn ? a.tagEn : a.tag}</span><span className="rt">{parseInt(String(a.readTime || '').match(/\d+/)?.[0] || '0', 10)} {isEn ? 'min read' : 'menit baca'}</span></div><h3>{isEn && a.titleEn ? a.titleEn : a.title}</h3><p className="wex">{getExcerpt(isEn && a.bodyEn?.length ? a.bodyEn : a.body)}</p></Link>)}</div>
      <Link to="/blog" className="morelink">{isEn ? 'Read all writing →' : 'Baca semua tulisan →'}</Link>
    </div></section>}

    <section className="contact" id="contact"><div className="wrap">
      {contact.profileImage && <div className="avatar sr"><img src={String(contact.profileImage).startsWith('http') ? resolveImageSrc(contact.profileImage) : `${import.meta.env.BASE_URL}${String(contact.profileImage).replace(/^\//, '')}`} alt="Profile" onError={e => { e.currentTarget.style.display = 'none' }} /></div>}
      <span className="eyebrow sr">{localized(contact, 'eyebrow')}</span><h2 className="sr">{localized(contact, 'titleLead')} <em>{localized(contact, 'titleEmphasis')}</em></h2><br />
      <a href={`mailto:${contact.email}`} className="mail sr">{contact.email}</a>
    </div></section>
    {activeDocumentItem && <DocumentModal item={activeDocumentItem.item} kind={activeDocumentItem.kind} language={language} onClose={() => setActiveDocumentItem(null)} />}
  </>
}
