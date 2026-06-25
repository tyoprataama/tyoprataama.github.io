import { useEffect, useState } from 'react'
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

const EMPTY = {
  title: '', slug: '', subtitle: '', date: '', time: '', readTime: '',
  tag: 'Career', tagColor: 'blue', isPinned: false, picture: false,
  urlPicture: '', body: [{ type: 'paragraph', text: '' }],
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
            className="rounded-sm2 border border-black/10 bg-white/80 px-4 py-3 text-[0.9rem] outline-none focus:border-accent-blue" />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password"
            className="rounded-sm2 border border-black/10 bg-white/80 px-4 py-3 text-[0.9rem] outline-none focus:border-accent-blue" />
          {error && <p className="text-[0.82rem] text-accent-red">{error}</p>}
          <button type="submit" disabled={busy}
            className="mt-1 rounded-[30px] bg-ink px-6 py-3 text-[0.88rem] font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60">
            {busy ? 'Memproses…' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ── Editor form ─────────────────────────────────────────
function ArticleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const setBlock = (i, patch) =>
    setForm((f) => ({ ...f, body: f.body.map((b, j) => (j === i ? { ...b, ...patch } : b)) }))
  const addBlock = () => setForm((f) => ({ ...f, body: [...f.body, { type: 'paragraph', text: '' }] }))
  const removeBlock = (i) => setForm((f) => ({ ...f, body: f.body.filter((_, j) => j !== i) }))

  const save = async () => {
    setBusy(true)
    try { await onSave(form) } catch (e) { alert('Gagal menyimpan: ' + e.message) }
    setBusy(false)
  }

  const field = "rounded-sm2 border border-black/10 bg-white/80 px-3 py-2 text-[0.88rem] outline-none focus:border-accent-blue"

  return (
    <div className="glass rounded-card p-6 shadow-card">
      <h2 className="mb-4 font-serif text-[1.3rem] text-ink">{form.id ? 'Edit Artikel' : 'Artikel Baru'}</h2>
      <div className="grid grid-cols-2 gap-3">
        <input className={field} placeholder="Judul" value={form.title} onChange={(e) => set('title', e.target.value)} />
        <input className={field} placeholder="Slug (mis. siapakah-saya)" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
        <input className={field} placeholder="Tanggal (18 April 2026)" value={form.date} onChange={(e) => set('date', e.target.value)} />
        <input className={field} placeholder="Waktu upload (mis. 19:00 WIB)" value={form.time || ''} onChange={(e) => set('time', e.target.value)} />
        <input className={field} type="number" min="1" placeholder="Lama baca (menit)" value={parseReadMinutes(form.readTime)} onChange={(e) => set('readTime', formatReadTime(e.target.value))}/>
      <select
      className={field}
      value={form.tag}
      onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value, tagColor: colorForTag(e.target.value) }))}>
        {TAGS.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
</select>
        <label className="flex items-center gap-2 text-[0.85rem] text-ink">
          <input type="checkbox" checked={form.isPinned} onChange={(e) => set('isPinned', e.target.checked)} /> Pinned
        </label>
      </div>
      <textarea className={field + ' mt-3 w-full'} rows={2} placeholder="Subtitle" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
      <div className="mt-3">
        <ImageInput
          label="Gambar hero (opsional)"
          value={form.urlPicture || ''}
          onChange={(v) => setForm((f) => ({ ...f, urlPicture: v, picture: !!v }))}
        />
      </div>

      {/* Editor blok konten */}
      <div className="mt-5 text-[0.72rem] font-medium uppercase tracking-wider text-ink-muted">Isi Artikel (blok)</div>
      <div className="mt-2 flex flex-col gap-3">
        {form.body.map((b, i) => (
          <div key={i} className="rounded-sm2 border border-black/10 bg-white/60 p-3">
            <div className="mb-2 flex items-center gap-2">
              <select className={field} value={b.type} onChange={(e) => setBlock(i, { type: e.target.value })}>
                <option value="paragraph">paragraph</option><option value="heading">heading</option>
                <option value="blockquote">blockquote</option><option value="pullquote">pullquote</option>
                <option value="image">image</option>
              </select>
              <button onClick={() => removeBlock(i)} className="ml-auto text-[0.8rem] text-accent-red">Hapus blok</button>
            </div>
            {b.type === 'image' ? (
              <div className="grid gap-2">
                <ImageInput label="Gambar blok" value={b.url || ''} onChange={(url) => setBlock(i, { url })} />
                <input className={field} placeholder="Caption" value={b.caption || ''} onChange={(e) => setBlock(i, { caption: e.target.value })} />
              </div>
            ) : (
              <textarea className={field + ' w-full'} rows={3} placeholder="Teks…" value={b.text || ''} onChange={(e) => setBlock(i, { text: e.target.value })} />
            )}
          </div>
        ))}
        <button onClick={addBlock} className="self-start rounded-[30px] border border-black/10 px-4 py-2 text-[0.82rem]">+ Tambah blok</button>
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={save} disabled={busy} className="rounded-[30px] bg-ink px-6 py-2.5 text-[0.85rem] font-medium text-white disabled:opacity-60">
          {busy ? 'Menyimpan…' : 'Simpan'}
        </button>
        <button onClick={onCancel} className="rounded-[30px] border border-black/10 px-6 py-2.5 text-[0.85rem]">Batal</button>
      </div>
    </div>
  )
}

