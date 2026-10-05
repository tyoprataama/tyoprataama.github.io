import { useEffect, useState } from 'react'

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const [pageInput, setPageInput] = useState(
    String(currentPage),
  )

  // Sync input ketika currentPage berubah dari luar,
  // misalnya ketika filter diganti dan page kembali ke 1.
  useEffect(() => {
    setPageInput(String(currentPage))
  }, [currentPage])

  // Tidak perlu menampilkan pagination jika tidak ada data.
  if (totalItems === 0) return null

  const startItem =
    (currentPage - 1) * itemsPerPage + 1

  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems,
  )

  const goToPage = (page) => {
    const nextPage = Math.min(
      Math.max(page, 1),
      totalPages,
    )

    onPageChange(nextPage)
    setPageInput(String(nextPage))
  }

  const handleInputChange = (event) => {
    const value = event.target.value

    // Hanya izinkan angka.
    if (!/^\d*$/.test(value)) return

    setPageInput(value)
  }

  const handleInputSubmit = () => {
    // Jika input dikosongkan, kembalikan ke halaman aktif.
    if (pageInput === '') {
      setPageInput(String(currentPage))
      return
    }

    const requestedPage = Number(pageInput)

    if (!Number.isFinite(requestedPage)) {
      setPageInput(String(currentPage))
      return
    }

    goToPage(requestedPage)
  }

  const handleInputKeyDown = (event) => {
    // Enter → submit page.
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }

    // Escape → batalkan perubahan.
    if (event.key === 'Escape') {
      setPageInput(String(currentPage))
      event.currentTarget.blur()
    }
  }

  const handleInputBlur = () => {
    handleInputSubmit()
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {/* Liquid glass pagination */}
      {totalPages > 1 && (
        <div
          className="
            inline-flex
            items-center
            gap-1
            rounded-full
            border
            border-black/[0.08]
            bg-white/[0.58]
            p-1.5
            shadow-[0_10px_35px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
            backdrop-blur-2xl
            backdrop-saturate-150

            dark:border-white/[0.10]
            dark:bg-black/[0.58]
            dark:shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]
          "
        >
          {/* First page */}
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            aria-label="First page"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[0.9rem]
              text-ink-secondary
              transition-all
              duration-200
              hover:bg-black/[0.07]
              hover:text-ink
              hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
              active:scale-95
              disabled:pointer-events-none
              disabled:opacity-25

              dark:text-white/70
              dark:hover:bg-white/[0.12]
              dark:hover:text-white
              dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
            "
          >
            «
          </button>

          {/* Previous page */}
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[1rem]
              text-ink-secondary
              transition-all
              duration-200
              hover:bg-black/[0.07]
              hover:text-ink
              hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
              active:scale-95
              disabled:pointer-events-none
              disabled:opacity-25

              dark:text-white/70
              dark:hover:bg-white/[0.12]
              dark:hover:text-white
              dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
            "
          >
            ‹
          </button>

          {/* Page input + total pages */}
          <div
            className="
              flex
              h-9
              items-center
              gap-1.5
              rounded-full
              px-1.5
            "
          >
            {/* Editable page number */}
            <div
              className="
                relative
                flex
                h-7
                min-w-[38px]
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.12]
                bg-black/[0.04]
                px-1
                shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]
                transition-all
                duration-200

                hover:border-black/[0.20]
                hover:bg-black/[0.07]

                focus-within:border-black/[0.25]
                focus-within:bg-white/[0.85]
                focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.04)]

                dark:border-white/[0.18]
                dark:bg-white/[0.10]
                dark:hover:border-white/[0.28]
                dark:hover:bg-white/[0.14]
                dark:focus-within:border-white/[0.35]
                dark:focus-within:bg-white/[0.16]
                dark:focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.07),inset_0_1px_2px_rgba(0,0,0,0.25)]
              "
            >
              <input
                type="text"
                inputMode="numeric"
                value={pageInput}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                aria-label="Page number"
                title="Go to page"
                className="
                  h-full
                  w-full
                  min-w-0
                  cursor-text
                  bg-transparent
                  text-center
                  text-[0.78rem]
                  font-semibold
                  tabular-nums
                  text-ink
                  outline-none
                  placeholder:text-ink-muted

                  dark:text-white
                "
              />
            </div>

            <span
              className="
                select-none
                text-[0.72rem]
                text-ink-muted
              "
            >
              of
            </span>

            <span
              className="
                min-w-[20px]
                select-none
                text-center
                text-[0.78rem]
                font-medium
                tabular-nums
                text-ink-secondary

                dark:text-white/80
              "
            >
              {totalPages}
            </span>
          </div>

          {/* Next page */}
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[1rem]
              text-ink-secondary
              transition-all
              duration-200
              hover:bg-black/[0.07]
              hover:text-ink
              hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
              active:scale-95
              disabled:pointer-events-none
              disabled:opacity-25

              dark:text-white/70
              dark:hover:bg-white/[0.12]
              dark:hover:text-white
              dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
            "
          >
            ›
          </button>

          {/* Last page */}
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[0.9rem]
              text-ink-secondary
              transition-all
              duration-200
              hover:bg-black/[0.07]
              hover:text-ink
              hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
              active:scale-95
              disabled:pointer-events-none
              disabled:opacity-25

              dark:text-white/70
              dark:hover:bg-white/[0.12]
              dark:hover:text-white
              dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
            "
          >
            »
          </button>
        </div>
      )}

      {/* Result count */}
      <div
        className="
          text-[0.72rem]
          tracking-wide
          text-ink-muted
        "
      >
        Showing {startItem}–{endItem} from {totalItems}
      </div>
    </div>
  )
}
