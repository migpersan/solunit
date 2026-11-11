import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }

    const onResize = () => {
      if (window.matchMedia('(min-width: 980px)').matches) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

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

      <div id="mobile-nav" className={`mobile-nav${open ? ' is-open' : ''}`}>
        <div className="site-shell">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a
            className="btn btn-primary"
            href={hero.primaryCta.href}
            onClick={() => setOpen(false)}
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
    <section className="hero site-shell" id="top" aria-labelledby="hero-title">
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
    <section className={`section section-${layout}`} id={id} aria-labelledby={titleId}>
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

function Contact() {
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const company = String(data.get('company') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    const subject = encodeURIComponent(`Proyecto Solunit — ${company || name}`)
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmpresa: ${company}\nEmail: ${email}\n\n${message}`,
    )

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section className="section section-contact" id="contacto" aria-labelledby="contact-title">
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

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Nombre</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="company">
                  Empresa <span className="optional">(opcional)</span>
                </label>
                <input id="company" name="company" autoComplete="organization" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="message">Qué necesitas</label>
              <textarea id="message" name="message" required />
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
            {sent ? (
              <p className="form-note form-status" role="status">
                {contact.formSent}{' '}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>.
              </p>
            ) : null}
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
      <main id="contenido">
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
