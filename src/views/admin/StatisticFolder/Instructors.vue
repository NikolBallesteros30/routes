<template>
  <q-page class="q-pa-md instructors-statistics-page">
    <BackButton class="q-mb-lg" />

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader 
              title="Estadísticas de Instructores" 
              description="Indicadores del desempeño y carga de instructores." 
            />
          </q-card-section>
        </q-card>

        <!-- Filtros y Acciones -->
        <div class="filters-wrapper flex items-center justify-between q-my-lg">
          <div class="filters-left flex items-center bg-white">
            <div class="filter-item">
              <label class="filter-label">FECHA DESDE</label>
              <q-input
                v-model="filtersData.startDate"
                outlined
                dense
                type="date"
                placeholder="DD/MM/AAAA"
                @update:model-value="handleFilterChange"
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
                @update:model-value="handleFilterChange"
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

          <div class="actions-right row items-center q-gutter-sm">
            <Button
              label="Generar Estadísticas"
              custom-class="gradient-btn"
              icon="analytics"
              @click="generateStatistics"
              :loading="loading"
            />
            <Button
              label="Repfora EP"
              custom-class="gradient-btn"
              icon="school"
              @click="fetchRepforaStatistics"
              :loading="loadingRepfora"
            />
          </div>
        </div>

        <!-- Loader mientras carga -->
        <div v-if="loadingTable" class="loading-state">
          <q-card class="shadow-1">
            <q-card-section class="text-center q-pa-xl">
              <q-spinner-dots size="64px" color="primary" />
              <div class="text-h6 q-mt-md text-grey-7">
                Cargando estadísticas...
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Contenido de estadísticas generales -->
        <template v-else-if="rowsStatistics">
          <!-- Resumen Principal -->
          <div class="q-mb-lg">
            <q-card class="shadow-1 summary-card">
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="school" size="48px" color="primary" />
                      <div class="summary-value">{{ rowsStatistics.totalInstructors || 0 }}</div>
                      <div class="summary-label">Total Instructores</div>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="access_time" size="48px" color="secondary" />
                      <div class="summary-value">
                        {{ rowsStatistics.hoursStatistics?.totalCapacityHours || 0 }}
                      </div>
                      <div class="summary-label">Horas Capacidad Total</div>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="schedule" size="48px" color="accent" />
                      <div class="summary-value">
                        {{ rowsStatistics.hoursStatistics?.totalWorkedHours || 0 }}
                      </div>
                      <div class="summary-label">Horas Trabajadas Total</div>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="timeline" size="48px" color="positive" />
                      <div class="summary-value">
                        {{ rowsStatistics.hoursStatistics?.avgWorkedHours?.toFixed(1) || 0 }}
                      </div>
                      <div class="summary-label">Promedio Horas Trabajadas</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráficas -->
          <div class="row q-col-gutter-md q-mb-lg">
            <!-- Por Área Temática -->
            <div v-if="rowsStatistics.byThematicArea?.length" class="col-12 col-md-6">
              <q-card class="shadow-1">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Por Área Temática</div>
                  <div class="chart-container-medium">
                    <canvas ref="thematicAreaChartRef"></canvas>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Por Tipo de Vinculación -->
            <div v-if="rowsStatistics.byBindingType?.length" class="col-12 col-md-6">
              <q-card class="shadow-1">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Por Tipo de Vinculación</div>
                  <div class="chart-container-medium">
                    <canvas ref="bindingTypeChartRef"></canvas>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Top Instructores -->
          <div v-if="rowsStatistics?.topInstructors?.length" class="q-mb-lg">
            <q-card class="shadow-1">
              <q-card-section>
                <div class="text-h6 q-mb-md">Top 10 Instructores (Horas Trabajadas)</div>
                <Table
                  card
                  :rows="rowsStatistics.topInstructors"
                  :columns="topInstructorsColumns"
                  row-key="_id"
                  :hide-pagination="true"
                />
              </q-card-section>
            </q-card>
          </div>
        </template>

        <!-- Estadísticas REPFORA EP -->
        <div v-if="rowsRepfora" class="q-mb-lg">
          <q-card class="shadow-1">
            <q-card-section>
              <div class="text-h6 q-mb-md">Instructores en REPFORA EP</div>
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-md-3">
                  <q-card flat bordered class="stat-mini-card">
                    <q-card-section>
                      <div class="text-caption text-grey-7">Total Únicos</div>
                      <div class="text-h5 text-primary">
                        {{ rowsRepfora.uniqueInstructors || 0 }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-3">
                  <q-card flat bordered class="stat-mini-card">
                    <q-card-section>
                      <div class="text-caption text-grey-7">Técnicos</div>
                      <div class="text-h5 text-secondary">
                        {{ rowsRepfora.technicalInstructors || 0 }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-3">
                  <q-card flat bordered class="stat-mini-card">
                    <q-card-section>
                      <div class="text-caption text-grey-7">Proyecto</div>
                      <div class="text-h5 text-accent">
                        {{ rowsRepfora.projectInstructors || 0 }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-3">
                  <q-card flat bordered class="stat-mini-card">
                    <q-card-section>
                      <div class="text-caption text-grey-7">Seguimiento</div>
                      <div class="text-h5 text-positive">
                        {{ rowsRepfora.followInstructors || 0 }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <!-- Distribución por Área Temática -->
              <div v-if="rowsRepfora.instructorsByThematicArea?.length">
                <div class="text-subtitle1 q-mb-sm">Distribución por Área Temática</div>
                <div class="row q-col-gutter-sm">
                  <div
                    v-for="area in rowsRepfora.instructorsByThematicArea"
                    :key="area._id"
                    class="col-12 col-md-6 col-lg-4"
                  >
                    <q-card flat bordered>
                      <q-card-section class="q-pa-sm">
                        <div class="text-weight-bold">{{ area._id }}</div>
                        <div class="text-caption text-grey-7">
                          {{ area.count }} instructor(es)
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Estado Vacío -->
        <div v-if="!rowsStatistics && !rowsRepfora && !loadingTable && !loadingRepfora" class="empty-state">
          <q-card class="shadow-1">
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="analytics" size="64px" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-7">
                No hay estadísticas para mostrar
              </div>
              <div class="text-body2 text-grey-6 q-mt-sm">
                Presiona "Generar Estadísticas" para estadísticas generales o "Repfora EP" para instructores asignados
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useEntityManager } from 'src/composables/useEntityManager'
import { getData, postData } from 'src/services/apiClient'
import { useNotifications } from 'src/composables/useNotifications'
import BackButton from 'src/components/BackButton.vue'
import Button from 'src/components/Button.vue'
import PageHeader from 'src/components/PageHeader.vue'
import Table from 'src/components/Table.vue'
import Chart from 'chart.js/auto'

// ==================== NOTIFICACIONES ====================
const { error, success } = useNotifications()

// ==================== CONFIGURACIÓN DEL COMPOSABLE ====================

// Estructura del formulario (no se usa para estadísticas, pero es requerido)
const getDefaultFormData = () => ({
  startDate: '',
  endDate: ''
})

// Endpoints de la API
const endpoints = {
  list: '/statistics/generate/instructors'
}

// Mensajes personalizados
const customMessages = {
  listError: 'Error al generar estadísticas de instructores',
  noData: 'No hay estadísticas disponibles'
}

// Inicializar composable
const {
  // Estados
  loading,
  loadingTable,
  filtersData,
  
  // Funciones
  resetPaginationState
} = useEntityManager({
  entityName: 'estadística',
  entityNamePlural: 'estadísticas',
  getDefaultFormData,
  endpoints,
  messages: customMessages
})

// ==================== EXTENDER FILTROS PARA ESTADÍSTICAS ====================
// Añadir campos de fecha a filtersData
filtersData.value.startDate = ''
filtersData.value.endDate = ''

// ==================== ESTADOS ESPECÍFICOS ====================
const rowsStatistics = ref(null)
const rowsRepfora = ref(null)
const loadingRepfora = ref(false)

// Referencias para gráficas
const thematicAreaChartRef = ref(null)
const bindingTypeChartRef = ref(null)

let thematicChartInstance = null
let bindingChartInstance = null

// ==================== COLUMNAS DE TABLAS ====================
const topInstructorsColumns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'thematicarea', label: 'Área Temática', align: 'center', field: 'thematicarea' },
  { name: 'bindingtype', label: 'Tipo Vinculación', align: 'center', field: 'bindingtype' },
  { name: 'caphour', label: 'Cap. Horas', align: 'center', field: 'caphour' },
  { name: 'hourswork', label: 'Horas Trabajadas', align: 'center', field: 'hourswork' }
]

// ==================== FUNCIONES PRINCIPALES ====================

/**
 * Genera las estadísticas generales según los filtros aplicados
 */
const generateStatistics = async () => {
  loading.value = true
  loadingTable.value = true
  
  try {
    const payload = buildPayloadStatistics()
    
    if (payload === null) {
      loading.value = false
      loadingTable.value = false
      return
    }

    const response = await postData('/statistics/generate/instructors', payload)
    success(response?.msg || 'Estadísticas generadas correctamente')
    
    // Procesar respuesta del backend
    if (response?.data) {
      rowsStatistics.value = response.data
    } else if (response && typeof response === 'object' && !response.msg) {
      rowsStatistics.value = response
    } else {
      rowsStatistics.value = null
    }
    
    await nextTick()
    renderCharts()
  } catch (err) {
    const message = err?.response?.data?.msg || err?.response?.data?.message || 
                   err?.message || 'Error al generar estadísticas'
    error(message)
    rowsStatistics.value = null
  } finally {
    loading.value = false
    loadingTable.value = false
  }
}

/**
 * Obtiene las estadísticas de REPFORA EP
 */
const fetchRepforaStatistics = async () => {
  loadingRepfora.value = true
  
  try {
    const response = await getData('/statistics/instructors/repfora')
    
    // Procesar respuesta del backend
    if (response?.data) {
      rowsRepfora.value = response.data
    } else if (response && typeof response === 'object' && !response.msg) {
      rowsRepfora.value = response
    } else {
      rowsRepfora.value = null
    }
    
    success('Estadísticas de REPFORA EP obtenidas correctamente')
  } catch (err) {
    const message = err?.response?.data?.msg || err?.response?.data?.message || 
                   err?.message || 'Error al obtener estadísticas de REPFORA EP'
    error(message)
    rowsRepfora.value = null
  } finally {
    loadingRepfora.value = false
  }
}

/* Construye el payload para enviar a la API*/
const buildPayloadStatistics = () => {
  const payload = {}
  
  if (filtersData.value.startDate && filtersData.value.endDate) {
    payload.startDate = filtersData.value.startDate
    payload.endDate = filtersData.value.endDate
  } else if (filtersData.value.startDate || filtersData.value.endDate) {
    error('Debes especificar ambas fechas o ninguna')
    return null
  }
  
  return payload
}

/**
 * Maneja cambios en los filtros
 */
const handleFilterChange = () => {
  // Los filtros se aplican al hacer clic en "Generar Estadísticas"
}

/*Limpia el filtro de fecha de inicio*/
const clearStartDate = () => {
  filtersData.value.startDate = ''
}

/*Limpia el filtro de fecha de filtros*/
const clearEndDate = () => {
  filtersData.value.endDate = ''
}
// ==================== FUNCIONES DE GRÁFICAS ====================
/*Destruye todas las instancias de gráficas*/
const destroyCharts = () => {
  if (thematicChartInstance) {
    thematicChartInstance.destroy()
    thematicChartInstance = null
  }
  if (bindingChartInstance) {
    bindingChartInstance.destroy()
    bindingChartInstance = null
  }
}

/**
 * Renderiza todas las gráficas disponibles
 */
const renderCharts = () => {
  destroyCharts()
  
  if (rowsStatistics.value?.byThematicArea?.length && thematicAreaChartRef.value) {
    renderThematicAreaChart()
  }
  
  if (rowsStatistics.value?.byBindingType?.length && bindingTypeChartRef.value) {
    renderBindingTypeChart()
  }
}

/**
 * Renderiza gráfica de áreas temáticas
 */
const renderThematicAreaChart = () => {
  const ctx = thematicAreaChartRef.value.getContext('2d')
  const data = rowsStatistics.value.byThematicArea

  thematicChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(item => item._id),
      datasets: [{
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(45, 178, 0, 0.8)',
          'rgba(52, 152, 219, 0.8)',
          'rgba(155, 89, 182, 0.8)',
          'rgba(241, 196, 15, 0.8)',
          'rgba(231, 76, 60, 0.8)',
          'rgba(26, 188, 156, 0.8)',
          'rgba(243, 156, 18, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

/**
 * Renderiza gráfica de tipos de vinculación
 */
const renderBindingTypeChart = () => {
  const ctx = bindingTypeChartRef.value.getContext('2d')
  const data = rowsStatistics.value.byBindingType

  bindingChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => item._id),
      datasets: [{
        label: 'Instructores',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(45, 178, 0, 0.7)',
        borderColor: 'rgba(45, 178, 0, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
}

// ==================== LIFECYCLE ====================

onMounted(async () => {
  // Puedes cargar estadísticas por defecto si lo deseas
  // await generateStatistics()
})
</script>

<style lang="sass" scoped>
.instructors-statistics-page
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

// Estilos para los iconos del calendario
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

.summary-card
  border-radius: 16px
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)

  .summary-item
    text-align: center
    padding: 20px

    .summary-value
      font-size: 36px
      font-weight: 700
      color: #2c3e50
      margin: 12px 0 8px

    .summary-label
      font-size: 14px
      color: #7f8c8d
      text-transform: uppercase
      letter-spacing: 0.5px

.chart-container-medium
  height: 300px
  position: relative

.stat-mini-card
  border-radius: 12px
  transition: transform 0.2s ease, box-shadow 0.2s ease

  &:hover
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.loading-state,
.empty-state
  .q-card
    border-radius: 16px

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
  .chart-container-medium
    height: 250px

  .summary-item
    .summary-value
      font-size: 28px

  .filter-item
    width: 100%
    min-width: unset

  .actions-right
    width: 100%
    flex-wrap: wrap
</style>