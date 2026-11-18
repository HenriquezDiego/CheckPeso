<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useWeightEntries } from '@/composables/useWeightEntries'
import { resolveStartRoute } from '@/utils/routing'

const router = useRouter()
const { dayStatus } = useWeightEntries()

onBeforeMount(() => {
  router.replace(resolveStartRoute(dayStatus))
})
</script>

<template>
  <section class="panel" aria-busy="true" aria-live="polite">
    <p class="lead">Abriendo…</p>
  </section>
</template>
