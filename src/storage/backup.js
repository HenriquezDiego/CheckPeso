import { isOfficialDateKey } from '@/utils/dates'
import { STORE_VERSION } from '@/storage/weightStore'

/** Versión del formato de archivo de respaldo (independiente del localStorage). */
export const BACKUP_SCHEMA_VERSION = 1
export const BACKUP_APP = 'CheckPeso'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Formato de exportación (portable / listo para sync futuro):
 *
 * {
 *   "app": "CheckPeso",
 *   "schemaVersion": 1,
 *   "exportedAt": "2026-11-18T02:00:00.000Z",
 *   "meta": { "entryCount": 2, "dateFrom": "...", "dateTo": "..." },
 *   "entries": [
 *     {
 *       "id": "uuid",
 *       "date": "YYYY-MM-DD",
 *       "dayType": "official" | "extra",
 *       "entradaKg": 72.5 | null,
 *       "salidaKg": 71.8 | null,
 *       "synced": false,
 *       "updatedAt": "ISO-8601"
 *     }
 *   ]
 * }
 */

function isValidKg(value) {
  if (value === null) return true
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 300
}

function normalizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null

  const date = typeof raw.date === 'string' ? raw.date.trim() : ''
  if (!DATE_RE.test(date)) return null

  const entradaKg = raw.entradaKg === undefined ? null : raw.entradaKg
  const salidaKg = raw.salidaKg === undefined ? null : raw.salidaKg
  if (!isValidKg(entradaKg) || !isValidKg(salidaKg)) return null
  if (entradaKg == null && salidaKg == null) return null

  const dayType =
    raw.dayType === 'official' || raw.dayType === 'extra'
      ? raw.dayType
      : isOfficialDateKey(date)
        ? 'official'
        : 'extra'

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : crypto.randomUUID(),
    date,
    dayType,
    entradaKg,
    salidaKg,
    synced: typeof raw.synced === 'boolean' ? raw.synced : false,
    updatedAt:
      typeof raw.updatedAt === 'string' && raw.updatedAt
        ? raw.updatedAt
        : new Date().toISOString(),
  }
}

/** @param {Record<string, object>} entriesByDate */
export function buildBackupDocument(entriesByDate) {
  const entries = Object.values(entriesByDate || {})
    .map(normalizeEntry)
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date))

  const dates = entries.map((e) => e.date)

  return {
    app: BACKUP_APP,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    meta: {
      entryCount: entries.length,
      dateFrom: dates[0] ?? null,
      dateTo: dates[dates.length - 1] ?? null,
      storeVersion: STORE_VERSION,
    },
    entries,
  }
}

/**
 * Valida y normaliza un JSON de respaldo.
 * @returns {{ ok: true, document: object, entriesByDate: Record<string, object> } | { ok: false, error: string }}
 */
export function parseBackupDocument(raw) {
  let data = raw

  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw)
    } catch {
      return { ok: false, error: 'El archivo no es un JSON válido.' }
    }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'El archivo no tiene la estructura de CheckPeso.' }
  }

  if (data.app != null && data.app !== BACKUP_APP) {
    return { ok: false, error: 'Este JSON no es de CheckPeso.' }
  }

  if (data.schemaVersion != null && data.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    return {
      ok: false,
      error: `Versión de respaldo no soportada (${data.schemaVersion}).`,
    }
  }

  let list = data.entries

  // Compatibilidad: si alguien exportó el localStorage crudo { entries: { "fecha": {...} } }
  if (list && !Array.isArray(list) && typeof list === 'object') {
    list = Object.values(list)
  }

  if (!Array.isArray(list)) {
    return { ok: false, error: 'Falta la lista "entries" en el JSON.' }
  }

  const entriesByDate = {}
  let accepted = 0

  for (const item of list) {
    const entry = normalizeEntry(item)
    if (!entry) continue

    const prev = entriesByDate[entry.date]
    if (!prev || entry.updatedAt >= prev.updatedAt) {
      entriesByDate[entry.date] = entry
    }
    accepted += 1
  }

  if (accepted === 0) {
    return { ok: false, error: 'El archivo no trae registros de peso válidos.' }
  }

  const document = buildBackupDocument(entriesByDate)

  return { ok: true, document, entriesByDate }
}

export function backupFilename(exportedAt = new Date()) {
  const d = exportedAt instanceof Date ? exportedAt : new Date(exportedAt)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `checkpeso-respaldo-${y}-${m}-${day}.json`
}

export function downloadBackupJson(backupDoc) {
  const text = `${JSON.stringify(backupDoc, null, 2)}\n`
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = backupFilename(backupDoc.exportedAt)
  link.rel = 'noopener'
  window.document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
