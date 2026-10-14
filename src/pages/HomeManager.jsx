import { useEffect, useState } from 'react'
import { DEFAULT_HOME_CONTENT, fetchHomeContent, saveHomeContent, fetchProjects, saveProject, deleteProject, fetchExperiences, saveExperience, deleteExperience } from '../api/homeContent.js'
import { projects as defaultProjects, experiences as defaultExperiences } from '../data/portfolio.js'
import ImageInput from '../components/ImageInput.jsx'
import Pagination from '../components/Pagination.jsx'
import { deleteStorageUrls, isBucketUrl } from '../lib/storage.js'

const inputClass = 'w-full rounded-sm2 border border-line bg-surface px-3 py-2 text-[0.88rem] text-ink outline-none focus:border-accent'
const buttonClass = 'rounded-[30px] border border-line px-4 py-2 text-[0.82rem] font-medium text-ink hover:border-accent'
const primaryClass = 'rounded-[30px] bg-ink px-5 py-2.5 text-[0.85rem] font-medium text-paper disabled:opacity-60'
const blankProject = { title: '', category: '', description: '', imageUrl: '', projectUrl: '', githubUrl: '', stack: [], sortOrder: 0, isPinned: false, isVisible: true }
const blankExperience = { company: '', role: '', period: '', description: '', achievements: [], sortOrder: 0, isPinned: false, isVisible: true }
const ITEMS_PER_PAGE = 5

function Field({ label, value, onChange, multiline = false, type = 'text', placeholder = '' }) {
  const El = multiline ? 'textarea' : 'input'
  return <label className="flex flex-col gap-1.5 text-[0.78rem] text-ink-secondary"><span>{label}</span><El className={inputClass} type={type} rows={multiline ? 3 : undefined} value={value ?? ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} /></label>
}
function Panel({ title, children, actions }) {
  return <section className="glass rounded-card p-5 shadow-card sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-[1.25rem] text-ink">{title}</h2>{actions}</div>{children}</section>
}

