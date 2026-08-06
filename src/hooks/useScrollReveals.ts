import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useScrollReveals(container: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = container.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach(item => item.classList.add('is-revealed')); return }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target) } }), { threshold: .12, rootMargin: '0px 0px -8% 0px' })
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [container])
}
