import { useRef, useState } from 'react'
import { uploadDocument } from '../lib/storage.js'

const fieldClass = 'w-full rounded-sm2 border border-line bg-surface px-3 py-2 text-[0.88rem] text-ink outline-none focus:border-accent'

export default function DocumentManagerInput({ value = [], onChange, label = 'Dokumen pendukung', language = 'id' }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const documents = Array.isArray(value) ? value : []

  const addLink = () => {
    const cleanTitle = title.trim()
    const cleanUrl = url.trim()
    if (!cleanTitle || !cleanUrl) { setError((language === 'en' ? 'Enter a document title and link first.' : 'Isi judul dan tautan dokumen terlebih dahulu.')); return }
    if (!/^https?:\/\//i.test(cleanUrl)) { setError((language === 'en' ? 'The link must start with http:// or https://.' : 'Tautan harus diawali http:// atau https://.')); return }
    onChange([...documents, { title: cleanTitle, titleId: language === 'id' ? cleanTitle : '', titleEn: language === 'en' ? cleanTitle : '', url: cleanUrl, source: /drive\.google\.com|docs\.google\.com/i.test(cleanUrl) ? 'gdrive' : 'link' }])
    setTitle(''); setUrl(''); setError('')
  }

  const onFile = async event => {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setError((language === 'en' ? 'Supported formats: PDF, JPG, PNG, or WEBP.' : 'Format yang didukung: PDF, JPG, PNG, atau WEBP.')); event.target.value = ''; return }
    if (file.size > 20 * 1024 * 1024) { setError((language === 'en' ? 'Maximum file size is 20 MB.' : 'Ukuran file maksimal 20 MB.')); event.target.value = ''; return }
    setBusy(true)
    try {
      const fileUrl = await uploadDocument(file)
      onChange([...documents, { title: file.name.replace(/\.[^.]+$/, ''), titleId: language === 'id' ? file.name.replace(/\.[^.]+$/, '') : '', titleEn: language === 'en' ? file.name.replace(/\.[^.]+$/, '') : '', url: fileUrl, source: 'upload', fileName: file.name }])
    } catch (err) { setError(`${language === 'en' ? 'Upload failed' : 'Upload gagal'}: ${err?.message || err}. ${language === 'en' ? 'Make sure the Storage migration has been applied.' : 'Pastikan migrasi Storage sudah diterapkan.'}`) }
    finally { setBusy(false); event.target.value = '' }
  }

  return <section className="sm:col-span-2 rounded-sm2 border border-line bg-panel p-4">
    <div className="mb-1 text-[0.78rem] font-medium uppercase tracking-wider text-ink-muted">{label}</div>
    <p className="mb-3 text-xs text-ink-secondary">{language === 'en' ? 'Optional. Leave empty if this item has no documents; the button will be hidden on the portfolio page.' : 'Opsional. Kosongkan jika item ini tidak memiliki dokumen; tombol di halaman portfolio tidak akan ditampilkan.'}</p>
    {documents.length > 0 && <div className="mb-4 flex flex-col gap-2">{documents.map((doc, index) => <div key={`${doc.url}-${index}`} className="flex items-center gap-3 rounded-sm2 border border-line p-3">
      <span className="text-ink-muted">{doc.source === 'upload' ? '▤' : '↗'}</span>
      <div className="min-w-0 flex-1"><input className={fieldClass} value={language === 'en' ? (doc.titleEn || '') : (doc.titleId || doc.title || '')} onChange={e => onChange(documents.map((item, i) => i === index ? { ...item, [language === 'en' ? 'titleEn' : 'titleId']: e.target.value, title: item.title || e.target.value } : item))} placeholder={language === 'en' ? 'Document title (English)' : 'Judul dokumen (Indonesia)'} /><p className="mt-1 truncate text-xs text-ink-muted">{doc.source === 'upload' ? (doc.fileName || 'File upload') : (language === 'en' ? 'External link' : 'Tautan eksternal')}</p></div>
      <button type="button" className="text-xs text-red-600" onClick={() => onChange(documents.filter((_, i) => i !== index))}>{language === 'en' ? 'Remove' : 'Hapus'}</button>
    </div>)}</div>}
    <div className="mb-4"><button type="button" disabled={busy} className="rounded-[30px] border border-line px-4 py-2 text-[0.82rem] font-medium text-ink disabled:opacity-50" onClick={() => fileRef.current?.click()}>{busy ? (language === 'en' ? 'Uploading…' : 'Mengupload…') : (language === 'en' ? '↑ Upload file (PDF / image)' : '↑ Upload file (PDF / gambar)')}</button><span className="ml-2 text-xs text-ink-muted">{language === 'en' ? 'Max. 20 MB per file' : 'Maks. 20 MB per file'}</span><input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={onFile}/></div>
    <div className="grid gap-2 sm:grid-cols-2"><input className={fieldClass} value={title} onChange={e => setTitle(e.target.value)} placeholder={language === 'en' ? 'Document title (English)' : 'Judul dokumen (Indonesia)'}/><input className={fieldClass} value={url} onChange={e => setUrl(e.target.value)} placeholder={language === 'en' ? 'Google Drive link / document URL' : 'Tautan Google Drive / URL dokumen'}/></div>
    <button type="button" className="mt-2 rounded-[30px] border border-line px-4 py-2 text-[0.82rem] font-medium text-ink hover:border-accent" onClick={addLink}>{language === 'en' ? '+ Add link' : '+ Tambahkan tautan'}</button>
    {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
  </section>
}
