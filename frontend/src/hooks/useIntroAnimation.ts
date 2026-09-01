import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'

interface IntroAnimationOptions {
  scope: RefObject<HTMLDivElement | null>
  enabled: boolean
  onComplete: () => void
}

export function useIntroAnimation({ scope, enabled, onComplete }: IntroAnimationOptions) {
  useLayoutEffect(() => {
    const scopeElement = scope.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!enabled || reduceMotion || !scopeElement) {
      onComplete()
      return
    }

    let timeline: gsap.core.Timeline | null = null
    const context = gsap.context(() => {
      const thread = scopeElement.querySelector<SVGPathElement>('[data-intro-thread]')
      const threadLength = thread?.getTotalLength() ?? 360

      gsap.set('.intro-logo', { autoAlpha: 0, y: 7, filter: 'blur(10px)' })
      gsap.set('.intro-logo__mark', { opacity: .92 })
      gsap.set(thread, { strokeDasharray: threadLength, strokeDashoffset: threadLength })
      gsap.set('.intro-curtain', { xPercent: 0, force3D: true })
      gsap.set('.intro-curtain__edge', { opacity: 0 })

      timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          timeline?.kill()
          onComplete()
        },
      })

      timeline
        .to({}, { duration: .3 })
        .to('.intro-logo', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .7, ease: 'power2.out' })
        .to(thread, { strokeDashoffset: 0, duration: .55, ease: 'power2.inOut' }, '-=.15')
        .to('.intro-logo__mark', { opacity: 1, duration: .12, ease: 'power1.out' })
        .to({}, { duration: .08 })
        .addLabel('curtain')
        .to('.intro-logo', { autoAlpha: 0, y: -3, duration: .18, ease: 'power2.in' }, 'curtain')
        .to('.intro-curtain__edge', { opacity: 1, duration: .16, ease: 'power1.out' }, 'curtain')
        .to('.intro-curtain--left', { xPercent: -101, duration: 1.35, ease: 'power4.inOut' }, 'curtain')
        .to('.intro-curtain--right', { xPercent: 101, duration: 1.35, ease: 'power4.inOut' }, 'curtain')
    }, scopeElement)

    return () => {
      timeline?.kill()
      context.revert()
    }
  }, [enabled, onComplete, scope])
}
