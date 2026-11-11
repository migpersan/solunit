import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import {
  brand,
  contact,
  hero,
  method,
  nav,
  projects,
  projectsIntro,
  reasons,
  services,
  technologies,
} from './data/content'

const serviceId = (index: number) => `servicio-${index + 1}`
const twoDigits = (index: number) => String(index + 1).padStart(2, '0')

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

// Si el HTML llegó sin contenido, el navegador no pudo saltar al ancla de la URL.
function useHashOnLoad() {
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (!hash || window.scrollY !== 0) return
    document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' })
  }, [])
}

function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    // Lo que ya está en pantalla (o por encima) no debe parpadear al activar el efecto.
    for (const item of items) {
      if (item.getBoundingClientRect().top < window.innerHeight) {
        item.classList.add('is-visible')
      }
    }
    root.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      // El margen superior cuenta como visible todo lo que queda por encima:
      // un salto de ancla no deja bloques ocultos a medio camino.
      { rootMargin: '100000px 0px -8% 0px' },
    )

    items.forEach((item) => observer.observe(item))
    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}

const navIds = nav.map((item) => item.href.slice(1))

function Header() {
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
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const onResize = () => {
      if (window.matchMedia('(min-width: 980px)').matches) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    const current = nav?.querySelector<HTMLElement>('a[aria-current="location"]')
    const first = nav?.querySelector<HTMLElement>('a[href]')
    ;(current ?? first)?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  function goToSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const target = document.getElementById(href.slice(1))
    setOpen(false)
    if (!target) return
    event.preventDefault()
    // El cierre del menú libera scroll y el inert en un efecto. Si se espera,
    // el destino sigue bloqueado y la página no se mueve.
    const main = document.getElementById('contenido')
    if (main) main.inert = false
    document.body.style.overflow = ''
    target.focus({ preventScroll: true })
    target.scrollIntoView()
    if (window.location.hash !== href) history.pushState(null, '', href)
  }

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-shell inner">
        <a className="brand-lockup" href="#top" aria-label="Solunit inicio">
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
              href={item.href}
              aria-current={active === item.href.slice(1) ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="btn btn-primary nav-cta" href={hero.primaryCta.href}>
          {hero.primaryCta.label}
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
              href={item.href}
              aria-current={active === item.href.slice(1) ? 'location' : undefined}
              onClick={(event) => goToSection(event, item.href)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="btn btn-primary"
            href={hero.primaryCta.href}
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
          <h1 id="hero-title">{hero.title}</h1>
          <p className="support">{hero.support}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            <a className="btn btn-secondary" href={hero.secondaryCta.href}>
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

      <ul className="hero-index" aria-label="Qué hacemos">
        {services.map((service, index) => (
          <li key={service.title}>
            <a href={`#${serviceId(index)}`}>
              <span className="num">{twoDigits(index)}</span>
              {service.title}
            </a>
          </li>
        ))}
      </ul>
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
        <div className="section-heading" data-reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={titleId}>{title}</h2>
          {intro ? <p className="intro">{intro}</p> : null}
        </div>
        <div className="section-body" data-reveal>
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
      intro="Soluciones únicas orientadas a operativa real, diseñadas para evolucionar con tu empresa."
    >
      <ol className="services-list">
        {services.map((service, index) => (
          <li className="service-row" id={serviceId(index)} key={service.title}>
            <span className="num" aria-hidden="true">
              {twoDigits(index)}
            </span>
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Why() {
  return (
    <Section
      id="por-que"
      titleId="why-title"
      eyebrow="Por qué Solunit"
      title="Ingeniería, calidad y visión de crecimiento"
      intro="Construimos con la seriedad de una empresa de software y la cercanía de un equipo que entiende tu negocio."
    >
      <div className="reasons-grid">
        {reasons.map((reason) => (
          <article className="reason" key={reason.title}>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Projects() {
  return (
    <Section
      id="proyectos"
      titleId="projects-title"
      eyebrow="Proyectos"
      title={projectsIntro.title}
      intro={projectsIntro.intro}
      layout="stack"
    >
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project" key={project.name}>
            <header>
              <p className="sector">{project.sector}</p>
              <h3>{project.name}</h3>
            </header>
            <dl>
              <div>
                <dt>Reto</dt>
                <dd>{project.challenge}</dd>
              </div>
              <div>
                <dt>Qué construimos</dt>
                <dd>{project.built}</dd>
              </div>
              <div className="result">
                <dt>Resultado</dt>
                <dd>{project.result}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
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
      intro="Un proceso claro de extremo a extremo: de entender el problema a evolucionar la solución."
      layout="stack"
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

function Technologies() {
  return (
    <Section
      id="tecnologias"
      titleId="tech-title"
      eyebrow="Tecnologías"
      title="Experiencia técnica concreta"
      intro={technologies.intro}
    >
      <div className="tech-groups">
        {technologies.groups.map((group) => (
          <div className="tech-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
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

function mailtoHref(fields: ReturnType<typeof readContactForm>) {
  const subject = encodeURIComponent(`Proyecto Solunit — ${fields.company || fields.name}`)
  const body = encodeURIComponent(
    `Nombre: ${fields.name}\nEmpresa: ${fields.company}\nEmail: ${fields.email}\n\n${fields.message}`,
  )
  return `mailto:${contact.email}?subject=${subject}&body=${body}`
}

function Contact() {
  const [errors, setErrors] = useState<ContactErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const focusField = useRef<ContactField | null>(null)

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
      return
    }

    window.location.href = mailtoHref(fields)
    setSent(true)
  }

  function onInput(event: FormEvent<HTMLFormElement>) {
    if (sent) setSent(false)
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
        <div className="contact-panel" data-reveal>
          <div className="contact-copy">
            <p className="eyebrow">Contacto</p>
            <h2 id="contact-title">{contact.title}</h2>
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
                <label htmlFor="company">
                  Empresa <span className="optional">(opcional)</span>
                </label>
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
              <textarea
                id="message"
                name="message"
                required
                maxLength={2000}
                enterKeyHint="send"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? 'message-error' : undefined}
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
              aria-describedby="contact-form-hint"
            >
              Enviar mensaje
            </button>
            <p className="form-note" id="contact-form-hint">
              {contact.formHint}
            </p>
            <p className="form-note form-status" id="contact-form-status" role="status">
              {sent ? (
                <>
                  {contact.formSent}{' '}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </>
              ) : null}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

const copyrightYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="brand-lockup" href="#top" aria-label="Solunit inicio">
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
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>

        <p className="footer-legal">
          © <span suppressHydrationWarning>{copyrightYear}</span> Solunit. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  useHashOnLoad()
  useReveal()

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Services />
        <Why />
        <Projects />
        <Method />
        <Technologies />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
