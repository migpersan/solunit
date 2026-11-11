import { owner } from './data/legal'
import type { PageId } from './data/pages'

function Mail() {
  return <a href={`mailto:${owner.email}`}>{owner.email}</a>
}

function Identity() {
  return (
    <dl className="legal-facts">
      <div>
        <dt>Titular</dt>
        <dd>{owner.name}</dd>
      </div>
      <div>
        <dt>Documento</dt>
        {/* Sigue visible en la página. data-nosnippet evita que el buscador
            lo use como extracto si ignora la descripción. */}
        <dd data-nosnippet="">{`DNI ${owner.idDocument}`}</dd>
      </div>
      <div>
        <dt>Domicilio</dt>
        <dd>{owner.address}</dd>
      </div>
      <div>
        <dt>Signo</dt>
        <dd>
          {owner.sign} ({owner.signLong})
        </dd>
      </div>
      <div>
        <dt>Sitio</dt>
        <dd>
          <a href={owner.site}>{owner.site.replace(/\/$/, '')}</a>
        </dd>
      </div>
      <div>
        <dt>Correo</dt>
        <dd>
          <Mail />
        </dd>
      </div>
    </dl>
  )
}

function AvisoLegal() {
  return (
    <>
      <p className="eyebrow">Solunit</p>
      <h1 id="legal-title" tabIndex={-1}>
        Aviso legal
      </h1>
      <p className="legal-lead">
        Datos del titular de este sitio, conforme a la Ley 34/2002 de servicios de la sociedad de
        la información.
      </p>
      <Identity />

      <section className="legal-section" aria-labelledby="aviso-objeto">
        <h2 id="aviso-objeto">Objeto</h2>
        <p>
          Este sitio presenta el diseño, el desarrollo y la evolución de software, plataformas
          digitales y aplicaciones, y sirve para solicitar una conversación sobre un proyecto.
        </p>
        <p>
          No hay una sociedad mercantil constituida. De la web y de la actividad responde{' '}
          {owner.name}, persona física, titular del signo distintivo {owner.sign}.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="aviso-propiedad">
        <h2 id="aviso-propiedad">Propiedad intelectual e industrial</h2>
        <p>
          Los textos, el diseño, el código de este sitio y el signo {owner.sign} corresponden a{' '}
          {owner.name}, salvo que se indique otra titularidad. Queda reservada su reproducción y
          cualquier uso comercial no autorizado.
        </p>
        <p>
          Las fuentes Manrope y Syne se usan bajo la licencia SIL Open Font License. El texto de la
          licencia está en <a href="/fonts/OFL-Manrope.txt">OFL-Manrope.txt</a> y en{' '}
          <a href="/fonts/OFL-Syne.txt">OFL-Syne.txt</a>.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="aviso-uso">
        <h2 id="aviso-uso">Uso del sitio</h2>
        <p>
          La información publicada es general. Un encargo existe solo cuando las dos partes lo
          acuerdan. Visitar el sitio no obliga a contratar.
        </p>
        <p>
          Queda reservado cualquier uso que impida el funcionamiento del sitio, intente acceder a
          lo que no es público o lo emplee para una actividad ilícita.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="aviso-responsabilidad">
        <h2 id="aviso-responsabilidad">Responsabilidad</h2>
        <p>
          El contenido se mantiene con cuidado y puede cambiar. Los enlaces que salen de este sitio
          tienen su propio titular. {owner.name} no responde de esas páginas ni de las
          interrupciones ajenas a su control.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="aviso-ley">
        <h2 id="aviso-ley">Ley aplicable</h2>
        <p>
          Se aplica la ley española. Si quien contrata es una persona consumidora, se respetan las
          normas imperativas sobre el juzgado que le corresponde. En los demás casos conocen los
          juzgados del domicilio del titular.
        </p>
        <p>
          El tratamiento de los datos personales está en la <a href="/privacidad">privacidad</a>.
        </p>
      </section>

      <p className="legal-updated">Última actualización: {owner.updatedLabel}.</p>
    </>
  )
}

