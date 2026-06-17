import type { Barber } from '../../lib/api'

interface Props {
  barbers: Barber[]
  selected: Barber | null
  onSelect: (b: Barber) => void
}

export default function BarberStep({ barbers, selected, onSelect }: Props) {
  return (
    <div className="anim-bkn-fade" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {barbers.map(b => {
        const sel = selected?.id === b.id
        return (
          <div
            key={b.id}
            onClick={() => onSelect(b)}
            style={{
              padding: 16,
              background: sel ? '#161616' : '#111111',
              border: `1px solid ${sel ? '#B8996A' : 'rgba(200,200,200,0.08)'}`,
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {/* Photo */}
              <div
                style={{
                  width: 78,
                  height: 78,
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(155deg,#1c1c1c,#0d0d0d)',
                  border: '1px solid rgba(200,200,200,0.1)',
                }}
              >
                {b.profile_image_url ? (
                  <img
                    src={b.profile_image_url}
                    alt={b.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'repeating-linear-gradient(135deg,rgba(200,200,200,0.04) 0 1px,transparent 1px 9px)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        fontFamily: '"DM Mono", monospace',
                        fontSize: 7,
                        letterSpacing: 1,
                        color: 'rgba(184,153,106,0.5)',
                        textAlign: 'center',
                      }}
                    >
                      FOTO
                      <br />
                      {b.name.toUpperCase()}
                    </div>
                  </>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: 26,
                    letterSpacing: 2,
                    color: '#F0EDE8',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {b.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 300,
                    color: 'rgba(240,237,232,0.5)',
                    lineHeight: 1.5,
                  }}
                >
                  {b.bio ?? ''}
                </div>
                <div
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 8,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: '#B8996A',
                    marginTop: 8,
                  }}
                >
                  Disponible esta semana
                </div>
              </div>

              {/* Check circle */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  borderRadius: '50%',
                  border: `1px solid ${sel ? '#B8996A' : 'rgba(200,200,200,0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: 15,
                  color: sel ? '#0A0A0A' : 'transparent',
                  background: sel ? '#B8996A' : 'transparent',
                  transition: 'all .2s',
                }}
              >
                {sel ? '✓' : ''}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
