import type { Appointment } from '../../lib/api'

const pad = (n: number) => String(n).padStart(2, '0')
const fmtTime = (iso: string) => iso.substring(11, 16)

interface Props {
  appts: Appointment[]
}

export default function KpiStrip({ appts }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const nowH = `${pad(now.getHours())}:${pad(now.getMinutes())}`

  const todayAppts = appts.filter(
    a => a.start_datetime.startsWith(today) && a.status !== 'cancelled'
  )
  const ingresos = todayAppts.reduce((s, a) => s + (parseFloat(a.service_price ?? '0') || 0), 0)
  const totalSlots = 10
  const occ = Math.round((todayAppts.length / totalSlots) * 100)
  const nextAppt = [...todayAppts]
    .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))
    .find(a => fmtTime(a.start_datetime) > nowH.substring(0, 5))

  const kpis = [
    { label: 'Turnos hoy',   value: String(todayAppts.length),                             sub: 'turnos activos' },
    { label: 'Ocupación',    value: occ + '%',                                              sub: totalSlots + ' franjas diarias' },
    { label: 'Ingresos est.',value: ingresos > 0 ? ingresos.toLocaleString('es-PY') + ' Gs' : '—', sub: 'hoy' },
    { label: 'Próximo',      value: nextAppt ? fmtTime(nextAppt.start_datetime) : '—',     sub: nextAppt ? nextAppt.client_name : 'Sin pendientes' },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 8,
        marginBottom: 24,
      }}
    >
      {kpis.map(k => (
        <div
          key={k.label}
          style={{
            background: '#111111',
            border: '1px solid rgba(200,200,200,0.08)',
            padding: 18,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 2,
              height: '100%',
              background: '#B8996A',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: '#666',
              marginBottom: 10,
            }}
          >
            {k.label}
          </div>
          <div
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 36,
              letterSpacing: 1,
              color: '#B8996A',
              lineHeight: 1,
            }}
          >
            {k.value}
          </div>
          <div
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 8,
              letterSpacing: 1,
              color: 'rgba(240,237,232,0.4)',
              marginTop: 6,
            }}
          >
            {k.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
