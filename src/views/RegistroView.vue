<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import WeightForm from '@/components/WeightForm.vue'
import { formatLongDate, isOfficialDateKey, todayKey } from '@/utils/dates'

const route = useRoute()

const fecha = computed(() => {
  const q = route.query.fecha
  return typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : todayKey()
})

const fechaTexto = computed(() => formatLongDate(fecha.value))
const esOficial = computed(() => isOfficialDateKey(fecha.value))
</script>

<template>
  <section class="panel" aria-labelledby="reg-title">
    <h1 id="reg-title">Registrar peso</h1>
    <p class="lead">
      <span class="reg-date">{{ fechaTexto }}</span>
      <span class="reg-type"> — {{ esOficial ? 'día oficial' : 'día extra' }}</span>
    </p>

    <WeightForm :fecha="fecha" />

    <div class="btn-stack" style="margin-top: var(--space-4)">
      <RouterLink class="btn btn--secondary btn--block" to="/calendario">
        Ver calendario
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.reg-date {
  color: var(--color-text);
  font-weight: 800;
  text-transform: capitalize;
}

.reg-type {
  color: var(--color-text);
  font-weight: 700;
}
</style>
