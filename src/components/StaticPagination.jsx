export default function StaticPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const buttonBase = 'flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[0.8rem] transition-all duration-200 disabled:pointer-events-none disabled:opacity-25'
  return (
    <nav aria-label="Pagination" className="mt-10 flex justify-center">
      <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-black/[0.08] bg-white/[0.58] p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.10] dark:bg-black/[0.58] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <button type="button" className={`${buttonBase} text-ink-secondary hover:bg-black/[0.07] dark:text-white/70 dark:hover:bg-white/[0.12]`} onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="First page">«</button>
        <button type="button" className={`${buttonBase} text-ink-secondary hover:bg-black/[0.07] dark:text-white/70 dark:hover:bg-white/[0.12]`} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">‹</button>
        {pages.map(page => <button key={page} type="button" aria-current={page === currentPage ? 'page' : undefined} onClick={() => onPageChange(page)} className={`${buttonBase} ${page === currentPage ? 'bg-ink text-paper shadow-sm' : 'text-ink-secondary hover:bg-black/[0.07] hover:text-ink dark:text-white/70 dark:hover:bg-white/[0.12] dark:hover:text-white'}`}>{page}</button>)}
        <button type="button" className={`${buttonBase} text-ink-secondary hover:bg-black/[0.07] dark:text-white/70 dark:hover:bg-white/[0.12]`} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">›</button>
        <button type="button" className={`${buttonBase} text-ink-secondary hover:bg-black/[0.07] dark:text-white/70 dark:hover:bg-white/[0.12]`} onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Last page">»</button>
      </div>
    </nav>
  )
}
