<template>
  <q-dialog v-model="isOpen">
    <q-card :style="cardStyle" class="modal-card">
      <q-card-section class="modal-header">
        <slot name="header">
          <div class="modal-title">Título por defecto</div>
        </slot>
      </q-card-section>
        
      <q-card-section class="modal-body">
        <slot name="body">
          <!-- Contenido por defecto si no se proporciona ningún slot -->
          <p class="modal-default-content">Contenido del diálogo por defecto, esto no se va a ver en el modal si colocan contenido</p>
        </slot>
      </q-card-section>

      <q-card-actions class="modal-footer" align="right">
        <slot name="footer">
        
        </slot>
        <slot name="actions">
        
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose, watch, defineEmits, computed } from 'vue';

const props = defineProps({
  width: {
    type: String,
    default: '400px'
  },
  maxWidth: {
    type: String,
    default: '95vw'
  }
})

const isOpen = ref(false);

const emit = defineEmits(['accept', 'update:modelValue']);

const cardStyle = computed(() => ({
  width: props.width,
  maxWidth: props.maxWidth
}))

const openDialog = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
};

const acceptDialog = () => {
  isOpen.value = false;
  emit('accept');
};

// Emitir cambios de estado para sincronización externa
watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

defineExpose({
  openDialog,
  closeDialog,
});
</script>

<style scoped>
/* ==================== ESTILOS UNIFICADOS MODAL COMPONENT ==================== */
/* Todos los estilos de modal centralizados aquí - no duplicar en vistas */

/* Card principal del modal */
.modal-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background-color: var(--color-bg-primary, #ffffff);
  transition: all 0.3s ease;
  max-width: 95vw !important; /* Fuerza el límite máximo en todas las pantallas */
  width: auto !important; /* Permite que se ajuste al contenido pero respete max-width */
}

