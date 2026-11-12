import { contact, hero } from './content'

/** Titular persona física. La sociedad no está constituida. */
export const owner = {
  name: 'Miguel Pérez Sánchez',
  idDocument: '48122568J',
  address: 'Manuela Macías, 22, España',
  email: contact.email,
  site: 'https://solunit.es/',
  sign: 'Solunit',
  signLong: 'Soluciones Únicas Tecnológicas',
  /** Misma fecha que `updatedLabel`, en forma que puede leer un buscador. */
  updated: '2026-11-11',
  updatedLabel: '11 de noviembre de 2026',
} as const

export const organizationId = `${owner.site}#organizacion`
export const websiteId = `${owner.site}#sitio`

/**
 * Datos públicos de la organización. El documento de identidad queda en el aviso legal.
 * El nodo no lleva @context: lo pone el grafo de la página.
 */
export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: owner.sign,
    alternateName: owner.signLong,
    url: owner.site,
    logo: {
      '@type': 'ImageObject',
      url: `${owner.site}logo.png`,
      width: 446,
      height: 512,
    },
    email: owner.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'proyectos',
      email: owner.email,
      availableLanguage: 'es',
    },
    description: hero.support,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Manuela Macías, 22',
      addressCountry: 'ES',
    },
    founder: {
      '@type': 'Person',
      name: owner.name,
    },
  }
}
