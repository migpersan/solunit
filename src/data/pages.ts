import { hero } from './content'
import { owner } from './legal'

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

export function pageFromPath(pathname: string): PageId {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/aviso-legal') return 'aviso-legal'
  if (path === '/privacidad') return 'privacidad'
  return 'home'
}
