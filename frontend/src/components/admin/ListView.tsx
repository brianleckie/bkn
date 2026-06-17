import type { Appointment } from '../../lib/api'

const pad = (n: number) => String(n).padStart(2, '0')
const fmtTime = (iso: string) => iso.substring(11, 16)
const WK_SHORT = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']

interface Props {
  appts: Appointment[]
  barberFilter: string
  onOpenModal: (id: string) => void
}

export default function ListView({ appts, barberFilter, onOpenModal }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const filtered = appts
    .filter(a => a.start_datetime >= today && a.status !== 'cancelled')
    .filter(a => barberFilter === 'all' || a.barber_id === barberFilter)
    .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))

  if (filtered.length === 0) {
    return (
      <div
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 9,
          letterSpacing: 1,
          color: 'rgba(240,237,232,0.3)',
          textAlign: 'center',
          padding: 40,
        }}
      >
        Sin turnos próximos
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
      {filtered.map(a => {
        const d = new Date(a.start_datetime)
        const dateLabel = `${WK_SHORT[d.getDay()]} ${pad(d.getDate())}`
        const price = a.service_price ? parseFloat(a.service_price).toLocaleString('es-PY') + ' Gs' : '—'

        return (
          <div
            key={a.id}
            onClick={() => onOpenModal(a.id)}
            style={{
              background: '#111111',
              border: '1px solid rgba(200,200,200,0.08)',
              padding: 16,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'border-color .15s',
            }}
          >
            {/* Time block */}
            <div
              style={{
                textAlign: 'center',
                flexShrink: 0,
                borderRight: '1px solid rgba(200,200,200,0.08)',
                paddingRight: 14,
              }}
            >
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 1, color: '#666' }}>{dateLabel}</div>
              <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 24, letterSpacing: 1, color: '#B8996A', lineHeight: 1.1 }}>
                {fmtTime(a.start_datetime)}
              </div>
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#F0EDE8',
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {a.client_name}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 0.5, color: 'rgba(240,237,232,0.45)' }}>
                {a.service_name ?? ''} · {a.barber_name ?? ''}
              </div>
            </div>

            {/* Price */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, color: '#F0EDE8' }}>{price}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', color: '#B8996A' }}>
                Confirmado
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
