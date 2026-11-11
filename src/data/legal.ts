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
  updatedLabel: '11 de noviembre de 2026',
} as const

/** Datos públicos de la organización. El documento de identidad queda en el aviso legal. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: owner.sign,
    alternateName: owner.signLong,
    url: owner.site,
    logo: `${owner.site}logo.png`,
    email: owner.email,
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
