<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 28,
  },
})
</script>

<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Flecha atrás -->
    <path
      v-if="name === 'back'"
      fill="currentColor"
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
    />
    <!-- Mes anterior -->
    <path
      v-else-if="name === 'chevron-left'"
      fill="currentColor"
      d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
    />
    <!-- Mes siguiente -->
    <path
      v-else-if="name === 'chevron-right'"
      fill="currentColor"
      d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
    />
    <!-- Hoy / día actual -->
    <path
      v-else-if="name === 'today'"
      fill="currentColor"
      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
    />
    <!-- Calendario -->
    <path
      v-else-if="name === 'calendar'"
      fill="currentColor"
      d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
    />
    <!-- Báscula / peso -->
    <path
      v-else-if="name === 'scale'"
      fill="currentColor"
      d="M12 3a4 4 0 0 0-4 4h2a2 2 0 1 1 4 0h2a4 4 0 0 0-4-4zm-7 6v12h14V9H5zm2 2h10v8H7v-8zm3.5 2-.9 4h3.8l-.9-4H10.5z"
    />
    <!-- Check bold dentro de círculo (recorte: se ve bien en verde o en leyenda) -->
    <path
      v-else-if="name === 'check'"
      fill="currentColor"
      fill-rule="evenodd"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 7.05-1.6-1.6-5.05 5.05-2.65-2.65-1.6 1.6 4.25 4.25 6.65-6.65z"
    />
    <!-- Check simple (botones de guardar) -->
    <path
      v-else-if="name === 'check-plain'"
      fill="currentColor"
      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
    />
    <!-- Ajustes -->
    <path
      v-else-if="name === 'settings'"
      fill="currentColor"
      d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.07 7.07 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.55-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.77 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.89 14.52a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.43.34.68.22l2.39-.96c.5.39 1.04.71 1.63.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.55 1.63-.94l2.39.96c.25.12.54.02.68-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
    />
    <!-- Gota de sangre (días oficiales Mar/Vie) -->
    <path
      v-else-if="name === 'blood' || name === 'official'"
      fill="currentColor"
      d="M12 2.5C12 2.5 6 9.2 6 13.2a6 6 0 0 0 12 0C18 9.2 12 2.5 12 2.5zm0 14.7a2.7 2.7 0 0 1-2.7-2.7c0-1.5 2.7-4.6 2.7-4.6s2.7 3.1 2.7 4.6a2.7 2.7 0 0 1-2.7 2.7z"
    />
    <!-- Día extra -->
    <circle v-else-if="name === 'extra'" cx="12" cy="12" r="8" fill="currentColor" />
    <!-- Completo -->
    <path
      v-else-if="name === 'done'"
      fill="currentColor"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.3-4.2-4.2 1.4-1.4 2.8 2.8 5.6-5.6 1.4 1.4-7 7z"
    />
    <!-- Descargar -->
    <path
      v-else-if="name === 'download'"
      fill="currentColor"
      d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
    />
    <!-- Subir -->
    <path
      v-else-if="name === 'upload'"
      fill="currentColor"
      d="M5 20h14v-2H5v2zM5 10l7-7 7 7h-4v6H9v-6H5z"
    />
    <!-- Borrar -->
    <path
      v-else-if="name === 'trash'"
      fill="currentColor"
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
    />
  </svg>
</template>

<style scoped>
.app-icon {
  display: block;
  flex-shrink: 0;
}
</style>
