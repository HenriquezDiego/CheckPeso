<script setup>
import { nextTick, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmLabel: {
    type: String,
    default: 'Confirmar',
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar',
  },
  danger: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

let previousOverflow = ''

function onKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('cancel')
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      document.getElementById('confirm-modal-cancel')?.focus()
    } else {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  window.removeEventListener('keydown', onKeydown)
})

function onBackdrop(event) {
  if (event.target === event.currentTarget) {
    emit('cancel')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-backdrop"
      role="presentation"
      @click="onBackdrop"
    >
      <div
        class="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
      >
        <h2 id="confirm-modal-title" class="modal__title">{{ title }}</h2>
        <p id="confirm-modal-desc" class="modal__message">{{ message }}</p>

        <div class="modal__actions btn-stack">
          <button
            type="button"
            class="btn btn--block"
            :class="danger ? 'btn--danger' : 'btn--primary'"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
          <button
            id="confirm-modal-cancel"
            type="button"
            class="btn btn--secondary btn--block"
            @click="emit('cancel')"
          >
            {{ cancelLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: var(--space-3);
  background: color-mix(in srgb, #111 55%, transparent);
}

.modal {
  width: min(100%, 22rem);
  padding: var(--space-4);
  border: 3px solid var(--color-border);
  border-radius: calc(var(--radius) + 4px);
  background: var(--color-surface);
  box-shadow: 0 16px 40px color-mix(in srgb, #111 28%, transparent);
}

.modal__title {
  margin: 0 0 var(--space-2);
  font-size: var(--fs-xl);
  font-weight: 900;
  line-height: 1.2;
  color: var(--color-text);
  text-align: center;
}

.modal__message {
  margin: 0 0 var(--space-4);
  font-size: var(--fs-lg);
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-text-muted);
  text-align: center;
}

.modal__actions {
  gap: var(--space-2);
}
</style>
