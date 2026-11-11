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
  title: 'Qué hemos construido',
  intro:
    'Una selección de encargos recientes: el reto, lo que construimos y lo que cambió.',
} as const

export const projects = [
  {
    name: 'Plataforma de acompañamiento',
    sector: 'Servicios / marketplace',
    challenge: 'Digitalizar la relación entre clientes y profesionales con reservas y pagos.',
    built: 'Aplicación web completa con perfiles, reservas, mensajería y cobros.',
    result: 'Operativa centralizada y experiencia lista para escalar.',
  },
  {
    name: 'Portal para autónomos',
    sector: 'Productividad empresarial',
    challenge: 'Unificar trámites, visibilidad y herramientas en un solo entorno digital.',
    built: 'Producto web orientado a usuarios reales, con flujos claros y backend sólido.',
    result: 'Base tecnológica preparada para crecer por módulos.',
  },
  {
    name: 'App de campo y captura',
    sector: 'Operaciones',
    challenge: 'Sustituir procesos manuales por una herramienta usable en el día a día.',
    built: 'Aplicación enfocada en velocidad de uso, datos fiables y despliegue práctico.',
    result: 'Menos fricción operativa y mejor trazabilidad.',
  },
  {
    name: 'Comercio y recambios',
    sector: 'Retail / industrial',
    challenge: 'Dar a la empresa una presencia digital alineada con su catálogo y ventas.',
    built: 'Web y experiencia de producto orientada a conversión y mantenimiento sencillo.',
    result: 'Canal digital profesional y evolucionable.',
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
    'Elige una operativa. Verás cómo el problema se convierte en un flujo, una interfaz de ejemplo y una solución.',
  cases: [
    {
      id: 'reservas',
      label: 'Reservas y cobros sueltos',
      problem:
        'Clientes, huecos y pagos viven en conversaciones distintas. Nadie ve el día completo.',
      flow: ['Perfil', 'Reserva', 'Mensaje', 'Cobro'],
      screenTitle: 'Agenda del día',
      rows: [
        { name: 'Consulta inicial', meta: '09:30 · confirmada' },
        { name: 'Seguimiento', meta: '11:00 · pendiente de pago' },
        { name: 'Cierre', meta: '16:15 · mensaje sin leer' },
      ],
      outcome:
        'Una aplicación con perfiles, reservas, mensajería y cobros en el mismo sitio.',
    },
    {
      id: 'tramites',
      label: 'Trámites en sitios distintos',
      problem:
        'La misma gestión obliga a saltar de portal en portal para saber en qué punto está.',
      flow: ['Trámite', 'Estado', 'Aviso', 'Archivo'],
      screenTitle: 'Estado de gestiones',
      rows: [
        { name: 'Alta de actividad', meta: 'En revisión' },
        { name: 'Modelo pendiente', meta: 'Falta un dato' },
        { name: 'Notificación', meta: 'Recibida hoy' },
      ],
      outcome: 'Un solo entorno con el estado de cada gestión a la vista.',
    },
    {
      id: 'campo',
      label: 'Parte de campo en papel',
      problem:
        'Lo que ocurre fuera de la oficina se anota a mano y llega tarde, o no llega.',
      flow: ['Captura', 'Validación', 'Registro', 'Seguimiento'],
      screenTitle: 'Parte de hoy',
      rows: [
        { name: 'Revisión de equipo', meta: 'Foto y nota' },
        { name: 'Incidencia', meta: 'Ubicación guardada' },
        { name: 'Cierre de visita', meta: 'Pendiente de enviar' },
      ],
      outcome: 'El dato nace digital y se puede seguir desde el momento en que ocurre.',
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
