import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(200,200,200,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="/bkn-logo.jpg"
          alt="BKN"
          style={{ width: 34, height: 34, objectFit: 'contain', mixBlendMode: 'screen' }}
        />
        <span
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 22,
            letterSpacing: 6,
            color: '#F0EDE8',
            paddingLeft: 3,
          }}
        >
          BKN
        </span>
      </div>
      <Link
        to="/agendar"
        style={{
          background: '#B8996A',
          color: '#0A0A0A',
          fontFamily: '"DM Mono", monospace',
          fontSize: 9,
          letterSpacing: 2,
          textTransform: 'uppercase',
          padding: '9px 16px',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Reservar
      </Link>
    </nav>
  )
}
