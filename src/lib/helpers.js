// ── Tampilan tag ─────────────────────────────────────────
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

// ── Excerpt ──────────────────────────────────────────────
// Ambil paragraf pertama, dipangkas jadi cuplikan singkat.
export function getExcerpt(body, max = 120) {
  const first = (body || []).find((b) => b.type === 'paragraph')
  if (!first) return ''
  return first.text.length > max ? first.text.slice(0, max) + '...' : first.text
}

// ── #1 Tag → warna tetap per kategori ────────────────────
export const TAG_COLORS = {
  Career: 'blue',
  Finance: 'coral',
  Farm: 'mint',
  Personal: 'amber',
}
export const TAGS = Object.keys(TAG_COLORS) // ['career','finance','farm','personal']

// Warna selalu mengikuti tag (case-insensitive + beberapa alias).
export function colorForTag(tag) {
  const key = String(tag || '').trim().toLowerCase()
  const alias = {
    Career: 'blue', karir: 'blue',
    Finance: 'coral', keuangan: 'coral',
    Farm: 'mint', tani: 'mint', pertanian: 'mint',
    Personal: 'amber', pribadi: 'amber',
  }
  return alias[key] || TAG_COLORS[key] || 'blue'
}

// ── #3 Read time ─────────────────────────────────────────
export function parseReadMinutes(value) {
  const m = String(value ?? '').match(/\d+/) // "3 menit" / "3" -> "3"
  return m ? parseInt(m[0], 10) : ''
}
export function formatReadTime(minutes) {
  const n = parseInt(minutes, 10)
  return Number.isFinite(n) && n > 0 ? `${n} menit` : '' // 3 -> "3 menit"
}

// ── Urutan ───────────────────────────────────────────────
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