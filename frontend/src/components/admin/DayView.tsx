import type { Appointment } from '../../lib/api'

const pad = (n: number) => String(n).padStart(2, '0')
const fmtTime = (iso: string) => iso.substring(11, 16)

const WK_SHORT = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']
const MONTHS_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']

const SLOTS: string[] = []
for (let h = 9; h < 19; h++) SLOTS.push(`${pad(h)}:00`)

interface Props {
  appts: Appointment[]
  barberFilter: string
  onOpenModal: (id: string) => void
}

export default function DayView({ appts, barberFilter, onOpenModal }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const d = new Date(today + 'T00:00:00')
  const todayLabel = `${WK_SHORT[d.getDay()]} ${pad(d.getDate())} ${MONTHS_SHORT[d.getMonth()]} · AGENDA DEL DÍA`

  const now = new Date()
  const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`

  const todayAppts = appts.filter(
    a => a.start_datetime.startsWith(today) && a.status !== 'cancelled'
  )
  const apptMap: Record<string, Appointment> = {}
  todayAppts.forEach(a => { apptMap[fmtTime(a.start_datetime)] = a })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 9,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.6)',
          }}
        >
          {todayLabel}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {SLOTS.map(t => {
          const appt = apptMap[t]
          const matches = !appt || barberFilter === 'all' || appt.barber_id === barberFilter
          const booked = !!appt && matches
          const muted = !!appt && !matches
          const isNow = t === nowStr.substring(0, 5)

          const timeStyle: React.CSSProperties = {
            width: 54,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
            letterSpacing: 0.5,
            border: '1px solid rgba(200,200,200,0.08)',
            color: isNow ? '#B8996A' : '#666',
            ...(isNow ? { borderColor: 'rgba(184,153,106,0.4)' } : {}),
          }

          let barStyle: React.CSSProperties = {
            flex: 1,
            minWidth: 0,
            padding: '12px 14px',
            border: '1px solid rgba(200,200,200,0.08)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all .18s',
          }
          if (booked) {
            barStyle = { ...barStyle, background: 'rgba(184,153,106,0.08)', borderLeft: '2px solid #B8996A', cursor: 'pointer' }
          } else if (muted) {
            barStyle = { ...barStyle, background: '#0C0C0C', opacity: 0.5 }
          } else {
            barStyle = { ...barStyle, background: '#0E0E0E' }
          }

          return (
            <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
              <div style={timeStyle}>{t}</div>
              <div
                style={barStyle}
                onClick={() => booked && appt && onOpenModal(appt.id)}
              >
                {booked && appt ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 500, color: '#F0EDE8', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {appt.client_name}
                      </div>
                      <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 0.5, color: 'rgba(240,237,232,0.45)' }}>
                        {appt.service_name ?? ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 1, color: '#B8996A' }}>{appt.barber_name ?? ''}</div>
                        <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: 1, color: '#F0EDE8' }}>
                          {appt.service_price ? (parseFloat(appt.service_price) / 1000).toFixed(0) + 'K' : ''}
                        </div>
                      </div>
                      <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 15, color: 'rgba(184,153,106,0.55)' }}>›</span>
                    </div>
                  </div>
                ) : muted ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: 1, color: 'rgba(240,237,232,0.28)' }}>Ocupado · otro barbero</span>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, color: 'rgba(240,237,232,0.3)' }}>{appt?.barber_name ?? ''}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: 1, color: 'rgba(240,237,232,0.28)' }}>Disponible</span>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 13, color: 'rgba(184,153,106,0.5)' }}>+</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
