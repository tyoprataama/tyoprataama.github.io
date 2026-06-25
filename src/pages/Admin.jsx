import { useState } from 'react'
import articles from '../data/articles.js'
import { useAuth } from '../context/AuthContext.jsx'
import { tagColorClass } from '../lib/helpers.js'

function LoginForm() {
  const { login, demo } = useAuth()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = login(user.trim(), pass)
    if (!res.ok) setError(res.error)
  }

  return (
    <main className="relative z-[1] mx-auto flex min-h-[80vh] max-w-[420px] flex-col justify-center px-6">
      <div className="glass rounded-card p-9 shadow-soft">
        <h1 className="mb-1 font-serif text-[1.8rem] text-ink">Admin Login</h1>
        <p className="mb-6 text-[0.85rem] text-ink-secondary">Masuk untuk mengelola konten.</p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username"
            className="rounded-sm2 border border-black/10 bg-white/80 px-4 py-3 text-[0.9rem] outline-none focus:border-accent-blue"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="rounded-sm2 border border-black/10 bg-white/80 px-4 py-3 text-[0.9rem] outline-none focus:border-accent-blue"
          />
          {error && <p className="text-[0.82rem] text-accent-red">{error}</p>}
          <button
            type="submit"
            className="mt-1 rounded-[30px] bg-ink px-6 py-3 text-[0.88rem] font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Masuk
          </button>
        </form>
        <p className="mt-5 rounded-sm2 bg-black/[0.04] p-3 text-[0.75rem] leading-relaxed text-ink-muted">
          Demo — login khusus sisi browser (bukan keamanan sungguhan). Coba
          <strong className="text-ink"> {demo.user}</strong> /
          <strong className="text-ink"> {demo.pass}</strong>.
        </p>
      </div>
    </main>
  )
}

function Dashboard() {
  const { logout } = useAuth()
  return (
    <main className="relative z-[1] mx-auto max-w-[860px] px-6 pb-24 pt-28">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] text-ink">Dashboard</h1>
          <p className="text-[0.9rem] text-ink-secondary">{articles.length} artikel dipublikasikan.</p>
        </div>
        <button
          onClick={logout}
          className="rounded-[30px] border border-black/[0.08] bg-white/70 px-5 py-2.5 text-[0.85rem] font-medium text-ink transition-all hover:bg-white"
        >
          Keluar
        </button>
      </div>

      <div className="glass overflow-hidden rounded-card shadow-card">
        <table className="w-full border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-black/[0.06] text-[0.72rem] uppercase tracking-wider text-ink-muted">
              <th className="px-5 py-3 font-medium">Judul</th>
              <th className="px-5 py-3 font-medium">Tag</th>
              <th className="px-5 py-3 font-medium">Tanggal</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.slug} className="border-b border-black/[0.04] last:border-0 hover:bg-white/50">
                <td className="px-5 py-3 text-ink">{a.title}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-[20px] px-2.5 py-1 text-[0.68rem] font-medium uppercase ${tagColorClass(a.tagColor)}`}>
                    {a.tag}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-ink-muted">{a.date}</td>
                <td className="px-5 py-3">
                  {a.isPinned ? (
                    <span className="text-accent-amber">📌 Pinned</span>
                  ) : (
                    <span className="text-accent-mint">Published</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 rounded-sm2 bg-black/[0.04] p-4 text-[0.78rem] leading-relaxed text-ink-muted">
        Catatan: ini dashboard read-only sebagai contoh. Karena GitHub Pages bersifat statis, fitur tambah/edit
        artikel butuh backend (mis. Supabase/Firebase) atau editing langsung di <code>src/data/articles.js</code>.
      </p>
    </main>
  )
}

export default function Admin() {
  const { isAuthed } = useAuth()
  return isAuthed ? <Dashboard /> : <LoginForm />
}
