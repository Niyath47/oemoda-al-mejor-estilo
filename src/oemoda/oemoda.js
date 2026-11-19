import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTouch = window.matchMedia('(hover: none)').matches

if (reduced) document.documentElement.classList.add('reduced')

document.getElementById('year').textContent = new Date().getFullYear()

/* ---------- smooth scroll ---------- */

let lenis = null

if (!reduced) {
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

/* ---------- header, progress, anchors ---------- */

const header = document.getElementById('header')
const progressBar = document.getElementById('progressBar')

function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop
  header.classList.toggle('is-scrolled', y > 40)
  const max = document.documentElement.scrollHeight - window.innerHeight
  progressBar.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`
}

window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

const menuToggle = document.getElementById('menuToggle')

function closeMenu() {
  document.body.classList.remove('menu-open')
  menuToggle.setAttribute('aria-expanded', 'false')
  menuToggle.setAttribute('aria-label', 'Abrir menú')
}

menuToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open')
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú')
})

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const selector = link.getAttribute('href')
    if (!selector || selector === '#') return
    const target = document.querySelector(selector)
    if (!target) return
    event.preventDefault()
    closeMenu()
    if (lenis) lenis.scrollTo(target, { offset: -76 })
    else target.scrollIntoView({ behavior: 'smooth' })
  })
})

/* ---------- hero entrance ---------- */

if (!reduced) {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

  intro
    .fromTo(
      '.hero-title .line > span',
      { yPercent: 110, y: 0 },
      { yPercent: 0, y: 0, duration: 1.15, stagger: 0.11 },
      0.1
    )
    .from('.hero-frame', { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'power4.inOut' }, 0)
    .from('.hero-inset', { y: 70, opacity: 0, duration: 1 }, 0.65)
    .from('.hero-stamp', { scale: 0.5, opacity: 0, rotate: -40, duration: 0.9 }, 0.95)
    .to('.hero-lead', { opacity: 1, y: 0, duration: 0.9 }, 0.7)
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.9 }, 0.85)
    .to('.hero-note', { opacity: 1, y: 0, duration: 0.9 }, 1)

  gsap.to('.hero-frame img', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  })
  gsap.to('.hero-inset img', {
    yPercent: -14,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  })
}

/* ---------- statement words ---------- */

const statement = document.getElementById('introStatement')
const words = statement.textContent.trim().split(/\s+/)
statement.innerHTML = words
  .map((word) => `<span class="word"><span>${word}</span></span>`)
  .join(' ')

if (!reduced) {
  gsap.to(statement.querySelectorAll('.word > span'), {
    opacity: 1,
    y: 0,
    stagger: 0.04,
    ease: 'none',
    scrollTrigger: {
      trigger: statement,
      start: 'top 80%',
      end: 'top 32%',
      scrub: 1,
    },
  })
}

/* ---------- general reveals ---------- */

if (!reduced) {
  const groups = [
    '.collections-head > div',
    '.collections-hint',
    '.styles .section-label',
    '.styles h2',
    '.style-list',
    '.styles-note',
    '.visit-visual',
    '.visit-copy h2',
    '.visit-lead',
    '.info-list',
    '.visit-actions',
    '.social-head > div',
    '.social-head > .text-link',
    '.social-grid',
    '.footer-invite',
    '.footer-details',
    '.footer-nav',
  ]

  groups.forEach((selector) => {
    const elements = gsap.utils.toArray(selector)
    if (!elements.length) return
    gsap.from(elements, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: elements[0], start: 'top 88%' },
    })
  })

  gsap.from('.collection-card', {
    opacity: 0,
    y: 50,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#collectionsPin', start: 'top 80%' },
  })
}

/* ---------- collections: pinned horizontal pan ---------- */

if (!reduced) {
  ScrollTrigger.matchMedia({
    '(min-width: 761px)': () => {
      const track = document.getElementById('cardsTrack')
      const wrap = document.getElementById('collectionsPin')
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => tween.kill()
    },
  })
}

/* ---------- signature move: cursor-following style preview ---------- */

const styleItems = document.querySelectorAll('#styleList li')

if (!reduced && !isTouch) {
  const preview = document.getElementById('stylePreview')
  const previewImg = document.getElementById('stylePreviewImg')
  const stylesSection = document.querySelector('.styles')
  const styleList = document.getElementById('styleList')

  gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.92 })

  const xTo = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3.out' })
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3.out' })
  let positioned = false

  stylesSection.addEventListener('mousemove', (event) => {
    const bounds = stylesSection.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    if (!positioned) {
      gsap.set(preview, { x, y })
      positioned = true
    }
    xTo(x)
    yTo(y)
  })

  const showPreview = (item) => {
    previewImg.src = item.dataset.image
    styleItems.forEach((li) => li.classList.remove('is-active'))
    item.classList.add('is-active')
    gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
  }

  const hidePreview = () => {
    gsap.to(preview, { opacity: 0, scale: 0.92, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
    styleItems.forEach((li) => li.classList.remove('is-active'))
  }

  styleItems.forEach((item) => item.addEventListener('mouseenter', () => showPreview(item)))
  styleList.addEventListener('mouseleave', hidePreview)
}

/* ---------- lookbook: the peak ---------- */

const stages = gsap.utils.toArray('.look-stage')
const dots = gsap.utils.toArray('#lookbookDots span')
const titleEl = document.getElementById('lookbookTitle')
const captionEl = document.getElementById('lookbookCaption')

const lookTitles = [
  'El abrigo<br />lo dice todo.',
  'Cuero, gafas<br />y seguridad.',
  'Un color<br />sin permiso.',
  'Luz de<br />temporada.',
]
const lookCaptions = [
  'Capas que se ven, actitud que se siente.',
  'Piezas que no necesitan presentación.',
  'Para los días que piden algo más.',
  'El tono que se queda con nosotros.',
]

let activeStage = -1

function setLookStage(index) {
  if (index === activeStage) return
  activeStage = index
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index))
  gsap.to([titleEl, captionEl], {
    opacity: 0,
    y: -12,
    duration: 0.18,
    overwrite: 'auto',
    onComplete: () => {
      titleEl.innerHTML = lookTitles[index]
      captionEl.textContent = lookCaptions[index]
      gsap.to([titleEl, captionEl], { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
    },
  })
}

if (!reduced) {
  ScrollTrigger.create({
    trigger: '#lookbookPin',
    start: 'top top',
    end: () => `+=${window.innerHeight * 3.4}`,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const raw = self.progress * stages.length
      const index = Math.min(stages.length - 1, Math.floor(raw))
      const local = raw - index
      const fadeStart = 0.82

      stages.forEach((stage, i) => {
        let opacity = i === index ? 1 : 0
        if (i === index && index < stages.length - 1 && local > fadeStart) {
          opacity = 1 - (local - fadeStart) / (1 - fadeStart)
        }
        if (i === index + 1 && local > fadeStart) {
          opacity = (local - fadeStart) / (1 - fadeStart)
        }
        gsap.set(stage, {
          opacity,
          scale: i === index ? 1 + local * 0.05 : 1,
        })
      })

      setLookStage(index)
    },
  })
}

/* ---------- refresh after assets settle ---------- */

window.addEventListener('load', () => ScrollTrigger.refresh())
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh())
}
