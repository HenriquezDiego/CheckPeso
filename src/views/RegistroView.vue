<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import WeightForm from '@/components/WeightForm.vue'
import { isOfficialDateKey, parseDateKey, todayKey } from '@/utils/dates'

const route = useRoute()

const fecha = computed(() => {
  const q = route.query.fecha
  return typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : todayKey()
})

const esOficial = computed(() => isOfficialDateKey(fecha.value))

const diaSemana = computed(() =>
  parseDateKey(fecha.value).toLocaleDateString('es', { weekday: 'long' }),
)

const fechaCorta = computed(() =>
  parseDateKey(fecha.value).toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)
</script>

<template>
  <section class="panel" aria-labelledby="reg-title">
    <header class="reg-hero">
      <h1 id="reg-title" class="reg-hero__day">
        {{ diaSemana }}
        <AppIcon
          class="reg-hero__icon"
          :class="{ 'reg-hero__icon--extra': !esOficial }"
          :name="esOficial ? 'blood' : 'extra'"
          :size="esOficial ? 28 : 20"
        />
      </h1>
      <p class="reg-hero__date">{{ fechaCorta }}</p>
    </header>

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
.reg-hero {
  margin-bottom: var(--space-2);
  text-align: center;
}

.reg-hero__day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: 0;
  font-size: clamp(2.1rem, 8vw, 2.85rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-transform: capitalize;
  color: var(--color-text);
}

.reg-hero__date {
  margin: 0.4rem 0 0;
  font-size: clamp(1.35rem, 5vw, 1.75rem);
  font-weight: 800;
  text-transform: capitalize;
  color: var(--color-text);
}

.reg-hero__icon {
  color: var(--color-official);
  flex-shrink: 0;
}

.reg-hero__icon--extra {
  color: var(--color-extra);
}
</style>
