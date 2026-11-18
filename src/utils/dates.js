/** Días oficiales de control: martes (2) y viernes (5). JS: 0=dom … 6=sáb */
export const OFFICIAL_WEEKDAYS = new Set([2, 5])

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

/** Cabeceras cortas empezando en lunes */
export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function pad2(n) {
  return String(n).padStart(2, '0')
}

/** @returns {string} YYYY-MM-DD en calendario local */
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toDateKey(new Date())
}

export function isOfficialWeekday(date) {
  return OFFICIAL_WEEKDAYS.has(date.getDay())
}

export function isOfficialDateKey(key) {
  return isOfficialWeekday(parseDateKey(key))
}

export function monthTitle(year, monthIndex) {
  return `${MONTH_NAMES[monthIndex]} ${year}`
}

/**
 * Celdas del mes (lunes → domingo).
 * `date` es null en huecos del inicio/fin.
 */
export function buildMonthCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  // getDay(): 0=dom → convertir a índice lunes=0
  const startOffset = (first.getDay() + 6) % 7

  const cells = []

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ key: `pad-start-${i}`, date: null, dateKey: null })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day)
    const dateKey = toDateKey(date)
    cells.push({
      key: dateKey,
      date,
      dateKey,
      day,
      official: isOfficialWeekday(date),
    })
  }

  while (cells.length % 7 !== 0) {
    const i = cells.length
    cells.push({ key: `pad-end-${i}`, date: null, dateKey: null })
  }

  return cells
}

export function shiftMonth(year, monthIndex, delta) {
  const d = new Date(year, monthIndex + delta, 1)
  return { year: d.getFullYear(), monthIndex: d.getMonth() }
}

export function formatLongDate(dateKey) {
  const date = parseDateKey(dateKey)
  return date.toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
