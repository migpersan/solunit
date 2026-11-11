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

export const reasons = [
  {
    title: 'Solidez',
    description:
      'Procesos claros, documentación, seguridad y compromiso de mantenimiento.',
  },
  {
    title: 'Ingeniería de verdad',
    description:
      'Arquitectura y calidad pensadas para aguantar el uso real, no demos de escaparate.',
  },
  {
    title: 'Innovación aplicada',
    description:
      'IA y automatización cuando mejoran el resultado; nunca como adorno.',
  },
  {
    title: 'Hecha para crecer',
    description:
      'Empezamos donde estás hoy y diseñamos para lo que vendrá mañana.',
  },
] as const

/**
 * Casos provisionales (issue #1): sustituir por proyectos reales con nombre,
 * reto, qué se construyó y resultado verificable. No añadir métricas sin fuente.
 */
export const projectsIntro = {
  title: 'Qué construimos',
  intro:
    'Cuatro operativas de empresa. El cliente y el resultado se publican cuando se pueden contar.',
} as const

export const projects = [
  {
    name: 'Agenda y cobros',
    sector: 'Servicios',
    challenge: 'Clientes, huecos y pagos viven en conversaciones distintas.',
    built: 'Una aplicación con reservas, mensajes y cobros en el mismo sitio.',
    result: 'El día completo se ve en un solo producto.',
  },
  {
    name: 'Trámites dispersos',
    sector: 'Gestión',
    challenge: 'La misma gestión obliga a saltar de portal en portal.',
    built: 'Un entorno con el estado de cada trámite a la vista.',
    result: 'Se sabe en qué punto está cada gestión, sin salir del producto.',
  },
  {
    name: 'Trabajo de campo',
    sector: 'Operaciones',
    challenge: 'Lo que ocurre fuera de la oficina se anota a mano y llega tarde.',
    built: 'Una captura en el momento: nota, foto y ubicación.',
    result: 'El dato nace digital y se puede seguir.',
  },
  {
    name: 'Catálogo y ventas',
    sector: 'Comercio',
    challenge: 'La presencia digital no refleja el catálogo ni la forma de vender.',
    built: 'Una web de producto alineada con el catálogo y fácil de mantener.',
    result: 'Un canal digital que la empresa puede hacer evolucionar.',
  },
] as const

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
 * Ejemplos de operativa. Las filas de interfaz son ilustración,
 * no métricas ni resultados de un cliente.
 */
export const lab = {
  eyebrow: 'Ejemplo',
  title: 'Del problema al software',
  intro:
    'Elige una operativa. La pantalla es un ejemplo: el trabajo en curso y el paso que falta.',
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
      trail: ['Perfil', 'Reserva', 'Mensaje', 'Cobro'],
      trailAt: 3,
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
        { primary: 'Alta de actividad', secondary: 'Este mes', state: 'En revisión' },
        { primary: 'Modelo trimestral', secondary: 'Trimestre', state: 'Falta un dato' },
        { primary: 'Notificación', secondary: 'Hoy', state: 'Recibida' },
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
        { primary: 'Revisión de equipo', secondary: 'Foto y nota', state: 'Registrada' },
        { primary: 'Incidencia', secondary: 'Ubicación', state: 'Guardada' },
        { primary: 'Cierre de visita', secondary: 'Sin enviar', state: 'Pendiente' },
      ],
      open: 1,
      trail: ['Captura', 'Validación', 'Registro', 'Seguimiento'],
      trailAt: 2,
      outcome: 'El dato nace en el momento y se puede seguir después.',
    },
  ],
} as const

export const technologies = {
  intro:
    'Elegimos el stack según el problema, no según la moda. Experiencia concreta en entornos de producto real.',
  groups: [
    {
      title: 'Web',
      items: ['React', 'TypeScript', 'Vite', 'Next.js'],
    },
    {
      title: 'Apps',
      items: ['Capacitor', 'Android', 'PWA'],
    },
    {
      title: 'Backend y APIs',
      items: ['Node.js', 'Drupal', 'REST', 'Integraciones'],
    },
    {
      title: 'Datos e IA aplicada',
      items: ['Automatización', 'Modelos de IA', 'Flujos de negocio'],
    },
  ],
} as const

export const contact = {
  title: 'Hablemos de tu proyecto',
  support:
    'Una conversación para entender el reto y ver si encajamos. Sin compromiso y con claridad desde el primer momento.',
  email: 'hola@solunit.es',
  formHint: 'Al enviar se abre tu aplicación de correo con el mensaje ya redactado.',
  formSent: 'Mensaje preparado en tu aplicación de correo. Si no se ha abierto, escríbenos a',
} as const

export const nav = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Por qué Solunit', href: '#por-que' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Método', href: '#metodo' },
  { label: 'Contacto', href: '#contacto' },
] as const
