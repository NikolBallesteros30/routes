<template>
  <q-btn
    :label="label || 'Cerrar'"
    class="boton-cerrar"
    unelevated
    :loading="loading"
    :disable="disable"
    @click="handleClick"
  />
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Cerrar'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.boton-cerrar {
  background-color: #FF0000;
  color: white;
  border-radius: 15px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  transition: background-color 0.3s ease;
  min-width: 44px;
  min-height: 44px;
}

.boton-cerrar:hover {
  background-color: #CC0000;
}

/* Responsive - Tablets */
@media (max-width: 1024px) {
  .boton-cerrar {
    padding: 10px 22px;
    font-size: clamp(14px, 2vw, 16px);
  }
}

/* Responsive - Móviles grandes */
@media (max-width: 768px) {
  .boton-cerrar {
    padding: 8px 20px;
    font-size: clamp(13px, 2.5vw, 15px);
    border-radius: 12px;
  }
}

/* Responsive - Móviles medianos */
@media (max-width: 480px) {
  .boton-cerrar {
    padding: 8px 16px;
    font-size: clamp(12px, 3vw, 14px);
    border-radius: 10px;
  }
}

/* Responsive - Móviles pequeños */
@media (max-width: 360px) {
  .boton-cerrar {
    padding: 6px 14px;
    font-size: clamp(11px, 3.5vw, 13px);
    border-radius: 8px;
  }
}

/* Responsive - Pantallas muy pequeñas (300px) */
@media (max-width: 300px) {
  .boton-cerrar {
    padding: 6px 10px;
    font-size: clamp(10px, 4vw, 12px);
    border-radius: 6px;
  }
}
</style>