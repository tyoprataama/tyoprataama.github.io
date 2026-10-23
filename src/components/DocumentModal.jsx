
import { useCallback, useEffect, useState } from 'react'

function googleDrivePreview(url) {
  if (!/drive\.google\.com|docs\.google\.com/i.test(url || '')) {
    return null
  }

  const fileMatch =
    url.match(/\/file\/d\/([^/]+)/) ||
    url.match(/[?&]id=([^&]+)/)

  if (fileMatch) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
  }

  return url.replace(/\/edit(?:\?.*)?$/, '/preview')
}

function googleDriveDownload(url) {
  if (!/drive\.google\.com|docs\.google\.com/i.test(url || '')) {
    return url
  }

  const fileMatch =
    url.match(/\/file\/d\/([^/]+)/) ||
    url.match(/[?&]id=([^&]+)/)

  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`
  }

  return url
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
      <span
        className="document-loading-spinner"
        aria-hidden="true"
      />

      <p>
        {language === 'en'
          ? 'Loading document...'
          : 'Memuat dokumen...'}
      </p>
    </div>
  )
}

function DocumentPreview({ doc, heading, language }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const previewUrl = googleDrivePreview(doc.url)
  const image = isImage(doc.url, doc.fileName || doc.title)
  const isPdf =
    /\.pdf(?:[?#].*)?$/i.test(doc.url) ||
    doc.source === 'upload'

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

          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
          >
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

              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
              >
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

export default function DocumentModal({
  item,
  kind = 'document',
  onClose,
  language = 'id',
}) {
  const handleClose = useCallback(
    (event) => {
      event?.preventDefault()
      event?.stopPropagation()
      onClose?.()
    },
    [onClose]
  )

  useEffect(() => {
    if (!item) return undefined

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [item, handleClose])

  if (!item) return null

  const docs = Array.isArray(item.documents)
    ? item.documents.filter((doc) => doc?.url)
    : []

  if (!docs.length) return null

  const originalDocumentUrl = docs[0].url

  const heading =
    kind === 'certificate'
      ? language === 'en'
        ? 'Certificates'
        : 'Sertifikat'
      : kind === 'resume'
        ? language === 'en'
          ? 'Resume'
          : 'Daftar riwayat hidup'
        : language === 'en'
          ? 'Project documents'
          : 'Dokumen proyek'

  const title =
    kind === 'resume'
      ? 'Tyo Pratama Priyanto Putra'
      : (
          language === 'en'
            ? (
                item.documentTitleEn ||
                item.documentTitle ||
                item.title ||
                item.role ||
                item.company
              )
            : (
                item.documentTitleId ||
                item.documentTitle ||
                item.titleId ||
                item.roleId ||
                item.companyId ||
                item.title ||
                item.role ||
                item.company
              )
        ) || heading

  return (
    <div
      className="document-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose(event)
        }
      }}
    >
      <section
        className="document-modal"
        role="dialog"
        aria-modal="true"
        aria-label={heading}
      >
        <header className="document-modal-header">
          <div>
            <p className="document-modal-eyebrow">
              {heading}
            </p>

            <h2>{title}</h2>
          </div>

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
              language={language}
            />
          ))}
        </div>

        <footer className="document-modal-footer">
          {kind === 'resume' && (
            <a
              className="document-open-link"
              href={googleDriveDownload(originalDocumentUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="btn btn-line">
                {language === 'en' ? 'Download' : 'Unduh'}
              </span>
            </a>
          )}

          <div className="document-modal-footer-close">
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
  )
}
