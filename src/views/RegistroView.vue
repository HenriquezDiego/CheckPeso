<script setup>
</script>

<template>
  <section class="panel" aria-labelledby="reg-title">
    <h1 id="reg-title">Registrar peso</h1>
    <p class="lead">
      Anota el peso de entrada y de salida. También puedes registrar un día extra.
    </p>

    <div class="btn-stack" style="margin-top: var(--space-4)">
      <RouterLink class="btn btn--secondary btn--block" to="/calendario">
        Ver calendario
      </RouterLink>
      <RouterLink class="btn btn--secondary btn--block" to="/">
        Volver al inicio
      </RouterLink>
    </div>
  </section>
</template>
