<template>
  <q-page class="q-pa-md modalities-page">
    <BackButton class="q-mb-lg" />

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader title="Modalidades de Etapa Productiva" />
          </q-card-section>
        </q-card>

        <!-- ==================== SECCIÓN DE ESTADÍSTICAS ==================== -->
        <div class="stats-section q-mb-xl">
          <div class="stats-row">
            <!-- 1. Total Proyectos -->
            <div class="stats-card-wrapper">
              <StatsCard
                title="Total Proyectos"
                :value="modalitiesStats.totalProjects"
                color="var(--color-primary)"
                icon="folder"
                class="cursor-pointer stats-card-clickable"
                @click="openStatsModal('projects')"
              />
            </div>

            <!-- 2. Modalidades Activas -->
            <div class="stats-card-wrapper">
              <StatsCard
                title="Modalidades Activas"
                :value="modalitiesStats.activeModalities"
                color="#2e7d32"
                icon="check_circle"
                class="cursor-pointer stats-card-clickable"
                @click="openStatsModal('modalities')"
              />
            </div>

            <!-- 3. Pre-registros -->
            <div class="stats-card-wrapper">
              <StatsCard
                title="Pre-registros"
                :value="modalitiesStats.totalPreregistrations"
                color="#ed6c02"
                icon="pending_actions"
                class="cursor-pointer stats-card-clickable"
                @click="openStatsModal('preregistrations')"
              />
            </div>
          </div>
        </div>

        <div class="filters-wrapper flex items-center justify-between q-my-lg">
          <div class="filters-left flex items-center bg-white">
            <div class="filter-item search">
              <q-input
                v-model="filtersData.search"
                outlined
                dense
                clearable
                debounce="600"
                placeholder="Buscar por nombre..."
                @update:model-value="handleSearchChange"
              >
                <template #prepend>
                  <q-icon name="search" color="grey-7" />
                </template>
              </q-input>
            </div>

            <div class="filter-item">
              <q-select
                v-model="filtersData.technicalInstructor"
                outlined
                dense
                :options="[
                  { label: 'Todos', value: '' },
                  { label: 'Req. Técnico', value: 1 },
                  { label: 'No Req. Técnico', value: 0 }
                ]"
                emit-value
                map-options
                clearable
                label="Instructor Técnico"
                @update:model-value="applyFilters"
              >
                <template #prepend>
                  <q-icon name="filter_list" color="green-8" />
                </template>
              </q-select>
            </div>

            <div class="filter-item">
              <q-select
                v-model="filtersData.projectInstructor"
                outlined
                dense
                :options="[
                  { label: 'Todos', value: '' },
                  { label: 'Req. Proyecto', value: 1 },
                  { label: 'No Req. Proyecto', value: 0 }
                ]"
                emit-value
                map-options
                clearable
                label="Instructor Proyecto"
                @update:model-value="applyFilters"
              >
                <template #prepend>
                  <q-icon name="filter_list" color="green-8" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="actions-right row items-center q-gutter-sm">
            <Button
              label="Nueva Modalidad"
              custom-class="gradient-btn"
              icon="add"
              @click="openFormDialog"
            />
          </div>
        </div>

        <Table
          boxed
          :rows="rows"
          :columns="columns"
          v-model:pagination="pagination"
          :loading-table="loadingTable"
          row-key="_id"
          @request="handlePaginationRequest"
        >
          <template #body-cell-standardHours="props">
            <q-td :props="props">
              {{ props.row.standard_hours || props.row.standardHours || 0 }} horas
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.status === STATUS.ACTIVE ? 'positive' : 'negative'"
                class="text-uppercase"
              >
                {{ props.row.status === STATUS.ACTIVE ? 'Activa' : 'Inactiva' }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-options="props">
            <q-td :props="props" class="text-center table-options">
              <ButtonTableOptions
                icon="edit"
                color="grey-7"
                tooltip="Editar"
                @click="populateFormForEdit(props.row)"
              />
              <ButtonTableOptions
                :icon="props.row.status === STATUS.ACTIVE ? 'block' : 'check_circle'"
                :color="props.row.status === STATUS.ACTIVE ? 'negative' : 'positive'"
                :tooltip="props.row.status === STATUS.ACTIVE ? 'Desactivar' : 'Activar'"
                @click="toggleStatus(props.row)"
              />
              <ButtonTableOptions
                icon="visibility"
                color="grey"
                tooltip="Ver"
                @click="openDetailsDialog(props.row)"
              />
            </q-td>
          </template>

          <template #no-data>
            <div class="q-pa-md flex flex-center column text-grey full-width">
              <q-icon name="assignment" size="2.5em" color="positive" />
              <div class="text-subtitle2 q-mt-sm">
                No hay modalidades registradas
              </div>
            </div>
          </template>
        </Table>

        <!-- ==================== MODAL DE ESTADÍSTICAS DETALLADAS ==================== -->
        <Modal v-model="showStatsDialog" width="1000px" max-width="95vw">
          <template #header>
            <q-icon :name="statsModalConfig.icon" class="q-mr-sm" />
            <span class="modal-title-white">{{ statsModalConfig.title }}</span>
          </template>

          <template #body>
            <div class="stats-modal-content">
              <!-- Loading State -->
              <div v-if="loadingStatsDetails" class="flex flex-center q-pa-xl">
                <q-spinner color="primary" size="3em" />
              </div>

              <!-- Proyectos Detallados -->
              <div v-else-if="statsModalType === 'projects' && statsDetails.length > 0">
                <div class="section-title q-mb-md">
                  <q-icon name="info" class="q-mr-sm" />
                  Desglose por Modalidad
                </div>
                
                <div class="stats-grid">
                  <div 
                    v-for="item in statsDetails" 
                    :key="item.modalityId"
                    class="stat-detail-card"
                  >
                    <div class="stat-card-header">
                      <q-icon name="assignment" size="24px" color="primary" />
                      <span class="stat-card-title">{{ item.modalityName }}</span>
                    </div>
                    <div class="stat-card-body">
                      <div class="stat-item">
                        <span class="stat-label">Proyectos Activos:</span>
                        <q-badge color="positive" class="stat-badge">
                          {{ item.activeProjects || 0 }}
                        </q-badge>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Total Aprendices:</span>
                        <span class="stat-value">{{ item.totalApprentices || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modalidades Activas Detalladas -->
              <div v-else-if="statsModalType === 'modalities' && statsDetails.length > 0">
                <div class="section-title q-mb-md">
                  <q-icon name="info" class="q-mr-sm" />
                  Modalidades con Actividad
                </div>
                
                <div class="stats-grid">
                  <div 
                    v-for="item in statsDetails" 
                    :key="item.modalityId"
                    class="stat-detail-card"
                  >
                    <div class="stat-card-header">
                      <q-icon name="check_circle" size="24px" color="green" />
                      <span class="stat-card-title">{{ item.modalityName }}</span>
                    </div>
                    <div class="stat-card-body">
                      <div class="stat-item">
                        <span class="stat-label">Proyectos Activos:</span>
                        <q-badge color="positive" class="stat-badge">
                          {{ item.activeProjects || 0 }}
                        </q-badge>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Pre-registros:</span>
                        <q-badge color="warning" class="stat-badge">
                          {{ item.totalPreRegistrations || 0 }}
                        </q-badge>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Total Aprendices:</span>
                        <span class="stat-value">{{ item.totalApprentices || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pre-registros Detallados -->
              <div v-else-if="statsModalType === 'preregistrations' && statsDetails.length > 0">
                <div class="section-title q-mb-md">
                  <q-icon name="info" class="q-mr-sm" />
                  Pre-registros por Modalidad
                </div>
                
                <div class="stats-grid">
                  <div 
                    v-for="item in statsDetails.filter(i => i.totalPreRegistrations > 0)" 
                    :key="item.modalityId"
                    class="stat-detail-card"
                  >
                    <div class="stat-card-header">
                      <q-icon name="pending_actions" size="24px" color="orange" />
                      <span class="stat-card-title">{{ item.modalityName }}</span>
                    </div>
                    <div class="stat-card-body">
                      <div class="stat-item">
                        <span class="stat-label">Pre-registros:</span>
                        <q-badge color="warning" class="stat-badge">
                          {{ item.totalPreRegistrations || 0 }}
                        </q-badge>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Proyectos Activos:</span>
                        <span class="stat-value">{{ item.activeProjects || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Data State -->
              <div v-else class="flex flex-center column q-pa-xl text-grey">
                <q-icon name="info" size="3em" />
                <div class="text-subtitle1 q-mt-md">
                  No hay datos detallados disponibles
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button label="Cerrar" custom-class="boton-cerrar" v-close-popup />
          </template>
        </Modal>

        <!-- ==================== MODAL DE DETALLE ==================== -->
        <Modal v-model="showDetailDialog" width="900px" max-width="90vw">
          <template #header>
            <q-icon name="assignment" class="q-mr-sm" />
            <span class="modal-title-white">{{ selectedEntity?.name || 'Modalidad' }}</span>
          </template>

          <template #body>
            <div v-if="selectedEntity" class="modal-content-grid">
              <div class="modal-column">
                <div class="section-title">Información General</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Nombre:</div>
                    <div class="data-value">{{ selectedEntity?.name || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Descripción:</div>
                    <div class="data-value">{{ selectedEntity?.description || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Horas Estándar:</div>
                    <div class="data-value">{{ selectedEntity?.standard_hours || selectedEntity?.standardHours || 0 }} horas</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Estado:</div>
                    <div class="data-value">
                      <q-badge :color="selectedEntity?.status === STATUS.ACTIVE ? 'positive' : 'negative'">
                        {{ selectedEntity?.status === STATUS.ACTIVE ? 'Activa' : 'Inactiva' }}
                      </q-badge>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-column">
                <div class="section-title">Requisitos de Instructores</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Instructor de Seguimiento:</div>
                    <div class="data-value">{{ selectedEntity?.requires_follow_up_instructor ? 'Sí' : 'No' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Instructor Técnico:</div>
                    <div class="data-value">{{ selectedEntity?.requires_technical_instructor ? 'Sí' : 'No' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Instructor de Proyecto:</div>
                    <div class="data-value">{{ selectedEntity?.requires_project_instructor ? 'Sí' : 'No' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button label="Cerrar" custom-class="boton-cerrar" v-close-popup />
          </template>
        </Modal>

        <!-- ==================== MODAL DE FORMULARIO ==================== -->
        <Modal
          v-model="showAddDialog"
          width="900px"
          max-width="95vw"
          persistent
          @update:model-value="handleAddDialogVisibility"
        >
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon name="assignment" class="q-mr-sm" />
                {{ isEditMode ? 'Editar Modalidad' : 'Nueva Modalidad' }}
              </div>
            </div>
          </template>

          <template #body>
            <q-form ref="modalityForm" @submit.prevent="handleSubmit">
              <div class="modal-content-grid">
                <div class="modal-column">
                  <div class="section-title">Información General</div>
                  <q-input
                    v-model="formData.name"
                    filled
                    dense
                    label="Nombre de Modalidad *"
                    :rules="[val => !!val || 'El nombre es requerido']"
                  />

                  <q-input
                    v-model="formData.description"
                    filled
                    dense
                    label="Descripción"
                    type="textarea"
                    rows="6"
                  />

                  <q-input
                    v-model.number="formData.standard_hours"
                    filled
                    dense
                    label="Horas Estándar *"
                    type="number"
                    min="0"
                    :rules="[
                      val => (val !== null && val !== undefined && val !== '') || 'Campo horas estándar obligatorio',
                      val => val >= 0 || 'Las horas deben ser positivas'
                    ]"
                  />
                </div>

                <div class="modal-column">
                  <div class="section-title">Requisitos de Instructores</div>

                  <q-select
                    v-model="formData.requires_follow_up_instructor"
                    filled
                    dense
                    :options="[
                      { label: 'Sí', value: 1 },
                      { label: 'No', value: 0 }
                    ]"
                    emit-value
                    map-options
                    label="Instructor de Seguimiento"
                    :rules="[val => val === 0 || val === 1 || 'Campo obligatorio']"
                  />

                  <q-select
                    v-model="formData.requires_technical_instructor"
                    filled
                    dense
                    :options="[
                      { label: 'Sí', value: 1 },
                      { label: 'No', value: 0 }
                    ]"
                    emit-value
                    map-options
                    label="Instructor Técnico"
                    :rules="[val => val === 0 || val === 1 || 'Campo obligatorio']"
                  />

                  <q-select
                    v-model="formData.requires_project_instructor"
                    filled
                    dense
                    :options="[
                      { label: 'Sí', value: 1 },
                      { label: 'No', value: 0 }
                    ]"
                    emit-value
                    map-options
                    label="Instructor de Proyecto"
                    :rules="[val => val === 0 || val === 1 || 'Campo obligatorio']"
                  />

                  <div class="q-mt-lg row justify-end q-gutter-sm">
                    <Button
                      custom-class="boton-cerrar"
                      label="Cancelar"
                      @click="closeFormDialog"
                    />
                    <Button
                      :label="isEditMode ? 'Actualizar' : 'Crear Modalidad'"
                      type="submit"
                      custom-class="gradient-btn"
                      :loading="loading"
                    />
                  </div>
                </div>
              </div>
            </q-form>
          </template>
        </Modal>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData } from '../../services/apiClient'
import { useEntityManager } from '../../composables/useEntityManager'
import BackButton from '../../components/BackButton.vue'
import Table from '../../components/Table.vue'
import Button from '../../components/Button.vue'
import ButtonTableOptions from '../../components/ButtonTableOptions.vue'
import Modal from '../../components/Modal.vue'
import PageHeader from '../../components/PageHeader.vue'
import StatsCard from '../../components/cards/StatsCard.vue'

const STATUS = { ACTIVE: 0, INACTIVE: 1 }

const {
  loading,
  loadingTable,
  rows,
  showAddDialog,
  showDetailDialog,
  isEditMode,
  selectedEntity,
  formData,
  filtersData,
  pagination,
  handlePaginationRequest,
  handleSearchChange,
  applyFilters,
  openFormDialog,
  closeFormDialog,
  openDetailsDialog,
  populateFormForEdit,
  handleAddDialogVisibility,
  fetchEntities,
  submitForm,
  toggleStatus
} = useEntityManager({
  entityName: 'modalidad',
  entityNamePlural: 'modalidades',
  
  getDefaultFormData: () => ({
    _id: '',
    name: '',
    description: '',
    standard_hours: 0,
    requires_follow_up_instructor: 1,
    requires_technical_instructor: 1,
    requires_project_instructor: 0
  }),

  endpoints: {
    list: '/modalities/listModalities',
    create: '/modalities/saveModalities',
    update: (id) => `/modalities/updateModalities/${id}`,
    activate: (id) => `/modalities/activeModalities/${id}`,
    deactivate: (id) => `/modalities/inactiveModalities/${id}`
  },

  messages: {
    createSuccess: 'Modalidad creada correctamente',
    updateSuccess: 'Modalidad actualizada correctamente',
    listError: 'Error al listar las modalidades'
  },

  buildFilterParams: (filters, params) => {
    const trimmedSearch = filters.search?.trim()
    if (trimmedSearch) {
      params.name = trimmedSearch
    }

    if (filters.technicalInstructor !== '' && filters.technicalInstructor !== null) {
      params.requiresTechnicalInstructor = filters.technicalInstructor
    }

    if (filters.projectInstructor !== '' && filters.projectInstructor !== null) {
      params.requiresProjectInstructor = filters.projectInstructor
    }

    return params
  },

  processResponse: (response) => {
    const modalities = response?.msg ?? []
    return {
      data: Array.isArray(modalities) ? modalities : [],
      total: response?.totalDocuments ?? 0
    }
  },

  buildPayload: (formData) => {
    const numericStandardHours = Number(formData.standard_hours)
    const numericRequiresFollow = Number(formData.requires_follow_up_instructor)
    const numericRequiresTechnical = Number(formData.requires_technical_instructor)
    const numericRequiresProject = Number(formData.requires_project_instructor)

    return {
      standard_hours: numericStandardHours,
      requires_follow_up_instructor: numericRequiresFollow,
      requires_technical_instructor: numericRequiresTechnical,
      requires_project_instructor: numericRequiresProject,
      standardHours: numericStandardHours,
      requiresFollowUpInstructor: numericRequiresFollow,
      requiresTechnicalInstructor: numericRequiresTechnical,
      requiresProjectInstructor: numericRequiresProject,
      name: formData.name?.trim(),
      description: formData.description?.trim()
    }
  }
})

filtersData.value.technicalInstructor = ''
filtersData.value.projectInstructor = ''


const modalitiesStats = ref({
  totalProjects: 0,
  activeModalities: 0,
  totalPreregistrations: 0
})


const statsCache = ref({
  usage: null,
  comparison: null,
  lastFetch: null
})

const CACHE_DURATION = 5 * 60 * 1000 


const showStatsDialog = ref(false)
const statsModalType = ref('')
const loadingStatsDetails = ref(false)
const statsDetails = ref([])

const statsModalConfig = computed(() => {
  const configs = {
    projects: {
      title: 'Detalle de Proyectos por Modalidad',
      icon: 'folder'
    },
    modalities: {
      title: 'Detalle de Modalidades Activas',
      icon: 'check_circle'
    },
    preregistrations: {
      title: 'Detalle de Pre-registros por Modalidad',
      icon: 'pending_actions'
    }
  }
  return configs[statsModalType.value] || configs.projects
})


const isCacheValid = () => {
  if (!statsCache.value.lastFetch) return false
  const now = Date.now()
  return (now - statsCache.value.lastFetch) < CACHE_DURATION
}


const openStatsModal = async (type) => {
  statsModalType.value = type
  showStatsDialog.value = true
  

  const cachedData = type === 'projects' ? statsCache.value.usage : statsCache.value.comparison
  if (cachedData && isCacheValid()) {
    statsDetails.value = cachedData
    loadingStatsDetails.value = false
    console.log('📦 Datos cargados desde caché (instantáneo)')
    return
  }
  
 
  loadingStatsDetails.value = true
  
  try {
    let response
    
    if (type === 'projects') {
      response = await getData('/statistics/modalities/usage')
      const usageData = response?.data || response?.msg || response || []
      statsDetails.value = Array.isArray(usageData) ? usageData : []

      statsCache.value.usage = statsDetails.value
    } else {
      response = await getData('/statistics/modalities/comparison')
      const comparisonData = response?.data || response?.msg || response || []
      statsDetails.value = Array.isArray(comparisonData) ? comparisonData : []

      statsCache.value.comparison = statsDetails.value
    }
    
 
    statsCache.value.lastFetch = Date.now()
    console.log('🔄 Datos cargados desde API y guardados en caché')
  } catch (error) {
    console.error('❌ Error cargando detalles de estadísticas:', error)
    statsDetails.value = []
  } finally {
    loadingStatsDetails.value = false
  }
}


const fetchModalitiesStatistics = async () => {
  try {
  
    if (isCacheValid() && statsCache.value.usage && statsCache.value.comparison) {
      const usageData = statsCache.value.usage
      const comparisonData = statsCache.value.comparison
      
      
      let totalProjects = 0
      if (Array.isArray(usageData)) {
        totalProjects = usageData.reduce((sum, item) => sum + (item.activeProjects || 0), 0)
      }

      let activeModalities = 0
      let totalPreregistrations = 0
      
      if (Array.isArray(comparisonData)) {
        activeModalities = comparisonData.filter(item => 
          (item.activeProjects > 0) || (item.totalPreRegistrations > 0)
        ).length
        
        totalPreregistrations = comparisonData.reduce((sum, item) => 
          sum + (item.totalPreRegistrations || 0), 0
        )
      }

      modalitiesStats.value = {
        totalProjects,
        activeModalities,
        totalPreregistrations
      }
      
      console.log('📊 Estadísticas cargadas desde caché (instantáneo)')
      return
    }

   
    console.log('🔄 Cargando estadísticas desde API...')
    const [usageResponse, comparisonResponse] = await Promise.all([
      getData('/statistics/modalities/usage'),
      getData('/statistics/modalities/comparison')
    ])

    const usageData = usageResponse?.data || usageResponse?.msg || usageResponse || []
    const comparisonData = comparisonResponse?.data || comparisonResponse?.msg || comparisonResponse || []
    
   
    statsCache.value.usage = Array.isArray(usageData) ? usageData : []
    statsCache.value.comparison = Array.isArray(comparisonData) ? comparisonData : []
    statsCache.value.lastFetch = Date.now()
    
    let totalProjects = 0
    if (Array.isArray(usageData)) {
      totalProjects = usageData.reduce((sum, item) => sum + (item.activeProjects || 0), 0)
    }

    let activeModalities = 0
    let totalPreregistrations = 0
    
    if (Array.isArray(comparisonData)) {
      activeModalities = comparisonData.filter(item => 
        (item.activeProjects > 0) || (item.totalPreRegistrations > 0)
      ).length
      
      totalPreregistrations = comparisonData.reduce((sum, item) => 
        sum + (item.totalPreRegistrations || 0), 0
      )
    }

    modalitiesStats.value = {
      totalProjects,
      activeModalities,
      totalPreregistrations
    }

    console.log('✅ Estadísticas de modalidades cargadas y guardadas en caché')
  } catch (err) {
    console.warn('⚠️ Error cargando estadísticas de modalidades:', err)
    modalitiesStats.value = {
      totalProjects: 0,
      activeModalities: 0,
      totalPreregistrations: 0
    }
  }
}

// Función para invalidar caché manualmente (útil después de crear/editar)
const invalidateCache = () => {
  statsCache.value = {
    usage: null,
    comparison: null,
    lastFetch: null
  }
  console.log('🗑️ Caché invalidado')
}

// ==================== COLUMNAS DE LA TABLA ====================
const columns = [
  { name: 'name', label: 'Nombre', align: 'center', field: 'name' },
  { 
    name: 'standardHours', 
    label: 'Horas Estándar', 
    align: 'center', 
    field: row => row.standard_hours ?? row.standardHours ?? 0 
  },
  { name: 'status', label: 'Estado', align: 'center', field: 'status' },
  { name: 'options', label: 'Acciones', align: 'center' }
]


const handleSubmit = async () => {
  await submitForm()
  
  invalidateCache()
  await fetchModalitiesStatistics()
}


onMounted(async () => {
  console.log('🚀 Iniciando carga de datos...')
  await Promise.all([
    fetchEntities(),
    fetchModalitiesStatistics()
  ])
  console.log('✅ Datos iniciales cargados')
})
</script>

<style lang="scss" scoped>
.modalities-page {
  background: #f5f7fb;
  min-height: 100vh;
}

.hero-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%);
}

.stats-section {
  padding: 16px 0;
  display: flex;
  justify-content: center;
  width: 100%;
}

.stats-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}

.stats-card-wrapper {
  flex: 0 0 auto;
}

.stats-card-wrapper :deep(.stat-container) {
  width: 260px;
  max-width: 260px;
}

.stats-card-clickable {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }
  
  &:active {
    transform: translateY(-2px);
  }
}

.filters-wrapper {
  gap: 12px;
  flex-wrap: wrap;
}

.filters-left {
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

.filter-item {
  min-width: 200px;
}

.filter-item.search {
  width: 280px;
}

.table-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-primary);
  color: white;
  padding: 16px 24px;
}

.modal-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  padding: 18px;
}

.modal-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 4px solid var(--color-primary);
  display: flex;
  align-items: center;
}

.data-grid {
  display: grid;
  gap: 12px;
  background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
  padding: 14px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  border: 1px solid #E6E6E6;
  min-width: 0;
}

.data-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 12px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #F0F0F0;
}

.data-row > .data-value {
  min-width: 0;
  white-space: normal;
  word-break: break-word;
}

.data-row:last-child { 
  border-bottom: none; 
}

.text-weight-bold { 
  color: #2c3e50; 
  font-weight: 600; 
}

.data-value { 
  color: #34495e; 
}

.modal-title-white {
  color: white !important;
  font-weight: 700;
  font-size: 1.05rem;
  white-space: normal;
  overflow: auto;
}

/* ==================== ESTILOS MODAL DE ESTADÍSTICAS ==================== */
.stats-modal-content {
  padding: 24px;
  min-height: 300px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.stat-detail-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 16px;
}

.stat-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
}

.stat-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.stat-label {
  font-weight: 500;
  color: #546e7a;
  font-size: 0.95rem;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.stat-badge {
  font-size: 1rem;
  padding: 6px 12px;
  font-weight: 600;
}

/* ==================== RESPONSIVIDAD ==================== */
@media (max-width: 1200px) {
  .stats-card-wrapper :deep(.stat-container) {
    width: 240px;
    max-width: 240px;
  }
  
  .stats-row {
    gap: 12px;
  }
}

@media (max-width: 1024px) {
  .stats-card-wrapper :deep(.stat-container) {
    width: 220px;
    max-width: 220px;
  }

  .filters-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left {
    width: 100%;
  }

  .actions-right {
    justify-content: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 900px) {
  .stats-row {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .stats-card-wrapper :deep(.stat-container) {
    width: 260px;
    max-width: 260px;
  }
}

@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .stats-card-wrapper {
    width: 100%;
    max-width: 350px;
  }

  .stats-card-wrapper :deep(.stat-container) {
    width: 100%;
    max-width: 100%;
  }

  .filter-item,
  .filter-item.search {
    width: 100%;
    min-width: unset;
  }

  .actions-right {
    width: 100%;
  }

  .modal-content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-modal-content {
    padding: 16px;
  }
}
</style>