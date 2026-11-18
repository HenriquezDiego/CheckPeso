<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
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
    <h1 id="reg-title" class="sr-only">Registrar peso</h1>
    <p class="lead">
      <span class="reg-date">{{ fechaTexto }}</span>
      <span class="reg-type">
        <AppIcon
          class="reg-type__icon"
          :name="esOficial ? 'official' : 'extra'"
          :size="esOficial ? 22 : 16"
        />
      </span>
    </p>

    <WeightForm :fecha="fecha" />

    <div class="btn-stack" style="margin-top: var(--space-4)">
      <RouterLink
        class="btn btn--secondary btn--block"
        to="/calendario"
        aria-label="Ver calendario"
      >
        <AppIcon name="calendar" :size="26" />
        <span>Calendario</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.lead {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.reg-date {
  color: var(--color-text);
  font-weight: 800;
  text-transform: capitalize;
  font-size: clamp(1.1rem, 4.2vw, var(--fs-lg));
}

.reg-type {
  display: inline-flex;
  align-items: center;
  color: var(--color-text);
}

.reg-type__icon {
  color: var(--color-official);
}
</style>
