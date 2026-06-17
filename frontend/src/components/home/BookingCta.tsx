import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

export default function BookingCta() {
  return (
    <section id="bkn-turnos" style={{ padding: '72px 24px', background: '#0A0A0A' }}>
      <Reveal>
        <div
          style={{
            maxWidth: 780,
            margin: '0 auto',
            border: '1px solid rgba(200,200,200,0.12)',
            background: 'linear-gradient(160deg,#151515,#0b0b0b)',
            padding: 'clamp(34px,7vw,58px) clamp(24px,6vw,52px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '-3%',
              transform: 'translateY(-50%)',
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(180px,40vw,300px)',
              lineHeight: 0.8,
              letterSpacing: 6,
              color: 'rgba(184,153,106,0.035)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            BKN
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 9,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#B8996A',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ width: 22, height: 1, background: '#B8996A', display: 'inline-block' }} />
              Reserva online · sin filas
            </div>

            <div
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(52px,13vw,92px)',
                letterSpacing: 2,
                lineHeight: 0.88,
                color: '#F0EDE8',
                marginBottom: 18,
              }}
            >
              AGENDÁ
              <br />
              TU <span className="bkn-outline">TURNO</span>
            </div>

            <p
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(240,237,232,0.5)',
                lineHeight: 1.8,
                maxWidth: 430,
                margin: '0 0 30px',
                letterSpacing: 0.2,
              }}
            >
              Elegís tu barbero, mirás su agenda en tiempo real y reservás el servicio que querés. Te confirmamos por WhatsApp.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 34 }}>
              {[
                { n: '01', label: 'Elegí tu barbero' },
                { n: '02', label: 'Fecha y hora libre' },
                { n: '03', label: 'Tu servicio' },
              ].map(step => (
                <div
                  key={step.n}
                  style={{
                    flex: 1,
                    minWidth: 130,
                    borderTop: '1px solid rgba(200,200,200,0.14)',
                    paddingTop: 13,
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: 15,
                      letterSpacing: 1,
                      color: '#B8996A',
                      lineHeight: 1,
                    }}
                  >
                    {step.n}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(240,237,232,0.72)', marginTop: 5 }}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/agendar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 40px',
                background: '#B8996A',
                color: '#0A0A0A',
                fontFamily: '"DM Mono", monospace',
                fontSize: 11,
                letterSpacing: 2.5,
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Reservar cita →
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