/* Header del modal */
.modal-header {
  background-color: var(--color-primary, #39a900);
  color: var(--color-text-white, #ffffff);
  padding: 20px 24px;
  border-bottom: none;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

/* Body del modal */
.modal-body {
  padding: 24px;
  background-color: var(--color-bg-primary, #ffffff);
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
}

.modal-default-content {
  color: var(--color-text-secondary, #666);
  margin: 0;
  font-size: 0.95rem;
}

/* Footer del modal */
.modal-footer {
  padding: 16px 24px;
  background-color: var(--color-bg-primary, #ffffff);
  border-top: 1px solid var(--color-border-light, #e0e0e0);
  gap: 12px;
  flex-wrap: wrap;
}

/* ==================== ESTILOS PARA CONTENIDO COMÚN ==================== */

/* Títulos de sección */
:deep(.section-title) {
  color: var(--color-primary, #39a900);
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-left: 8px;
  border-left: 4px solid var(--color-border-primary, #39a900);
  line-height: 1.4;
}

/* Grid de datos */
:deep(.data-grid) {
  display: grid;
  gap: 16px;
  background-color: var(--color-bg-primary, #ffffff);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-light, #f0f0f0);
}

/* Filas de datos */
:deep(.data-row) {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light, #f5f5f5);
}

:deep(.data-row:last-child) {
  border-bottom: none;
}

/* Labels en negrita */
:deep(.text-weight-bold) {
  color: var(--color-text-primary, #2c3e50);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
}

/* Valores de datos */
:deep(.data-value) {
  color: var(--color-text-secondary, #34495e);
  font-size: 0.95rem;
  word-break: break-word;
  line-height: 1.4;
}

/* Estilos para texto que debe romperse */
:deep(.text-break) {
  word-break: break-all;
  word-wrap: break-word;
}

/* Estilos para destacar horas */
:deep(.hours-highlight) {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary, #39a900);
}

/* Cuerpo de confirmación */
:deep(.confirmation-body) {
  text-align: center;
  padding: 20px 0;
}

/* Texto de confirmación */
:deep(.confirmation-text) {
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.5;
  color: var(--color-text-primary, #333);
}

/* ==================== RESPONSIVE DESIGN ==================== */

/* Tablets y pantallas medianas (768px - 1024px) */
@media (max-width: 1024px) {
  .modal-card {
    margin: 12px;
    max-width: 95vw !important;
  }
  
  .modal-body {
    max-height: 65vh;
  }
  
  /* Ajustes específicos para data grid en tablets */
  :deep(.data-row) {
    grid-template-columns: 160px 1fr;
    gap: 12px;
    padding: 10px 0;
  }
  
  :deep(.text-weight-bold) {
    font-size: 0.92rem;
  }
  
  :deep(.data-value) {
    font-size: 0.92rem;
  }
  
  :deep(.section-title) {
    font-size: 1.25rem;
    margin-bottom: 18px;
  }
  
  :deep(.data-grid) {
    padding: 18px;
    gap: 14px;
  }
}

/* Tablets medianas (760px - 900px) - Rango problemático */
@media (max-width: 900px) and (min-width: 760px) {
  .modal-card {
    margin: 10px;
    max-width: 90vw !important; /* Más restrictivo en este rango */
    width: auto !important; /* Anula cualquier width fijo */
  }
  
  .modal-body {
    padding: 18px;
    max-height: 68vh;
  }
  
  .modal-header {
    padding: 18px 20px;
  }
  
  .modal-footer {
    padding: 14px 20px;
    gap: 10px;
  }
  
  /* Mejorar disposición de columnas en tablets */
  :deep(.row.q-col-gutter-lg) {
    margin: -10px;
  }
  
  :deep(.row.q-col-gutter-lg > *) {
    padding: 10px;
  }
  
  :deep(.data-row) {
    grid-template-columns: 140px 1fr;
    gap: 10px;
    padding: 8px 0;
  }
  
  :deep(.text-weight-bold) {
    font-size: 0.9rem;
    line-height: 1.3;
  }
  
  :deep(.data-value) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  :deep(.section-title) {
    font-size: 1.2rem;
    margin-bottom: 16px;
  }
  
  :deep(.data-grid) {
    padding: 16px;
    gap: 12px;
  }
  
  /* Formularios en tablets */
  :deep(.q-form .q-field) {
    margin-bottom: 14px;
  }
  
  :deep(.q-input .q-field__label) {
    font-size: 0.9rem;
  }
  
  :deep(.q-banner) {
    padding: 12px 14px;
  }
}

/* Pantallas específicas alrededor de 773px */
@media (max-width: 800px) and (min-width: 760px) {
  .modal-card {
    max-width: 85vw !important; /* Aún más restrictivo */
    width: auto !important;
    margin: 8px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-header {
    padding: 16px 18px;
  }
  
  .modal-footer {
    padding: 12px 18px;
  }
}

@media (max-width: 768px) {
  .modal-card {
    margin: 8px;
    border-radius: 12px;
    max-width: 95vw !important;
    min-width: auto !important;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .modal-body {
    padding: 20px;
    max-height: 60vh;
  }
  
  .modal-footer {
    padding: 12px 20px;
    flex-direction: column;
    gap: 8px;
  }
  
  /* Data grid responsive */
  :deep(.data-row) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px 0;
  }
  
  :deep(.text-weight-bold) {
    font-size: 0.9rem;
    color: var(--color-primary, #39a900);
    margin-bottom: 4px;
  }
  
  :deep(.data-value) {
    font-size: 0.9rem;
    padding-left: 12px;
  }
  
  :deep(.section-title) {
    font-size: 1.2rem;
    margin-bottom: 16px;
  }
  
  :deep(.data-grid) {
    padding: 16px;
    gap: 12px;
  }
  
  :deep(.hours-highlight) {
    font-size: 1.3rem;
  }
  
  :deep(.confirmation-text) {
    font-size: 15px;
    margin-bottom: 12px;
  }
}

/* Móviles (480px - 768px) */
@media (max-width: 480px) {
  .modal-card {
    margin: 4px;
    border-radius: 12px;
    max-width: 98vw !important;
  }
  
  .modal-header {
    padding: 12px 16px;
  }
  
  .modal-title {
    font-size: 1rem;
  }
  
  .modal-body {
    padding: 16px;
    max-height: 65vh;
  }
  
  .modal-footer {
    padding: 8px 16px;
    flex-direction: column;
    gap: 8px;
  }
  
  /* Botones full width en móvil */
  :deep(.modal-footer .q-btn) {
    width: 100%;
    margin: 0 !important;
  }
  
  :deep(.full-width-sm-auto) {
    width: 100% !important;
    margin-bottom: 8px;
  }
  
  :deep(.full-width-sm-auto:last-child) {
    margin-bottom: 0;
  }
  
  :deep(.section-title) {
    font-size: 1.1rem;
    margin-bottom: 12px;
  }
  
  :deep(.data-grid) {
    padding: 12px;
    gap: 10px;
  }
  
  :deep(.text-weight-bold) {
    font-size: 0.85rem;
  }
  
  :deep(.data-value) {
    font-size: 0.85rem;
  }
  
  :deep(.hours-highlight) {
    font-size: 1.2rem;
  }
  
  :deep(.confirmation-text) {
    font-size: 14px;
    margin-bottom: 10px;
  }
}

/* Móviles muy pequeños (< 480px) */
@media (max-width: 360px) {
  .modal-card {
    margin: 2px;
    border-radius: 8px;
    max-width: 99vw !important;
  }
  
  .modal-header {
    padding: 8px 12px;
  }
  
  .modal-title {
    font-size: clamp(0.9rem, 4vw, 1rem);
  }
  
  .modal-body {
    padding: 12px;
    max-height: 70vh;
  }
  
  .modal-footer {
    padding: 6px 12px;
  }
  
  :deep(.section-title) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
  
  :deep(.data-grid) {
    padding: 8px;
    gap: 8px;
  }
  
  :deep(.text-weight-bold) {
    font-size: 0.8rem;
  }
  
  :deep(.data-value) {
    font-size: 0.8rem;
  }
}

/* ==================== COMPATIBILIDAD CON QUASAR ==================== */

/* Overrides para componentes de Quasar */
:deep(.q-dialog .q-card) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Responsivo para el diálogo */
@media (max-width: 1024px) {
  :deep(.q-dialog) {
    margin: 12px;
  }
  
  :deep(.q-card) {
    max-width: 95vw !important;
    min-width: auto !important;
  }
}

/* Tablets medianas (760px - 900px) - Mejoras específicas */
@media (max-width: 900px) and (min-width: 760px) {
  :deep(.q-dialog) {
    margin: 10px;
  }
  
  :deep(.q-card) {
    max-width: 90vw !important; /* Más restrictivo */
    width: auto !important; /* Anula width fijo */
    min-width: auto !important; /* Anula min-width */
  }
}

/* Pantallas específicas alrededor de 773px */
@media (max-width: 800px) and (min-width: 760px) {
  :deep(.q-dialog) {
    margin: 8px;
  }
  
  :deep(.q-card) {
    max-width: 85vw !important; /* Aún más restrictivo */
    width: auto !important;
    min-width: auto !important;
  }
}

@media (max-width: 768px) {
  :deep(.q-dialog) {
    margin: 8px;
  }
  
  :deep(.q-card) {
    max-width: 95vw !important;
    min-width: auto !important;
  }
}

@media (max-width: 480px) {
  :deep(.q-dialog) {
    margin: 4px;
  }
  
  :deep(.q-card) {
    max-width: 98vw !important;
    border-radius: 12px;
  }
}

@media (max-width: 360px) {
  :deep(.q-dialog) {
    margin: 2px;
  }
  
  :deep(.q-card) {
    max-width: 99vw !important;
    border-radius: 8px;
  }
}

/* ==================== ESTILOS ADICIONALES PARA COMPATIBILIDAD ==================== */

/* Para formularios dentro de modales */
:deep(.q-form .q-field) {
  margin-bottom: 16px;
}

:deep(.q-form .q-field__label) {
  color: var(--color-text-primary, #2c3e50);
  font-weight: 500;
}

/* Para tablas dentro de modales */
:deep(.q-table) {
  box-shadow: none;
  border-radius: 8px;
  border: 1px solid var(--color-border-light, #e0e0e0);
}

/* Para chips y badges */
:deep(.q-chip) {
  border-radius: 6px;
}

:deep(.q-badge) {
  border-radius: 4px;
}

/* Para botones dentro del modal */
:deep(.q-btn) {
  border-radius: 6px;
  font-weight: 500;
  text-transform: none;
}

/* Scroll personalizado para el body del modal */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--color-border-light, #e0e0e0);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-light, #888);
}

/* ==================== GRID RESPONSIVE COLUMNS ==================== */

/* Ajustes para columnas en responsive */
@media (max-width: 1024px) {
  :deep(.row.q-col-gutter-lg),
  :deep(.row.q-col-gutter-md) {
    margin: -12px;
  }
  
  :deep(.row.q-col-gutter-lg > *),
  :deep(.row.q-col-gutter-md > *) {
    padding: 12px;
  }
}

@media (max-width: 900px) and (min-width: 760px) {
  :deep(.row.q-col-gutter-lg),
  :deep(.row.q-col-gutter-md) {
    margin: -10px;
  }
  
  :deep(.row.q-col-gutter-lg > *),
  :deep(.row.q-col-gutter-md > *) {
    padding: 10px;
  }
  
  /* Mejora para columnas en tablets */
  :deep(.col-md-6) {
    width: 100%;
    max-width: 100%;
  }
  
  /* Solo mantener 2 columnas en pantallas más grandes */
  @media (min-width: 850px) {
    :deep(.col-md-6) {
      width: 50%;
      max-width: 50%;
    }
  }
}

@media (max-width: 768px) {
  :deep(.row.q-col-gutter-lg),
  :deep(.row.q-col-gutter-md) {
    margin: -8px;
  }
  
  :deep(.row.q-col-gutter-lg > *),
  :deep(.row.q-col-gutter-md > *) {
    padding: 8px;
  }
  
  :deep(.col-md-6) {
    width: 100%;
    max-width: 100%;
  }
}

/* Timeline responsive */
:deep(.q-timeline) {
  padding: 16px 0;
}

@media (max-width: 480px) {
  :deep(.q-timeline) {
    padding: 12px 0;
  }
  
  :deep(.q-timeline__entry) {
    padding-left: 20px;
  }
}

/* Banner responsive */
:deep(.q-banner) {
  border-radius: 8px;
  padding: 12px 16px;
}

@media (max-width: 480px) {
  :deep(.q-banner) {
    padding: 8px 12px;
  }
}
</style>