/**
 * Persistencia Offline-First + schema listo para sync remoto
 * (Supabase / Google Sheets más adelante).
 */

export const STORAGE_KEY = 'checkpeso:v1'
export const STORE_VERSION = 1

/**
 * @typedef {{
 *   id: string,
 *   date: string,
 *   dayType: 'official' | 'extra',
 *   entradaKg: number | null,
 *   salidaKg: number | null,
 *   synced: boolean,
 *   updatedAt: string,
 * }} WeightEntry
 *
 * @typedef {{
 *   version: number,
 *   updatedAt: string,
 *   entries: Record<string, WeightEntry>,
 * }} WeightStorePayload
 */

/** @returns {WeightStorePayload} */
export function createEmptyStore() {
  return {
    version: STORE_VERSION,
    updatedAt: new Date().toISOString(),
    entries: {},
  }
}

/** @returns {WeightStorePayload} */
export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyStore()

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return createEmptyStore()

    const entries =
      parsed.entries && typeof parsed.entries === 'object' ? parsed.entries : {}

    return {
      version: STORE_VERSION,
      updatedAt: typeof parsed.updatedAt === 'string'
        ? parsed.updatedAt
        : new Date().toISOString(),
      entries,
    }
  } catch {
    return createEmptyStore()
  }
}

/** @param {Record<string, WeightEntry>} entries */
export function saveStore(entries) {
  /** @type {WeightStorePayload} */
  const payload = {
    version: STORE_VERSION,
    updatedAt: new Date().toISOString(),
    entries,
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Quota / modo privado: la app sigue en memoria
  }

  return payload
}

/** Entradas pendientes de sincronizar con remoto */
export function getPendingSyncEntries(entries) {
  return Object.values(entries).filter((entry) => entry && entry.synced === false)
}