export default function HomeManager({ onBack, onLogout }) {
  const [tab, setTab] = useState('home')
  const [editLanguage, setEditLanguage] = useState('id')
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT)
  const [projectList, setProjectList] = useState([])
  const [experienceList, setExperienceList] = useState([])
  const [projectEdit, setProjectEdit] = useState(null)
  const [experienceEdit, setExperienceEdit] = useState(null)
  const [projectPage, setProjectPage] = useState(1)
  const [experiencePage, setExperiencePage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const refresh = async () => {
    setLoading(true); setError('')
    try {
      const [c, p, e] = await Promise.all([fetchHomeContent(), fetchProjects(), fetchExperiences()])
      setContent(c); setProjectList(p); setExperienceList(e)
    } catch (err) { setError(err.message || 'Gagal memuat data.') }
    finally { setLoading(false) }
  }
  useEffect(() => { refresh() }, [])
  const localizedKey = key => editLanguage === 'id' ? `${key}Id` : key
  const getLocalized = (object, key) => object?.[localizedKey(key)] ?? object?.[key] ?? ''
  const setSection = (section, key, value) => setContent(old => ({ ...old, [section]: { ...old[section], [localizedKey(key)]: value } }))
  const setSharedSection = (section, key, value) => setContent(old => ({ ...old, [section]: { ...old[section], [key]: value } }))
  const setFact = (index, key, value) => setContent(old => ({ ...old, facts: old.facts.map((fact, i) => i === index ? { ...fact, [key]: value } : fact) }))
  const saveContent = async () => {
    setBusy(true); setError(''); setNotice('')
    try { await saveHomeContent(content); setNotice('Konten Home berhasil disimpan.') }
    catch (err) { setError(err.message || 'Gagal menyimpan konten Home.') }
    finally { setBusy(false) }
  }
  const submitProject = async () => {
    setBusy(true); setError(''); setNotice('')
    try { const sortOrder = projectEdit.id ? projectEdit.sortOrder : Math.min(0, ...projectList.map(p => p.sortOrder ?? 0)) - 1; await saveProject({ ...projectEdit, sortOrder, stack: typeof projectEdit.stack === 'string' ? projectEdit.stack.split(',').map(s => s.trim()).filter(Boolean) : projectEdit.stack }); setProjectEdit(null); setProjectPage(1); setProjectList(await fetchProjects()); setNotice('Proyek berhasil disimpan.') }
    catch (err) { setError(err.message || 'Gagal menyimpan proyek.') }
    finally { setBusy(false) }
  }
  const submitExperience = async () => {
    setBusy(true); setError(''); setNotice('')
    try { const sortOrder = experienceEdit.id ? experienceEdit.sortOrder : Math.min(0, ...experienceList.map(e => e.sortOrder ?? 0)) - 1; await saveExperience({ ...experienceEdit, sortOrder }); setExperienceEdit(null); setExperiencePage(1); setExperienceList(await fetchExperiences()); setNotice('Pengalaman berhasil disimpan.') }
    catch (err) { setError(err.message || 'Gagal menyimpan pengalaman.') }
    finally { setBusy(false) }
  }
  const seedDefaults = async () => {
    if (!confirm('Masukkan proyek dan pengalaman bawaan ke database? Data yang sudah ada tidak akan ditimpa.')) return
    setBusy(true); setError(''); setNotice('')
    try {
      const [p, e] = await Promise.all([fetchProjects(), fetchExperiences()])
      if (!p.length) {
        for (const [i, item] of defaultProjects.entries()) await saveProject({ title: item.title, category: item.tags?.map(t => t.label).join(', ') || '', description: item.desc, projectUrl: item.links || '', githubUrl: '', imageUrl: '', stack: item.tech || [], sortOrder: i, isPinned: !!item.featured, isVisible: true })
      }
      if (!e.length) {
        for (const [i, item] of defaultExperiences.entries()) await saveExperience({ company: item.company, role: item.title, period: item.period, description: item.desc, achievements: [], sortOrder: i, isPinned: false, isVisible: true })
      }
      await refresh(); setNotice('Konten bawaan dimuat. Data yang sudah ada tidak ditimpa.')
    } catch (err) { setError(err.message || 'Gagal memuat konten bawaan.') }
    finally { setBusy(false) }
  }
  const removeProject = async item => { if (!confirm(`Hapus proyek “${item.title}”?`)) return; try { await deleteProject(item.id); const next = await fetchProjects(); setProjectList(next); if ((projectPage - 1) * ITEMS_PER_PAGE >= next.length) setProjectPage(Math.max(1, projectPage - 1)); setNotice('Proyek dihapus.') } catch (err) { setError(err.message) } }
  const removeExperience = async item => { if (!confirm(`Hapus pengalaman “${item.role}”?`)) return; try { await deleteExperience(item.id); const next = await fetchExperiences(); setExperienceList(next); if ((experiencePage - 1) * ITEMS_PER_PAGE >= next.length) setExperiencePage(Math.max(1, experiencePage - 1)); setNotice('Pengalaman dihapus.') } catch (err) { setError(err.message) } }

  return <main className="relative z-[1] mx-auto max-w-[1000px] px-5 pb-24 pt-28 sm:px-6">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-serif text-[1.7rem] text-ink sm:text-[2rem]">Kelola Konten Home</h1><p className="text-[0.88rem] text-ink-secondary">Edit konten portfolio yang tampil di halaman utama.</p></div><div className="flex gap-2"><button className={buttonClass} onClick={onBack}>← Artikel</button><button className={buttonClass} onClick={onLogout}>Keluar</button></div></div>
    <div className="flex gap-2 rounded-full border border-line p-1"><button className={`${buttonClass} flex-1 ${editLanguage === 'id' ? '!bg-ink !text-paper' : ''}`} onClick={() => setEditLanguage('id')}>🇮🇩 Indonesia</button><button className={`${buttonClass} flex-1 ${editLanguage === 'en' ? '!bg-ink !text-paper' : ''}`} onClick={() => setEditLanguage('en')}>🇺🇸 English</button></div>
    <div className="mb-5 flex flex-wrap gap-2">{[['home','Hero, About & Contact'],['projects','Projects'],['experience','Experience']].map(([id,label]) => <button key={id} className={`${buttonClass} ${tab === id ? '!border-transparent !bg-ink !text-paper' : ''}`} onClick={() => { setTab(id); setError(''); setNotice('') }}>{label}</button>)}</div>
    {notice && <p role="status" className="mb-4 rounded-sm2 border border-green-600/30 bg-green-500/10 p-3 text-[0.85rem] text-green-700">{notice}</p>}
    {error && <p role="alert" className="mb-4 rounded-sm2 border border-red-500/30 bg-red-500/10 p-3 text-[0.85rem] text-red-600">{error}</p>}
    {loading ? <p className="text-ink-muted">Memuat konten…</p> : <>
      {tab === 'home' && <div className="flex flex-col gap-4">
        <Panel title="Hero / Bagian pembuka" actions={<button className={primaryClass} disabled={busy} onClick={saveContent}>{busy ? 'Menyimpan…' : 'Simpan konten Home'}</button>}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Label kecil" value={getLocalized(content.hero, 'eyebrow')} onChange={v => setSection('hero','eyebrow',v)} />
            <Field label="Lokasi (Based in)" value={getLocalized(content.hero, 'basedIn')} onChange={v => setSection('hero','basedIn',v)} />
            <div className="sm:col-span-2"><Field label="Judul Hero (baris otomatis menyesuaikan layar)" multiline value={getLocalized(content.hero, 'titleText')} onChange={v => setSection('hero','titleText',v)} /><p className="mt-1 text-xs text-ink-muted">Format penekanan: <code>#teks#</code> untuk italic, atau <code>*teks*</code> untuk italic dengan warna highlight.</p></div>
            <Field label="Fokus industri" value={getLocalized(content.hero, 'focus')} onChange={v => setSection('hero','focus',v)} />
            <div className="sm:col-span-2"><Field label="Deskripsi Hero" multiline value={getLocalized(content.hero, 'subtitle')} onChange={v => setSection('hero','subtitle',v)} /></div>
            <Field label="Teks tombol proyek" value={getLocalized(content.hero, 'workButton')} onChange={v => setSection('hero','workButton',v)} />
            <Field label="Teks tombol artikel" value={getLocalized(content.hero, 'blogButton')} onChange={v => setSection('hero','blogButton',v)} />
          </div>
        </Panel>
        <Panel title="About / Profil singkat" actions={<button className={primaryClass} disabled={busy} onClick={saveContent}>{busy ? 'Menyimpan…' : 'Simpan konten Home'}</button>}>
          <div className="flex flex-col gap-3"><Field label="Paragraf utama" multiline value={getLocalized(content.about, 'profile')} onChange={v => setSection('about','profile',v)} /><Field label="Paragraf lanjutan" multiline value={getLocalized(content.about, 'details')} onChange={v => setSection('about','details',v)} /></div>
          <h3 className="mb-3 mt-5 font-medium text-ink">Facts / Statistik singkat</h3>
          <div className="grid gap-3 sm:grid-cols-2">{content.facts.map((fact,i) => <div key={i} className="rounded-sm2 border border-line p-3"><p className="mb-2 text-xs text-ink-muted">Fact {i+1}</p><div className="flex flex-col gap-2"><Field label="Label" value={editLanguage === 'id' ? (fact.kId ?? fact.k) : fact.k} onChange={v => setContent(old => ({...old, facts: old.facts.map((f,j) => j === i ? {...f, [editLanguage === 'id' ? 'kId' : 'k']:v} : f)}))} /><Field label="Nilai" value={editLanguage === 'id' ? (fact.vId ?? fact.v) : fact.v} onChange={v => setContent(old => ({...old, facts: old.facts.map((f,j) => j === i ? {...f, [editLanguage === 'id' ? 'vId' : 'v']:v} : f)}))} /><Field label="Keterangan" value={editLanguage === 'id' ? (fact.sId ?? fact.s) : fact.s} onChange={v => setContent(old => ({...old, facts: old.facts.map((f,j) => j === i ? {...f, [editLanguage === 'id' ? 'sId' : 's']:v} : f)}))} /></div></div>)}</div>
        </Panel>
        <Panel title="Contact / Kontak" actions={<button className={primaryClass} disabled={busy} onClick={saveContent}>{busy ? 'Menyimpan…' : 'Simpan konten Home'}</button>}>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Eyebrow" value={getLocalized(content.contact, 'eyebrow')} onChange={v => setSection('contact','eyebrow',v)} /><Field label="Teks judul" value={getLocalized(content.contact, 'titleLead')} onChange={v => setSection('contact','titleLead',v)} /><Field label="Kata penekanan judul" value={getLocalized(content.contact, 'titleEmphasis')} onChange={v => setSection('contact','titleEmphasis',v)} /><Field label="Email" value={content.contact.email} onChange={v => setSharedSection('contact','email',v)} /><div className="sm:col-span-2"><ImageInput label="Foto profil (maks. 5 MB)" value={content.contact.profileImage} onChange={v => setSharedSection('contact','profileImage',v)} onUploaded={async url => { const previousUrl = content.contact.profileImage; const updated = { ...content, contact: { ...content.contact, profileImage: url } }; setContent(updated); try { await saveHomeContent(updated); if (previousUrl && previousUrl !== url && isBucketUrl(previousUrl)) { const removed = await deleteStorageUrls([previousUrl]); if (!removed) { setNotice('Foto baru sudah tersimpan.'); setError('Foto lama sudah tidak ditampilkan, tetapi file lamanya gagal dihapus dari Storage.') ; return } } setNotice('Foto profil berhasil diupload dan langsung diperbarui di Home.'); setError('') } catch (err) { setError('Foto terupload, tetapi gagal menyimpan perubahan Home: ' + (err.message || err)) } }} onRemove={async url => { const updated = { ...content, contact: { ...content.contact, profileImage: '' } }; await saveHomeContent(updated); setContent(updated); if (url && isBucketUrl(url)) { const removed = await deleteStorageUrls([url]); if (!removed) { setNotice('Foto sudah dihapus dari Home dan database.'); setError('File foto gagal dihapus dari Storage. Periksa izin DELETE pada bucket article-images.') ; return } } setNotice('Foto profil dihapus dari Home, database, dan Storage.'); setError('') }} /></div></div>
        </Panel>
      </div>}
      {tab === 'projects' && <Panel title={`Projects (${projectList.length})`} actions={<div className="flex flex-wrap gap-2"><button className={buttonClass} disabled={busy} onClick={seedDefaults}>Muat konten bawaan</button><button className={primaryClass} onClick={() => setProjectEdit({...blankProject})}>+ Proyek</button></div>}>
        {projectEdit ? <div className="mb-5 rounded-sm2 border border-line p-4"><h3 className="mb-3 font-medium text-ink">{projectEdit.id ? 'Edit proyek' : 'Proyek baru'}</h3><div className="grid gap-3 sm:grid-cols-2"><Field label={editLanguage === 'en' ? 'Title (English)' : 'Judul (Indonesia)'} value={editLanguage === 'id' ? projectEdit.titleId : projectEdit.title} onChange={v => setProjectEdit(p=>({...p,[editLanguage === 'id' ? 'titleId' : 'title']:v}))}/><Field label={editLanguage === 'en' ? 'Category (English)' : 'Kategori (Indonesia)'} value={editLanguage === 'id' ? projectEdit.categoryId : projectEdit.category} onChange={v => setProjectEdit(p=>({...p,[editLanguage === 'id' ? 'categoryId' : 'category']:v}))}/><Field label="Stack / teknologi (pisahkan koma)" value={Array.isArray(projectEdit.stack)?projectEdit.stack.join(', '):projectEdit.stack} onChange={v=>setProjectEdit(p=>({...p,stack:v}))}/><Field label="URL proyek" value={projectEdit.projectUrl} onChange={v=>setProjectEdit(p=>({...p,projectUrl:v}))}/><Field label="URL GitHub" value={projectEdit.githubUrl} onChange={v=>setProjectEdit(p=>({...p,githubUrl:v}))}/><Field label="URL gambar" value={projectEdit.imageUrl} onChange={v=>setProjectEdit(p=>({...p,imageUrl:v}))}/><label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={projectEdit.isPinned} onChange={e=>setProjectEdit(p=>({...p,isPinned:e.target.checked}))}/> Pinned / utamakan proyek</label><label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={projectEdit.isVisible} onChange={e=>setProjectEdit(p=>({...p,isVisible:e.target.checked}))}/> Tampilkan di Home</label><div className="sm:col-span-2"><Field label={editLanguage === 'en' ? 'Description (English)' : 'Deskripsi (Indonesia)'} multiline value={editLanguage === 'id' ? projectEdit.descriptionId : projectEdit.description} onChange={v=>setProjectEdit(p=>({...p,[editLanguage === 'id' ? 'descriptionId' : 'description']:v}))}/></div></div><div className="mt-4 flex gap-2"><button className={primaryClass} disabled={busy} onClick={submitProject}>{busy?'Menyimpan…':'Simpan proyek'}</button><button className={buttonClass} onClick={()=>setProjectEdit(null)}>Batal</button></div></div> : null}
        {projectList.length===0 && !projectEdit ? <p className="mb-4 text-sm text-ink-secondary">Belum ada proyek di database. Tekan “Muat konten bawaan” untuk menyalin proyek yang saat ini tertulis di file portfolio.js.</p> : null}
        <div className="flex flex-col gap-2">{projectList.slice((projectPage-1)*ITEMS_PER_PAGE, projectPage*ITEMS_PER_PAGE).map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm2 border border-line p-3"><div className="min-w-0"><p className="font-medium text-ink">{p.title}</p><p className="text-xs text-ink-secondary">{p.category || 'Tanpa kategori'} · {p.isPinned ? 'Pinned · ' : ''}{p.isVisible?'Tampil':'Disembunyikan'}</p></div><div className="flex gap-2"><button className={buttonClass} onClick={()=>setProjectEdit({...p,stack:p.stack.join(', ')})}>Edit</button><button className={`${buttonClass} !text-red-600`} onClick={()=>removeProject(p)}>Hapus</button></div></div>)}</div>
        <Pagination currentPage={projectPage} totalPages={Math.ceil(projectList.length / ITEMS_PER_PAGE)} totalItems={projectList.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setProjectPage} />
      </Panel>}
      {tab === 'experience' && <Panel title={`Experience (${experienceList.length})`} actions={<div className="flex flex-wrap gap-2"><button className={buttonClass} disabled={busy} onClick={seedDefaults}>Muat konten bawaan</button><button className={primaryClass} onClick={() => setExperienceEdit({...blankExperience})}>+ Experience</button></div>}>
        {experienceEdit ? <div className="mb-5 rounded-sm2 border border-line p-4"><h3 className="mb-3 font-medium text-ink">{experienceEdit.id?'Edit pengalaman':'Pengalaman baru'}</h3><div className="grid gap-3 sm:grid-cols-2"><Field label={editLanguage === 'en' ? 'Role (English)' : 'Jabatan / peran'} value={editLanguage === 'id' ? experienceEdit.roleId : experienceEdit.role} onChange={v=>setExperienceEdit(p=>({...p,[editLanguage === 'id' ? 'roleId' : 'role']:v}))}/><Field label={editLanguage === 'en' ? 'Company (English)' : 'Perusahaan / organisasi'} value={editLanguage === 'id' ? experienceEdit.companyId : experienceEdit.company} onChange={v=>setExperienceEdit(p=>({...p,[editLanguage === 'id' ? 'companyId' : 'company']:v}))}/><Field label={editLanguage === 'en' ? 'Period (English)' : 'Periode'} value={editLanguage === 'id' ? experienceEdit.periodId : experienceEdit.period} onChange={v=>setExperienceEdit(p=>({...p,[editLanguage === 'id' ? 'periodId' : 'period']:v}))}/><label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={experienceEdit.isPinned} onChange={e=>setExperienceEdit(p=>({...p,isPinned:e.target.checked}))}/> Pinned / utamakan pengalaman</label><label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={experienceEdit.isVisible} onChange={e=>setExperienceEdit(p=>({...p,isVisible:e.target.checked}))}/> Tampilkan di Home</label><div className="sm:col-span-2"><Field label={editLanguage === 'en' ? 'Description (English)' : 'Deskripsi (Indonesia)'} multiline value={editLanguage === 'id' ? experienceEdit.descriptionId : experienceEdit.description} onChange={v=>setExperienceEdit(p=>({...p,[editLanguage === 'id' ? 'descriptionId' : 'description']:v}))}/></div></div><div className="mt-4 flex gap-2"><button className={primaryClass} disabled={busy} onClick={submitExperience}>{busy?'Menyimpan…':'Simpan pengalaman'}</button><button className={buttonClass} onClick={()=>setExperienceEdit(null)}>Batal</button></div></div> : null}
        {experienceList.length===0 && !experienceEdit ? <p className="mb-4 text-sm text-ink-secondary">Belum ada pengalaman di database. Tekan “Muat konten bawaan” untuk menyalin pengalaman yang saat ini tertulis di file portfolio.js.</p> : null}
        <div className="flex flex-col gap-2">{experienceList.slice((experiencePage-1)*ITEMS_PER_PAGE, experiencePage*ITEMS_PER_PAGE).map(e=><div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm2 border border-line p-3"><div className="min-w-0"><p className="font-medium text-ink">{e.role}</p><p className="text-xs text-ink-secondary">{e.company} · {e.period} · {e.isPinned ? 'Pinned · ' : ''}{e.isVisible?'Tampil':'Disembunyikan'}</p></div><div className="flex gap-2"><button className={buttonClass} onClick={()=>setExperienceEdit(e)}>Edit</button><button className={`${buttonClass} !text-red-600`} onClick={()=>removeExperience(e)}>Hapus</button></div></div>)}</div>
        <Pagination currentPage={experiencePage} totalPages={Math.ceil(experienceList.length / ITEMS_PER_PAGE)} totalItems={experienceList.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setExperiencePage} />
      </Panel>}
    </>}
  </main>
}
