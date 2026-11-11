# Solunit — guía para agentes

## Norte de marca (no negociable)

- **Solunit** = Soluciones Únicas Tecnológicas.
- Empresa seria de ingeniería y desarrollo de software.
- Vende **soluciones y resultados**, no herramientas ni moda de IA.
- La IA es capacidad interna / acelerador, **nunca** el titular de la home.
- La promesa debe poder escalar: de proyectos actuales a contratos empresariales mayores, sin reescribir la marca.

## Hero cerrado

- Marca: SOLUNIT / Soluciones Únicas Tecnológicas
- Titular: Tecnología a medida para empresas que quieren llegar más lejos.
- Apoyo: Diseñamos, desarrollamos y evolucionamos software, plataformas digitales y aplicaciones que resuelven desafíos reales e impulsan el crecimiento de tu negocio.
- CTAs: Hablemos de tu proyecto · Nuestros servicios

## Qué mejorar en ciclos 24h

Prioridad alta:

1. Rendimiento (Lighthouse), accesibilidad, SEO técnico.
2. Tipografía, ritmo vertical, jerarquía visual, móvil.
3. Copy de proyectos con datos reales cuando existan.
4. Formulario de contacto / integración real (Formspree, Resend, etc.).
5. Microinteracciones sobrias alineadas con la marca (cian / negro).

Prioridad baja / evitar:

- Centrar la web en “IA 24h” o experimentos públicos como mensaje principal.
- Estética genérica púrpura “AI startup”, glassmorphism excesivo, muros de logos.
- Prometer plazos milagro (“listo en semanas”) como regla general en el hero.
- Limitar públicamente el ICP a “10–100 empleados” en el copy de marca.

## Skills de diseño (obligatorias en cambios visuales)

Instaladas en `.agents/skills/` (lock en `skills-lock.json`):

1. **`frontend-design`** (Anthropic) — léela **antes** de rediseñar o tocar tipografía, color, layout o secciones nuevas. Planifica dirección visual y evita look genérico de IA. No diluye el hero cerrado ni el norte de marca.
2. **`web-design-guidelines`** (Vercel) — úsala **después** del cambio visual para revisar accesibilidad, foco e interacción (`file:line`).

No mezclar otras skills de “gusto” (Taste, etc.) con `frontend-design` en el mismo ciclo. Emil Kowalski solo si el trabajo es motion concreto.

## Archivos clave

- Copy: `src/data/content.ts`
- Estilos: `src/index.css`
- Página: `src/App.tsx`
- Skills: `.agents/skills/frontend-design`, `.agents/skills/web-design-guidelines`

## Criterio de merge

Un cambio es bueno si mejora claridad, confianza, conversión o calidad técnica **sin** diluir la identidad corporativa.
