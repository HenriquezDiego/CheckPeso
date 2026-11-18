<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#contenido-principal">Ir al contenido</a>
    <AppHeader />
    <main id="contenido-principal" class="app-main" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>
