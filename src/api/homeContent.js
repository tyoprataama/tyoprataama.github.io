import { supabase } from '../lib/supabase.js'

export const DEFAULT_HOME_CONTENT = {
  hero: {
    eyebrow: 'Available for work',
    titleText: 'Turning economics, data and field safety into real impact.',
    titleLine1: 'Turning economics, data',
    titleLine2: 'and field',
    emphasis1: 'safety',
    titleLine3: 'into real',
    emphasis2: 'impact.',
    subtitle: 'Fresh graduate blending economics, data analysis, software, and real operational experience. Certified in Occupational Health & Safety (AK3 Umum), building toward Indonesia’s mining & resource industry.',
    basedIn: 'Kediri, East Java, ID',
    focus: 'Mining & Resource Industry',
    workButton: 'Selected work',
    blogButton: 'Read my writing',
  },
  about: {
    profile: 'An economics graduate from IAIN Kediri, certified in Occupational Health & Safety (AK3 Umum), currently managing family owned agricultural operations in East Java.',
    details: 'My background spans financial analysis, real field operations, data, and software engineering. I want to move into Indonesia’s mining and resource industry, bringing an analytical mindset, operational discipline, and K3 certification to contribute from day one.',
  },
  facts: [
    { k: 'Education', v: '3.56', s: ' / 4.00 GPA' },
    { k: 'Certification', v: 'AK3 Umum', s: ' BNSP & Kemnaker' },
    { k: 'Discipline', v: 'Data', s: ' & Operations' },
    { k: 'Focus', v: 'Mining', s: ' & Resource' },
  ],
  contact: {
    eyebrow: 'Let’s work together',
    titleLead: 'Say',
    titleEmphasis: 'hello.',
    email: 'tyopriyantoputra@gmail.com',
    profileImage: 'assets/profile.JPG',
  },
}

export async function fetchHomeContent() {
  const { data, error } = await supabase.from('home_content').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  return {
    hero: { ...DEFAULT_HOME_CONTENT.hero, ...(data?.hero || {}), titleText: data?.hero?.titleText || [data?.hero?.titleLine1 ?? DEFAULT_HOME_CONTENT.hero.titleLine1, data?.hero?.titleLine2 ?? DEFAULT_HOME_CONTENT.hero.titleLine2, data?.hero?.emphasis1 ?? DEFAULT_HOME_CONTENT.hero.emphasis1, data?.hero?.titleLine3 ?? DEFAULT_HOME_CONTENT.hero.titleLine3, data?.hero?.emphasis2 ?? DEFAULT_HOME_CONTENT.hero.emphasis2].filter(Boolean).join(' ') },
    about: { ...DEFAULT_HOME_CONTENT.about, ...(data?.about || {}) },
    facts: Array.isArray(data?.facts) && data.facts.length ? data.facts : DEFAULT_HOME_CONTENT.facts,
    contact: { ...DEFAULT_HOME_CONTENT.contact, ...(data?.contact || {}) },
  }
}

export async function saveHomeContent(content) {
  const { error } = await supabase.from('home_content').upsert({
    id: 1,
    hero: content.hero,
    about: content.about,
    facts: content.facts,
    contact: content.contact,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' })
  if (error) throw error
}

const projectFromRow = (r) => ({
  id: r.id, title: r.title, category: r.category, description: r.description,
  imageUrl: r.image_url, projectUrl: r.project_url, githubUrl: r.github_url,
  stack: r.stack || [], sortOrder: r.sort_order ?? 0, isPinned: r.is_pinned ?? false, isVisible: r.is_visible ?? true,
})
const projectToRow = (p, index = 0) => ({
  title: p.title || '', category: p.category || '', description: p.description || '',
  image_url: p.imageUrl || '', project_url: p.projectUrl || '', github_url: p.githubUrl || '',
  stack: Array.isArray(p.stack) ? p.stack : String(p.stack || '').split(',').map(s => s.trim()).filter(Boolean),
  sort_order: Number(p.sortOrder ?? index), is_pinned: p.isPinned === true, is_visible: p.isVisible !== false,
})
export async function fetchProjects({ includeHidden = true } = {}) {
  let query = supabase.from('home_projects').select('*').order('is_pinned', { ascending: false }).order('sort_order', { ascending: true })
  if (!includeHidden) query = query.eq('is_visible', true)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map(projectFromRow)
}
export async function saveProject(project) {
  const payload = projectToRow(project)
  const query = project.id
    ? supabase.from('home_projects').update(payload).eq('id', project.id)
    : supabase.from('home_projects').insert(payload)
  const { error } = await query
  if (error) throw error
}
export async function deleteProject(id) {
  const { error } = await supabase.from('home_projects').delete().eq('id', id)
  if (error) throw error
}

const experienceFromRow = (r) => ({
  id: r.id, company: r.company, role: r.role, period: r.period, description: r.description,
  achievements: r.achievements || [], sortOrder: r.sort_order ?? 0, isPinned: r.is_pinned ?? false, isVisible: r.is_visible ?? true,
})
const experienceToRow = (e, index = 0) => ({
  company: e.company || '', role: e.role || '', period: e.period || '', description: e.description || '',
  achievements: Array.isArray(e.achievements) ? e.achievements : [],
  sort_order: Number(e.sortOrder ?? index), is_pinned: e.isPinned === true, is_visible: e.isVisible !== false,
})
export async function fetchExperiences({ includeHidden = true } = {}) {
  let query = supabase.from('home_experiences').select('*').order('is_pinned', { ascending: false }).order('sort_order', { ascending: true })
  if (!includeHidden) query = query.eq('is_visible', true)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map(experienceFromRow)
}
export async function saveExperience(experience) {
  const payload = experienceToRow(experience)
  const query = experience.id
    ? supabase.from('home_experiences').update(payload).eq('id', experience.id)
    : supabase.from('home_experiences').insert(payload)
  const { error } = await query
  if (error) throw error
}
export async function deleteExperience(id) {
  const { error } = await supabase.from('home_experiences').delete().eq('id', id)
  if (error) throw error
}
