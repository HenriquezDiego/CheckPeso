import { isOfficialDateKey, todayKey } from '@/utils/dates'

/**
 * Destino al abrir la app:
 * - Martes/Viernes con datos incompletos → registro de hoy
 * - En cualquier otro caso → calendario
 */
export function resolveStartRoute(dayStatus) {
  const today = todayKey()

  if (isOfficialDateKey(today) && !dayStatus(today).complete) {
    return {
      name: 'registro',
      query: { fecha: today },
    }
  }

  return { name: 'calendario' }
}
