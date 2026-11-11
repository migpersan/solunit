import { contact } from './content'

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

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: owner.sign,
    alternateName: owner.signLong,
    url: owner.site,
    logo: `${owner.site}logo.png`,
    email: owner.email,
    description:
      'Tecnología a medida para empresas que quieren llegar más lejos. Diseñamos, desarrollamos y evolucionamos software, plataformas digitales y aplicaciones.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Manuela Macías, 22',
      addressCountry: 'ES',
    },
    founder: {
      '@type': 'Person',
      name: owner.name,
      taxID: owner.idDocument,
    },
  }
}
