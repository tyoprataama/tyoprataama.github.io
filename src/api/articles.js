import { supabase } from '../lib/supabase.js'
import { collectImageUrls, deleteStorageUrls } from '../lib/storage.js'

// DB (snake_case)  ->  React (camelCase)
const fromRow = (r) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  subtitle: r.subtitle,
  date: r.date,
  time: r.time,
  readTime: r.read_time,
  tag: r.tag,
  tagColor: r.tag_color,
  isPinned: r.is_pinned,
  picture: r.picture,
  urlPicture: r.url_picture,
  body: r.body || [],
  sortOrder: r.sort_order,
  updatedAt: r.updated_at,
})

// React (camelCase)  ->  DB (snake_case)
const toRow = (a) => ({
  slug: a.slug,
  title: a.title,
  subtitle: a.subtitle,
  date: a.date,
  time: a.time ?? '',
  read_time: a.readTime,
  tag: a.tag,
  tag_color: a.tagColor,
  is_pinned: a.isPinned,
  picture: a.picture,
  url_picture: a.urlPicture,
  body: a.body,
  sort_order: a.sortOrder ?? 0,
  updated_at: new Date().toISOString(), // dipakai footer "Last update"
})

export async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('sort_order', { ascending: false })
  if (error) throw error
  return data.map(fromRow)
}

export async function fetchArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? fromRow(data) : null
}

// Waktu artikel terakhir ditambah/diedit — untuk footer "Last update".
export async function fetchLastUpdated() {
  const { data, error } = await supabase
    .from('articles')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data?.updated_at ? new Date(data.updated_at) : null
}

export async function createArticle(article) {
  const { data, error } = await supabase
    .from('articles')
    .insert(toRow(article))
    .select()
    .single()
  if (error) throw error
  return fromRow(data)
}

export async function updateArticle(id, article) {
  // Ambil data lama untuk membandingkan gambar yang dibuang/diganti.
  const { data: oldRow } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('articles')
    .update(toRow(article))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  // Hapus file bucket yang sudah tidak dipakai lagi.
  if (oldRow) {
    const oldUrls = collectImageUrls(fromRow(oldRow))
    const newUrls = collectImageUrls(article)
    const removed = oldUrls.filter((u) => !newUrls.includes(u))
    await deleteStorageUrls(removed)
  }
  return fromRow(data)
}

export async function deleteArticle(id) {
  // Ambil dulu agar tahu gambar mana yang harus dibersihkan dari bucket.
  const { data: row } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error

  if (row) await deleteStorageUrls(collectImageUrls(fromRow(row)))
}
