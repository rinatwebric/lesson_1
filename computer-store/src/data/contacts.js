// Demo contact details for the Bishkek store (not real).
export const CONTACTS = {
  phone: '+996 555 123 456',
  tel: '+996555123456',
  email: 'hello@nexus.example',
  telegram: 'nexus_bishkek',
  city: { ru: 'Бишкек', en: 'Bishkek' },
  address: { ru: 'г. Бишкек, пр. Чуй, 155', en: '155 Chuy Ave, Bishkek' },
  hours: { ru: 'Пн–Сб 10:00–20:00, Вс 11:00–18:00', en: 'Mon–Sat 10:00–20:00, Sun 11:00–18:00' },
}

// Kyrgyz numbers are 9 digits after +996 (or 0 + 9 digits locally); accept foreign numbers too.
export const isValidPhone = (phone) => {
  const s = String(phone ?? '')
  const digits = s.replace(/\D/g, '')
  return /^[\d\s()+-]+$/.test(s) && digits.length >= 9 && digits.length <= 15
}

export const COURIER_FEE = 300
export const FREE_COURIER_FROM = 100000
