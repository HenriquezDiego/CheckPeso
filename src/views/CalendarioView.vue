<script setup>
import MonthCalendar from '@/components/MonthCalendar.vue'
</script>

<template>
  <section class="panel" aria-labelledby="cal-title">
    <h1 id="cal-title" class="sr-only">Calendario</h1>

    <MonthCalendar />

    <ul class="legend" aria-label="Leyenda de colores">
      <li class="legend__item">
        <span class="swatch swatch--official" aria-hidden="true" />
        <span>Martes y viernes (oficiales)</span>
      </li>
      <li class="legend__item">
        <span class="swatch swatch--extra" aria-hidden="true" />
        <span>Día extra con registro</span>
      </li>
      <li class="legend__item">
        <span class="swatch swatch--done" aria-hidden="true" />
        <span>Oficial completo</span>
      </li>
    </ul>

    <div class="btn-stack" style="margin-top: var(--space-3)">
      <RouterLink class="btn btn--primary btn--block" to="/registro">
        Registrar peso de hoy
      </RouterLink>
    </div>
  </section>
</template>
