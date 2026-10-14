import {
  useEffect,
  useMemo,
  useState
} from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  tagColorClass,
  colorForTag,
  TAGS,
  parseReadMinutes,
  formatReadTime,
  sortPinnedThenDate,
  dateTimeLabel,
} from '../lib/helpers.js'
import ImageInput from '../components/ImageInput.jsx'
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../api/articles.js'
import Pagination from '../components/Pagination.jsx'
import HomeManager from './HomeManager.jsx'

const EMPTY = {
  title: '', slug: '', subtitle: '', date: '', time: '', readTime: '',
  tag: 'Career', tagColor: 'blue', isPinned: false, picture: false,
  urlPicture: '', body: [{ type: 'paragraph', text: '' }],
  titleEn: '', slugEn: '', subtitleEn: '', tagEn: '', bodyEn: [],
}

// ── Login ───────────────────────────────────────────────
function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    const res = await login(email.trim(), pass)
    if (!res.ok) setError(res.error)
    setBusy(false)
  }

  return (
    <main className="relative z-[1] mx-auto flex min-h-[80vh] max-w-[420px] flex-col justify-center px-6">
      <div className="glass rounded-card p-9 shadow-soft">
        <h1 className="mb-1 font-serif text-[1.8rem] text-ink">Admin Login</h1>
        <p className="mb-6 text-[0.85rem] text-ink-secondary">Masuk untuk mengelola artikel.</p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email / ID"
            className="rounded-sm2 border border-line bg-surface text-ink placeholder:text-ink-muted px-4 py-3 text-[0.9rem] outline-none focus:border-accent" />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password"
            className="rounded-sm2 border border-line bg-surface text-ink placeholder:text-ink-muted px-4 py-3 text-[0.9rem] outline-none focus:border-accent" />
          {error && <p className="text-[0.82rem] text-[#e5484d]">{error}</p>}
          <button type="submit" disabled={busy}
            className="mt-1 rounded-[30px] bg-ink px-6 py-3 text-[0.88rem] font-medium text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60">
            {busy ? 'Memproses…' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ── Editor form ─────────────────────────────────────────
function ArticleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initial,
    body: Array.isArray(initial?.body) && initial.body.length
      ? initial.body
      : [{ type: 'paragraph', text: '' }],
    bodyEn: Array.isArray(initial?.bodyEn) ? initial.bodyEn : [],
  }))
  const [busy, setBusy] = useState(false)
  const [language, setLanguage] = useState('id')
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const titleKey = language === 'id' ? 'title' : 'titleEn'
  const slugKey = language === 'id' ? 'slug' : 'slugEn'
  const subtitleKey = language === 'id' ? 'subtitle' : 'subtitleEn'
  const tagKey = language === 'id' ? 'tag' : 'tagEn'
  const bodyKey = language === 'id' ? 'body' : 'bodyEn'
  const blocks = Array.isArray(form[bodyKey]) ? form[bodyKey] : []

  const setBlock = (index, patch) => setForm((current) => ({
    ...current,
    [bodyKey]: (Array.isArray(current[bodyKey]) ? current[bodyKey] : []).map((block, i) =>
      i === index ? { ...block, ...patch } : block
    ),
  }))
  const addBlock = () => setForm((current) => ({
    ...current,
    [bodyKey]: [...(Array.isArray(current[bodyKey]) ? current[bodyKey] : []), { type: 'paragraph', text: '' }],
  }))
  const removeBlock = (index) => setForm((current) => ({
    ...current,
    [bodyKey]: (Array.isArray(current[bodyKey]) ? current[bodyKey] : []).filter((_, i) => i !== index),
  }))
  const copyIndonesianStructure = () => {
    setForm((current) => ({
      ...current,
      bodyEn: (Array.isArray(current.body) ? current.body : []).map((block) =>
        block.type === 'image'
          ? { type: 'image', url: block.url || '', caption: '' }
          : { type: block.type || 'paragraph', text: '' }
      ),
    }))
  }

  const save = async () => {
    setBusy(true)
    try {
      await onSave({ ...form, body: Array.isArray(form.body) ? form.body : [], bodyEn: Array.isArray(form.bodyEn) ? form.bodyEn : [] })
    } catch (error) {
      alert('Gagal menyimpan: ' + (error?.message || error))
    } finally {
      setBusy(false)
    }
  }

  const field = 'rounded-sm2 border border-line bg-surface text-ink placeholder:text-ink-muted px-3 py-2 text-[0.88rem] outline-none focus:border-accent'
  const tabClass = (active) => `flex-1 rounded-full px-4 py-2 text-sm transition ${active ? 'bg-ink text-paper' : 'text-ink-secondary hover:bg-panel'}`

  return (
    <div className="glass rounded-card p-6 shadow-card">
      <h2 className="mb-4 font-serif text-[1.3rem] text-ink">{form.id ? 'Edit Artikel' : 'Artikel Baru'}</h2>
      <div className="mb-5 flex gap-2 rounded-full border border-line p-1">
        <button type="button" onClick={() => setLanguage('id')} className={tabClass(language === 'id')}>🇮🇩 Indonesia</button>
        <button type="button" onClick={() => setLanguage('en')} className={tabClass(language === 'en')}>🇺🇸 English</button>
      </div>
      {language === 'en' && (
        <div className="mb-4 rounded-sm2 border border-line bg-panel p-3 text-sm text-ink-secondary">
          Isi terjemahan Inggris di tab ini. Data Indonesia dan metadata bersama tidak berubah saat berpindah tab.
          {blocks.length === 0 && <div className="mt-2 flex flex-wrap items-center gap-2"><span>Konten Inggris masih kosong.</span><button type="button" onClick={copyIndonesianStructure} className="rounded-full border border-line px-3 py-1 text-xs text-ink hover:border-accent">Salin struktur blok Indonesia</button></div>}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input className={field} placeholder={language === 'id' ? 'Judul' : 'English title'} value={form[titleKey] || ''} onChange={(e) => set(titleKey, e.target.value)} />
        {language === 'id' && <input className={field} placeholder="Slug (mis. siapakah-saya)" value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} />}
        {language === 'id' && <input className={field} placeholder="Tanggal (18 April 2026)" value={form.date || ''} onChange={(e) => set('date', e.target.value)} />}
        <input className={field} placeholder="Waktu upload (mis. 19:00 WIB)" value={form.time || ''} onChange={(e) => set('time', e.target.value)} />
        <input className={field} type="number" min="1" placeholder="Lama baca (menit)" value={parseReadMinutes(form.readTime)} onChange={(e) => set('readTime', formatReadTime(e.target.value))} />
        
        <select
          className={field}
          value={form.tag || 'Career'}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              tag: e.target.value,
              tagColor: colorForTag(e.target.value),
            }))
          }
        >
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-[0.85rem] text-ink"><input type="checkbox" checked={!!form.isPinned} onChange={(e) => set('isPinned', e.target.checked)} /> Pinned</label>
      </div>
      <textarea className={field + ' mt-3 w-full'} rows={2} placeholder={language === 'id' ? 'Subtitle' : 'English subtitle'} value={form[subtitleKey] || ''} onChange={(e) => set(subtitleKey, e.target.value)} />
      <div className="mt-3">
        <ImageInput label="Gambar hero (berlaku untuk kedua bahasa)" value={form.urlPicture || ''} onChange={(value) => setForm((current) => ({ ...current, urlPicture: value, picture: !!value }))} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.72rem] font-medium uppercase tracking-wider text-ink-muted">{language === 'id' ? 'Isi Artikel (blok)' : 'Article Content (blocks)'}</div>
        {language === 'en' && blocks.length > 0 && <button type="button" onClick={copyIndonesianStructure} className="text-xs text-accent hover:underline">Salin ulang struktur blok Indonesia</button>}
      </div>
      <div className="mt-2 flex flex-col gap-3">
        {blocks.length === 0 ? (
          <p className="rounded-sm2 border border-dashed border-line p-4 text-sm text-ink-muted">Belum ada blok konten. Tekan “+ Tambah blok” untuk mulai menulis.</p>
        ) : blocks.map((block, index) => (
          <div key={`${bodyKey}-${index}`} className="rounded-sm2 border border-line bg-panel p-3">
            <div className="mb-2 flex items-center gap-2">
              <select className={field} value={block.type || 'paragraph'} onChange={(e) => setBlock(index, { type: e.target.value })}>
                <option value="paragraph">paragraph</option><option value="heading">heading</option><option value="blockquote">blockquote</option><option value="pullquote">pullquote</option><option value="image">image</option>
              </select>
              <button type="button" onClick={() => removeBlock(index)} className="ml-auto text-[0.8rem] text-[#e5484d]">Hapus blok</button>
            </div>
            {block.type === 'image' ? (
              <div className="grid gap-2">
                <ImageInput label="Gambar blok" value={block.url || ''} onChange={(url) => setBlock(index, { url })} />
                <input className={field} placeholder={language === 'id' ? 'Caption' : 'English caption'} value={block.caption || ''} onChange={(e) => setBlock(index, { caption: e.target.value })} />
              </div>
            ) : (
              <textarea className={field + ' w-full'} rows={3} placeholder={language === 'id' ? 'Teks…' : 'English text…'} value={typeof block.text === 'string' ? block.text : ''} onChange={(e) => setBlock(index, { text: e.target.value })} />
            )}
          </div>
        ))}
        <button type="button" onClick={addBlock} className="self-start rounded-[30px] border border-line px-4 py-2 text-[0.82rem]">+ Tambah blok</button>
      </div>
      <div className="mt-5 flex gap-3">
        <button type="button" onClick={save} disabled={busy} className="rounded-[30px] bg-ink px-6 py-2.5 text-[0.85rem] font-medium text-paper disabled:opacity-60">{busy ? 'Menyimpan…' : 'Simpan'}</button>
        <button type="button" onClick={onCancel} className="rounded-[30px] border border-line px-6 py-2.5 text-[0.85rem]">Batal</button>
      </div>
    </div>
  )
}

