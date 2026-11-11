import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  brand,
  contact,
  hero,
  method,
  nav,
  projects,
  reasons,
  services,
  technologies,
} from './data/content'

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

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
            <a key={item.href} href={item.href}>
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
    </section>
  )
}

function Services() {
  return (
    <section className="section" id="servicios" aria-labelledby="services-title">
      <div className="site-shell">
        <div className="section-heading">
          <p className="eyebrow">Servicios</p>
          <h2 id="services-title">Capacidad técnica para resolver y escalar</h2>
          <p>
            Soluciones únicas orientadas a operativa real, diseñadas para evolucionar
            con tu empresa.
          </p>
        </div>

        <div className="services-list">
          {services.map((service) => (
            <article className="service-row" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section className="section" id="por-que" aria-labelledby="why-title">
      <div className="site-shell">
        <div className="section-heading">
          <p className="eyebrow">Por qué Solunit</p>
          <h2 id="why-title">Ingeniería, calidad y visión de crecimiento</h2>
          <p>
            Construimos con la seriedad de una empresa de software y la cercanía de
            un equipo que entiende tu negocio.
          </p>
        </div>

        <div className="reasons-grid">
          {reasons.map((reason) => (
            <article className="reason" key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section className="section" id="proyectos" aria-labelledby="projects-title">
      <div className="site-shell">
        <div className="section-heading">
          <p className="eyebrow">Proyectos</p>
          <h2 id="projects-title">Trabajos reales, resultados verificables</h2>
          <p>
            Una selección de encargos recientes. Los detalles y métricas se
            precisarán con los casos definitivos.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project" key={project.name}>
              <p className="sector">{project.sector}</p>
              <h3>{project.name}</h3>
              <dl>
                <div>
                  <dt>Reto</dt>
                  <dd>{project.challenge}</dd>
                </div>
                <div>
                  <dt>Qué construimos</dt>
                  <dd>{project.built}</dd>
                </div>
                <div>
                  <dt>Resultado</dt>
                  <dd>{project.result}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Method() {
  return (
    <section className="section" id="metodo" aria-labelledby="method-title">
      <div className="site-shell">
        <div className="section-heading">
          <p className="eyebrow">Método</p>
          <h2 id="method-title">Nuestra forma de trabajar</h2>
          <p>
            Un proceso claro de extremo a extremo: de entender el problema a
            evolucionar la solución.
          </p>
        </div>

        <div className="method-list">
          {method.map((item) => (
            <article className="method-item" key={item.step}>
              <div className="step">{item.step}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Technologies() {
  return (
    <section className="section" id="tecnologias" aria-labelledby="tech-title">
      <div className="site-shell">
        <div className="section-heading">
          <p className="eyebrow">Tecnologías</p>
          <h2 id="tech-title">Experiencia técnica concreta</h2>
        </div>
        <p className="tech-intro">{technologies.intro}</p>
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
      </div>
    </section>
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
    <section className="section" id="contacto" aria-labelledby="contact-title">
      <div className="site-shell">
        <div className="contact-panel">
          <div className="contact-copy">
            <h2 id="contact-title">{contact.title}</h2>
            <p>{contact.support}</p>
            <a className="email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="company">Empresa</label>
              <input id="company" name="company" autoComplete="organization" />
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
            <button className="btn btn-primary" type="submit">
              Enviar mensaje
            </button>
            {sent ? (
              <p className="form-note" role="status">
                Se abrirá tu cliente de correo para completar el envío.
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
      <div className="site-shell inner">
        <div>
          <strong>{brand.name}</strong>
          <div>{brand.tagline}</div>
        </div>
        <div>
          © <span suppressHydrationWarning>{copyrightYear}</span> Solunit. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default function App() {
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
