<script setup>
import AppIcon from '@/components/AppIcon.vue'
import MonthCalendar from '@/components/MonthCalendar.vue'
import { todayKey } from '@/utils/dates'
</script>

<template>
  <section class="panel" aria-labelledby="cal-title">
    <h1 id="cal-title" class="sr-only">Calendario</h1>

    <MonthCalendar />

    <ul class="legend" aria-label="Leyenda">
      <li class="legend__item">
        <span class="legend__icon legend__icon--official" aria-hidden="true">
          <AppIcon name="official" :size="18" />
        </span>
        <span>Martes y viernes</span>
      </li>
      <li class="legend__item">
        <span class="legend__icon legend__icon--extra" aria-hidden="true">
          <AppIcon name="extra" :size="14" />
        </span>
        <span>Día extra</span>
      </li>
      <li class="legend__item">
        <span class="legend__icon legend__icon--done" aria-hidden="true">
          <AppIcon name="done" :size="18" />
        </span>
        <span>Completo</span>
      </li>
      <li class="legend__item">
        <span class="legend__hoy" aria-hidden="true">HOY</span>
        <span>Día actual</span>
      </li>
    </ul>

    <div class="btn-stack" style="margin-top: var(--space-3)">
      <RouterLink
        class="btn btn--primary btn--block"
        :to="{ name: 'registro', query: { fecha: todayKey() } }"
        aria-label="Registrar peso de hoy"
      >
        <AppIcon name="scale" :size="28" />
        <span>Registrar</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.legend__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  color: #fff;
}

.legend__icon--official {
  background: var(--color-official);
  border-color: #063a9e;
}

.legend__icon--extra {
  background: var(--color-extra);
  border-color: #8a3d14;
}

.legend__icon--done {
  background: var(--color-success);
  border-color: #0f5a32;
}

.legend__hoy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.3rem;
  border-radius: 4px;
  background: #111;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}
</style>
