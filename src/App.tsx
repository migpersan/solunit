import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import {
  brand,
  contact,
  hero,
  lab,
  method,
  nav,
  services,
} from './data/content'
import { owner } from './data/legal'
import { pageMeta, type PageId } from './data/pages'
import LegalPage from './LegalPage'

const serviceId = (index: number) => `servicio-${index + 1}`

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActive(ids.find((id) => visible.has(id)) ?? null)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return active
}

function headingIn(target: HTMLElement) {
  if (target.matches('h1, h2, h3')) return target
  return target.querySelector<HTMLElement>('h1, h2, h3')
}

// Si el HTML llegó sin contenido, el navegador no pudo saltar al ancla de la URL.
// El foco va al título, que sí muestra anillo; la sección no.
function useHashOnLoad() {
  useEffect(() => {
    const place = (allowScroll: boolean) => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (!hash) return
      const target = document.getElementById(hash)
      if (!target) return
      const focusTarget = headingIn(target) ?? target
      const active = document.activeElement
      // Solo corregimos el foco si sigue en la región o en el documento.
      // No se lo quitamos a quien ya pasó a un control.
      if (
        active === document.body ||
        active === document.documentElement ||
        active === target
      ) {
        focusTarget.focus({ preventScroll: true })
      }
      if (allowScroll && window.scrollY === 0) {
        target.scrollIntoView({ behavior: 'instant' })
      }
    }

    const onFocusIn = (event: FocusEvent) => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      const target = hash ? document.getElementById(hash) : null
      if (target && event.target === target) place(false)
    }

    // Atrás y adelante restauran el scroll solos. El foco hay que moverlo
    // aquí: si se queda en el destino, el siguiente tecleo vuelve a bajar.
    const onNavigate = () => {
      window.setTimeout(() => {
        const hash = decodeURIComponent(window.location.hash.slice(1))
        if (!hash) {
          const hero = document.getElementById('hero-title')
          if (hero && document.activeElement !== hero) {
            hero.focus({ preventScroll: true })
          }
          return
        }

        const target = document.getElementById(hash)
        if (!target) return
        const heading = headingIn(target) ?? target
        if (document.activeElement !== heading) heading.focus({ preventScroll: true })
      }, 0)
    }

    place(true)
    document.addEventListener('focusin', onFocusIn)
    window.addEventListener('hashchange', onNavigate)
    window.addEventListener('popstate', onNavigate)
    const later = window.setTimeout(() => {
      document.removeEventListener('focusin', onFocusIn)
      place(false)
    }, 500)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('hashchange', onNavigate)
      window.removeEventListener('popstate', onNavigate)
      window.clearTimeout(later)
    }
  }, [])
}

const navIds = nav.map((item) => item.href.slice(1))

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

// El ancla apunta a la sección. El foco va al título: es lo que se oye
// y lo que queda visible bajo la cabecera. La sección entera no.
function followAnchor(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!isPlainClick(event)) return
  const target = document.getElementById(decodeURIComponent(href.slice(1)))
  if (!target) return
  event.preventDefault()
  // Si el menú móvil dejó el contenido inerte, el título no puede recibir el foco.
  const main = document.getElementById('contenido')
  if (main) main.inert = false
  document.body.style.overflow = ''
  // El historial guarda la posición de este momento. Si se desplaza antes,
  // Atrás se queda en el destino y no recupera el punto de partida.
  if (decodeURIComponent(window.location.hash) !== href) history.pushState(null, '', href)
  const heading = headingIn(target)
  ;(heading ?? target).focus({ preventScroll: true })
  target.scrollIntoView()
}

function revealInMenu(item: HTMLElement, menu: HTMLElement) {
  const pad = 6
  const itemRect = item.getBoundingClientRect()
  const menuRect = menu.getBoundingClientRect()
  if (itemRect.top < menuRect.top + pad) {
    menu.scrollTop -= menuRect.top + pad - itemRect.top
  } else if (itemRect.bottom > menuRect.bottom - pad) {
    menu.scrollTop += itemRect.bottom - (menuRect.bottom - pad)
  }
}

