<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWeightEntries } from '@/composables/useWeightEntries'
import { isOfficialDateKey } from '@/utils/dates'

const props = defineProps({
  fecha: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const { getEntry, upsertEntry } = useWeightEntries()

const esOficial = computed(() => isOfficialDateKey(props.fecha))

const entrada = ref('')
const salida = ref('')
const pesoExtra = ref('')
const errorMsg = ref('')
const errorRef = ref(null)
const savedMsg = ref('')

function kgToInput(value) {
  return value == null ? '' : String(value)
}

function loadFromStore() {
  const entry = getEntry(props.fecha)
  errorMsg.value = ''
  savedMsg.value = ''

  if (!entry) {
    entrada.value = ''
    salida.value = ''
    pesoExtra.value = ''
    return
  }

  if (esOficial.value) {
    entrada.value = kgToInput(entry.entradaKg)
    salida.value = kgToInput(entry.salidaKg)
    pesoExtra.value = ''
  } else {
    pesoExtra.value = kgToInput(entry.entradaKg ?? entry.salidaKg)
    entrada.value = ''
    salida.value = ''
  }
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
  return { empty: false, value: Math.round(num * 10) / 10 }
}

async function showError(message) {
  errorMsg.value = message
  savedMsg.value = ''
  await nextTick()
  errorRef.value?.focus()
}

async function onSubmit() {
  errorMsg.value = ''

  if (esOficial.value) {
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
    if (inParsed.empty && outParsed.empty) {
      await showError('Escribe al menos el peso de entrada o el de salida.')
      return
    }

    upsertEntry({
      date: props.fecha,
      dayType: 'official',
      entradaKg: inParsed.empty ? null : inParsed.value,
      salidaKg: outParsed.empty ? null : outParsed.value,
    })
  } else {
    const parsed = parseKg(pesoExtra.value)

    if (parsed.empty) {
      await showError('Escribe el peso en kilogramos.')
      return
    }
    if (parsed.invalid) {
      await showError('Escribe solo números. Ejemplo: 72.5')
      return
    }
    if (parsed.outOfRange) {
      await showError('El peso debe estar entre 20 y 300 kg.')
      return
    }

    upsertEntry({
      date: props.fecha,
      dayType: 'extra',
      entradaKg: parsed.value,
      salidaKg: null,
    })
  }

  savedMsg.value = 'Peso guardado.'
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

    <template v-if="esOficial">
      <div class="field">
        <label class="field__label" for="peso-entrada">Entrada (kg)</label>
        <input
          id="peso-entrada"
          v-model="entrada"
          class="field__input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          enterkeyhint="next"
          aria-describedby="hint-entrada"
        />
        <p id="hint-entrada" class="field__hint">Peso al llegar</p>
      </div>

      <div class="field">
        <label class="field__label" for="peso-salida">Salida (kg)</label>
        <input
          id="peso-salida"
          v-model="salida"
          class="field__input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          enterkeyhint="done"
          aria-describedby="hint-salida"
        />
        <p id="hint-salida" class="field__hint">Peso al salir</p>
      </div>
    </template>

    <template v-else>
      <div class="field">
        <label class="field__label" for="peso-extra">Peso (kg)</label>
        <input
          id="peso-extra"
          v-model="pesoExtra"
          class="field__input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          enterkeyhint="done"
        />
      </div>
    </template>

    <div class="btn-stack">
      <button type="submit" class="btn btn--primary btn--block">
        Guardar
      </button>
    </div>
  </form>
</template>

<style scoped>
.weight-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-3);
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
  font-weight: 700;
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
