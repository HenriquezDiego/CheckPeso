<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'

const route = useRoute()

const title = computed(() => {
  if (route.name === 'calendario') return 'Calendario'
  if (route.name === 'registro') return 'Peso'
  if (route.name === 'ajustes') return 'Ajustes'
  return 'CheckPeso'
})

const showBack = computed(() => route.name === 'registro' || route.name === 'ajustes')
const showSettings = computed(() => route.name === 'calendario' || route.name === 'registro')
</script>

<template>
  <header class="app-header" role="banner">
    <div class="app-header__inner">
      <div class="app-header__side app-header__side--left">
        <RouterLink
          v-if="showBack"
          class="app-header__icon-btn btn"
          to="/calendario"
          aria-label="Volver al calendario"
          title="Volver"
        >
          <AppIcon name="back" :size="30" />
        </RouterLink>
      </div>

      <p
        class="app-header__brand"
        :aria-current="route.name === 'calendario' ? 'page' : undefined"
      >
        {{ title }}
      </p>

      <div class="app-header__side app-header__side--right">
        <RouterLink
          v-if="showSettings"
          class="app-header__icon-btn btn"
          to="/ajustes"
          aria-label="Ajustes"
          title="Ajustes"
        >
          <AppIcon name="settings" :size="28" />
        </RouterLink>
      </div>
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
  display: grid;
  grid-template-columns: minmax(3.25rem, auto) 1fr minmax(3.25rem, auto);
  align-items: center;
  gap: var(--space-2);
  width: min(100%, var(--max-width));
  min-height: var(--header-height);
  margin-inline: auto;
  padding: var(--space-2) var(--space-3);
}

.app-header__side {
  display: flex;
  align-items: center;
  min-height: 3.25rem;
}

.app-header__side--right {
  justify-content: flex-end;
}

.app-header__brand {
  margin: 0;
  font-size: clamp(1.15rem, 4.5vw, var(--fs-xl));
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
  text-align: center;
  line-height: 1.15;
}

.app-header__icon-btn {
  min-width: 3.25rem;
  min-height: 3.25rem;
  padding: 0.4rem;
}
</style>
