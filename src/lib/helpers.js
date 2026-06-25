// Map a tagColor key to its Tailwind component class.
export function tagColorClass(color) {
  const map = {
    blue: 'tag-blue',
    coral: 'tag-coral',
    mint: 'tag-mint',
    amber: 'tag-amber',
  }
  return map[color] || 'tag-blue'
}

// First paragraph, trimmed to a short excerpt.
export function getExcerpt(body, max = 120) {
  const first = body.find((b) => b.type === 'paragraph')
  if (!first) return ''
  return first.text.length > max ? first.text.slice(0, max) + '...' : first.text
}

// Pinned items first, preserving original order otherwise.
export function sortPinnedFirst(list) {
  return [
    ...list.filter((a) => a.isPinned === true),
    ...list.filter((a) => a.isPinned !== true),
  ]
}
