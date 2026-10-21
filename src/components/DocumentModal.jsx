import { useEffect } from 'react'

function googleDrivePreview(url) {
  if (!/drive\.google\.com|docs\.google\.com/i.test(url || '')) return null
  const fileMatch = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/)
  if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
  return url.replace(/\/edit(?:\?.*)?$/, '/preview')
}

function isImage(url, title = '') {
  const imageExtension = /\.(png|jpe?g|webp|gif)(?:[?#].*)?$/i
  return imageExtension.test(url || '') || imageExtension.test(title || '')
}

export default function DocumentModal({ item, kind = 'document', onClose, language = 'id' }) {
  useEffect(() => {
    if (!item) return undefined
    const onKeyDown = event => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previous }
  }, [item, onClose])

  if (!item) return null
  const docs = Array.isArray(item.documents) ? item.documents.filter(doc => doc?.url) : []
  if (!docs.length) return null
  const heading = kind === 'certificate' ? (language === 'en' ? 'Certificates' : 'Sertifikat') : (language === 'en' ? 'Project documents' : 'Dokumen proyek')

  return <div className="document-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="document-modal" role="dialog" aria-modal="true" aria-label={heading}>
      <header className="document-modal-header"><div><p className="document-modal-eyebrow">{heading}</p><h2>{(language === 'en' ? (item.documentTitleEn || item.documentTitle || item.title || item.role || item.company) : (item.documentTitleId || item.documentTitle || item.titleId || item.roleId || item.companyId || item.title || item.role || item.company)) || heading}</h2></div><button type="button" className="document-modal-close" onClick={onClose} aria-label={language === 'en' ? 'Close' : 'Tutup'}>×</button></header>
      <div className="document-modal-body">{docs.map((doc, index) => {
        const previewUrl = googleDrivePreview(doc.url)
        const image = isImage(doc.url, doc.fileName || doc.title)
        return <article className="document-preview" key={`${doc.url}-${index}`}><h3>{(language === 'en' ? (doc.titleEn || doc.title || doc.titleId) : (doc.titleId || doc.title || doc.titleEn)) || `${heading} ${index + 1}`}</h3>
          {image ? <img className="document-preview-image" src={doc.url} alt={doc.title || 'Dokumen'} loading="lazy"/> : previewUrl ? <iframe className="document-preview-frame" src={previewUrl} title={doc.title || heading} loading="lazy" allow="autoplay"/> : /\.pdf(?:[?#].*)?$/i.test(doc.url) || doc.source === 'upload' ? <iframe className="document-preview-frame" src={doc.url} title={doc.title || heading} loading="lazy"/> : <div className="document-link-fallback"><p>{language === 'en' ? 'This document cannot be previewed inline.' : 'Pratinjau inline tidak tersedia untuk tautan ini.'}</p><a href={doc.url} target="_blank" rel="noreferrer">{language === 'en' ? 'Open document in a new tab' : 'Buka dokumen di tab baru'} ↗</a></div>}
          <a className="document-open-link" href={doc.url} target="_blank" rel="noreferrer">{language === 'en' ? 'Open original' : 'Buka dokumen asli'} ↗</a>
        </article>
      })}</div>
      <footer className="document-modal-footer"><button type="button" className="btn btn-line" onClick={onClose}>{language === 'en' ? 'Close' : 'Tutup'}</button></footer>
    </section>
  </div>
}