// ── Dashboard ───────────────────────────────────────────
function Dashboard() {
  const { logout } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // object utk edit/baru, atau null

  const load = () => { setLoading(true); fetchArticles().then(setList).finally(() => setLoading(false)) }
  useEffect(load, [])

  const handleSave = async (form) => {
    if (form.id) await updateArticle(form.id, form)
    else await createArticle(form)
    setEditing(null); load()
  }
  const handleDelete = async (a) => {
    if (!confirm(`Hapus "${a.title}"?`)) return
    await deleteArticle(a.id); load()
  }

  if (editing) return (
    <main className="relative z-[1] mx-auto max-w-[760px] px-6 pb-24 pt-28">
      <ArticleForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
    </main>
  )

  return (
    <main className="relative z-[1] mx-auto max-w-[900px] px-6 pb-24 pt-28">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
  <div>
    <h1 className="font-serif text-[1.7rem] text-ink sm:text-[2rem]">Dashboard</h1>
    <p className="text-[0.9rem] text-ink-secondary">{list.length} artikel.</p>
  </div>
  <div className="flex gap-2">
    <button onClick={() => setEditing({ ...EMPTY })} className="rounded-[30px] bg-ink px-3.5 py-2 text-[0.8rem] font-medium text-white sm:px-5 sm:py-2.5 sm:text-[0.85rem]">+ Artikel Baru</button>
    <button onClick={logout} className="rounded-[30px] border border-black/10 bg-white/70 px-3.5 py-2 text-[0.8rem] font-medium sm:px-5 sm:py-2.5 sm:text-[0.85rem]">Keluar</button>
  </div>
</div>

      {loading ? (
  <p className="text-ink-muted">Memuat…</p>
) : (
  <div className="flex flex-col gap-2.5">
    {sortPinnedThenDate(list).map((a) => (
      <div
        key={a.id}
        className="glass flex flex-col gap-3 rounded-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
      >
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {a.isPinned && <span className="text-[0.72rem] text-accent-amber">📌 Pinned</span>}
            <span className={`rounded-[20px] px-2.5 py-1 text-[0.65rem] font-medium uppercase ${tagColorClass(colorForTag(a.tag))}`}>
              {a.tag}
            </span>
            <span className="text-[0.75rem] text-ink-muted">{dateTimeLabel(a)}</span>
          </div>
          <h3 className="truncate text-[0.95rem] font-medium text-ink">{a.title}</h3>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => setEditing(a)}
            className="rounded-[20px] border border-accent-blue/30 px-4 py-1.5 text-[0.8rem] font-medium text-accent-blue">
            Edit
          </button>
          <button
            onClick={() => handleDelete(a)}
            className="rounded-[20px] border border-accent-red/30 px-4 py-1.5 text-[0.8rem] font-medium text-accent-red">
            Hapus
          </button>
        </div>
      </div>
    ))}
  </div>
)}
    </main>
  )
}

export default function Admin() {
  const { isAuthed, loading } = useAuth()
  if (loading) return <main className="relative z-[1] flex min-h-[60vh] items-center justify-center text-ink-muted">Memuat…</main>
  return isAuthed ? <Dashboard /> : <LoginForm />
}