// ── Dashboard ───────────────────────────────────────────
function Dashboard() {
  const { logout } = useAuth()

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showHomeManager, setShowHomeManager] = useState(false)

  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  const load = () => {
    setLoading(true)

    fetchArticles()
      .then(setList)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSave = async (form) => {
    if (form.id) {
      await updateArticle(form.id, form)
    } else {
      await createArticle(form)
    }

    setEditing(null)
    setCurrentPage(1)
    load()
  }

  const handleDelete = async (a) => {
    if (!confirm(`Hapus "${a.title}"?`)) return

    await deleteArticle(a.id)

    load()
  }

  // Filter berdasarkan tema.
  const filteredList = useMemo(() => {
    const result =
      filter === 'all'
        ? list
        : list.filter((a) => a.tag === filter)

    return sortPinnedThenDate(result)
  }, [list, filter])

  // Hitung jumlah halaman.
  const totalPages = Math.ceil(
    filteredList.length / ITEMS_PER_PAGE,
  )

  // Ambil artikel sesuai halaman aktif.
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

    return filteredList.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    )
  }, [filteredList, currentPage])

  // Ketika filter berubah → kembali ke page 1.
  const handleFilterChange = (tag) => {
    setFilter(tag)
    setCurrentPage(1)
  }

  // Jika setelah delete artikel halaman aktif sudah tidak tersedia,
  // pindahkan user ke halaman terakhir yang masih valid.
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (showHomeManager) {
    return <HomeManager onBack={() => setShowHomeManager(false)} onLogout={logout} />
  }

  if (editing) {
    return (
      <main className="relative z-[1] mx-auto max-w-[760px] px-6 pb-24 pt-28">
        <ArticleForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </main>
    )
  }

  return (
    <main className="relative z-[1] mx-auto max-w-[900px] px-6 pb-24 pt-28">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[1.7rem] text-ink sm:text-[2rem]">
            Dashboard
          </h1>

          <p className="text-[0.9rem] text-ink-secondary">
            {filteredList.length} artikel
            {filter !== 'all' && ` · ${filter}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowHomeManager(true)}
            className="rounded-[30px] border border-line bg-surface px-3.5 py-2 text-[0.8rem] font-medium text-ink sm:px-5 sm:py-2.5 sm:text-[0.85rem]"
          >
            Kelola Home
          </button>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="rounded-[30px] bg-ink px-3.5 py-2 text-[0.8rem] font-medium text-paper sm:px-5 sm:py-2.5 sm:text-[0.85rem]"
          >
            + Artikel Baru
          </button>

          <button
            onClick={logout}
            className="rounded-[30px] border border-line bg-surface px-3.5 py-2 text-[0.8rem] font-medium text-ink sm:px-5 sm:py-2.5 sm:text-[0.85rem]"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Theme Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...TAGS].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleFilterChange(tag)}
            className={`rounded-full border px-4 py-1.5 text-[0.8rem] transition-all ${
              filter === tag
                ? 'border-transparent bg-ink text-paper'
                : 'border-line bg-surface text-ink-secondary hover:border-line2 hover:text-ink'
            }`}
          >
            {tag === 'all' ? 'Semua' : tag}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-muted">
          Memuat…
        </p>
      ) : filteredList.length === 0 ? (
        <div className="rounded-card border border-line py-16 text-center text-ink-muted">
          Belum ada artikel di kategori ini.
        </div>
      ) : (
        <>
          {/* Article list */}
          <div className="flex flex-col gap-2.5">
            {paginatedList.map((a) => (
              <div
                key={a.id}
                className="glass flex flex-col gap-3 rounded-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
              >
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    {a.isPinned && (
                      <span className="text-[0.72rem] text-accent-amber">
                        📌 Pinned
                      </span>
                    )}

                    <span
                      className={`rounded-[20px] px-2.5 py-1 text-[0.65rem] font-medium uppercase ${tagColorClass(
                        colorForTag(a.tag),
                      )}`}
                    >
                      {a.tag}
                    </span>

                    <span className="text-[0.75rem] text-ink-muted">
                      {dateTimeLabel(a)}
                    </span>
                  </div>

                  <h3 className="truncate text-[0.95rem] font-medium text-ink">
                    {a.title}
                  </h3>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  <button
                    onClick={() => setEditing(a)}
                    className="rounded-[20px] border border-accent/30 px-4 py-1.5 text-[0.8rem] font-medium text-accent"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(a)}
                    className="rounded-[20px] border border-[#e5484d]/30 px-4 py-1.5 text-[0.8rem] font-medium text-[#e5484d]"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredList.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
/>
        </>
      )}
    </main>
  )
}

export default function Admin() {
  const { isAuthed, loading } = useAuth()
  if (loading) return <main className="relative z-[1] flex min-h-[60vh] items-center justify-center text-ink-muted">Memuat…</main>
  return isAuthed ? <Dashboard /> : <LoginForm />
}