<template>
  <q-page class="q-pa-md history-page">
    <BackButton class="q-mb-lg" />

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader 
              title="Historial de Estadísticas" 
              description="Revisa el historial de métricas y cambios a lo largo del tiempo." 
            />
          </q-card-section>
        </q-card>

        <div class="filters-wrapper flex items-center justify-between q-my-lg">
          <div class="filters-left flex items-center bg-white">
            <div class="filter-item">
              <label class="filter-label">TIPO DE ESTADÍSTICA</label>
              <q-select
                v-model="filtersData.type"
                :options="typeOptions"
                outlined
                dense
                emit-value
                map-options
                clearable
                placeholder="Todas"
                @update:model-value="handleTypeChange"
              >
                <template #prepend>
                  <q-icon name="category" color="green-8" />
                </template>
              </q-select>
            </div>

            <div class="filter-item">
              <label class="filter-label">PERÍODO</label>
              <q-select
                v-model="filtersData.period"
                :options="periodOptions"
                outlined
                dense
                emit-value
                map-options
                clearable
                placeholder="Todos"
                @update:model-value="handlePeriodChange"
              >
                <template #prepend>
                  <q-icon name="date_range" color="green-8" />
                </template>
              </q-select>
            </div>

            <div class="filter-item">
              <label class="filter-label">FECHA DESDE</label>
              <q-input
                v-model="filtersData.startDate"
                outlined
                dense
                type="date"
                placeholder="DD/MM/AAAA"
                @update:model-value="handleDateChange"
              >
                <template #prepend>
                  <q-icon name="event" color="green-8" />
                </template>
                <template #append>
                  <q-icon 
                    v-if="filtersData.startDate"
                    name="close" 
                    class="cursor-pointer" 
                    @click.stop="clearStartDate"
                  />
                </template>
              </q-input>
            </div>

            <div class="filter-item">
              <label class="filter-label">FECHA HASTA</label>
              <q-input
                v-model="filtersData.endDate"
                outlined
                dense
                type="date"
                placeholder="DD/MM/AAAA"
                @update:model-value="handleDateChange"
              >
                <template #prepend>
                  <q-icon name="event" color="green-8" />
                </template>
                <template #append>
                  <q-icon 
                    v-if="filtersData.endDate"
                    name="close" 
                    class="cursor-pointer" 
                    @click.stop="clearEndDate"
                  />
                </template>
              </q-input>
            </div>
          </div>

        </div>

        <!-- Tabla de Estadísticas -->
        <Table
          card
          :rows="rowsStatistics"
          :columns="columnsStatistics"
          v-model:pagination="pagination"
          :loading="loadingTable"
          row-key="_id"
          @request="handlePaginationRequest"
        >
          <template #body-cell-type="props">
            <q-td :props="props">
              <q-badge
                :color="getTypeColor(props.row.type)"
                class="text-uppercase"
              >
                {{ getTypeLabel(props.row.type) }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-period="props">
            <q-td :props="props">
              <q-badge color="grey-7" class="text-uppercase">
                {{ getPeriodLabel(props.row.period) }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdAt) }}
            </q-td>
          </template>

          <template #body-cell-options="props">
            <q-td :props="props" class="text-center table-options">
              <ButtonTableOptions
                icon="visibility"
                color="primary"
                tooltip="Ver Detalles"
                @click="openDetailsDialogStatistics(props.row)"
              />
              <ButtonTableOptions
                icon="download"
                color="secondary"
                tooltip="Descargar"
                @click="downloadStatistic(props.row)"
              />
            </q-td>
          </template>

          <template #no-data>
            <div class="q-pa-md flex flex-center column text-grey full-width">
              <q-icon name="analytics" size="2.5em" color="grey-5" />
              <div class="text-subtitle2 q-mt-sm">
                No hay estadísticas guardadas
              </div>
            </div>
          </template>
        </Table>

        <!-- Modal de Detalles -->
        <Modal v-model="showDetailDialog" variant="view" width="1000px" max-width="95vw">
          <template #header>
            <div class="modal-header-content">
              <div class="text-h6">Detalle de Estadística</div>
            </div>
          </template>

          <template #body>
            <div v-if="selectedStatistic" class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Información General</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Tipo:</div>
                    <div class="data-value">{{ getTypeLabel(selectedStatistic.type) }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Período:</div>
                    <div class="data-value">{{ getPeriodLabel(selectedStatistic.period) }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Fecha Generación:</div>
                    <div class="data-value">{{ formatDate(selectedStatistic.createdAt) }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Descripción:</div>
                    <div class="data-value">{{ selectedStatistic.description || '-' }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Datos de la Estadística</div>
                <div class="data-grid">
                  <q-scroll-area style="height: 300px;">
                    <pre class="data-preview">{{ JSON.stringify(selectedStatistic.data, null, 2) }}</pre>
                  </q-scroll-area>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              label="Cerrar"
              color="negative"
              @click="closeDetailsDialogStatistics"
            />
          </template>
        </Modal>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotifications } from 'src/composables/useNotifications'
import { useEntityManager } from 'src/composables/useEntityManager'

import BackButton from 'src/components/BackButton.vue'
import Button from 'src/components/Button.vue'
import ButtonTableOptions from 'src/components/ButtonTableOptions.vue'
import PageHeader from 'src/components/PageHeader.vue'
import Table from 'src/components/Table.vue'
import Modal from 'src/components/Modal.vue'

// ==================== NOTIFICACIONES ====================
const { error, success } = useNotifications()

// ==================== CONFIGURACIÓN DEL COMPOSABLE ====================

// Estructura del formulario (no se usa para historial, pero es requerido)
const getDefaultFormData = () => ({
  _id: '',
  type: '',
  period: '',
  description: '',
  createdAt: '',
  data: null
})

// Endpoints de la API
const endpoints = {
  list: '/statistics'
}

// Mensajes personalizados
const customMessages = {
  listError: 'Error al obtener historial de estadísticas',
  noData: 'No hay estadísticas guardadas'
}

// Función para procesar respuesta de la API
const processStatisticsHistoryResponse = (response) => {
  const data = response?.data || response?.msg?.statistics || []
  return {
    data,
    total: response?.msg?.totalDocuments || data.length
  }
}

// Inicializar composable
const {
  // Estados
  loadingTable,
  rows,
  showDetailDialog,
  selectedEntity,
  pagination,
  filtersData,
  
  // Funciones
  handlePaginationRequest: handlePaginationRequestBase,
  openDetailsDialog,
  closeDetailsDialog,
  fetchEntities
} = useEntityManager({
  entityName: 'estadística',
  entityNamePlural: 'estadísticas',
  getDefaultFormData,
  endpoints,
  messages: customMessages,
  processResponse: processStatisticsHistoryResponse
})

// ==================== ALIAS CON NOMBRES ESTANDARIZADOS ====================

// Estados
const rowsStatistics = rows
const selectedStatistic = selectedEntity

// Funciones para modales
const openDetailsDialogStatistics = openDetailsDialog
const closeDetailsDialogStatistics = closeDetailsDialog

// ==================== EXTENDER FILTROS PARA HISTORIAL ====================
// Añadir campos personalizados a filtersData
filtersData.value.type = ''
filtersData.value.period = ''
filtersData.value.startDate = ''
filtersData.value.endDate = ''

// ==================== OPCIONES DE FILTROS ====================
const typeOptions = [
  { label: 'Todas', value: '' },
  { label: 'Generales', value: 'general' },
  { label: 'Aprendices', value: 'apprentices' },
  { label: 'Instructores', value: 'instructors' }
]

const periodOptions = [
  { label: 'Todos', value: '' },
  { label: 'Diario', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensual', value: 'monthly' },
  { label: 'Anual', value: 'yearly' },
  { label: 'Personalizado', value: 'custom' }
]

// ==================== COLUMNAS DE TABLA ====================
const columnsStatistics = [
  { name: 'type', label: 'Tipo', align: 'center', field: 'type' },
  { name: 'period', label: 'Período', align: 'center', field: 'period' },
  { name: 'description', label: 'Descripción', align: 'left', field: 'description' },
  { name: 'createdAt', label: 'Fecha Creación', align: 'center', field: 'createdAt' },
  { name: 'options', label: 'Acciones', align: 'center' }
]

// ==================== FUNCIONES PRINCIPALES ====================

/**
 * Obtiene el historial de estadísticas
 */
const fetchStatisticsHistory = async () => {
  await fetchEntities()
}

/**
 * Maneja el cambio de paginación
 */
const handlePaginationRequest = (props) => {
  handlePaginationRequestBase(props)
}

/**
 * Maneja cambios en el filtro de tipo
 */
const handleTypeChange = () => {
  pagination.value.page = 1
  fetchStatisticsHistory()
}

/**
 * Maneja cambios en el filtro de período
 */
const handlePeriodChange = () => {
  pagination.value.page = 1
  fetchStatisticsHistory()
}

/**
 * Maneja cambios en los filtros de fecha
 */
const handleDateChange = () => {
  pagination.value.page = 1
  fetchStatisticsHistory()
}

/**
 * Limpia el filtro de fecha de inicio
 */
const clearStartDate = () => {
  filtersData.value.startDate = ''
  handleDateChange()
}

/**
 * Limpia el filtro de fecha de fin
 */
const clearEndDate = () => {
  filtersData.value.endDate = ''
  handleDateChange()
}

/**
 * Limpia todos los filtros
 */
const clearAllFilters = () => {
  filtersData.value.type = ''
  filtersData.value.period = ''
  filtersData.value.startDate = ''
  filtersData.value.endDate = ''
  pagination.value.page = 1
  fetchStatisticsHistory()
}

/**
 * Descarga una estadística en formato JSON
 */
const downloadStatistic = (row) => {
  try {
    const exportData = {
      tipo: getTypeLabel(row.type),
      periodo: getPeriodLabel(row.period),
      descripcion: row.description || '-',
      fechaGeneracion: formatDate(row.createdAt),
      datos: row.data
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `estadistica_${row.type}_${new Date(row.createdAt).getTime()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    success('Estadística descargada correctamente')
  } catch (err) {
    error('Error al descargar la estadística')
  }
}

// ==================== FUNCIONES DE FORMATO ====================

/**
 * Obtiene la etiqueta del tipo de estadística
 */
const getTypeLabel = (type) => {
  const labels = {
    general: 'Generales',
    apprentices: 'Aprendices',
    instructors: 'Instructores'
  }
  return labels[type] || type
}

/**
 * Obtiene el color del tipo de estadística
 */
const getTypeColor = (type) => {
  const colors = {
    general: 'primary',
    apprentices: 'secondary',
    instructors: 'accent'
  }
  return colors[type] || 'grey-7'
}

/**
 * Obtiene la etiqueta del período
 */
const getPeriodLabel = (period) => {
  const labels = {
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',
    custom: 'Personalizado'
  }
  return labels[period] || period || '-'
}

/**
 * Formatea una fecha para mostrarla
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ==================== LIFECYCLE ====================

onMounted(() => {
  fetchStatisticsHistory()
})
</script>

<style lang="sass" scoped>
.history-page
  background: #f5f7fb
  min-height: 100vh

.hero-card
  border-radius: 20px
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%)

.filters-wrapper
  gap: 12px
  flex-wrap: wrap
  margin-left: 80px

.filters-left
  gap: 12px
  padding: 12px 16px 12px 8px
  border-radius: 16px
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08)
  flex-wrap: wrap

.filter-item
  min-width: 200px

.filter-item .filter-label
  display: block
  font-weight: 600
  font-size: 14px
  margin-bottom: 8px
  color: #2c3e50
  text-transform: uppercase

// Estilos para los iconos
:deep(.q-field__prepend .q-icon)
  color: #4CAF50 !important

// Estilo para el icono de limpiar fecha
:deep(.q-field__append .q-icon)
  color: #999
  font-size: 18px
  
  &:hover
    color: #666

// Forzar placeholder en mayúsculas para inputs de fecha
:deep(.q-field__native)
  text-transform: uppercase

:deep(input[type="date"])
  text-transform: uppercase
  
:deep(input[type="date"]::-webkit-datetime-edit-text),
:deep(input[type="date"]::-webkit-datetime-edit-month-field),
:deep(input[type="date"]::-webkit-datetime-edit-day-field),
:deep(input[type="date"]::-webkit-datetime-edit-year-field)
  text-transform: uppercase

.table-options
  display: flex
  align-items: center
  justify-content: center
  gap: 8px

.data-preview
  background: #f5f5f5
  padding: 16px
  border-radius: 8px
  font-size: 12px
  overflow-x: auto
  white-space: pre-wrap
  word-wrap: break-word

// Badges
:deep(.q-badge)
  padding: 6px 12px
  border-radius: 6px
  font-weight: 500
  font-size: 0.85rem

@media (max-width: 1024px)
  .filters-wrapper
    flex-direction: column
    align-items: stretch
    margin-left: 0

  .filters-left
    width: 100%

  .actions-right
    justify-content: flex-start

@media (max-width: 768px)
  .filter-item
    width: 100%
    min-width: unset

  .actions-right
    width: 100%

  .data-row
    grid-template-columns: 1fr
    gap: 8px

    .text-weight-bold
      margin-bottom: 4px
</style>