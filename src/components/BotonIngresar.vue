<template>
  <q-btn
    :label="label || 'INGRESAR'"
    class="boton-ingresar"
    unelevated
    :icon="icon || undefined"
    @click="handleClick"
  />
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'INGRESAR'
  },
  icon: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.boton-ingresar {
  background-color: var(--color-primary);
  color: white;
  border-radius: 15px;
  border: none;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
  min-width: 44px;
  min-height: 44px;
}

.boton-ingresar:hover {
  background-color: var(--color-primary-hover-dark);
}

/* Responsive - Tablets */
@media (max-width: 1024px) {
  .boton-ingresar {
    padding: 10px 22px;
    font-size: clamp(14px, 2vw, 16px);
  }
}

/* Responsive - Móviles grandes */
@media (max-width: 768px) {
  .boton-ingresar {
    padding: 8px 20px;
    font-size: clamp(13px, 2.5vw, 15px);
    border-radius: 12px;
  }
}

/* Responsive - Móviles medianos */
@media (max-width: 480px) {
  .boton-ingresar {
    padding: 8px 16px;
    font-size: clamp(12px, 3vw, 14px);
    border-radius: 10px;
    text-transform: uppercase;
  }
}

/* Responsive - Móviles pequeños */
@media (max-width: 360px) {
  .boton-ingresar {
    padding: 6px 14px;
    font-size: clamp(11px, 3.5vw, 13px);
    border-radius: 8px;
  }
}

/* Responsive - Pantallas muy pequeñas (300px) */
@media (max-width: 300px) {
  .boton-ingresar {
    padding: 6px 10px;
    font-size: clamp(10px, 4vw, 12px);
    border-radius: 6px;
  }
}
</style>