import type { Service } from '../../lib/api'

interface Props {
  services: Service[]
  selected: number | null
  onSelect: (idx: number) => void
}

export default function ServiceStep({ services, selected, onSelect }: Props) {
  return (
    <div className="anim-bkn-fade" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {services.map((s, i) => {
        const sel = selected === i
        const price = (parseFloat(s.price) / 1000).toFixed(0) + 'K'
        return (
          <div
            key={s.id}
            onClick={() => onSelect(i)}
            style={{
              padding: 16,
              background: sel ? '#161616' : '#111111',
              border: `1px solid ${sel ? '#B8996A' : 'rgba(200,200,200,0.08)'}`,
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Radio circle */}
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `1px solid ${sel ? '#B8996A' : 'rgba(200,200,200,0.22)'}`,
                  background: sel
                    ? `radial-gradient(circle at center,#B8996A 0 40%,transparent 46%)`
                    : 'transparent',
                  transition: 'all .2s',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: 20,
                    letterSpacing: 2,
                    color: '#F0EDE8',
                    marginBottom: 2,
                  }}
                >
                  {s.name}
                </div>
                <div style={{ fontSize: 11, fontWeight: 300, color: '#666', lineHeight: 1.4 }}>
                  {s.description ?? ''}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: 22,
                    letterSpacing: 1,
                    color: '#B8996A',
                    lineHeight: 1,
                  }}
                >
                  {price}
                </div>
                <div
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 8,
                    letterSpacing: 1,
                    color: '#666',
                    marginTop: 4,
                  }}
                >
                  {s.duration_minutes} MIN
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
