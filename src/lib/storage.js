import { supabase } from './supabase.js'

export const BUCKET = 'article-images'
// Penanda URL publik bucket kita: "/storage/v1/object/public/article-images/"
const PUBLIC_MARKER = '/storage/v1/object/public/' + BUCKET + '/'

// Upload file ke bucket, kembalikan URL publik.
export async function uploadImage(file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// Apakah URL ini benar-benar file di bucket kita? (bukan link gdrive/base64)
export function isBucketUrl(url) {
  return typeof url === 'string' && url.includes(PUBLIC_MARKER)
}

// Ambil path objek dari URL publik bucket.
export function storagePathFromUrl(url) {
  if (!isBucketUrl(url)) return null
  const after = url.split(PUBLIC_MARKER)[1] || ''
  return decodeURIComponent(after.split('?')[0]) // buang query string bila ada
}

// Kumpulkan semua URL gambar (hero + blok) dari sebuah artikel (bentuk React).
export function collectImageUrls(article) {
  if (!article) return []
  const urls = []
  if (article.urlPicture) urls.push(article.urlPicture)
  for (const b of article.body || []) {
    if (b?.type === 'image' && b.url) urls.push(b.url)
  }
  return urls
}

// Hapus daftar URL dari bucket (hanya yang memang file bucket kita).
export async function deleteStorageUrls(urls) {
  const paths = (urls || []).map(storagePathFromUrl).filter(Boolean)
  if (paths.length === 0) return
  const { error } = await supabase.storage.from(BUCKET).remove(paths)
  if (error) console.error('Gagal hapus file storage:', error.message)
}
