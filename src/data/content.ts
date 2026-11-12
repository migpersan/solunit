export const brand = {
  name: 'SOLUNIT',
  tagline: 'Soluciones Únicas Tecnológicas',
} as const

export const hero = {
  title: 'Tecnología a medida para empresas que quieren llegar más lejos.',
  support:
    'Diseñamos, desarrollamos y evolucionamos software, plataformas digitales y aplicaciones que resuelven desafíos reales e impulsan el crecimiento de tu negocio.',
  primaryCta: { label: 'Hablemos de tu proyecto', href: '#contacto' },
  secondaryCta: { label: 'Nuestros servicios', href: '#servicios' },
} as const

export const services = [
  {
    title: 'Desarrollo de software a medida',
    description:
      'Sistemas y herramientas pensados para tu operativa, no plantillas adaptadas a la fuerza.',
  },
  {
    title: 'Aplicaciones web y móviles',
    description:
      'Productos digitales listos para usarse, medirse y evolucionar con tu negocio.',
  },
  {
    title: 'Plataformas e integraciones',
    description:
      'Conectamos procesos, datos y sistemas para que tu empresa trabaje como un solo conjunto.',
  },
  {
    title: 'Automatización e IA aplicada',
    description:
      'Aceleramos tareas, decisiones y desarrollo donde la inteligencia artificial aporta valor real.',
  },
  {
    title: 'Evolución y mantenimiento',
    description:
      'Acompañamos la solución después del lanzamiento: mejoras, estabilidad y crecimiento continuo.',
  },
] as const

/** Id de cada fila de servicios. El JSON-LD enlaza el mismo ancla. */
export function serviceDomId(index: number) {
  return `servicio-${index + 1}`
}

export const method = [
  {
    step: '01',
    title: 'Análisis',
    description: 'Entendemos el negocio, el contexto y el problema a resolver.',
  },
  {
    step: '02',
    title: 'Arquitectura',
    description: 'Definimos la solución, el alcance y las prioridades técnicas.',
  },
  {
    step: '03',
    title: 'Desarrollo',
    description: 'Construimos con calidad, seguimiento y comunicación continua.',
  },
  {
    step: '04',
    title: 'Pruebas',
    description: 'Validamos funcionalidad, rendimiento y experiencia antes del lanzamiento.',
  },
  {
    step: '05',
    title: 'Evolución',
    description: 'Mejoramos y mantenemos la solución a medida que tu empresa crece.',
  },
] as const

/**
 * Ejemplos de operativa. Las filas son ilustración, no métricas
 * ni resultados de un cliente. La fila abierta es el paso en curso
 * (trailAt): lo anterior del recorrido está hecho y lo posterior, pendiente.
 */
export const lab = {
  eyebrow: 'Ejemplo',
  title: 'Del problema al software',
  intro:
    'Elige una operativa. La pantalla es un ejemplo: qué está hecho, qué sigue en curso y qué falta.',
  cases: [
    {
      id: 'reservas',
      label: 'Reservas y cobros sueltos',
      problem:
        'Clientes, huecos y pagos viven en conversaciones distintas. Nadie ve el día completo.',
      app: 'Agenda',
      when: 'Hoy',
      rows: [
        { primary: 'Consulta inicial', secondary: '09:30', state: 'Confirmada' },
        { primary: 'Seguimiento', secondary: '11:00', state: 'Pendiente de pago' },
        { primary: 'Cierre', secondary: '16:15', state: 'Mensaje sin leer' },
      ],
      open: 1,
      trail: ['Perfil', 'Reserva', 'Cobro', 'Mensaje'],
      trailAt: 2,
      outcome: 'Reservas, mensajes y cobros quedan en el mismo producto.',
    },
    {
      id: 'tramites',
      label: 'Trámites en sitios distintos',
      problem:
        'La misma gestión obliga a saltar de portal en portal para saber en qué punto está.',
      app: 'Gestiones',
      when: 'En curso',
      rows: [
        { primary: 'Alta de actividad', secondary: 'Este mes', state: 'Presentada' },
        { primary: 'Modelo trimestral', secondary: 'Trimestre', state: 'Falta un dato' },
        { primary: 'Notificación', secondary: 'Hoy', state: 'Sin leer' },
      ],
      open: 1,
      trail: ['Trámite', 'Estado', 'Aviso', 'Archivo'],
      trailAt: 1,
      outcome: 'Cada gestión muestra en qué punto está, sin salir del producto.',
    },
    {
      id: 'campo',
      label: 'Parte de campo en papel',
      problem:
        'Lo que ocurre fuera de la oficina se anota a mano y llega tarde, o no llega.',
      app: 'Parte',
      when: 'Visita 14',
      rows: [
        { primary: 'Revisión de equipo', secondary: 'Foto y nota', state: 'Validada' },
        { primary: 'Incidencia', secondary: 'Ubicación', state: 'En registro' },
        { primary: 'Cierre de visita', secondary: 'Sin enviar', state: 'Pendiente' },
      ],
      open: 1,
      trail: ['Captura', 'Validación', 'Registro', 'Seguimiento'],
      trailAt: 2,
      outcome: 'El dato nace en el momento y se puede seguir después.',
    },
  ],
} as const

export const contact = {
  title: 'Hablemos de tu proyecto',
  support:
    'Cuéntanos el problema y quién lo vive. Respondemos por correo, sin compromiso.',
  email: 'info@kedai.es',
  formSubmit: 'Abrir en el correo',
  formHint: 'El mensaje no sale de esta página: lo envías tú desde tu correo.',
  formMessageHint: 'El problema, quién lo vive y qué tendría que quedar resuelto.',
  formSent: 'Mensaje preparado en tu aplicación de correo. Si no se ha abierto, escríbenos a',
  formCopy: 'Copiar mensaje',
  formCopied: 'El texto ya está en el portapapeles.',
  formCopyFailed: 'No se ha podido copiar. Escríbenos a mano a esa dirección.',
  formErrors: {
    name: 'Escribe tu nombre.',
    email: 'Escribe un email de contacto.',
    emailInvalid: 'Ese email no es válido. Revisa que lleve @ y el dominio.',
    message: 'Cuéntanos qué necesitas.',
    messageLong: 'El mensaje no cabe en un correo. Acórtalo y vuelve a enviarlo.',
  },
} as const

export const nav = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Método', href: '#metodo' },
  { label: 'Ejemplo', href: '#laboratorio' },
  { label: 'Contacto', href: '#contacto' },
] as const
