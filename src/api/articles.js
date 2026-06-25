import { supabase } from '../lib/supabase.js'

// DB (snake_case)  ->  React (camelCase)
const fromRow = (r) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  subtitle: r.subtitle,
  date: r.date,
  readTime: r.read_time,
  tag: r.tag,
  tagColor: r.tag_color,
  isPinned: r.is_pinned,
  picture: r.picture,
  urlPicture: r.url_picture,
  body: r.body || [],
  sortOrder: r.sort_order,
})

// React (camelCase)  ->  DB (snake_case)
const toRow = (a) => ({
  slug: a.slug,
  title: a.title,
  subtitle: a.subtitle,
  date: a.date,
  read_time: a.readTime,
  tag: a.tag,
  tag_color: a.tagColor,
  is_pinned: a.isPinned,
  picture: a.picture,
  url_picture: a.urlPicture,
  body: a.body,
  sort_order: a.sortOrder ?? 0,
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
  const { data, error } = await supabase
    .from('articles')
    .update(toRow(article))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return fromRow(data)
}

export async function deleteArticle(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}