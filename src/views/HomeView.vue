<script setup>
</script>

<template>
  <section class="panel" aria-labelledby="home-title">
    <h1 id="home-title">CheckPeso</h1>

    <nav class="btn-stack" aria-label="Acciones principales">
      <RouterLink class="btn btn--primary btn--block" to="/registro">
        Registrar peso
      </RouterLink>
      <RouterLink class="btn btn--secondary btn--block" to="/calendario">
        Ver calendario
      </RouterLink>
    </nav>

    <h2 class="h2" style="margin-top: var(--space-5)">Colores</h2>
    <ul class="legend" aria-label="Leyenda de colores">
      <li class="legend__item">
        <span class="swatch swatch--official" aria-hidden="true" />
        <span>Martes y viernes (días oficiales)</span>
      </li>
      <li class="legend__item">
        <span class="swatch swatch--extra" aria-hidden="true" />
        <span>Días extras con registro</span>
      </li>
      <li class="legend__item">
        <span class="swatch swatch--done" aria-hidden="true" />
        <span>Día completo (entrada y salida)</span>
      </li>
    </ul>
  </section>
</template>
