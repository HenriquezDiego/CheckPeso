<script setup>
</script>

<template>
  <section class="panel" aria-labelledby="cal-title">
    <h1 id="cal-title">Calendario</h1>
    <p class="lead">
      Mes completo. Martes y viernes más grandes; días extras con otro color.
    </p>

    <div class="btn-stack" style="margin-top: var(--space-4)">
      <RouterLink class="btn btn--primary btn--block" to="/registro">
        Ir a registrar peso
      </RouterLink>
      <RouterLink class="btn btn--secondary btn--block" to="/">
        Volver al inicio
      </RouterLink>
    </div>
  </section>
</template>