function Header({ home }: { home: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const active = useActiveSection(navIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const locked = [
      document.querySelector('.skip-link'),
      document.querySelector('.site-header .brand-lockup'),
      document.querySelector('.nav-links'),
      document.querySelector('.nav-cta'),
      document.querySelector('.nav-cta-compact'),
      document.getElementById('contenido'),
      document.querySelector('.site-footer'),
    ].filter((node): node is HTMLElement => node instanceof HTMLElement)

    for (const node of locked) node.inert = open
    return () => {
      document.body.style.overflow = ''
      for (const node of locked) node.inert = false
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const nav = document.getElementById('mobile-nav')
    const items = () => {
      const links = nav ? [...nav.querySelectorAll<HTMLElement>('a[href]')] : []
      return toggleRef.current ? [toggleRef.current, ...links] : links
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = items()
      if (focusable.length === 0) return
      event.preventDefault()
      const index = focusable.indexOf(document.activeElement as HTMLElement)
      const nextIndex = event.shiftKey
        ? index <= 0
          ? focusable.length - 1
          : index - 1
        : index === -1 || index >= focusable.length - 1
          ? 0
          : index + 1
      const next = focusable[nextIndex]
      next?.focus({ preventScroll: true })
      if (next && nav?.contains(next)) revealInMenu(next, nav)
    }

    const onResize = () => {
      // La misma anchura en la que la cabecera muestra las secciones.
      if (window.matchMedia('(min-width: 800px)').matches) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    const current = nav?.querySelector<HTMLElement>('a[aria-current="location"]')
    const first = nav?.querySelector<HTMLElement>('a[href]')
    const target = current ?? first
    // preventScroll: el documento está bloqueado. Solo se mueve el panel.
    target?.focus({ preventScroll: true })
    if (target && nav) revealInMenu(target, nav)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const sectionHref = (hash: string) => (home ? hash : `/${hash}`)

  function goToSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!isPlainClick(event) || !home) return
    setOpen(false)
    // El cierre del menú libera scroll y el inert en un efecto. Si se espera,
    // el destino sigue bloqueado y la página no se mueve.
    followAnchor(event, href)
  }

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-shell inner">
        <a
          className="brand-lockup"
          href={home ? '#top' : '/'}
          aria-label="Solunit inicio"
          onClick={home ? (event) => followAnchor(event, '#top') : undefined}
        >
          <img
            src="/mark.svg"
            alt=""
            width={446}
            height={392}
            decoding="async"
          />
          <strong>{brand.name}</strong>
        </a>

        <nav className="nav-links" aria-label="Principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={sectionHref(item.href)}
              aria-current={home && active === item.href.slice(1) ? 'location' : undefined}
              onClick={(event) => goToSection(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="btn btn-primary nav-cta"
          href={sectionHref(hero.primaryCta.href)}
          onClick={(event) => goToSection(event, hero.primaryCta.href)}
        >
          {hero.primaryCta.label}
        </a>

        <a
          className="btn btn-primary nav-cta-compact"
          href={sectionHref(hero.primaryCta.href)}
          aria-label={hero.primaryCta.label}
          onClick={(event) => goToSection(event, hero.primaryCta.href)}
        >
          Hablemos
        </a>

        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open ? (
        <button
          type="button"
          className="nav-scrim"
          aria-label="Cerrar menú"
          tabIndex={-1}
          onClick={() => {
            setOpen(false)
            toggleRef.current?.focus()
          }}
        />
      ) : null}

      <div
        id="mobile-nav"
        className={`mobile-nav${open ? ' is-open' : ''}`}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? 'Menú' : undefined}
      >
        <div className="site-shell">
          {nav.map((item) => (
            <a
              key={item.href}
              href={sectionHref(item.href)}
              aria-current={home && active === item.href.slice(1) ? 'location' : undefined}
              onClick={(event) => goToSection(event, item.href)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="btn btn-primary"
            href={sectionHref(hero.primaryCta.href)}
            onClick={(event) => goToSection(event, hero.primaryCta.href)}
          >
            {hero.primaryCta.label}
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero site-shell" id="top" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-brand">
            <span className="name">{brand.name}</span>
            <span className="tagline">{brand.tagline}</span>
          </p>
          <h1 id="hero-title" tabIndex={-1}>
            {hero.title}
          </h1>
          <p className="support">{hero.support}</p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={hero.primaryCta.href}
              onClick={(event) => followAnchor(event, hero.primaryCta.href)}
            >
              {hero.primaryCta.label}
            </a>
            <a
              className="btn btn-secondary"
              href={hero.secondaryCta.href}
              onClick={(event) => followAnchor(event, hero.secondaryCta.href)}
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img
            src="/mark.svg"
            alt=""
            width={446}
            height={392}
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}

type SectionProps = {
  id: string
  titleId: string
  eyebrow: string
  title: string
  intro?: string
  layout?: 'split' | 'stack'
  children: ReactNode
}

function Section({
  id,
  titleId,
  eyebrow,
  title,
  intro,
  layout = 'split',
  children,
}: SectionProps) {
  return (
    <section
      className={`section section-${layout}`}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className="site-shell section-grid">
          <div className="section-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={titleId} tabIndex={-1}>
            {title}
          </h2>
          {intro ? <p className="intro">{intro}</p> : null}
        </div>
        <div className="section-body">
          {children}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <Section
      id="servicios"
      titleId="services-title"
      eyebrow="Servicios"
      title="Capacidad técnica para resolver y escalar"
      intro="Lo que podemos construir. Una pieza o el conjunto."
    >
      <ul className="services-list">
        {services.map((service, index) => (
          <li className="service-row" id={serviceId(index)} key={service.title}>
            <h3 tabIndex={-1}>{service.title}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Method() {
  return (
    <Section
      id="metodo"
      titleId="method-title"
      eyebrow="Método"
      title="Nuestra forma de trabajar"
      intro="El orden del trabajo, de la primera conversación al mantenimiento."
    >
      <ol className="method-list">
        {method.map((item) => (
          <li className="method-item" key={item.step}>
            <span className="step" aria-hidden="true">
              {item.step}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function caseIndexFromUrl() {
  const id = new URLSearchParams(window.location.search).get('caso')
  const index = lab.cases.findIndex((item) => item.id === id)
  return index >= 0 ? index : 0
}

function Lab() {
  const [active, setActive] = useState(0)
  const [animate, setAnimate] = useState(false)
  const usedPointer = useRef(false)
  const scrollStage = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const selected = lab.cases[active] ?? lab.cases[0]

  // Antes del primer pintado: un enlace ?caso= no debe mostrar
  // el ejemplo por defecto y luego saltar al elegido.
  useLayoutEffect(() => {
    const apply = () => {
      setAnimate(false)
      setActive(caseIndexFromUrl())
    }
    apply()
    window.addEventListener('popstate', apply)
    return () => window.removeEventListener('popstate', apply)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    stage.classList.remove('is-moving')
    if (!animate) return
    const frame = window.requestAnimationFrame(() => {
      stage.classList.add('is-moving')
    })
    return () => window.cancelAnimationFrame(frame)
  }, [animate, selected.id])

  useEffect(() => {
    if (!scrollStage.current) return
    scrollStage.current = false
    const stage = stageRef.current
    if (!stage) return
    // En el móvil las opciones quedan arriba. Si el ejemplo está
    // fuera, el toque parece no hacer nada. Con teclado no se mueve:
    // el foco sigue en la opción y un salto lo dejaría fuera.
    const header = document.querySelector('.site-header')
    const topLimit = header instanceof HTMLElement ? header.offsetHeight : 0
    const rect = stage.getBoundingClientRect()
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, topLimit)
    if (visible >= 160) return
    stage.scrollIntoView({ block: 'start' })
  }, [active])

  function choose(index: number) {
    const pointer = usedPointer.current
    usedPointer.current = false
    scrollStage.current = pointer
    setAnimate(pointer)
    setActive(index)
    const url = new URL(window.location.href)
    url.searchParams.set('caso', lab.cases[index].id)
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  return (
    <Section
      id="laboratorio"
      titleId="lab-title"
      eyebrow={lab.eyebrow}
      title={lab.title}
      intro={lab.intro}
      layout="stack"
    >
      <div className="lab">
        <fieldset
          className="lab-options"
          onPointerDown={() => {
            usedPointer.current = true
          }}
          onKeyDown={() => {
            usedPointer.current = false
          }}
        >
          <legend className="sr-only">Caso de ejemplo</legend>
          {lab.cases.map((item, index) => (
            <label className="lab-option" key={item.id}>
              <input
                type="radio"
                name="lab-case"
                value={item.id}
                checked={index === active}
                onChange={() => choose(index)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>

        <div ref={stageRef} className="lab-stage">
          <p className="lab-lead" aria-live="polite">
            {selected.problem}
          </p>

          <article className="lab-app" aria-label={`${selected.app}, ejemplo`}>
            <header className="lab-app-bar">
              <strong>{selected.app}</strong>
              <span>{selected.when}</span>
              <span className="lab-app-tag">Ejemplo</span>
            </header>
            <div className="lab-app-body">
              <ul className="lab-rows">
                {selected.rows.map((row, index) => (
                  <li key={row.primary} className={index === selected.open ? 'is-open' : undefined}>
                    {index === selected.open ? <span className="sr-only">En curso: </span> : null}
                    <span className="lab-row-name">{row.primary}</span>
                    <span className="lab-row-time">{row.secondary}</span>
                    <span className="lab-row-state">{row.state}</span>
                  </li>
                ))}
              </ul>
              <div className="lab-detail">
                <p className="lab-detail-kicker">{selected.rows[selected.open].secondary}</p>
                <p className="lab-detail-title">{selected.rows[selected.open].primary}</p>
                <p className="lab-detail-state">{selected.rows[selected.open].state}</p>
                <ol className="lab-trail" aria-label="Pasos del ejemplo">
                  {selected.trail.map((step, index) => (
                    <li
                      key={step}
                      className={
                        index === selected.trailAt
                          ? 'is-now'
                          : index < selected.trailAt
                            ? 'is-done'
                            : undefined
                      }
                    >
                      <span className="sr-only">
                        {index < selected.trailAt
                          ? 'Hecho: '
                          : index === selected.trailAt
                            ? 'En curso: '
                            : 'Pendiente: '}
                      </span>
                      <span className="lab-trail-mark" aria-hidden="true" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>

          <p className="lab-outcome" aria-live="polite">
            {selected.outcome}
          </p>
          <p className="lab-next">
            <a
              className="btn btn-secondary"
              href={hero.primaryCta.href}
              onClick={(event) => followAnchor(event, hero.primaryCta.href)}
            >
              {hero.primaryCta.label}
            </a>
          </p>
        </div>
      </div>
    </Section>
  )
}

type ContactField = 'name' | 'email' | 'message'
type ContactErrors = Partial<Record<ContactField, string>>

const mailtoLimit = 1800

function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim()
}

function isEmailAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function readContactForm(form: HTMLFormElement) {
  const data = new FormData(form)
  return {
    name: singleLine(String(data.get('name') || '')),
    company: singleLine(String(data.get('company') || '')),
    email: singleLine(String(data.get('email') || '')),
    message: String(data.get('message') || '').trim(),
  }
}

function contactErrors(fields: ReturnType<typeof readContactForm>): ContactErrors {
  const errors: ContactErrors = {}
  if (!fields.name) errors.name = contact.formErrors.name
  if (!fields.email) errors.email = contact.formErrors.email
  else if (!isEmailAddress(fields.email)) errors.email = contact.formErrors.emailInvalid
  if (!fields.message) errors.message = contact.formErrors.message
  return errors
}

function contactBody(fields: ReturnType<typeof readContactForm>) {
  return `Nombre: ${fields.name}\nEmpresa: ${fields.company}\nEmail: ${fields.email}\n\n${fields.message}`
}

function mailtoHref(fields: ReturnType<typeof readContactForm>) {
  const subject = encodeURIComponent(`Proyecto Solunit — ${fields.company || fields.name}`)
  const body = encodeURIComponent(contactBody(fields))
  return `mailto:${contact.email}?subject=${subject}&body=${body}`
}

function copyWithSelection(text: string) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.setAttribute('aria-hidden', 'true')
  area.style.position = 'fixed'
  area.style.top = '0'
  area.style.left = '0'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.focus()
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  if (!ok) return Promise.reject(new Error('copy'))
  return Promise.resolve()
}

function copyContactBody(text: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => copyWithSelection(text))
  }
  return copyWithSelection(text)
}

type ContactDraft = ReturnType<typeof readContactForm>
type CopyState = 'idle' | 'done' | 'failed'

function Contact() {
  const [errors, setErrors] = useState<ContactErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const [draft, setDraft] = useState<ContactDraft | null>(null)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const focusField = useRef<ContactField | null>(null)
  const copyButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const field = focusField.current
    if (!field) return
    focusField.current = null
    document.getElementById(field)?.focus()
  }, [errors])

  useEffect(() => {
    if (!sent) return
    document.getElementById('contact-form-status')?.scrollIntoView({ block: 'nearest' })
  }, [sent])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = readContactForm(event.currentTarget)
    const next = contactErrors(fields)
    if (Object.keys(next).length === 0 && mailtoHref(fields).length > mailtoLimit) {
      next.message = contact.formErrors.messageLong
    }

    setSubmitted(true)
    setErrors(next)

    const firstInvalid = (['name', 'email', 'message'] as const).find((field) => next[field])
    if (firstInvalid) {
      focusField.current = firstInvalid
      setSent(false)
      setDraft(null)
      setCopyState('idle')
      return
    }

    setDraft(fields)
    setCopyState('idle')
    setSent(true)
    window.location.href = mailtoHref(fields)
  }

  async function onCopy() {
    if (!draft) return
    try {
      await copyContactBody(contactBody(draft))
      setCopyState('done')
    } catch {
      setCopyState('failed')
    } finally {
      copyButton.current?.focus()
    }
  }

  function onInput(event: FormEvent<HTMLFormElement>) {
    if (sent) {
      setSent(false)
      setDraft(null)
      setCopyState('idle')
    }
    if (!submitted) return
    const fields = readContactForm(event.currentTarget)
    const next = contactErrors(fields)
    if (Object.keys(next).length === 0 && mailtoHref(fields).length > mailtoLimit) {
      next.message = contact.formErrors.messageLong
    }
    setErrors(next)
  }

  return (
    <section
      className="section section-contact"
      id="contacto"
      aria-labelledby="contact-title"
      tabIndex={-1}
    >
      <div className="site-shell">
          <div className="contact-panel">
          <div className="contact-copy">
            <p className="eyebrow">Contacto</p>
            <h2 id="contact-title" tabIndex={-1}>
              {contact.title}
            </h2>
            <p>{contact.support}</p>
            <a className="email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>

          <form
            className="contact-form"
            action={`mailto:${contact.email}`}
            method="post"
            encType="text/plain"
            noValidate
            aria-labelledby="contact-title"
            onSubmit={onSubmit}
            onInput={onInput}
          >
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name ? (
                  <p className="field-error" id="name-error">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="company">Empresa (opcional)</label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  maxLength={160}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                maxLength={254}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email ? (
                <p className="field-error" id="email-error">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div className="field">
              <label htmlFor="message">Qué necesitas</label>
              <p className="field-hint" id="message-hint">
                {contact.formMessageHint}
              </p>
              <textarea
                id="message"
                name="message"
                required
                maxLength={2000}
                enterKeyHint="send"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? 'message-hint message-error' : 'message-hint'}
              />
              {errors.message ? (
                <p className="field-error" id="message-error">
                  {errors.message}
                </p>
              ) : null}
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              aria-describedby="contact-form-hint contact-form-privacy"
            >
              {contact.formSubmit}
            </button>
            <p className="form-note" id="contact-form-hint">
              {contact.formHint}
            </p>
            <p className="form-note" id="contact-form-privacy">
              Responsable: {owner.name}. El mensaje sirve para responderte y no se guarda en esta
              web. <a href="/privacidad">Política de privacidad</a>.
            </p>
            {sent ? (
              <div className="form-followup" id="contact-form-status">
                <p className="form-note form-status" role="status">
                  {contact.formSent} <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                  {copyState === 'done' ? ` ${contact.formCopied}` : null}
                  {copyState === 'failed' ? ` ${contact.formCopyFailed}` : null}
                </p>
                <button
                  ref={copyButton}
                  className="btn btn-secondary"
                  type="button"
                  onClick={onCopy}
                >
                  {contact.formCopy}
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  )
}

const copyrightYear = new Date().getFullYear()

function Footer({ page }: { page: PageId }) {
  const home = page === 'home'
  const sectionHref = (hash: string) => (home ? hash : `/${hash}`)

  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <a
              className="brand-lockup"
              href={home ? '#top' : '/'}
              aria-label="Solunit inicio"
              onClick={home ? (event) => followAnchor(event, '#top') : undefined}
            >
              <img
                src="/mark.svg"
                alt=""
                width={446}
                height={392}
                loading="lazy"
                decoding="async"
              />
              <strong>{brand.name}</strong>
            </a>
            <p>{brand.tagline}</p>
          </div>

          <nav className="footer-nav" aria-label="Secciones">
            {nav.map((item) => (
              <a
                key={item.href}
                href={sectionHref(item.href)}
                onClick={home ? (event) => followAnchor(event, item.href) : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a className="email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>

        <div className="footer-bottom">
          <p>
            © <span suppressHydrationWarning>{copyrightYear}</span> {owner.name}. {brand.name}.
          </p>
          <nav className="footer-legal-nav" aria-label="Información legal">
            <a href="/aviso-legal" aria-current={page === 'aviso-legal' ? 'page' : undefined}>
              Aviso legal
            </a>
            <a href="/privacidad" aria-current={page === 'privacidad' ? 'page' : undefined}>
              Privacidad
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

function usePageMeta(page: PageId) {
  useEffect(() => {
    const meta = pageMeta[page]
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.canonical)
  }, [page])
}

export default function App({ page = 'home' }: { page?: PageId }) {
  const home = page === 'home'
  usePageMeta(page)
  useHashOnLoad()

  return (
    <>
      <a
        className="skip-link"
        href={home ? '#top' : '#contenido'}
        onClick={(event) => followAnchor(event, home ? '#top' : '#contenido')}
      >
        Saltar al contenido
      </a>
      <Header home={home} />
      <main id="contenido" tabIndex={-1}>
        {page === 'home' ? (
          <>
            <Hero />
            <Services />
            <Method />
            <Lab />
            <Contact />
          </>
        ) : (
          <LegalPage page={page} />
        )}
      </main>
      <Footer page={page} />
    </>
  )
}
