import { useRef, useState } from 'react'
import { resolveImageSrc } from '../lib/helpers.js'
import { uploadImage } from '../lib/storage.js'

const MAX_BYTES = 5 * 1024 * 1024 // batas 5 MB (ubah sesuai kebutuhan)

// Input gambar hibrida:
//  - Upload file dari device → disimpan di Supabase Storage (bucket), DB hanya simpan URL-nya.
//  - Tempel link gambar (mis. Google Drive) yang otomatis ter-render.
// Catatan: penghapusan file bucket ditangani di api/articles.js saat artikel disimpan/dihapus.
export default function ImageInput({ value, onChange, onUploaded, onRemove, label = 'Gambar' }) {
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErr('')
    if (!file.type.startsWith('image/')) {
      setErr('File harus berupa gambar.')
      return
    }
    if (file.size > MAX_BYTES) {
      setErr(`Ukuran ${(file.size / 1024 / 1024).toFixed(2)} MB melebihi batas 5 MB.`)
      return
    }
    setBusy(true)
    try {
      const url = await uploadImage(file)
      onChange(url) // simpan URL publik, bukan base64
      if (onUploaded) await onUploaded(url)
    } catch (e2) {
      setErr('Gagal upload: ' + (e2?.message || e2))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = async () => {
    setErr('')
    try {
      if (onRemove) await onRemove(value)
      else onChange('')
    } catch (removeError) {
      setErr('Gagal menghapus gambar: ' + (removeError?.message || removeError))
    }
  }

  const previewSrc = value && !/^(https?:|data:|blob:|\/)/i.test(value)
    ? `${import.meta.env.BASE_URL}${value}`
    : resolveImageSrc(value)

  const field =
    'rounded-sm2 border border-line bg-surface text-ink placeholder:text-ink-muted px-3 py-2 text-[0.88rem] outline-none focus:border-accent'

  return (
    <div className="rounded-sm2 border border-line bg-panel p-3">
      <div className="mb-2 text-[0.72rem] font-medium uppercase tracking-wider text-ink-muted">{label}</div>

      {value && (
        <div className="mb-2 flex items-center gap-3">
          <img src={previewSrc} alt="" className="h-16 w-16 rounded-md object-cover" />
          <button type="button" disabled={busy} onClick={removeImage} className="text-[0.78rem] text-[#e5484d] disabled:opacity-50">
            Hapus gambar
          </button>
        </div>
      )}

      <div className="grid gap-2">
        <input
          className={field}
          placeholder="Tempel link gambar (mis. Google Drive)"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-[20px] border border-line px-4 py-1.5 text-[0.8rem] disabled:opacity-60"
          >
            {busy ? 'Mengupload…' : '⬆ Upload ke Storage'}
          </button>
          <span className="text-[0.72rem] text-ink-muted">maks 5 MB</span>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        </div>
        {err && <p className="text-[0.78rem] text-[#e5484d]">{err}</p>}
      </div>
    </div>
  )
}
