<template>
  <q-page class="q-pa-md apprentices-page">
    <BackButton class="q-mb-lg" />

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader 
              title="Estadísticas de Aprendices" 
              description="Métricas y análisis del desempeño de los aprendices." 
            />
          </q-card-section>
        </q-card>

        <div class="filters-wrapper flex items-center justify-between q-my-lg">
          <div class="filters-left flex items-center bg-white">
            <div class="filter-item">
              <label class="filter-label">FICHA</label>
              <q-select
                v-model="filtersData.groupId"
                :options="groupOptions"
                outlined
                dense
                emit-value
                map-options
                clearable
                placeholder="Todas las fichas"
                @update:model-value="handleFilterChange"
              >
                <template #prepend>
                  <q-icon name="groups" color="green-8" />
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

        <!-- Contenido de estadísticas -->
        <template v-else-if="rowsStatistics">
          <!-- Resumen Principal -->
          <div class="q-mb-lg">
            <q-card class="shadow-1 summary-card">
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="school" size="48px" color="primary" />
                      <div class="summary-value">{{ rowsStatistics.totalApprentices || 0 }}</div>
                      <div class="summary-label">Total Aprendices</div>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="check_circle" size="48px" color="positive" />
                      <div class="summary-value">{{ rowsStatistics.activeApprentices || 0 }}</div>
                      <div class="summary-label">Activos</div>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="pause_circle" size="48px" color="warning" />
                      <div class="summary-value">{{ rowsStatistics.inactiveApprentices || 0 }}</div>
                      <div class="summary-label">Inactivos</div>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="summary-item">
                      <q-icon name="groups" size="48px" color="secondary" />
                      <div class="summary-value">{{ rowsStatistics.totalGroups || 0 }}</div>
                      <div class="summary-label">Fichas</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Estadísticas de Etapa Productiva -->
          <div v-if="rowsStatistics?.productiveStage" class="q-mb-lg">
            <q-card class="shadow-1">
              <q-card-section>
                <div class="text-h6 q-mb-md">Etapa Productiva</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-3">
                    <q-card flat bordered class="stat-mini-card">
                      <q-card-section>
                        <div class="text-caption text-grey-7">Con Registro EP</div>
                        <div class="text-h5 text-primary">
                          {{ rowsStatistics.productiveStage.withRegistration || 0 }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col-12 col-md-3">
                    <q-card flat bordered class="stat-mini-card">
                      <q-card-section>
                        <div class="text-caption text-grey-7">Sin Registro EP</div>
                        <div class="text-h5 text-negative">
                          {{ rowsStatistics.productiveStage.withoutRegistration || 0 }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col-12 col-md-3">
                    <q-card flat bordered class="stat-mini-card">
                      <q-card-section>
                        <div class="text-caption text-grey-7">Aprobados</div>
                        <div class="text-h5 text-positive">
                          {{ rowsStatistics.productiveStage.approved || 0 }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col-12 col-md-3">
                    <q-card flat bordered class="stat-mini-card">
                      <q-card-section>
                        <div class="text-caption text-grey-7">Pendientes</div>
                        <div class="text-h5 text-warning">
                          {{ rowsStatistics.productiveStage.pending || 0 }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráficas -->
          <div class="row q-col-gutter-md q-mb-lg">
            <!-- Por Estado -->
            <div v-if="rowsStatistics.byStatus?.length" class="col-12 col-md-6">
              <q-card class="shadow-1">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Por Estado</div>
                  <div class="chart-container-medium">
                    <canvas ref="statusChartRef"></canvas>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Por Modalidad EP -->
            <div v-if="rowsStatistics.byModality?.length" class="col-12 col-md-6">
              <q-card class="shadow-1">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Por Modalidad EP</div>
                  <div class="chart-container-medium">
                    <canvas ref="modalityChartRef"></canvas>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Por Género -->
            <div v-if="rowsStatistics.byGender?.length" class="col-12 col-md-6">
              <q-card class="shadow-1">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Por Género</div>
                  <div class="chart-container-medium">
                    <canvas ref="genderChartRef"></canvas>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Aprendices por Ficha -->
            <div v-if="rowsStatistics.byGroup?.length" class="col-12 col-md-6">
              <q-card class="shadow-1">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Top 10 Fichas</div>
                  <div class="chart-container-medium">
                    <canvas ref="groupChartRef"></canvas>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Tabla de Aprendices Destacados -->
          <div v-if="rowsStatistics?.topApprentices?.length" class="q-mb-lg">
            <q-card class="shadow-1">
              <q-card-section>
                <div class="text-h6 q-mb-md">Aprendices Destacados (Con más bitácoras)</div>
                <Table
                  card
                  :rows="rowsStatistics.topApprentices"
                  :columns="topApprenticesColumns"
                  row-key="_id"
                  :hide-pagination="true"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Resumen por Fichas -->
          <div v-if="rowsStatistics?.groupsSummary?.length" class="q-mb-lg">
            <q-card class="shadow-1">
              <q-card-section>
                <div class="text-h6 q-mb-md">Resumen por Fichas</div>
                <Table
                  card
                  :rows="rowsStatistics.groupsSummary"
                  :columns="groupsSummaryColumns"
                  row-key="_id"
                  v-model:pagination="pagination"
                />
              </q-card-section>
            </q-card>
          </div>
        </template>

        <!-- Estado Vacío -->
        <div v-else-if="!loadingTable && !rowsStatistics" class="empty-state">
          <q-card class="shadow-1">
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="school" size="64px" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-7">
                No hay estadísticas disponibles
              </div>
              <div class="text-body2 text-grey-6 q-mt-sm">
                No se encontraron datos para mostrar en este momento
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
const { error } = useNotifications()

// ==================== CONFIGURACIÓN DEL COMPOSABLE ====================

// Estructura del formulario (no se usa para estadísticas, pero es requerido)
const getDefaultFormData = () => ({
  groupId: '',
  startDate: '',
  endDate: ''
})

// Endpoints de la API
const endpoints = {
  list: '/statistics/generate/apprentices'
}

// Mensajes personalizados
const customMessages = {
  listError: 'Error al generar estadísticas de aprendices',
  noData: 'No hay estadísticas disponibles'
}

// Inicializar composable
const {
  // Estados
  loading,
  loadingTable,
  filtersData,
  pagination,
  
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
filtersData.value.groupId = ''
filtersData.value.startDate = ''
filtersData.value.endDate = ''

// ==================== ESTADOS ESPECÍFICOS ====================
const rowsStatistics = ref(null)
const groupOptions = ref([])

// Referencias para gráficas
const statusChartRef = ref(null)
const modalityChartRef = ref(null)
const genderChartRef = ref(null)
const groupChartRef = ref(null)

let statusChartInstance = null
let modalityChartInstance = null
let genderChartInstance = null
let groupChartInstance = null

// ==================== COLUMNAS DE TABLAS ====================
const topApprenticesColumns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'group', label: 'Ficha', align: 'center', field: 'group' },
  { name: 'logbooks', label: 'Bitácoras', align: 'center', field: 'logbooks' }
]

const groupsSummaryColumns = [
  { name: 'group', label: 'Ficha', align: 'left', field: 'group' },
  { name: 'total', label: 'Total', align: 'center', field: 'total' },
  { name: 'active', label: 'Activos', align: 'center', field: 'active' },
  { name: 'withEP', label: 'Con EP', align: 'center', field: 'withEP' },
  { name: 'approved', label: 'Aprobados', align: 'center', field: 'approved' }
]

// ==================== FUNCIONES PRINCIPALES ====================

/**
 * Obtiene la lista de fichas/grupos del backend
 */
const fetchGroups = async () => {
  try {
    let response = null
    let fichasData = []
    
    const possibleEndpoints = [
      '/fiches/listFiche',
      '/fichas',
      '/fiches'
    ]
    
    for (const endpoint of possibleEndpoints) {
      try {
        response = await getData(endpoint)
        break
      } catch (err) {
        continue
      }
    }
    
    if (!response) {
      throw new Error('No se pudo obtener la lista de fichas desde ningún endpoint')
    }
    
    // Extraer datos de fichas según formato de respuesta
    if (Array.isArray(response)) {
      fichasData = response
    } else if (response?.msg && Array.isArray(response.msg)) {
      fichasData = response.msg
    } else if (response?.data && Array.isArray(response.data)) {
      fichasData = response.data
    } else if (response?.fiches && Array.isArray(response.fiches)) {
      fichasData = response.fiches
    } else if (response && typeof response === 'object') {
      const keys = Object.keys(response)
      for (const key of keys) {
        if (Array.isArray(response[key])) {
          fichasData = response[key]
          break
        }
      }
    }
    
    groupOptions.value = [
      { label: 'Todas las fichas', value: '' },
      ...fichasData.map(group => ({
        label: group.number || group.name || `Ficha ${group._id}`,
        value: group._id
      }))
    ]
  } catch (err) {
    console.error('Error al cargar fichas:', err)
    error('Error al cargar la lista de fichas. Por favor, intenta nuevamente.')
    groupOptions.value = [{ label: 'Todas las fichas', value: '' }]
  }
}

/**
 * Genera las estadísticas según los filtros aplicados
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

    const response = await postData('/statistics/generate/apprentices', payload)
    
    // Procesar respuesta del backend
    if (response?.data) {
      rowsStatistics.value = response.data
    } else if (response && typeof response === 'object' && !response.msg) {
      rowsStatistics.value = response
    } else {
      rowsStatistics.value = null
    }
    
    // Normalizar estructura de datos
    if (rowsStatistics.value) {
      normalizeStatisticsData()
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
 * Construye el payload para enviar a la API
 */
const buildPayloadStatistics = () => {
  const payload = {}
  
  if (filtersData.value.groupId && filtersData.value.groupId !== '') {
    payload.groupId = filtersData.value.groupId
  }
  
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
 * Normaliza los datos de estadísticas para asegurar estructura consistente
 */
const normalizeStatisticsData = () => {
  // Campos básicos
  rowsStatistics.value.totalApprentices = rowsStatistics.value.totalApprentices || 0
  
  // Total de grupos
  if (rowsStatistics.value.fichestatistics) {
    rowsStatistics.value.totalGroups = rowsStatistics.value.totalGroups || 
                                       rowsStatistics.value.fichestatistics.totalFiches || 
                                       rowsStatistics.value.fichestatistics.totalGroups || 0
  } else {
    rowsStatistics.value.totalGroups = rowsStatistics.value.totalGroups || 0
  }
  
  rowsStatistics.value.activeApprentices = rowsStatistics.value.activeApprentices || 
                                           rowsStatistics.value.active || 0
  rowsStatistics.value.inactiveApprentices = rowsStatistics.value.inactiveApprentices || 
                                             rowsStatistics.value.inactive || 0
  
  // Arrays de estadísticas
  rowsStatistics.value.byStatus = rowsStatistics.value.byStatus || 
                                  rowsStatistics.value.byStatusCount || 
                                  rowsStatistics.value.statusStatistics || []
  
  rowsStatistics.value.byModality = rowsStatistics.value.byModality || 
                                   rowsStatistics.value.byModalityCount || 
                                   rowsStatistics.value.modalityStatistics || []
  
  rowsStatistics.value.byGender = rowsStatistics.value.byGender || 
                                 rowsStatistics.value.byGenderCount || 
                                 rowsStatistics.value.genderStatistics || []
  
  rowsStatistics.value.byGroup = rowsStatistics.value.byGroup || 
                                rowsStatistics.value.byGroupCount || 
                                rowsStatistics.value.groupStatistics || 
                                rowsStatistics.value.byFiche || []
  
  rowsStatistics.value.topApprentices = rowsStatistics.value.topApprentices || 
                                       rowsStatistics.value.topApprenticesList || 
                                       rowsStatistics.value.destacados || []
  
  rowsStatistics.value.groupsSummary = rowsStatistics.value.groupsSummary || 
                                      rowsStatistics.value.groupsResume || 
                                      rowsStatistics.value.fichesSummary || 
                                      rowsStatistics.value.fichesResume || []
  
  // Normalizar aprendices destacados
  if (rowsStatistics.value.topApprentices && Array.isArray(rowsStatistics.value.topApprentices)) {
    rowsStatistics.value.topApprentices = rowsStatistics.value.topApprentices.map(apprentice => ({
      _id: apprentice._id || apprentice.id,
      name: apprentice.name || apprentice.fullName || apprentice.nombre || '-',
      email: apprentice.email || apprentice.correo || '-',
      group: apprentice.group || apprentice.groupName || apprentice.ficha || apprentice.groupNumber || '-',
      logbooks: apprentice.logbooks || apprentice.bitacoras || apprentice.totalLogbooks || 0
    }))
  }
  
  // Normalizar resumen de grupos
  if (rowsStatistics.value.groupsSummary && Array.isArray(rowsStatistics.value.groupsSummary)) {
    rowsStatistics.value.groupsSummary = rowsStatistics.value.groupsSummary.map(group => ({
      _id: group._id || group.id || group.groupId,
      group: group.group || group.groupName || group.name || group.number || group.ficha || '-',
      total: group.total || group.totalApprentices || 0,
      active: group.active || group.activeApprentices || 0,
      withEP: group.withEP || group.withRegistration || group.conEP || 0,
      approved: group.approved || group.aprobados || 0
    }))
  }
  
  // Etapa productiva
  if (!rowsStatistics.value.productiveStage) {
    rowsStatistics.value.productiveStage = rowsStatistics.value.productiveStageStats || {
      withRegistration: rowsStatistics.value.withEP || rowsStatistics.value.conRegistroEP || 0,
      withoutRegistration: rowsStatistics.value.withoutEP || rowsStatistics.value.sinRegistroEP || 0,
      approved: rowsStatistics.value.approvedEP || rowsStatistics.value.aprobadosEP || 0,
      pending: rowsStatistics.value.pendingEP || rowsStatistics.value.pendientesEP || 0
    }
  }
  
  if (rowsStatistics.value.groupsSummary && Array.isArray(rowsStatistics.value.groupsSummary)) {
    pagination.value.rowsNumber = rowsStatistics.value.groupsSummary.length
  }
}

/**
 * Maneja cambios en los filtros
 */
const handleFilterChange = () => {
  // Los filtros se aplican al hacer clic en "Generar Estadísticas"
}

/**
 * Limpia el filtro de fecha de inicio
 */
const clearStartDate = () => {
  filtersData.value.startDate = ''
}

/**
 * Limpia el filtro de fecha de fin
 */
const clearEndDate = () => {
  filtersData.value.endDate = ''
}

// ==================== FUNCIONES DE GRÁFICAS ====================

/**
 * Destruye todas las instancias de gráficas
 */
const destroyCharts = () => {
  if (statusChartInstance) {
    statusChartInstance.destroy()
    statusChartInstance = null
  }
  if (modalityChartInstance) {
    modalityChartInstance.destroy()
    modalityChartInstance = null
  }
  if (genderChartInstance) {
    genderChartInstance.destroy()
    genderChartInstance = null
  }
  if (groupChartInstance) {
    groupChartInstance.destroy()
    groupChartInstance = null
  }
}

/**
 * Renderiza todas las gráficas disponibles
 */
const renderCharts = () => {
  destroyCharts()
  
  if (rowsStatistics.value?.byStatus?.length && statusChartRef.value) {
    renderStatusChart()
  }
  
  if (rowsStatistics.value?.byModality?.length && modalityChartRef.value) {
    renderModalityChart()
  }
  
  if (rowsStatistics.value?.byGender?.length && genderChartRef.value) {
    renderGenderChart()
  }
  
  if (rowsStatistics.value?.byGroup?.length && groupChartRef.value) {
    renderGroupChart()
  }
}

/**
 * Renderiza gráfica de estados
 */
const renderStatusChart = () => {
  const ctx = statusChartRef.value.getContext('2d')
  const data = rowsStatistics.value.byStatus

  statusChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(item => item._id ? 'Activo' : 'Inactivo'),
      datasets: [{
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(231, 76, 60, 0.8)'
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
 * Renderiza gráfica de modalidades
 */
const renderModalityChart = () => {
  const ctx = modalityChartRef.value.getContext('2d')
  const data = rowsStatistics.value.byModality

  modalityChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(item => item._id || 'Sin modalidad'),
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
 * Renderiza gráfica de género
 */
const renderGenderChart = () => {
  const ctx = genderChartRef.value.getContext('2d')
  const data = rowsStatistics.value.byGender

  genderChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => item._id || 'No especificado'),
      datasets: [{
        label: 'Aprendices',
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(231, 76, 60, 0.7)',
          'rgba(149, 165, 166, 0.7)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(231, 76, 60, 1)',
          'rgba(149, 165, 166, 1)'
        ],
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

/**
 * Renderiza gráfica de grupos
 */
const renderGroupChart = () => {
  const ctx = groupChartRef.value.getContext('2d')
  const data = rowsStatistics.value.byGroup.slice(0, 10)

  groupChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => item._id),
      datasets: [{
        label: 'Aprendices',
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
      },
      indexAxis: 'y'
    }
  })
}

// ==================== LIFECYCLE ====================

onMounted(async () => {
  await fetchGroups()
  await generateStatistics()
})
</script>

<style lang="sass" scoped>
.apprentices-page
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

.stat-mini-card
  border-radius: 12px
  transition: transform 0.2s ease, box-shadow 0.2s ease

  &:hover
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.chart-container-medium
  height: 300px
  position: relative

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
</style>