import Reveal from '../Reveal'

const INFO = [
  { icon: '📍', label: 'Dirección',  value: 'Encarnación, Paraguay' },
  { icon: '🕐', label: 'Horarios',   value: 'Lunes a Sábado · 9:00 – 19:00' },
  { icon: '📱', label: 'WhatsApp',   value: '+595 981 000 000' },
  { icon: '📸', label: 'Instagram',  value: '@bkn.barbershop' },
]

export default function Contacto() {
  return (
    <section id="contacto" style={{ padding: '72px 24px', background: '#111111' }}>
      <Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 44,
          }}
        >
          {/* Left */}
          <div>
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
              Encontranos
            </div>
            <div
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(46px, 12vw, 72px)',
                letterSpacing: 2,
                lineHeight: 0.9,
                color: '#F0EDE8',
                marginBottom: 24,
              }}
            >
              CON<span className="bkn-outline">TACTO</span>
            </div>
            <a
              href="https://wa.me/595981000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                width: '100%',
                padding: 17,
                background: '#1A1A1A',
                color: '#25D366',
                fontFamily: '"DM Mono", monospace',
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: '1px solid rgba(37,211,102,0.22)',
              }}
            >
              Escribinos por WhatsApp
            </a>
          </div>

          {/* Right */}
          <div>
            {INFO.map((item, idx) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 0',
                  borderBottom: idx < INFO.length - 1 ? '1px solid rgba(200,200,200,0.08)' : undefined,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: '#1A1A1A',
                    border: '1px solid rgba(200,200,200,0.08)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: 8,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                      color: '#B8996A',
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 300, color: 'rgba(240,237,232,0.7)' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