function Privacidad() {
  return (
    <>
      <p className="eyebrow">Solunit</p>
      <h1 id="legal-title" tabIndex={-1}>
        Privacidad
      </h1>
      <p className="legal-lead">
        Qué datos se tratan al usar este sitio, para qué y cómo ejercer tus derechos. Reglamento
        (UE) 2016/679 y Ley Orgánica 3/2018.
      </p>
      <Identity />

      <section className="legal-section" aria-labelledby="priv-datos">
        <h2 id="priv-datos">Datos que se tratan</h2>
        <p>
          El formulario pide el nombre, el email, el mensaje y, si lo indicas, la empresa. Son
          datos que escribes tú. Darlos es voluntario. Sin nombre, email y mensaje no hay forma de
          responder.
        </p>
        <p>
          Al visitar el sitio, el alojamiento puede registrar la dirección IP, la fecha, la hora y
          el identificador del navegador. Sirven para entregar la página y protegerla.
        </p>
        <p>
          No se piden datos de categorías especiales. No se elaboran perfiles y no hay decisiones
          automatizadas.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="priv-envio">
        <h2 id="priv-envio">Cómo viaja el mensaje</h2>
        <p>
          El formulario no envía los datos a un servidor de {owner.sign}. Al pulsar «Abrir en el
          correo», el navegador abre tu aplicación de correo con el texto ya escrito. El envío lo
          haces tú desde esa aplicación. Si no tienes un correo configurado, el mensaje no sale y
          en esta web no queda copia. «Copiar mensaje» deja ese mismo texto en el portapapeles de
          tu dispositivo, no en esta web.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="priv-fin">
        <h2 id="priv-fin">Finalidad y base jurídica</h2>
        <p>
          La consulta se usa para responderte y, si hay encaje, preparar una conversación sobre el
          proyecto. La base es el artículo 6.1.b del Reglamento: nos pides medidas previas a un
          posible encargo.
        </p>
        <p>
          Los datos técnicos de la conexión se usan para prestar el sitio y mantener su seguridad.
          La base es el artículo 6.1.f, interés legítimo. Puedes oponerte cuando la norma lo
          permite.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="priv-dest">
        <h2 id="priv-dest">Destinatarios</h2>
        <p>
          Los datos de la consulta no se ceden a terceros para que los usen por su cuenta. Al
          enviar el correo intervienen tu proveedor de correo y la cuenta <Mail />, que gestiona el
          responsable.
        </p>
        <p>
          El sitio está alojado en Vercel Inc. (Estados Unidos). Ese proveedor puede tratar los
          registros técnicos de conexión, también fuera del Espacio Económico Europeo. Su
          información está en{' '}
          <a href="https://vercel.com/legal/privacy-policy">vercel.com/legal/privacy-policy</a>.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="priv-plazo">
        <h2 id="priv-plazo">Conservación</h2>
        <p>
          La correspondencia se conserva mientras se atiende la consulta. Si no hay un encargo,
          puedes pedir que se borre al terminar la conversación. Si hay una relación profesional,
          se conserva el tiempo que exijan las obligaciones legales que correspondan.
        </p>
        <p>Los registros técnicos siguen el plazo del proveedor de alojamiento.</p>
      </section>

      <section className="legal-section" aria-labelledby="priv-derechos">
        <h2 id="priv-derechos">Derechos</h2>
        <p>
          Puedes pedir acceso, rectificación, supresión, oposición, limitación del tratamiento y
          portabilidad. Escribe a <Mail /> e indica qué derecho ejerces. Si hace falta comprobar
          que la petición es tuya, se pedirá una acreditación mínima.
        </p>
        <p>
          También puedes reclamar ante la Agencia Española de Protección de Datos, en{' '}
          <a href="https://www.aepd.es">aepd.es</a>.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="priv-menores">
        <h2 id="priv-menores">Menores</h2>
        <p>
          El sitio se dirige a empresas y profesionales. No se recaban a sabiendas datos de menores
          de 14 años. Si detectas un caso, escribe a <Mail /> y se suprimirá.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="priv-cookies">
        <h2 id="priv-cookies">Cookies</h2>
        <p>
          Esta web no instala cookies de análisis, publicidad ni seguimiento, y no usa herramientas
          de medición. No hay un panel de consentimiento porque no se usan cookies de ese tipo.
        </p>
      </section>

      <section className="legal-section" aria-labelledby="priv-cambios">
        <h2 id="priv-cambios">Cambios</h2>
        <p>
          Si esta política cambia, la versión nueva se publicará en esta misma dirección, con su
          fecha. La identidad del titular y las condiciones del sitio están en el{' '}
          <a href="/aviso-legal">aviso legal</a>.
        </p>
      </section>

      <p className="legal-updated">Última actualización: {owner.updatedLabel}.</p>
    </>
  )
}

export default function LegalPage({ page }: { page: Extract<PageId, 'aviso-legal' | 'privacidad'> }) {
  return (
    <article className="legal-page site-shell" aria-labelledby="legal-title">
      <div className="legal-wrap">{page === 'aviso-legal' ? <AvisoLegal /> : <Privacidad />}</div>
    </article>
  )
}
