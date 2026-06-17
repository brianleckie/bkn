import Reveal from '../Reveal'

export default function Nosotros() {
  return (
    <section
      style={{
        padding: '72px 24px',
        background: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 200,
          letterSpacing: 14,
          color: 'rgba(240,237,232,0.018)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        BKN
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 44,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Reveal>
          <div
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 9,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#B8996A',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ width: 22, height: 1, background: '#B8996A', display: 'inline-block' }} />
            Quiénes somos
          </div>
          <div
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(46px, 12vw, 72px)',
              letterSpacing: 2,
              lineHeight: 0.88,
              color: '#F0EDE8',
              marginBottom: 26,
            }}
          >
            ARTE Y <span className="bkn-outline">PRECI</span>SIÓN
          </div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'rgba(240,237,232,0.42)',
              marginBottom: 26,
              letterSpacing: 0.3,
              maxWidth: 420,
            }}
          >
            Dos barberos, un estándar. BKN nació con la convicción de que cada corte es una obra. Técnica moderna, respeto por el oficio tradicional, y la agenda siempre organizada para que tu tiempo valga.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Fade & Degradé', 'Barba Clásica', 'Navaja Tradicional', '2 Barberos'].map(tag => (
              <span
                key={tag}
                style={{
                  padding: '7px 14px',
                  border: '1px solid rgba(184,153,106,0.25)',
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 8,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: 'rgba(184,153,106,0.65)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              background: '#111111',
              border: '1px solid rgba(200,200,200,0.08)',
              borderTop: '2px solid #B8996A',
              padding: 28,
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.85,
                color: 'rgba(240,237,232,0.58)',
                margin: '0 0 22px',
                letterSpacing: 0.2,
              }}
            >
              "En BKN no hacemos cortes en serie. Cada cliente tiene su estilo y nos tomamos el tiempo para encontrarlo. Por eso la gente vuelve."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <img
                src="/bkn-logo.jpg"
                alt="BKN"
                style={{
                  width: 42,
                  height: 42,
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: 18,
                    letterSpacing: 3,
                    color: '#F0EDE8',
                  }}
                >
                  EQUIPO BKN
                </div>
                <div
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 8,
                    letterSpacing: 1,
                    color: '#666',
                  }}
                >
                  Encarnación, Paraguay
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
