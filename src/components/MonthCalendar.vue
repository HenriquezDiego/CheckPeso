<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWeightEntries } from '@/composables/useWeightEntries'
import {
  WEEKDAY_LABELS,
  buildMonthCells,
  monthTitle,
  shiftMonth,
  todayKey,
  formatLongDate,
} from '@/utils/dates'

const props = defineProps({
  /** YYYY-MM-DD opcional para abrir el mes de esa fecha */
  initialDate: {
    type: String,
    default: null,
  },
})

const router = useRouter()
const { dayStatus } = useWeightEntries()

const now = props.initialDate ? new Date(`${props.initialDate}T12:00:00`) : new Date()
const cursor = ref({
  year: now.getFullYear(),
  monthIndex: now.getMonth(),
})

const title = computed(() => monthTitle(cursor.value.year, cursor.value.monthIndex))
const cells = computed(() => buildMonthCells(cursor.value.year, cursor.value.monthIndex))
const today = todayKey()

function goPrev() {
  cursor.value = shiftMonth(cursor.value.year, cursor.value.monthIndex, -1)
}

function goNext() {
  cursor.value = shiftMonth(cursor.value.year, cursor.value.monthIndex, 1)
}

function goToday() {
  const t = new Date()
  cursor.value = { year: t.getFullYear(), monthIndex: t.getMonth() }
}

function openDay(dateKey) {
  router.push({ name: 'registro', query: { fecha: dateKey } })
}

function labelFor(cell) {
  const status = dayStatus(cell.dateKey)
  const long = formatLongDate(cell.dateKey)
  const parts = [long]

  if (status.official) parts.push('día oficial')
  if (!status.official && status.hasData) parts.push('día extra')
  if (status.complete) parts.push('completo')
  else if (status.hasData) parts.push('registro incompleto')
  if (cell.dateKey === today) parts.push('hoy')

  return parts.join(', ')
}
</script>

<template>
  <div class="cal">
    <div class="cal__toolbar">
      <button type="button" class="btn cal__nav" aria-label="Mes anterior" @click="goPrev">
        ←
      </button>
      <h2 class="cal__title" aria-live="polite">{{ title }}</h2>
      <button type="button" class="btn cal__nav" aria-label="Mes siguiente" @click="goNext">
        →
      </button>
    </div>

    <button type="button" class="btn btn--secondary btn--block cal__today" @click="goToday">
      Ir a hoy
    </button>

    <div
      class="cal__grid"
      role="grid"
      :aria-label="`Calendario de ${title}`"
    >
      <div class="cal__weekdays" role="row">
        <div
          v-for="label in WEEKDAY_LABELS"
          :key="label"
          class="cal__weekday"
          role="columnheader"
        >
          {{ label }}
        </div>
      </div>

      <div class="cal__days" role="rowgroup">
        <template v-for="cell in cells" :key="cell.key">
          <div v-if="!cell.date" class="cal__cell cal__cell--empty" aria-hidden="true" />
          <button
            v-else
            type="button"
            class="cal__day"
            :class="{
              'cal__day--official': dayStatus(cell.dateKey).official,
              'cal__day--extra': dayStatus(cell.dateKey).kind === 'extra',
              'cal__day--done': dayStatus(cell.dateKey).kind === 'done',
              'cal__day--today': cell.dateKey === today,
              'cal__day--has-data': dayStatus(cell.dateKey).hasData,
            }"
            role="gridcell"
            :aria-label="labelFor(cell)"
            :aria-current="cell.dateKey === today ? 'date' : undefined"
            @click="openDay(cell.dateKey)"
          >
            <span class="cal__num">{{ cell.day }}</span>
            <span v-if="dayStatus(cell.dateKey).official" class="cal__tag">Oficial</span>
            <span v-else-if="dayStatus(cell.dateKey).kind === 'extra'" class="cal__tag">Extra</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cal {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.cal__toolbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-2);
}

.cal__title {
  margin: 0;
  text-align: center;
  font-size: var(--fs-xl);
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-text);
}

.cal__nav {
  min-width: 3.5rem;
  padding-inline: 0.75rem;
  font-size: var(--fs-xl);
}

.cal__today {
  min-height: 3rem;
  font-size: var(--fs-base);
}

.cal__grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cal__weekdays,
.cal__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.4rem;
}

.cal__weekday {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-text);
  padding-block: 0.25rem;
}

.cal__cell--empty {
  min-height: 3.25rem;
}

.cal__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  min-height: 3.5rem;
  margin: 0;
  padding: 0.35rem 0.15rem;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text);
  font-family: inherit;
  cursor: pointer;
  touch-action: manipulation;
}

.cal__num {
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1;
}

.cal__tag {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
}

/* Martes / viernes: más grandes y azul */
.cal__day--official {
  min-height: 5rem;
  border-width: 3px;
  border-color: #063a9e;
  background: var(--color-official);
  color: var(--color-official-text);
  grid-row: span 1;
}

.cal__day--official .cal__num {
  font-size: 1.55rem;
}

.cal__day--official .cal__tag {
  color: var(--color-official-text);
}

/* Día extra con registro */
.cal__day--extra {
  border-width: 3px;
  border-color: #8a3d14;
  background: var(--color-extra);
  color: var(--color-extra-text);
}

.cal__day--extra .cal__tag {
  color: var(--color-extra-text);
}

/* Oficial completo */
.cal__day--done {
  border-color: #0f5a32;
  background: var(--color-success);
  color: #fff;
}

.cal__day--done .cal__tag {
  color: #fff;
}

.cal__day--today {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-text) 85%, transparent);
}

.cal__day:focus-visible {
  outline: 4px solid var(--color-focus);
  outline-offset: 3px;
}

@media (max-width: 420px) {
  .cal__weekday {
    font-size: 0.8rem;
  }

  .cal__day--official {
    min-height: 4.5rem;
  }

  .cal__day--official .cal__num {
    font-size: 1.35rem;
  }

  .cal__tag {
    font-size: 0.58rem;
  }
}
</style>
