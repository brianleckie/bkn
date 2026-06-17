import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '106px 16px 40px',
        minHeight: '84vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#0A0A0A',
      }}
    >
      {/* top hairline */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          height: 1,
          background: 'rgba(200,200,200,0.22)',
        }}
      />

      <Reveal style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo + tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: 36,
          }}
        >
          <img
            src="/bkn-logo.jpg"
            alt="BKN"
            style={{
              width: 58,
              height: 58,
              objectFit: 'contain',
              mixBlendMode: 'screen',
              opacity: 0.95,
            }}
          />
          <div
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 9,
              letterSpacing: 5,
              color: '#C9A86F',
              marginTop: 14,
            }}
          >
            PREMIUM BARBERSHOP · ENCARNACIÓN
          </div>
          <div
            style={{
              width: 1,
              height: 26,
              background: 'linear-gradient(#C9A86F, transparent)',
              marginTop: 14,
            }}
          />
        </div>

        {/* Main title */}
        <h1
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(96px, 28vw, 204px)',
            lineHeight: 0.78,
            letterSpacing: 0,
            color: '#F0EDE8',
            margin: '0 0 0 -4px',
          }}
        >
          BARBER
          <br />
          SHOP<span style={{ color: '#B8996A' }}>.</span>
        </h1>

        {/* Separator */}
        <div
          style={{
            height: 1,
            background: 'rgba(200,200,200,0.16)',
            margin: '26px 0 22px',
          }}
        />

        {/* Subtitle row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: 'rgba(240,237,232,0.5)',
              maxWidth: 280,
              margin: 0,
              lineHeight: 1.85,
              letterSpacing: 0.2,
            }}
          >
            Cortes de precisión. Barba a navaja. Sistema de reservas sin filas ni esperas.
          </p>
          <div
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 10,
              letterSpacing: 1,
              color: '#C8C8C8',
              lineHeight: 1.9,
              textAlign: 'right',
            }}
          >
            [01] CORTES
            <br />
            [02] BARBA
            <br />
            [03] AFEITADO
            <br />
            [04] DISEÑO
          </div>
        </div>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            marginTop: 32,
            border: '1px solid rgba(200,200,200,0.25)',
          }}
        >
          <Link
            to="/agendar"
            style={{
              flex: 1,
              padding: 17,
              background: '#B8996A',
              color: '#0A0A0A',
              fontFamily: '"DM Mono", monospace',
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Reservar →
          </Link>
          <a
            href="#bkn-servicios"
            style={{
              flex: 1,
              padding: 17,
              background: 'transparent',
              color: '#C8C8C8',
              fontFamily: '"DM Mono", monospace',
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
              borderLeft: '1px solid rgba(200,200,200,0.25)',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Servicios
          </a>
        </div>
      </Reveal>
    </section>
  )
}
