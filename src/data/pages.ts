import { owner } from './legal'

export const pageMeta = {
  home: {
    title: 'Solunit — Soluciones Únicas Tecnológicas',
    description:
      'Solunit — Soluciones Únicas Tecnológicas. Tecnología a medida para empresas que quieren llegar más lejos.',
    canonical: owner.site,
  },
  'aviso-legal': {
    title: 'Aviso legal — Solunit',
    description: `Titular de solunit.es: ${owner.name}, DNI ${owner.idDocument}, domicilio en ${owner.address}.`,
    canonical: `${owner.site}aviso-legal`,
  },
  privacidad: {
    title: 'Privacidad — Solunit',
    description: `Datos que trata ${owner.name} en solunit.es, con qué fin, durante cuánto tiempo y cómo ejercer tus derechos.`,
    canonical: `${owner.site}privacidad`,
  },
} as const

export type PageId = keyof typeof pageMeta

export function pageFromPath(pathname: string): PageId {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/aviso-legal') return 'aviso-legal'
  if (path === '/privacidad') return 'privacidad'
  return 'home'
}
