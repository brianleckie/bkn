const STEPS = [
  [1, 'Barbero'],
  [2, 'Fecha'],
  [3, 'Servicio'],
  [4, 'Listo'],
] as const

const pad = (n: number) => String(n).padStart(2, '0')

export default function Stepper({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 30 }}>
      {STEPS.map(([n, label]) => {
        const active = step === n
        const done = step > n
        const barColor = active || done ? '#B8996A' : 'rgba(200,200,200,0.12)'
        const numColor = active || done ? '#B8996A' : 'rgba(240,237,232,0.3)'
        const lblColor = active ? 'rgba(240,237,232,0.7)' : 'rgba(240,237,232,0.3)'
        return (
          <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div
              style={{
                height: 3,
                background: barColor,
                transition: 'background .3s',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 8,
                  letterSpacing: 1,
                  color: numColor,
                }}
              >
                {pad(n)}
              </span>
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 8,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: lblColor,
                }}
              >
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
