import { Link } from 'react-router-dom'
import type { Barber, Service } from '../../lib/api'

const WK_SHORT = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']
const MONTHS_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']

interface Props {
  barber: Barber
  selectedDate: string
  selectedTime: string
  service: Service
  clientName: string
}

export default function DoneScreen({ barber, selectedDate, selectedTime, service, clientName }: Props) {
  const d = new Date(selectedDate + 'T00:00:00')
  const dateLabel = `${WK_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`

  const waText = encodeURIComponent(
    `Hola BKN! Confirmé mi turno:\nBarbero: ${barber.name}\nFecha: ${dateLabel} a las ${selectedTime} hs\nServicio: ${service.name}\nNombre: ${clientName}`
  )

  const rows = [
    { k: 'Barbero',  v: barber.name },
    { k: 'Fecha',    v: dateLabel },
    { k: 'Hora',     v: selectedTime + ' hs' },
    { k: 'Servicio', v: service.name },
  ]

  return (
    <div className="anim-bkn-fade" style={{ textAlign: 'center', padding: '30px 10px 0' }}>
      {/* Check circle */}
      <div
        style={{
          width: 60,
          height: 60,
          border: '1px solid #B8996A',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 22px',
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 32,
          color: '#B8996A',
        }}
      >
        ✓
      </div>

      <div
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 34,
          letterSpacing: 2,
          color: '#F0EDE8',
          marginBottom: 10,
        }}
      >
        ¡TURNO RESERVADO!
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 300,
          color: 'rgba(240,237,232,0.5)',
          lineHeight: 1.7,
          maxWidth: 320,
          margin: '0 auto 26px',
        }}
      >
        Te contactamos por WhatsApp para confirmar. Si surge un cambio te enviamos un link para reprogramar al instante.
      </div>

      {/* Summary */}
      <div
        style={{
          background: '#111111',
          border: '1px solid rgba(200,200,200,0.08)',
          textAlign: 'left',
          marginBottom: 24,
        }}
      >
        {rows.map(r => (
          <div
            key={r.k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              borderBottom: '1px solid rgba(200,200,200,0.06)',
            }}
          >
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 8.5,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: '#666',
              }}
            >
              {r.k}
            </span>
            <span style={{ fontSize: 13, fontWeight: 400, color: '#F0EDE8' }}>{r.v}</span>
          </div>
        ))}
      </div>

      <a
        href={`https://wa.me/595981000000?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: 16,
          background: '#25D366',
          color: '#0A0A0A',
          fontFamily: '"DM Mono", monospace',
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
          textDecoration: 'none',
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        Confirmar por WhatsApp
      </a>
      <Link
        to="/"
        style={{
          display: 'block',
          width: '100%',
          padding: 14,
          background: 'transparent',
          color: 'rgba(240,237,232,0.5)',
          fontFamily: '"DM Mono", monospace',
          fontSize: 9,
          letterSpacing: 2,
          textTransform: 'uppercase',
          textDecoration: 'none',
          border: '1px solid rgba(200,200,200,0.12)',
        }}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
