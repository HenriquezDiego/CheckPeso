import { computed, readonly, ref } from 'vue'
import { isOfficialDateKey } from '@/utils/dates'

/**
 * Almacén reactivo en memoria.
 * Entrada: { id, date, dayType, entradaKg, salidaKg, synced, updatedAt }
 * Siempre entrada + salida; se pueden guardar por separado (horas después).
 */
const entriesByDate = ref({})

function hasAnyWeight(entry) {
  if (!entry) return false
  return entry.entradaKg != null || entry.salidaKg != null
}

function isComplete(entry) {
  if (!entry) return false
  return entry.entradaKg != null && entry.salidaKg != null
}

export function useWeightEntries() {
  const entries = computed(() => entriesByDate.value)

  function getEntry(dateKey) {
    return entriesByDate.value[dateKey] ?? null
  }

  function dayStatus(dateKey) {
    const entry = getEntry(dateKey)
    const official = isOfficialDateKey(dateKey)

    if (!hasAnyWeight(entry)) {
      return {
        official,
        hasData: false,
        complete: false,
        kind: official ? 'official' : 'plain',
      }
    }

    const complete = isComplete(entry)

    if (complete) {
      return {
        official,
        hasData: true,
        complete: true,
        kind: 'done',
      }
    }

    if (official) {
      return {
        official: true,
        hasData: true,
        complete: false,
        kind: 'official',
      }
    }

    return {
      official: false,
      hasData: true,
      complete: false,
      kind: 'extra',
    }
  }

  function upsertEntry(partial) {
    const date = partial.date
    if (!date) return

    const prev = entriesByDate.value[date] ?? {}
    const dayType = partial.dayType ?? (isOfficialDateKey(date) ? 'official' : 'extra')

    entriesByDate.value = {
      ...entriesByDate.value,
      [date]: {
        id: prev.id ?? crypto.randomUUID(),
        date,
        dayType,
        entradaKg: partial.entradaKg !== undefined ? partial.entradaKg : (prev.entradaKg ?? null),
        salidaKg: partial.salidaKg !== undefined ? partial.salidaKg : (prev.salidaKg ?? null),
        synced: false,
        updatedAt: new Date().toISOString(),
      },
    }
  }

  return {
    entries: readonly(entries),
    getEntry,
    dayStatus,
    upsertEntry,
  }
}
