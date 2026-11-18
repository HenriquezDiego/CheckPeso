<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => {
  if (route.name === 'calendario') return 'Calendario'
  if (route.name === 'registro') return 'Registrar peso'
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
          class="app-header__back btn"
          to="/calendario"
          aria-label="Volver al calendario"
        >
          ← Calendario
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
          class="app-header__gear btn"
          to="/ajustes"
          aria-label="Ajustes"
          title="Ajustes"
        >
          <svg
            class="app-header__gear-icon"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.07 7.07 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.55-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.77 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.89 14.52a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.43.34.68.22l2.39-.96c.5.39 1.04.71 1.63.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.55 1.63-.94l2.39.96c.25.12.54.02.68-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
            />
          </svg>
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
  font-size: var(--fs-xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
  text-align: center;
}

.app-header__back {
  min-height: 3rem;
  padding: 0.55rem 0.9rem;
  font-size: var(--fs-base);
}

.app-header__gear {
  min-width: 3.25rem;
  min-height: 3.25rem;
  padding: 0.45rem;
}

.app-header__gear-icon {
  display: block;
}
</style>
