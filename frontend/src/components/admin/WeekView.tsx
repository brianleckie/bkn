import type { Appointment } from '../../lib/api'

const pad = (n: number) => String(n).padStart(2, '0')
const fmtTime = (iso: string) => iso.substring(11, 16)
const WK_SHORT = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']

interface Props {
  appts: Appointment[]
  barberFilter: string
  onOpenModal: (id: string) => void
}

export default function WeekView({ appts, barberFilter, onOpenModal }: Props) {
  const today = new Date()
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const todayStr = today.toISOString().split('T')[0]

  const weekDays: Date[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + mondayOffset + i)
    weekDays.push(d)
  }

  const filtered = (list: Appointment[]) =>
    barberFilter === 'all' ? list : list.filter(a => a.barber_id === barberFilter)

  return (
    <div className="bkn-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 6 }}>
      {weekDays.map(d => {
        const ds = d.toISOString().split('T')[0]
        const isToday = ds === todayStr
        const list = filtered(
          appts.filter(a => a.start_datetime.startsWith(ds) && a.status !== 'cancelled')
        ).sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))
        const pct = Math.round((list.length / 10) * 100)

        return (
          <div
            key={ds}
            style={{
              flex: '1 0 158px',
              minWidth: 158,
              background: '#111111',
              border: '1px solid rgba(200,200,200,0.08)',
            }}
          >
            {/* Day header */}
            <div
              style={{
                padding: 12,
                borderBottom: '1px solid rgba(200,200,200,0.08)',
                background: isToday ? 'rgba(184,153,106,0.1)' : '#141414',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: 1.5, color: 'rgba(240,237,232,0.6)' }}>
                  {WK_SHORT[d.getDay()]}
                </span>
                <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, color: '#F0EDE8', lineHeight: 1 }}>
                  {d.getDate()}
                </span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 7, letterSpacing: 1, color: '#B8996A', marginTop: 4 }}>
                {list.length} turnos · {pct}%
              </div>
            </div>

            {/* Appointments */}
            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 5, minHeight: 120 }}>
              {list.length === 0 ? (
                <div
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 8,
                    letterSpacing: 1,
                    color: 'rgba(240,237,232,0.2)',
                    textAlign: 'center',
                    paddingTop: 24,
                  }}
                >
                  Sin turnos
                </div>
              ) : (
                list.map(a => (
                  <div
                    key={a.id}
                    onClick={() => onOpenModal(a.id)}
                    style={{
                      padding: '7px 8px',
                      background: 'rgba(184,153,106,0.08)',
                      borderLeft: '2px solid #B8996A',
                      cursor: 'pointer',
                      transition: 'background .15s',
                    }}
                  >
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, color: '#B8996A', letterSpacing: 0.5 }}>
                      {fmtTime(a.start_datetime)}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: 10,
                        fontWeight: 500,
                        color: '#F0EDE8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {a.client_name}
                    </div>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 7, color: 'rgba(240,237,232,0.4)' }}>
                      {a.barber_name ?? ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
