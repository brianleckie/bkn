import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBarbers, getServices, type Barber, type Service } from '../lib/api'
import Stepper from '../components/agendar/Stepper'
import BarberStep from '../components/agendar/BarberStep'
import DateTimeStep from '../components/agendar/DateTimeStep'
import ServiceStep from '../components/agendar/ServiceStep'
import ConfirmStep from '../components/agendar/ConfirmStep'
import DoneScreen from '../components/agendar/DoneScreen'

const DEMO_BARBERS: Barber[] = [
  { id: 'demo-1', name: 'Marco',  slug: 'marco',  bio: 'Cortes de precisión, fades y diseño a mano alzada.', profile_image_url: null, is_active: true, display_order: 1 },
  { id: 'demo-2', name: 'Andrés', slug: 'andres', bio: 'Barba a navaja, afeitado clásico y perfilado.',      profile_image_url: null, is_active: true, display_order: 2 },
]
const DEMO_SERVICES: Service[] = [
  { id: 'demo-1', name: 'Corte Clásico',   description: 'Tijera y máquina. Lavado y peinado.',    price: '60000', duration_minutes: 60, image_url: null, is_active: true, display_order: 1 },
  { id: 'demo-2', name: 'Perfilado Barba', description: 'Diseño y perfilado con navaja.',          price: '40000', duration_minutes: 60, image_url: null, is_active: true, display_order: 2 },
  { id: 'demo-3', name: 'Combo Completo',  description: 'Corte + barba + tratamiento.',            price: '90000', duration_minutes: 60, image_url: null, is_active: true, display_order: 3 },
  { id: 'demo-4', name: 'Afeitado Clásico',description: 'Navaja, toalla caliente y bálsamo.',      price: '50000', duration_minutes: 60, image_url: null, is_active: true, display_order: 4 },
  { id: 'demo-5', name: 'Diseño & Líneas', description: 'Freestyle, líneas y detalles.',           price: '70000', duration_minutes: 60, image_url: null, is_active: true, display_order: 5 },
]

const TITLES: Record<number, string> = {
  1: 'ELEGÍ TU BARBERO',
  2: 'ELEGÍ FECHA Y HORA',
  3: 'ELEGÍ EL SERVICIO',
  4: 'CONFIRMÁ TU TURNO',
}
const NEXT_LABELS: Record<number, string> = {
  1: 'Elegí fecha y hora →',
  2: 'Elegí el servicio →',
  3: 'Revisar y confirmar →',
}

export default function Agendar() {
  const [step, setStep] = useState(1)
  const [barber, setBarber] = useState<Barber | null>(null)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [serviceIdx, setServiceIdx] = useState<number | null>(null)
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)

  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    Promise.all([getBarbers(), getServices()])
      .then(([b, s]) => {
        setBarbers(Array.isArray(b) && b.length ? b : DEMO_BARBERS)
        setServices(Array.isArray(s) && s.length ? s : DEMO_SERVICES)
        if (!Array.isArray(b) || !b.length) setIsDemo(true)
      })
      .catch(() => {
        setBarbers(DEMO_BARBERS)
        setServices(DEMO_SERVICES)
        setIsDemo(true)
      })
  }, [])

  const canContinue = () => {
    if (step === 1) return !!barber
    if (step === 2) return !!selectedDate && !!selectedTime
    if (step === 3) return serviceIdx !== null
    return false
  }

  const goNext = () => {
    if (canContinue()) { setStep(s => s + 1); window.scrollTo(0, 0) }
  }
  const goBack = () => {
    if (step > 1) { setStep(s => s - 1); window.scrollTo(0, 0) }
  }

  const selectBarber = (b: Barber) => {
    setBarber(b)
    setSelectedTime(null)
    setSelectedDate(null)
  }

  const ok = canContinue()

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', color: '#F0EDE8' }}>
      {/* Top bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(200,200,200,0.08)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: 'rgba(240,237,232,0.6)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 9,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          ‹ Volver
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img
            src="/bkn-logo.jpg"
            alt="BKN"
            style={{ width: 30, height: 30, objectFit: 'contain', mixBlendMode: 'screen' }}
          />
          <span
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 20,
              letterSpacing: 5,
              color: '#F0EDE8',
              paddingLeft: 2,
            }}
          >
            BKN
          </span>
        </div>
        <div style={{ width: 54 }} />
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '26px 22px 160px' }}>
        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 9,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#B8996A',
              marginBottom: 10,
            }}
          >
            Reservá tu cita
          </div>
          <div
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(40px, 11vw, 58px)',
              letterSpacing: 2,
              lineHeight: 0.9,
              color: '#F0EDE8',
            }}
          >
            {TITLES[step]}
          </div>
        </div>

        <Stepper step={step} />

        {/* Panels */}
        {!done && step === 1 && (
          <BarberStep barbers={barbers} selected={barber} onSelect={selectBarber} />
        )}
        {!done && step === 2 && barber && (
          <DateTimeStep
            barber={barber}
            monthOffset={monthOffset}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onChangeBarber={() => { setStep(1); window.scrollTo(0, 0) }}
            onMonthPrev={() => setMonthOffset(o => o - 1)}
            onMonthNext={() => setMonthOffset(o => o + 1)}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />
        )}
        {!done && step === 3 && (
          <ServiceStep services={services} selected={serviceIdx} onSelect={setServiceIdx} />
        )}
        {!done && step === 4 && barber && selectedDate && selectedTime && serviceIdx !== null && (
          <ConfirmStep
            barber={barber}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            service={services[serviceIdx]}
            clientName={clientName}
            phone={phone}
            onNameChange={setClientName}
            onPhoneChange={setPhone}
            onDone={() => setDone(true)}
            isDemo={isDemo}
          />
        )}
        {done && barber && selectedDate && selectedTime && serviceIdx !== null && (
          <DoneScreen
            barber={barber}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            service={services[serviceIdx]}
            clientName={clientName}
          />
        )}
      </div>

      {/* Sticky nav (steps 1-3 only) */}
      {!done && step < 4 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            background: 'linear-gradient(transparent,#0A0A0A 26%)',
            padding: '30px 22px 22px',
          }}
        >
          <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', gap: 10 }}>
            {step > 1 && (
              <button
                onClick={goBack}
                style={{
                  padding: '16px 22px',
                  background: '#141414',
                  border: '1px solid rgba(200,200,200,0.16)',
                  color: '#C8C8C8',
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                ‹ Atrás
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!ok}
              style={{
                flex: 1,
                padding: 16,
                fontFamily: '"DM Mono", monospace',
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                border: 'none',
                fontWeight: 500,
                background: ok ? '#B8996A' : '#1A1A1A',
                color: ok ? '#0A0A0A' : 'rgba(240,237,232,0.25)',
                cursor: ok ? 'pointer' : 'not-allowed',
              }}
            >
              {NEXT_LABELS[step]}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
