import { hero, serviceDomId, services } from './content'
import { organizationId, organizationNode, owner, websiteId } from './legal'

export const pageMeta = {
  home: {
    title: 'Solunit — Soluciones Únicas Tecnológicas',
    // El título ya lleva la marca. La ficha dice el oficio, con el apoyo cerrado del hero.
    description: hero.support,
    canonical: owner.site,
  },
  'aviso-legal': {
    title: 'Aviso legal — Solunit',
    // El documento va en el texto de la página, no en la ficha: Google y las
    // tarjetas sociales leen esta frase.
    description: `Titular de solunit.es: ${owner.name}. Identidad, domicilio y condiciones de uso del sitio, conforme a la Ley 34/2002.`,
    canonical: `${owner.site}aviso-legal`,
  },
  privacidad: {
    title: 'Privacidad — Solunit',
    description: `Datos que trata ${owner.name} en solunit.es, con qué fin, durante cuánto tiempo y cómo ejercer tus derechos.`,
    canonical: `${owner.site}privacidad`,
  },
} as const

export type PageId = keyof typeof pageMeta

/**
 * Grafo de la página. La organización y el sitio van en todas.
 * Los servicios solo en la home: es donde se leen.
 * El documento de identidad no entra: está en el texto del aviso legal.
 */
export function pageJsonLd(page: PageId) {
  const meta = pageMeta[page]
  const graph: Record<string, unknown>[] = [
    organizationNode(),
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: owner.sign,
      alternateName: owner.signLong,
      url: owner.site,
      inLanguage: 'es',
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'WebPage',
      '@id': `${meta.canonical}#pagina`,
      url: meta.canonical,
      name: meta.title,
      description: meta.description,
      inLanguage: 'es',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
    },
  ]

  if (page === 'home') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${owner.site}#servicios`,
      name: 'Servicios',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          url: `${owner.site}#${serviceDomId(index)}`,
          provider: { '@id': organizationId },
        },
      })),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function pageFromPath(pathname: string): PageId {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/aviso-legal') return 'aviso-legal'
  if (path === '/privacidad') return 'privacidad'
  return 'home'
}
