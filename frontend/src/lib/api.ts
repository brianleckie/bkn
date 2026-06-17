const API = (import.meta.env.VITE_API_URL as string) ?? ''

// ── Types ────────────────────────────────────────────────────────────────────

export interface Barber {
  id: string
  name: string
  slug: string
  bio: string | null
  profile_image_url: string | null
  is_active: boolean
  display_order: number
}

export interface Service {
  id: string
  name: string
  description: string | null
  price: string
  duration_minutes: number
  image_url: string | null
  is_active: boolean
  display_order: number
}

export interface AvailabilitySlot {
  start_datetime: string
  end_datetime: string
}

export interface AppointmentCreate {
  barber_id: string
  service_id: string
  client_name: string
  client_phone: string
  start_datetime: string
}

export interface Appointment {
  id: string
  barber_id: string
  service_id: string
  client_name: string
  client_phone: string
  client_email: string | null
  start_datetime: string
  end_datetime: string
  status: string
  notes: string | null
  barber_name?: string
  service_name?: string
  service_price?: string
}

export interface GalleryImage {
  id: string
  image_url: string
  title: string | null
  description: string | null
  display_order: number
}

export interface BlockedSlotCreate {
  barber_id: string | null
  start_datetime: string
  end_datetime: string
  reason: string | null
}

// ── Public endpoints ─────────────────────────────────────────────────────────

export const getBarbers = (): Promise<Barber[]> =>
  fetch(`${API}/api/v1/public/barbers`).then(r => r.json())

export const getServices = (): Promise<Service[]> =>
  fetch(`${API}/api/v1/public/services`).then(r => r.json())

export const getAvailability = (barberId: string, date: string): Promise<AvailabilitySlot[]> =>
  fetch(`${API}/api/v1/public/availability?barber_id=${barberId}&date=${date}`).then(r => r.json())

export const createAppointment = (data: AppointmentCreate): Promise<Response> =>
  fetch(`${API}/api/v1/public/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const getPublicGallery = (): Promise<GalleryImage[]> =>
  fetch(`${API}/api/v1/admin/gallery/public`).then(r => r.json())

// ── Auth ─────────────────────────────────────────────────────────────────────

export const login = async (email: string, password: string): Promise<string> => {
  const form = new FormData()
  form.append('username', email)
  form.append('password', password)
  const res = await fetch(`${API}/api/v1/auth/login`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Credenciales incorrectas')
  const data = await res.json()
  return data.access_token as string
}

export const getMe = (token: string): Promise<Response> =>
  fetch(`${API}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${token}` } })

// ── Admin helpers ─────────────────────────────────────────────────────────────

const adminFetch = (token: string, path: string, opts: RequestInit = {}): Promise<Response> =>
  fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
    },
  })

export const getAdminBarbers = (token: string): Promise<Barber[]> =>
  adminFetch(token, '/api/v1/admin/barbers').then(r => r.json())

export const getAdminAppointments = (token: string, dateFrom: string): Promise<Appointment[]> =>
  adminFetch(token, `/api/v1/admin/appointments?date_from=${dateFrom}`).then(r => r.json())

export const cancelAppointment = (token: string, id: string): Promise<Response> =>
  adminFetch(token, `/api/v1/admin/appointments/${id}`, { method: 'DELETE' })

export const createBlockedSlot = (token: string, data: BlockedSlotCreate): Promise<Response> =>
  adminFetch(token, '/api/v1/admin/blocked-slots', {
    method: 'POST',
    body: JSON.stringify(data),
  })
