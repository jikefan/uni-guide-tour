type Listener = (page: string) => void
const listeners = new Set<Listener>()
export function emitPageEnter(page: string) { listeners.forEach(l => l(page)) }
export function onPageEnter(l: Listener): () => void {
  listeners.add(l); return () => listeners.delete(l)
}
export function getCurrentPagePath(): string {
  const pages = (typeof getCurrentPages !== 'undefined') ? getCurrentPages() : []
  if (!pages.length) return ''
  const route = (pages[pages.length - 1] as any).route ?? ''
  return route ? `/${route}` : ''
}
