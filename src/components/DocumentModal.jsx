import { useEffect, useState } from 'react'

function googleDrivePreview(url) {
  if (!/drive\.google\.com|docs\.google\.com/i.test(url || '')) return null
  const fileMatch = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/)
  if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
  return url.replace(/\/edit(?:\?.*)?$/, '/preview')
}

function isImage(url, title = '') {
  const imageExtension = /\.(png|jpe?g|webp|gif)(?:[?#].*)?$/i

  return (
    imageExtension.test(url || '') ||
    imageExtension.test(title || '')
  )
}


function DocumentLoader({ language }) {
  return (
    <div
      className="document-preview-loading"
      role="status"
      aria-live="polite"
    >
      <span className="document-loading-spinner" aria-hidden="true" />

      <p>
        {language === 'en'
          ? 'Loading document...'
          : 'Memuat dokumen...'}
      </p>
    </div>
  )
}
function DocumentPreview({ doc, heading, index, language }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const previewUrl = googleDrivePreview(doc.url)
  const image = isImage(doc.url, doc.fileName || doc.title)
  const isPdf =
    /\.pdf(?:[?#].*)?$/i.test(doc.url) || doc.source === 'upload'

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  return (
    <article className="document-preview">

      {error ? (
        <div className="document-link-fallback">
          <p>
            {language === 'en'
              ? 'The document preview could not be loaded.'
              : 'Pratinjau dokumen gagal dimuat.'}
          </p>
          <a href={doc.url} target="_blank" rel="noreferrer">
            {language === 'en'
              ? 'Open document in a new tab'
              : 'Buka dokumen di tab baru'}{' '}
            ↗
          </a>
        </div>
      ) : (
        <>
          {loading && <DocumentLoader language={language} />}

          {image ? (
            <img
              className="document-preview-image"
              src={doc.url}
              alt={doc.title || heading}
              loading="eager"
              onLoad={handleLoad}
              onError={handleError}
              style={{ display: loading ? 'none' : 'block' }}
            />
          ) : previewUrl || isPdf ? (
            <iframe
              className="document-preview-frame"
              src={previewUrl || doc.url}
              title={doc.title || heading}
              loading="eager"
              allow="autoplay"
              onLoad={handleLoad}
              onError={handleError}
              style={{ display: loading ? 'none' : 'block' }}
            />
          ) : (
            <div className="document-link-fallback">
              <p>
                {language === 'en'
                  ? 'This document cannot be previewed inline.'
                  : 'Pratinjau inline tidak tersedia untuk tautan ini.'}
              </p>
              <a href={doc.url} target="_blank" rel="noreferrer">
                {language === 'en'
                  ? 'Open document in a new tab'
                  : 'Buka dokumen di tab baru'}{' '}
                ↗
              </a>
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default function DocumentModal({ item, kind = 'document', onClose, language = 'id' }) {
  const handleClose = (event) => {
  event?.preventDefault()
  event?.stopPropagation()
  onClose()
}
  useEffect(() => {
    if (!item) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previous }
  }, [item, onClose])

  if (!item) return null
  const docs = Array.isArray(item.documents) ? item.documents.filter(doc => doc?.url) : []
  if (!docs.length) return null
  const originalDocumentUrl = docs[0].url
  const heading = kind === 'certificate' ? (language === 'en' ? 'Certificates' : 'Sertifikat') : (language === 'en' ? 'Project documents' : 'Dokumen proyek')

  return <div className="document-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="document-modal" role="dialog" aria-modal="true" aria-label={heading}>
      <header className="document-modal-header"><div><p className="document-modal-eyebrow">{heading}</p><h2>{(language === 'en' ? (item.documentTitleEn || item.documentTitle || item.title || item.role || item.company) : (item.documentTitleId || item.documentTitle || item.titleId || item.roleId || item.companyId || item.title || item.role || item.company)) || heading}</h2></div>
      <button
  type="button"
  className="document-modal-close"
  onClick={handleClose}
  aria-label={language === 'en' ? 'Close' : 'Tutup'}
>
  <span aria-hidden="true">×</span>
</button>
      </header>
      <div className="document-modal-body">
        {docs.map((doc, index) => (
          <DocumentPreview
            key={`${doc.url}-${index}`}
            doc={doc}
            heading={heading}
            index={index}
            language={language}
          />
))}
      </div>
      

<footer className="document-modal-footer">
  <div className="document-modal-footer-actions">
    <a
      className="document-open-link"
      href={originalDocumentUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {language === 'en'
        ? 'Open original document ↗'
        : 'Buka dokumen asli ↗'}
    </a>

    <button
      type="button"
      className="btn btn-line"
      onClick={handleClose}
    >
      {language === 'en' ? 'Close' : 'Tutup'}
    </button>
  </div>
</footer>


    </section>
  </div>
}
