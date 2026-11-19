<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useWeightEntries } from '@/composables/useWeightEntries'
import { isOfficialDateKey } from '@/utils/dates'

const props = defineProps({
  fecha: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const { getEntry, upsertEntry, removeEntry } = useWeightEntries()

const esOficial = computed(() => isOfficialDateKey(props.fecha))
const hasSavedData = computed(() => {
  const entry = getEntry(props.fecha)
  return entry != null && (entry.entradaKg != null || entry.salidaKg != null)
})

const entrada = ref('')
const salida = ref('')
const errorMsg = ref('')
const errorRef = ref(null)
const savedMsg = ref('')
const confirmDelete = ref(false)

function kgToInput(value) {
  return value == null ? '' : String(value)
}

/** Solo dígitos: máx. 3 enteros y 2 decimales (ej. 999.99). */
function sanitizeWeightInput(raw) {
  let s = String(raw ?? '').replace(/[^\d.,]/g, '')
  const sepIndex = s.search(/[.,]/)

  if (sepIndex === -1) {
    return s.slice(0, 3)
  }

  const sep = s[sepIndex]
  const intPart = s.slice(0, sepIndex).replace(/[.,]/g, '').slice(0, 3)
  const decPart = s.slice(sepIndex + 1).replace(/[.,]/g, '').slice(0, 2)
  return decPart.length > 0 ? `${intPart}${sep}${decPart}` : `${intPart}${sep}`
}

function applyWeightInput(event, modelRef) {
  const cleaned = sanitizeWeightInput(event.target.value)
  modelRef.value = cleaned
  // Si el valor limpio no cambia (ej. "72" + "a"), Vue no re-renderiza:
  // hay que forzar el DOM para que la letra no se quede visible.
  event.target.value = cleaned
}

function onEntradaInput(event) {
  applyWeightInput(event, entrada)
}

function onSalidaInput(event) {
  applyWeightInput(event, salida)
}

function onBeforeWeightInput(event) {
  if (event.data == null) return
  if (/[^\d.,]/.test(event.data)) {
    event.preventDefault()
  }
}

function loadFromStore() {
  const entry = getEntry(props.fecha)
  errorMsg.value = ''
  savedMsg.value = ''
  confirmDelete.value = false
  entrada.value = kgToInput(entry?.entradaKg)
  salida.value = kgToInput(entry?.salidaKg)
}

watch(() => props.fecha, loadFromStore, { immediate: true })

function parseKg(raw) {
  const trimmed = String(raw ?? '').trim().replace(',', '.')
  if (trimmed === '') return { empty: true, value: null }

  const num = Number(trimmed)
  if (!Number.isFinite(num)) {
    return { empty: false, value: null, invalid: true }
  }
  if (num < 20 || num > 300) {
    return { empty: false, value: null, outOfRange: true }
  }
  return { empty: false, value: Math.round(num * 100) / 100 }
}

async function showError(message) {
  errorMsg.value = message
  savedMsg.value = ''
  await nextTick()
  errorRef.value?.focus()
}

async function onSubmit() {
  errorMsg.value = ''
  confirmDelete.value = false

  const prev = getEntry(props.fecha)
  const inParsed = parseKg(entrada.value)
  const outParsed = parseKg(salida.value)

  if (inParsed.invalid || outParsed.invalid) {
    await showError('Escribe solo números. Ejemplo: 72.5')
    return
  }
  if (inParsed.outOfRange || outParsed.outOfRange) {
    await showError('El peso debe estar entre 20 y 300 kg.')
    return
  }

  // Campo vacío = conservar el valor ya guardado (entrada ahora, salida horas después)
  const nextEntrada = inParsed.empty ? (prev?.entradaKg ?? null) : inParsed.value
  const nextSalida = outParsed.empty ? (prev?.salidaKg ?? null) : outParsed.value

  if (nextEntrada == null && nextSalida == null) {
    await showError('Escribe al menos el peso de entrada o el de salida.')
    return
  }

  upsertEntry({
    date: props.fecha,
    dayType: esOficial.value ? 'official' : 'extra',
    entradaKg: nextEntrada,
    salidaKg: nextSalida,
  })

  savedMsg.value = 'Peso guardado.'
  await router.push({ name: 'calendario' })
}

function askDelete() {
  errorMsg.value = ''
  savedMsg.value = ''
  confirmDelete.value = true
}

function cancelDelete() {
  confirmDelete.value = false
}

async function confirmDeleteDay() {
  removeEntry(props.fecha)
  confirmDelete.value = false
  entrada.value = ''
  salida.value = ''
  savedMsg.value = 'Día borrado.'
  await router.push({ name: 'calendario' })
}
</script>

<template>
  <form class="weight-form" novalidate @submit.prevent="onSubmit">
    <p
      ref="errorRef"
      class="form-alert"
      :class="{ 'form-alert--error': errorMsg, 'form-alert--ok': savedMsg && !errorMsg }"
      role="alert"
      tabindex="-1"
      aria-live="assertive"
    >
      {{ errorMsg || savedMsg }}
    </p>

    <div class="field">
      <label class="field__label" for="peso-entrada">Entrada</label>
      <input
        id="peso-entrada"
        class="field__input"
        type="text"
        inputmode="decimal"
        pattern="[0-9]{1,3}([.,][0-9]{0,2})?"
        maxlength="6"
        autocomplete="off"
        enterkeyhint="next"
        aria-describedby="hint-entrada"
        :value="entrada"
        @beforeinput="onBeforeWeightInput"
        @input="onEntradaInput"
      />
      <p id="hint-entrada" class="field__hint">Antes de la terapia</p>
    </div>

    <div class="field">
      <label class="field__label" for="peso-salida">Salida</label>
      <input
        id="peso-salida"
        class="field__input"
        type="text"
        inputmode="decimal"
        pattern="[0-9]{1,3}([.,][0-9]{0,2})?"
        maxlength="6"
        autocomplete="off"
        enterkeyhint="done"
        aria-describedby="hint-salida"
        :value="salida"
        @beforeinput="onBeforeWeightInput"
        @input="onSalidaInput"
      />
      <p id="hint-salida" class="field__hint">Al salir de la terapia</p>
    </div>

    <div class="btn-stack">
      <button type="submit" class="btn btn--primary btn--block" aria-label="Guardar peso">
        <AppIcon name="check-plain" :size="28" />
        <span>Guardar</span>
      </button>

      <button
        v-if="hasSavedData"
        type="button"
        class="btn btn--danger btn--block"
        aria-label="Borrar este día"
        @click="askDelete"
      >
        <AppIcon name="trash" :size="26" />
        <span>Borrar día</span>
      </button>
    </div>

    <ConfirmModal
      :open="confirmDelete"
      title="¿Borrar este día?"
      message="Se eliminarán los pesos de entrada y salida. Esta acción no se puede deshacer."
      confirm-label="Sí, borrar"
      cancel-label="Cancelar"
      danger
      @confirm="confirmDeleteDay"
      @cancel="cancelDelete"
    />
  </form>
</template>

<style scoped>
.weight-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.form-alert {
  min-height: 1.5em;
  margin: 0;
  font-size: var(--fs-base);
  font-weight: 700;
  color: var(--color-text);
}

.form-alert:empty {
  display: none;
}

.form-alert--error {
  color: var(--color-danger);
}

.form-alert--ok {
  color: var(--color-success);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field__label {
  font-size: var(--fs-xl);
  font-weight: 800;
  color: var(--color-text);
}

.field__input {
  width: 100%;
  min-height: 4.25rem;
  padding: 0.75rem 1rem;
  border: 3px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--fs-2xl);
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.field__input:focus-visible {
  outline: 4px solid var(--color-focus);
  outline-offset: 3px;
}

.field__hint {
  margin: 0;
  font-size: var(--fs-base);
  color: var(--color-text-muted);
}

</style>
