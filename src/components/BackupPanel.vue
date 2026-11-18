<script setup>
import { nextTick, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { useWeightEntries } from '@/composables/useWeightEntries'
import {
  buildBackupDocument,
  downloadBackupJson,
  parseBackupDocument,
} from '@/storage/backup'

const { entries, replaceAllEntries } = useWeightEntries()

const fileInput = ref(null)
const statusMsg = ref('')
const statusKind = ref('') // 'ok' | 'error'
const statusRef = ref(null)
const pendingImport = ref(null)

async function announce(message, kind) {
  statusMsg.value = message
  statusKind.value = kind
  await nextTick()
  statusRef.value?.focus()
}

function onExport() {
  const doc = buildBackupDocument(entries.value)
  downloadBackupJson(doc)
  announce(
    doc.meta.entryCount === 0
      ? 'Copia vacía descargada.'
      : `Copia guardada: ${doc.meta.entryCount} registro(s).`,
    'ok',
  )
}

function openFilePicker() {
  pendingImport.value = null
  fileInput.value?.click()
}

async function onFileChosen(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  let text
  try {
    text = await file.text()
  } catch {
    await announce('No se pudo leer el archivo.', 'error')
    return
  }

  const parsed = parseBackupDocument(text)
  if (!parsed.ok) {
    await announce(parsed.error, 'error')
    return
  }

  pendingImport.value = parsed
  await announce(
    `Archivo listo: ${parsed.document.meta.entryCount} registro(s). Confirma para reemplazar los datos.`,
    'ok',
  )
}

async function confirmImport() {
  if (!pendingImport.value) return
  replaceAllEntries(pendingImport.value.entriesByDate)
  const count = pendingImport.value.document.meta.entryCount
  pendingImport.value = null
  await announce(`Datos cargados: ${count} registro(s).`, 'ok')
}

function cancelImport() {
  pendingImport.value = null
  statusMsg.value = ''
  statusKind.value = ''
}
</script>

<template>
  <section class="backup" aria-labelledby="backup-title">
    <h2 id="backup-title" class="h2">Copia de seguridad</h2>

    <p
      ref="statusRef"
      class="backup__status"
      :class="{
        'backup__status--ok': statusKind === 'ok',
        'backup__status--error': statusKind === 'error',
      }"
      role="status"
      tabindex="-1"
      aria-live="polite"
    >
      {{ statusMsg }}
    </p>

    <div class="btn-stack">
      <button
        type="button"
        class="btn btn--secondary btn--block"
        aria-label="Guardar copia JSON"
        @click="onExport"
      >
        <AppIcon name="download" :size="26" />
        <span>Guardar copia</span>
      </button>

      <button
        type="button"
        class="btn btn--secondary btn--block"
        aria-label="Cargar copia JSON"
        @click="openFilePicker"
      >
        <AppIcon name="upload" :size="26" />
        <span>Cargar copia</span>
      </button>

      <input
        ref="fileInput"
        class="sr-only"
        type="file"
        accept="application/json,.json"
        aria-label="Elegir archivo JSON de respaldo"
        @change="onFileChosen"
      />
    </div>

    <div v-if="pendingImport" class="backup__confirm btn-stack">
      <p class="backup__warn">
        Esto reemplaza todos los pesos guardados en este dispositivo.
      </p>
      <button type="button" class="btn btn--primary btn--block" @click="confirmImport">
        Sí, cargar copia
      </button>
      <button type="button" class="btn btn--secondary btn--block" @click="cancelImport">
        Cancelar
      </button>
    </div>
  </section>
</template>

<style scoped>
.backup {
  margin-top: var(--space-2);
}

.backup__status {
  min-height: 1.5em;
  margin: 0 0 var(--space-3);
  font-size: var(--fs-base);
  font-weight: 700;
  color: var(--color-text);
}

.backup__status:empty {
  display: none;
}

.backup__status--ok {
  color: var(--color-success);
}

.backup__status--error {
  color: var(--color-danger);
}

.backup__confirm {
  margin-top: var(--space-3);
}

.backup__warn {
  margin: 0;
  font-size: var(--fs-lg);
  font-weight: 700;
  color: var(--color-text);
}
</style>
