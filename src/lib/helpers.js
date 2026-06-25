// ── Tampilan tag ────────────────────────────────────
// Map sebuah key warna ke kelas Tailwind komponen.
export function tagColorClass(color) {
  const map = {
    blue: 'tag-blue',
    coral: 'tag-coral',
    mint: 'tag-mint',
    amber: 'tag-amber',
  }
  return map[color] || 'tag-blue'
}

// ── Excerpt ───────────────────────────────────────
// Ambil paragraf pertama, dipangkas jadi cuplikan singkat.
export function getExcerpt(body, max = 120) {
  const first = (body || []).find((b) => b.type === 'paragraph')
  if (!first) return ''
  return first.text.length > max ? first.text.slice(0, max) + '...' : first.text
}

// ── #1 Tag → warna tetap per kategori ────────────────
export const TAG_COLORS = {
  Career: 'blue',
  Finance: 'coral',
  Farm: 'mint',
  Personal: 'amber',
}
export const TAGS = Object.keys(TAG_COLORS) // ['Career','Finance','Farm','Personal']

// Warna selalu mengikuti tag (case-insensitive + beberapa alias Indonesia).
export function colorForTag(tag) {
  const key = String(tag || '').trim().toLowerCase()
  const map = {
    career: 'blue', karir: 'blue',
    finance: 'coral', keuangan: 'coral',
    farm: 'mint', tani: 'mint', pertanian: 'mint',
    personal: 'amber', pribadi: 'amber',
  }
  return map[key] || 'blue'
}

// ── #3 Read time ──────────────────────────────
export function parseReadMinutes(value) {
  const m = String(value ?? '').match(/\d+/) // "3 menit" / "3" -> "3"
  return m ? parseInt(m[0], 10) : ''
}
export function formatReadTime(minutes) {
  const n = parseInt(minutes, 10)
  return Number.isFinite(n) && n > 0 ? `${n} menit` : '' // 3 -> "3 menit"
}

// ── Tanggal + waktu upload (mis. "18 April 2026 · 19:00 WIB") ──
export function dateTimeLabel(a) {
  if (!a) return ''
  return a.time ? `${a.date} · ${a.time}` : a.date
}

// ── Tanggal pendek utk footer (mis. "25 Jun 2026", zona Asia/Jakarta) ──
const ID_SHORT = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
export function formatShortDate(input) {
  const d = input instanceof Date ? input : new Date(input)
  if (isNaN(d.getTime())) return ''
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const day = parseInt(get('day'), 10)
  const mon = ID_SHORT[parseInt(get('month'), 10) - 1]
  return `${day} ${mon} ${get('year')}`
}

// ── #2 Sumber gambar ───────────────────────────
// Ubah link berbagi (mis. Google Drive) jadi URL yang bisa dipakai <img>.
// data URL (hasil upload base64) & path lokal dibiarkan apa adanya.
export function resolveImageSrc(src) {
  const s = String(src || '').trim()
  if (!s) return ''
  if (s.startsWith('data:') || s.startsWith('blob:') || s.startsWith('/')) return s
  const host = "https://drive.google.com/thumbnail"
  const drive =
    s.match(/drive\.google\.com\/file\/d\/([^/]+)/) ||
    s.match(/[?&]id=([^&]+)/)
  if (drive) return host + '?' + 'id=' + drive[1] + '&sz=w1600'
  return s
}

// ── Urutan ────────────────────────────────────
// Pinned dulu, sisanya pertahankan urutan asli.
export function sortPinnedFirst(list) {
  return [
    ...list.filter((a) => a.isPinned === true),
    ...list.filter((a) => a.isPinned !== true),
  ]
}

// #5 Pinned dulu, lalu tanggal terbaru di atas.
const ID_MONTHS = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
}
export function parseIndoDate(s) {
  const m = String(s || '').trim().toLowerCase().match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/)
  if (!m) return 0
  const mon = ID_MONTHS[m[2]]
  if (mon === undefined) return 0
  return new Date(parseInt(m[3], 10), mon, parseInt(m[1], 10)).getTime()
}
export function sortPinnedThenDate(list) {
  const byDateDesc = (a, b) => parseIndoDate(b.date) - parseIndoDate(a.date)
  return [
    ...list.filter((a) => a.isPinned).sort(byDateDesc),
    ...list.filter((a) => !a.isPinned).sort(byDateDesc),
  ]
}
