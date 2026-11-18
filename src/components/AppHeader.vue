<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => {
  if (route.name === 'calendario') return 'Calendario'
  if (route.name === 'registro') return 'Registrar peso'
  return 'CheckPeso'
})
</script>

<template>
  <header class="app-header" role="banner">
    <div class="app-header__inner">
      <RouterLink
        v-if="route.name === 'registro'"
        class="app-header__back btn"
        to="/calendario"
        aria-label="Volver al calendario"
      >
        ← Calendario
      </RouterLink>
      <p class="app-header__brand" :aria-current="route.name === 'calendario' ? 'page' : undefined">
        {{ title }}
      </p>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: var(--header-height);
  border-bottom: 3px solid var(--color-border);
  background: color-mix(in srgb, var(--color-bg) 92%, white);
  backdrop-filter: blur(6px);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: min(100%, var(--max-width));
  min-height: var(--header-height);
  margin-inline: auto;
  padding: var(--space-2) var(--space-3);
}

.app-header__brand {
  margin: 0;
  font-size: var(--fs-xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.app-header__back {
  flex-shrink: 0;
  min-height: 3rem;
  padding: 0.55rem 0.9rem;
  font-size: var(--fs-base);
}
</style>
