<script setup>
import { ref } from 'vue'

const props = defineProps({
  datos: {
    type: Array,
    required: true
  },
  columnas: {
    type: Array,
    required: true
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  noDataLabel: {
    type: String,
    default: 'Sin registros'
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 20, 50]
  },
  initialRowsPerPage: {
    type: Number,
    default: 10
  }
})

// Declarar los eventos que emite el componente
const emit = defineEmits(['eliminar', 'descargar', 'visualizar', 'editar'])

// Configuración de paginación interna
const pagination = ref({
  page: 1,
  rowsPerPage: props.initialRowsPerPage
})
</script>

<template>
  <div class="tabla-container">
    <q-table
      :rows="datos"
      :columns="columnas"
      :row-key="rowKey"
      flat
      dense
      separator="none"
      class="custom-table"
      :pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"
      :no-data-label="noDataLabel"
    >
      <!-- Estado -->
      <template #body-cell-estado="props">
        <q-td :props="props" class="text-center">
          <q-badge
            :color="props.row.estado === 'RECHAZADO' ? 'red' : 'green'"
            :label="props.row.estado"
            class="text-uppercase"
          />
        </q-td>
      </template>

      <!-- Estado con status numérico (0 = Activo, 1 = Inactivo) -->
      <template #body-cell-status="props">
        <q-td :props="props" class="text-center">
          <q-badge
            :color="props.row.status === 0 ? 'green' : 'red'"
            :label="props.row.status === 0 ? 'Activo' : 'Inactivo'"
            class="text-uppercase"
          />
        </q-td>
      </template>
      
      <!-- Acciones por defecto -->
      <template #body-cell-acciones="props">
        <q-td :props="props" class="text-center actions-column">
          <q-btn 
            dense 
            flat 
            round 
            icon="file_download" 
            color="grey-7"
            @click="emit('descargar', props.row)"
          >
            <q-tooltip>Descargar</q-tooltip>
          </q-btn>
          <q-btn 
            dense 
            flat 
            round 
            icon="visibility" 
            color="grey-7"
            @click="emit('visualizar', props.row)"
          >
            <q-tooltip>Visualizar</q-tooltip>
          </q-btn>
          <q-btn 
            dense 
            flat 
            round 
            icon="close" 
            color="grey-7"
            @click="emit('eliminar', props.row)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- Permitir slots personalizados desde el componente padre -->
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-table>
  </div>
</template>

<style scoped>
.tabla-container {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin: 35px auto;
  width: 95%;
  overflow-x: auto;
}

/* ==== Encabezado verde ==== */
:deep(.q-table thead tr th) {
  background-color: var(--color-secondary) !important;
  color: white !important;
  font-weight: bold;
  text-align: center;
  border: none !important;
  padding: 10px;
  font-size: 14px;
  white-space: nowrap;
}

:deep(.q-table thead tr:first-child th:first-child) {
  border-top-left-radius: 10px;
}

:deep(.q-table thead tr:first-child th:last-child) {
  border-top-right-radius: 10px;
}

/* ==== Cuerpo ==== */
:deep(.q-table tbody tr td) {
  text-align: center;
  border: none !important;
  font-size: 13px;
  padding: 10px 8px;
}

:deep(.q-table tbody tr) {
  border: none !important;
  box-shadow: none !important;
}

/* ==== Botones ==== */
:deep(.actions-column .q-btn) {
  margin: 0 5px;
}

/* Responsive - Tablets */
@media (max-width: 1024px) {
  .tabla-container {
    padding: 20px;
    margin: 25px auto;
    width: 98%;
  }
  
  :deep(.q-table thead tr th) {
    padding: 8px 6px;
    font-size: clamp(12px, 1.5vw, 14px);
  }
  
  :deep(.q-table tbody tr td) {
    padding: 8px 6px;
    font-size: clamp(11px, 1.5vw, 13px);
  }
  
  :deep(.actions-column .q-btn) {
    margin: 0 3px;
    padding: 4px;
  }
}

/* Responsive - Móviles grandes */
@media (max-width: 768px) {
  .tabla-container {
    padding: 16px;
    margin: 20px auto;
    width: 100%;
    border-radius: 10px;
  }
  
  :deep(.q-table thead tr th) {
    padding: 8px 4px;
    font-size: clamp(11px, 2vw, 13px);
  }
  
  :deep(.q-table tbody tr td) {
    padding: 8px 4px;
    font-size: clamp(10px, 2vw, 12px);
  }
  
  :deep(.actions-column .q-btn) {
    margin: 0 2px;
    padding: 3px;
    min-width: 32px;
    min-height: 32px;
  }
  
  :deep(.q-table) {
    font-size: 0.875rem;
  }
}

/* Responsive - Móviles medianos */
@media (max-width: 480px) {
  .tabla-container {
    padding: 12px;
    margin: 15px auto;
    border-radius: 8px;
  }
  
  :deep(.q-table thead tr th) {
    padding: 6px 3px;
    font-size: clamp(10px, 2.5vw, 12px);
  }
  
  :deep(.q-table tbody tr td) {
    padding: 6px 3px;
    font-size: clamp(9px, 2.5vw, 11px);
  }
  
  :deep(.actions-column) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
  }
  
  :deep(.actions-column .q-btn) {
    margin: 0;
    padding: 4px;
    min-width: 36px;
    min-height: 36px;
  }
  
  :deep(.q-table) {
    font-size: 0.8rem;
  }
}

/* Responsive - Móviles pequeños */
@media (max-width: 360px) {
  .tabla-container {
    padding: 10px;
    margin: 10px auto;
  }
  
  :deep(.q-table thead tr th) {
    padding: 5px 2px;
    font-size: clamp(9px, 3vw, 11px);
  }
  
  :deep(.q-table tbody tr td) {
    padding: 5px 2px;
    font-size: clamp(8px, 3vw, 10px);
  }
  
  :deep(.actions-column .q-btn) {
    min-width: 32px;
    min-height: 32px;
    padding: 3px;
  }
}

/* Responsive - Pantallas muy pequeñas (300px) */
@media (max-width: 300px) {
  .tabla-container {
    padding: 8px;
    margin: 8px auto;
    border-radius: 6px;
  }
  
  :deep(.q-table thead tr th) {
    padding: 4px 1px;
    font-size: clamp(8px, 3.5vw, 10px);
    white-space: normal;
    word-break: break-word;
    line-height: 1.2;
  }
  
  :deep(.q-table tbody tr td) {
    padding: 4px 1px;
    font-size: clamp(7px, 3.5vw, 9px);
    word-break: break-word;
    line-height: 1.3;
  }
  
  :deep(.actions-column) {
    flex-direction: column;
    gap: 2px;
  }
  
  :deep(.actions-column .q-btn) {
    min-width: 28px;
    min-height: 28px;
    padding: 2px;
  }
  
  :deep(.q-table) {
    font-size: 0.75rem;
  }
}
</style>