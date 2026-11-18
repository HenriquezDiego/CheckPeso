<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
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
        <AppIcon name="chevron-left" :size="32" />
      </button>
      <h2 class="cal__title" aria-live="polite">{{ title }}</h2>
      <button type="button" class="btn cal__nav" aria-label="Mes siguiente" @click="goNext">
        <AppIcon name="chevron-right" :size="32" />
      </button>
    </div>

    <button
      type="button"
      class="btn btn--secondary btn--block cal__today"
      aria-label="Ir al día de hoy"
      @click="goToday"
    >
      <AppIcon name="today" :size="26" />
      <span>Hoy</span>
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
              'cal__day--official':
                dayStatus(cell.dateKey).official && dayStatus(cell.dateKey).kind !== 'done',
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
            <span v-if="cell.dateKey === today" class="cal__hoy" aria-hidden="true">
              <AppIcon name="today" :size="12" />
              HOY
            </span>
            <span class="cal__num">{{ cell.day }}</span>
            <span
              v-if="dayStatus(cell.dateKey).kind === 'done'"
              class="cal__mark"
              title="Completo"
            >
              <AppIcon name="check" :size="18" />
            </span>
            <span
              v-else-if="dayStatus(cell.dateKey).official"
              class="cal__mark"
              title="Día de control"
            >
              <AppIcon name="blood" :size="15" />
            </span>
            <span
              v-else-if="dayStatus(cell.dateKey).kind === 'extra'"
              class="cal__mark"
              title="Extra"
            >
              <AppIcon name="extra" :size="12" />
            </span>
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
  font-size: clamp(1.15rem, 4.8vw, var(--fs-xl));
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-text);
}

.cal__nav {
  min-width: 3.25rem;
  min-height: 3.25rem;
  padding: 0.35rem;
}

.cal__today {
  min-height: 3.25rem;
  font-size: var(--fs-lg);
  gap: 0.55rem;
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-height: 3.5rem;
  margin: 0;
  padding: 0.4rem 0.15rem 0.35rem;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text);
  font-family: inherit;
  cursor: pointer;
  touch-action: manipulation;
}

.cal__num {
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1;
}

.cal__mark {
  display: inline-flex;
  line-height: 0;
  opacity: 0.95;
}

.cal__hoy {
  position: absolute;
  top: 0.12rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.12rem 0.4rem;
  border-radius: 999px;
  background: var(--color-today);
  color: var(--color-today-ink);
  border: 2px solid #063a9e;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.03em;
  line-height: 1;
  z-index: 1;
  white-space: nowrap;
}

.cal__day--today {
  padding-top: 1.15rem;
  border-width: 3px;
  border-color: var(--color-today);
  box-shadow:
    0 0 0 3px #fff,
    0 0 0 6px var(--color-today);
}

.cal__day--today .cal__num {
  text-decoration: underline;
  text-underline-offset: 0.12em;
  text-decoration-thickness: 3px;
}

/* Martes / viernes — rojo + gota */
.cal__day--official {
  min-height: 5rem;
  border-width: 3px;
  border-color: var(--color-official-border);
  background: var(--color-official);
  color: var(--color-official-text);
}

.cal__day--official .cal__num {
  font-size: 1.55rem;
}

/* Completo — solo verde */
.cal__day--done {
  border-width: 3px;
  border-color: #0f5a32;
  background: var(--color-success);
  color: #fff;
}

.cal__day--done .cal__num {
  font-size: 1.45rem;
}

/* Día extra con registro */
.cal__day--extra {
  border-width: 3px;
  border-color: #8a3d14;
  background: var(--color-extra);
  color: var(--color-extra-text);
}

.cal__day:focus-visible {
  outline: 4px solid var(--color-focus);
  outline-offset: 3px;
}

@media (max-width: 420px) {
  .cal__weekday {
    font-size: 0.75rem;
  }

  .cal__day {
    min-height: 3.1rem;
  }

  .cal__day--official {
    min-height: 4.35rem;
  }

  .cal__day--official .cal__num {
    font-size: 1.3rem;
  }

  .cal__hoy {
    font-size: 0.55rem;
    padding: 0.06rem 0.28rem;
  }
}
</style>
