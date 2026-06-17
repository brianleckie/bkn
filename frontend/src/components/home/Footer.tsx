export default function Footer() {
  return (
    <footer
      style={{
        background: '#0A0A0A',
        borderTop: '1px solid rgba(200,200,200,0.08)',
        padding: '44px 24px',
        textAlign: 'center',
      }}
    >
      <img
        src="/bkn-logo.jpg"
        alt="BKN"
        style={{
          width: 52,
          height: 52,
          objectFit: 'contain',
          mixBlendMode: 'screen',
          margin: '0 auto 14px',
          display: 'block',
        }}
      />
      <div
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 24,
          letterSpacing: 8,
          color: '#F0EDE8',
          marginBottom: 8,
          paddingLeft: 8,
        }}
      >
        BKN
      </div>
      <div
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 8,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#666',
          marginBottom: 8,
        }}
      >
        Premium Barbershop · Encarnación, Paraguay
      </div>
      <div
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 8,
          letterSpacing: 1,
          color: 'rgba(102,102,102,0.4)',
        }}
      >
        © 2026 BKN Barbershop — Todos los derechos reservados
      </div>
    </footer>
  )
}
