﻿<template>
  <q-page class="q-pa-md news-page">
    <div class="q-mb-lg">
      <BackButton />
    </div>

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader title="Novedades y Alertas Administrativas"
             description="Se resuelve las novenades de los aprendices"  />
          </q-card-section>
        </q-card>

        <!-- Stats Cards -->
        <div class="stats-container q-mb-lg">
          <div class="stats-grid">
            <StatsCard
              v-for="(stat, index) in stats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
              class="stat-card"
              :class="{ 'cursor-pointer': index === 0 || index === 1 }"
              @click="index === 0 ? showTypeStats = true : index === 1 ? showStatusStats = true : null"
            />
          </div>
        </div>

        <div class="text-center q-mb-lg">
          <p class="text-body2 text-grey-7">
            Las novedades tienen un plazo máximo de 15 días hábiles para ser resueltas
          </p>
        </div>

        <!-- Vista de Cards Urgentes -->
        <div v-if="!showTableView" class="urgent-cards-container">
          <div class="urgent-title">Novedades Urgentes</div>
          <div class="urgent-cards-grid">
            <CardNovedades
              v-for="news in urgentNews"
              :key="news._id"
              :novedades="[news]"
              :loading="loading"
            />
          </div>
          <div class="text-center q-mt-xl">
            <Button
              label="Ver todas las novedades"
              custom-class="gradient-btn"
              icon="visibility"
              @click="showTableView = true"
            />
          </div>
        </div>

        <!-- Vista de Tabla -->
        <div v-else class="table-container">
          <!-- FILTROS Y BOTÓN CREAR -->
          <div class="filters-wrapper flex items-center justify-between q-my-lg">
            <div class="filters-left flex items-center bg-white">
              <div class="filter-item">
                <q-input
                  v-model="filtersData.startDate"
                  outlined
                  dense
                  type="date"
                  label="Fecha desde"
                  placeholder="DD/MM/AAAA"

                  @update:model-value="handleDateChange"
                >
                  <template #prepend>
                    <q-icon name="event" color="green-8" />
                  </template>
                </q-input>
              </div>

              <div class="filter-item">
                <q-input
                  v-model="filtersData.endDate"
                  outlined
                  dense
                  type="date"
                  label="Fecha hasta"
                  placeholder="DD/MM/AAAA"
                  @update:model-value="handleDateChange"
                >
                  <template #prepend>
                    <q-icon name="event" color="green-8" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Botón Crear Novedad alineado a la derecha -->
            <div class="filters-right">
              <Button
                label="Añadir nueva novedad"
                custom-class="create-news-btn"
                icon="add"
                @click="openCreateDialog"
              />
            </div>
          </div>

          <div class="row q-mb-md">
            <div class="col-12 text-center">
              <Button
                label="Volver a novedades urgentes"
                custom-class="gradient-btn"
                icon="arrow_back"
                @click="showTableView = false"
              />
            </div>
          </div>

          <Table
            card
            :rows="rowsNews"
            :columns="columns"
            v-model:pagination="pagination"
            :loanding-table="loadingTable"
            row-key="_id"
            @request="handlePaginationRequestNews"
          >
            <template #body-cell-tiempo="props">
              <q-td :props="props" class="text-center">
                {{ formatElapsedTime(props.row.createdAt || props.row.datesofia) }}
              </q-td>
            </template>

            <template #body-cell-acciones="props">
              <q-td :props="props" class="text-center table-options">
                <ButtonTableOptions
                  icon="visibility"
                  color="grey"
                  tooltip="Ver detalles"
                  @click="openDetailsDialogNews(props.row)"
                />
              </q-td>
            </template>

            <template #no-data>
              <div class="q-pa-md flex flex-center column text-grey full-width">
                <q-icon name="notification_important" size="2.5em" color="positive" />
                <div class="text-subtitle2 q-mt-sm">
                  No hay novedades registradas
                </div>
              </div>
            </template>
          </Table>
        </div>

        <!-- Modal de Detalles -->
        <Modal v-model="showDetailDialogNews" variant="view" width="900px" max-width="95vw">
          <template #header>
            <div class="text-h6 flex items-center">
              <q-icon name="notification_important" class="q-mr-sm" />
              DETALLES DE LA NOVEDAD
            </div>
          </template>

          <template #body>
            <div v-if="selectedNews" class="modal-content-grid">
              <!-- Datos del aprendiz -->
              <div class="modal-column">
                <div class="section-title">Datos del aprendiz</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Nombre completo:</div>
                    <div class="data-value">{{ selectedNews.name || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Tipo de documento:</div>
                    <div class="data-value">{{ selectedNews.tpdocument || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Número de documento:</div>
                    <div class="data-value">{{ selectedNews.document || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Teléfono:</div>
                    <div class="data-value">{{ selectedNews.phone || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Email:</div>
                    <div class="data-value">{{ selectedNews.email || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- Información de la novedad -->
              <div class="modal-column">
                <div class="section-title">Información de la novedad</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Tipo de novedad:</div>
                    <div class="data-value">{{ selectedNews.tpnew || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Estado:</div>
                    <div class="data-value">{{ selectedNews.state || String(selectedNews.status || '-') }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Ficha:</div>
                    <div class="data-value">{{ selectedNews.fiche?.number || selectedNews.code || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Programa:</div>
                    <div class="data-value">{{ formatProgram(selectedNews) }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Instructor responsable:</div>
                    <div class="data-value">{{ formatInstructor(selectedNews) }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Fecha de creación:</div>
                    <div class="data-value">{{ selectedNews.createdAt ? new Date(selectedNews.createdAt).toLocaleDateString('es-ES') : (selectedNews.datesofia || '-') }}</div>
                  </div>
                </div>
              </div>

              <!-- Causa (ocupando todo el ancho) -->
              <div class="modal-column" style="grid-column: 1 / -1;">
                <div class="section-title">Descripción de la causa</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="data-value">{{ selectedNews.cause || 'Sin descripción' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              label="Cerrar"
              custom-class="boton-cerrar"
              v-close-popup
            />
          </template>
        </Modal>

        <!-- Modal de Crear Novedad -->
        <Modal v-model="showAddDialogNews" variant="edit" width="800px" max-width="90vw" persistent @update:model-value="handleAddDialogVisibility">
          <template #header>
            <div class="text-h6 flex items-center">
              <q-icon name="add" class="q-mr-sm" />
              {{ isEditMode ? 'Editar novedad' : 'Añadir nueva novedad' }}
            </div>
          </template>

          <template #body>
            <q-form @submit.prevent="submitFormNews">
              <div class="modal-content-grid">
                <div class="modal-column">
                  <div class="section-title">Datos de la novedad</div>
                  
                  <!-- ID del Aprendiz -->
                  <q-input
                    v-model="formData.apprenticeId"
                    filled
                    dense
                    label="ID del Aprendiz *"
                    type="text"
                    :rules="[val => !!val || 'El ID del aprendiz es requerido']"
                  />

                  <!-- Tipo de Novedad -->
                  <q-select
                    v-model="formData.tpnew"
                    filled
                    dense
                    label="Tipo de novedad *"
                    :options="newsTypes"
                    :rules="[val => !!val || 'El tipo de novedad es requerido']"
                  />

                  <!-- Fecha de Creación -->
                  <q-input
                    v-model="formData.datesofia"
                    filled
                    dense
                    label="Fecha de creación *"
                    type="date"
                    placeholder="DD/MM/AAAA"
                    :rules="[val => !!val || 'La fecha es requerida']"
                    @update:model-value="handleFormDateChange"
                  />
                </div>

                <div class="modal-column">
                  <div class="section-title">Detalles adicionales</div>
                  
                  <!-- Causa -->
                  <q-input
                    v-model="formData.cause"
                    filled
                    dense
                    label="Causa *"
                    type="textarea"
                    rows="3"
                    :rules="[val => !!val || 'La causa es requerida']"
                  />

                  <!-- Archivo -->
                  <q-file
                    v-model="formData.file"
                    filled
                    dense
                    label="Archivo adjunto (opcional)"
                    accept=".jpg"
                    max-file-size="5242880"
                    @rejected="onFileRejected"
                    clearable
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:hint>
                      El archivo es opcional. Solo se aceptan imágenes JPG (máximo 5MB)
                    </template>
                  </q-file>
                </div>
              </div>
            </q-form>
          </template>

          <template #footer>
            <div class="row justify-end q-gutter-sm full-width">
              <Button
                label="Cancelar"
                custom-class="boton-cerrar"
                @click="closeFormDialogNews"
              />
              <Button
                :label="isEditMode ? 'Actualizar' : 'Añadir Novedad'"
                custom-class="gradient-btn"
                icon="add"
                :loading="loading"
                @click="submitFormNews"
              />
            </div>
          </template>
        </Modal>

        <!-- Modal de Estadísticas por Tipo -->
        <Modal v-model="showTypeStats" variant="view" width="800px">
          <template #header>
            <div class="text-h6 flex items-center">
              <q-icon name="analytics" class="q-mr-sm" />
              Estadísticas por Tipo de Novedad
            </div>
          </template>
          <template #body>
            <div class="statistics-content">
              <div v-if="statisticsData.byType.data.length === 0" class="text-center q-pa-lg text-grey-7">
                No hay estadísticas disponibles
              </div>
              <div v-else v-for="item in statisticsData.byType.data" :key="item._id" class="stat-item">
                <div class="stat-label">{{ item._id || 'Sin especificar' }}</div>
                <div class="stat-count">{{ item.count }}</div>
              </div>
            </div>
          </template>
          <template #footer>
            <Button label="Cerrar" custom-class="boton-cerrar" v-close-popup />
          </template>
        </Modal>

        <!-- Modal de Estadísticas por Estado -->
        <Modal v-model="showStatusStats" variant="view" width="800px">
          <template #header>
            <div class="text-h6 flex items-center">
              <q-icon name="query_stats" class="q-mr-sm" />
              Estadísticas por Estado de Novedad
            </div>
          </template>
          <template #body>
            <div class="statistics-content">
              <div v-if="statisticsData.byStatus.data.length === 0" class="text-center q-pa-lg text-grey-7">
                No hay estadísticas disponibles
              </div>
              <div v-else v-for="item in statisticsData.byStatus.data" :key="item._id" class="stat-item">
                <div class="stat-label">{{ item._id || 'Sin especificar' }}</div>
                <div class="stat-count">{{ item.count }}</div>
              </div>
            </div>
          </template>
          <template #footer>
            <Button label="Cerrar" custom-class="boton-cerrar" v-close-popup />
          </template>
        </Modal>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEntityManager } from 'src/composables/useEntityManager'
import { getData, postData } from 'src/services/apiClient'
import { useNotifications } from 'src/composables/useNotifications'
import BackButton from 'src/components/BackButton.vue'
import Table from 'src/components/Table.vue'
import Button from 'src/components/Button.vue'
import ButtonTableOptions from 'src/components/ButtonTableOptions.vue'
import Modal from 'src/components/Modal.vue'
import PageHeader from 'src/components/PageHeader.vue'
import CardNovedades from 'src/components/CardNovedades.vue'
import StatsCard from 'src/components/cards/StatsCard.vue'


const { error, success, warning } = useNotifications()

const getDefaultFormData = () => ({
  apprenticeId: '',
  tpnew: 'DESERCIÓN',
  cause: '',
  datesofia: new Date().toISOString().split('T')[0],
  file: null
})

const endpoints = {
  list: '/news/listNews',
  create: '/news/createNew',
  update: (id) => `/news/updateNew/${id}`
}

const customMessages = {
  listError: 'Error al cargar novedades',
  createSuccess: 'Novedad creada exitosamente',
  createError: 'Error al crear la novedad',
  updateSuccess: 'Novedad actualizada exitosamente',
  updateError: 'Error al actualizar la novedad',
  noData: 'No hay novedades registradas'
}

const processNewsResponse = (response) => {
  let newsArray = []
  let totalDocs = 0

  if (response?.msg?.news && Array.isArray(response.msg.news)) {
    newsArray = response.msg.news
    totalDocs = response.msg.totalDocuments || newsArray.length
  } else if (Array.isArray(response?.msg)) {
    newsArray = response.msg
    totalDocs = newsArray.length
  }

  return {
    data: newsArray,
    total: totalDocs
  }
}

const buildPayloadNews = (formDataValue) => {
  const formData = new FormData()
  
  formData.append('apprenticeId', formDataValue.apprenticeId)
  formData.append('tpnew', formDataValue.tpnew)
  formData.append('cause', formDataValue.cause.trim())
  formData.append('datesofia', formDataValue.datesofia)
  
  if (formDataValue.file) {
    formData.append('file', formDataValue.file)
  }

  return formData
}

const {

  loading,
  loadingTable,
  rows,
  showAddDialog,
  showDetailDialog,
  isEditMode,
  selectedEntity,
  filtersData,
  pagination,
  formData,

  resetPaginationState,



  // Funciones de modales
  openFormDialog,
  closeFormDialog,
  openDetailsDialog,
  handleAddDialogVisibility,

  // Funciones de formulario
  resetForm,
  populateFormForEdit,

} = useEntityManager({
  entityName: 'news',
  entityNamePlural: 'news',
  getDefaultFormData,
  endpoints,
  messages: customMessages,
  processResponse: processNewsResponse,
  buildPayload: buildPayloadNews,
  useFormData: true
})

// ==================== EXTENDER FILTROS PARA NOVEDADES ====================
filtersData.value.startDate = ''
filtersData.value.endDate = ''

// ==================== ALIAS CON NOMBRES ESTANDARIZADOS ====================

// Estados
const rowsNews = rows
const selectedNews = selectedEntity
const showAddDialogNews = showAddDialog
const showDetailDialogNews = showDetailDialog

// Funciones de modales
const openFormDialogNews = openFormDialog
const closeFormDialogNews = closeFormDialog
const openDetailsDialogNews = openDetailsDialog
const closeDetailsDialogNews = () => {
  showDetailDialogNews.value = false
}

// Funciones de formulario
const resetFormNews = resetForm
const populateFormForEditNews = populateFormForEdit

// Funciones de API
const fetchNews = async () => {
  const { page, rowsPerPage } = pagination.value
  loadingTable.value = true
  
  try {
    const params = {
      page,
      limit: rowsPerPage
    }

    // Add date filters if they exist
    if (filtersData.value.startDate) {
      params.startDate = filtersData.value.startDate
    }
    if (filtersData.value.endDate) {
      params.endDate = filtersData.value.endDate
    }

    const response = await getData(endpoints.list, { params })
    
    // Process response
    const processed = processNewsResponse(response)
    rows.value = processed.data
    pagination.value.rowsNumber = processed.total

    if (!processed.data.length && (filtersData.value.startDate || filtersData.value.endDate)) {
      warning('No se encontraron novedades en el rango de fechas seleccionado')
    }
  } catch (err) {
    error(err?.response?.data?.msg || err?.message || customMessages.listError)
    rows.value = []
    pagination.value.rowsNumber = 0
  } finally {
    loadingTable.value = false
  }
}

const submitFormNews = async () => {
  if (!formData.value.apprenticeId || !formData.value.tpnew || 
      !formData.value.cause || !formData.value.datesofia) {
    warning('Por favor complete todos los campos requeridos')
    return
  }

  // Validar formato de archivo si existe
  if (formData.value.file) {
    const fileName = formData.value.file.name.toLowerCase()
    if (!fileName.endsWith('.jpg')) {
      warning('Solo se permiten archivos JPG')
      return
    }
  }

  loading.value = true

  try {
    const payload = buildPayloadNews(formData.value)

    await postData(endpoints.create, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    success(customMessages.createSuccess)
    showAddDialogNews.value = false
    resetFormNews()
    
    await fetchStatistics()
    await fetchNews()
  } catch (err) {
    console.error('Error:', err)
    error(err?.response?.data?.msg || err?.message || customMessages.createError)
    
    if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
      err.response.data.errors.forEach(err => warning(err))
    }
  } finally {
    loading.value = false
  }
}

// ==================== ESTADOS ESPECÍFICOS DE NOVEDADES ====================
const showTableView = ref(false)

// ==================== ESTADÍSTICAS ====================
const stats = ref([
  { title: 'TIPOS DE NOVEDADES', value: 0 },
  { title: 'ESTADOS', value: 0 },
  { title: 'RESUELTAS ESTE MES', value: 0 },
  { title: 'CRÍTICAS SIN ATENDER >3 DÍAS', value: 0 }
])

// Estados para las estadísticas detalladas
const statisticsData = ref({
  byType: { data: [], uniqueCount: 0, totalCount: 0 },
  byStatus: { data: [], uniqueCount: 0, totalCount: 0 }
})

// Estados para los modales de estadísticas
const showTypeStats = ref(false)
const showStatusStats = ref(false)

// ==================== OPCIONES PARA FORMULARIO ====================
const newsTypes = ['DESERCIÓN']


// ==================== COLUMNAS ====================
const columns = [
  {
    name: 'fecha',
    label: 'Fecha',
    align: 'left',
    field: row => {
      const date = row?.createdAt || row?.datesofia || ''
      if (!date) return 'N/A'
      try {
        return new Date(date).toLocaleDateString('es-ES')
      } catch {
        return 'N/A'
      }
    },
    sortable: true
  },
  { name: 'aprendiz', label: 'Aprendiz', align: 'left', field: row => row?.name || 'N/A' },
  { name: 'cedula', label: 'Cédula', align: 'left', field: row => formatDocument(row) },
  { name: 'ficha', label: 'Ficha', align: 'left', field: row => row?.fiche?.number || row?.code || 'N/A' },
  { name: 'programa', label: 'Programa', align: 'left', field: row => formatProgram(row) },
  { name: 'tipo', label: 'Tipo', align: 'left', field: row => row?.tpnew || 'N/A' },
  { name: 'estado', label: 'Estado', align: 'center', field: row => row?.state || String(row?.status || 'N/A') },
  { name: 'instructor', label: 'Instructor', align: 'left', field: row => formatInstructor(row) },
  { name: 'tiempo', label: 'Tiempo', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

// ==================== COMPUTED ====================

/**
 * Filtra las novedades urgentes (las más antiguas primero)
 */
const urgentNews = computed(() => {
  if (!rowsNews.value.length) return []

  // Función auxiliar para obtener la fecha de la novedad
  const getNewsDate = (news) => {
    const dateStr = news?.createdAt || news?.datesofia
    if (!dateStr) return new Date() // Si no hay fecha, usar fecha actual
    
    // Si la fecha está en formato DD/MM/YYYY
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/')
      return new Date(`${year}-${month}-${day}`)
    }
    
    return new Date(dateStr)
  }

  // Ordenar todas las novedades por fecha (más antiguas primero)
  const sortedNews = [...rowsNews.value].sort((a, b) => {
    return getNewsDate(a) - getNewsDate(b)
  })

  // Primero, intentar obtener novedades no procesadas y registradas (más antiguas)
  const urgent = sortedNews
    .filter(news => !news?.processed && ['REGISTRADA', 'REGISTRADO'].includes(news?.state))
    .slice(0, 4)

  // Si no hay suficientes, agregar las más antiguas no procesadas
  if (urgent.length < 4) {
    const additional = sortedNews
      .filter(news => !news?.processed && !urgent.includes(news))
      .slice(0, 4 - urgent.length)
    urgent.push(...additional)
  }

  // Si aún no hay suficientes, agregar cualquier novedad antigua
  if (urgent.length < 4) {
    const fallback = sortedNews
      .filter(news => !urgent.includes(news))
      .slice(0, 4 - urgent.length)
    urgent.push(...fallback)
  }

  return urgent
})

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Calcula la diferencia de días entre una fecha y hoy
 */
const calculateDaysDifference = dateString => {
  const newsDate = new Date(dateString)
  newsDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor((today - newsDate) / (1000 * 60 * 60 * 24))
}

/**
 * Formatea el tiempo transcurrido desde una fecha
 */
const formatElapsedTime = dateString => {
  if (!dateString) return 'N/A'
  let days = 0
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/')
    days = calculateDaysDifference(`${month}/${day}/${year}`)
  } else {
    days = calculateDaysDifference(dateString)
  }
  if (days < 0) return `Faltan ${Math.abs(days)} días`
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Hace 1 día'
  return `Hace ${days} días`
}

/**
 * Formatea el documento con su tipo
 */
const formatDocument = news => {
  const docType = news?.tpdocument || ''
  const docNumber = news?.document || ''
  return docNumber ? `${docType} ${docNumber}`.trim() : 'N/A'
}

/**
 * Formatea el nombre del programa
 */
const formatProgram = news => {
  const program = news?.fiche?.program
  if (program && typeof program === 'object') {
    return program.name || program.code || 'N/A'
  }
  return news?.coordination?.name || 'N/A'
}

/**
 * Formatea el nombre del instructor
 */
const formatInstructor = news => {
  if (news?.fiche?.owner?.name) return news.fiche.owner.name
  if (news?.owner?.name) return news.owner.name
  const instructor = news?.instructor
  if (!instructor) return 'N/A'
  if (typeof instructor === 'object') {
    return instructor.name || instructor.Name || instructor._id || 'N/A'
  }
  return String(instructor)
}

// ==================== VALIDACIÓN DE FECHAS ====================

/**
 * Maneja cambios en los campos de fecha de filtros
 */
function handleDateChange() {
  validateDateRange()
  resetPaginationState()
  fetchNews()
}

/**
 * Valida que la fecha de inicio sea anterior a la fecha de fin
 */
function validateDateRange() {
  if (!filtersData.value.startDate || !filtersData.value.endDate) return

  const startDate = new Date(filtersData.value.startDate)
  const endDate = new Date(filtersData.value.endDate)
  
  if (endDate < startDate) {
    warning('La fecha de fin debe ser posterior a la fecha de inicio')
    filtersData.value.endDate = ''
  }
}

/**
 * Maneja cambios en la fecha del formulario
 */
function handleFormDateChange() {
  validateFormDate(formData.value.datesofia)
}

/**
 * Valida que la fecha del formulario no sea futura
 */
function validateFormDate(dateStr) {
  if (!dateStr) return

  const selectedDate = new Date(dateStr)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  
  if (selectedDate > today) {
    warning('No se pueden seleccionar fechas futuras')
    formData.value.datesofia = ''
  }
}

// ==================== FUNCIONES DE ARCHIVO ====================
const onFileRejected = (rejectedEntries) => {
  if (rejectedEntries && rejectedEntries.length > 0) {
    const rejection = rejectedEntries[0]
    if (rejection.failedPropValidation === 'max-file-size') {
      warning('Archivo demasiado grande. Máximo 5MB')
    } else if (rejection.failedPropValidation === 'accept') {
      warning('Solo se permiten archivos JPG')
    } else {
      warning('Archivo no válido')
    }
  }
}

// ==================== API CALLS ====================

/**
 * Carga las estadísticas de novedades
 */
const fetchStatistics = async () => {
  try {
    // Obtener estadísticas generales
    const response = await getData('/news/statistics')
    
    if (response?.data?.totales) {
      const totales = response.data.totales
      stats.value = [
        { title: 'TIPOS DE NOVEDADES', value: statisticsData.value.byType.totalCount || 0 },
        { title: 'ESTADOS', value: statisticsData.value.byStatus.totalCount || 0 },
        { title: 'RESUELTAS ESTE MES', value: totales.resueltasMes || 0 },
        { title: 'CRÍTICAS SIN ATENDER >3 DÍAS', value: totales.criticasSinAtender || 0 }
      ]
    }

    // Obtener estadísticas por tipo y por estado
    await Promise.all([
      fetchTypeStatistics(),
      fetchStatusStatistics()
    ])
  } catch (err) {
    console.error('Error al cargar estadísticas:', err)
    error('Error al cargar las estadísticas')
    stats.value.forEach(stat => stat.value = 0)
  }
}

/**
 * Carga las estadísticas por tipo de novedad
 */
const fetchTypeStatistics = async () => {
  try {
    const response = await getData('/statistics/news/by-type')
    
    let data = []
    
    if (response?.data && Array.isArray(response.data)) {
      data = response.data
    } else if (response?.statistics && Array.isArray(response.statistics)) {
      data = response.statistics
    } else if (response?.data?.statistics && Array.isArray(response.data.statistics)) {
      data = response.data.statistics
    } else {
      console.warn('No statistics found for byType', response)
      data = []
    }
    
    const validStats = data.filter(item => {
      const hasId = item._id !== null && item._id !== undefined && item._id !== ''
      const hasCount = typeof item.count === 'number' && item.count > 0
      return hasId && hasCount
    })
    
    const totalCount = validStats.reduce((sum, item) => sum + (item.count || 0), 0)
    
    statisticsData.value.byType = {
      data: validStats,
      uniqueCount: validStats.length,
      totalCount: totalCount
    }
    
    // Actualizar el valor en la primera card
    stats.value[0].value = totalCount
  } catch (err) {
    console.error('Error fetching type statistics:', err)
    statisticsData.value.byType = { data: [], uniqueCount: 0, totalCount: 0 }
  }
}

/**
 * Carga las estadísticas por estado de novedad
 */
const fetchStatusStatistics = async () => {
  try {
    const response = await getData('/statistics/news/by-status')
    
    let data = []
    
    if (response?.data && Array.isArray(response.data)) {
      data = response.data
    } else if (response?.statistics && Array.isArray(response.statistics)) {
      data = response.statistics
    } else if (response?.data?.statistics && Array.isArray(response.data.statistics)) {
      data = response.data.statistics
    } else {
      console.warn('No statistics found for byStatus', response)
      data = []
    }
    
    const validStats = data.filter(item => {
      const hasId = item._id !== null && item._id !== undefined && item._id !== ''
      const hasCount = typeof item.count === 'number' && item.count > 0
      return hasId && hasCount
    })
    
    const totalCount = validStats.reduce((sum, item) => sum + (item.count || 0), 0)
    
    statisticsData.value.byStatus = {
      data: validStats,
      uniqueCount: validStats.length,
      totalCount: totalCount
    }
    
    // Actualizar el valor en la segunda card
    stats.value[1].value = totalCount
  } catch (err) {
    console.error('Error fetching status statistics:', err)
    statisticsData.value.byStatus = { data: [], uniqueCount: 0, totalCount: 0 }
  }
}

/**
 * Sobrescribe handlePaginationRequest para usar nombres estandarizados
 */
const handlePaginationRequestNews = (props) => {
  if (!props?.pagination) return
  pagination.value = {
    page: props.pagination.page,
    rowsPerPage: props.pagination.rowsPerPage,
    rowsNumber: props.pagination.rowsNumber ?? pagination.value.rowsNumber
  }
  fetchNews()
}

/**
 * Abre el diálogo de crear
 */
const openCreateDialog = () => {
  resetFormNews()
  formData.value.tpnew = 'DESERCIÓN'
  formData.value.datesofia = new Date().toISOString().split('T')[0]
  openFormDialogNews()
}

// ==================== CICLO DE VIDA ====================

onMounted(() => {
  fetchStatistics()
  fetchNews()
})
</script>

<style lang="scss" scoped>
.news-page {
  background: #f5f7fb;
  min-height: 100vh;
}

.hero-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%);
}

// ==================== ESTILOS PARA ESTADÍSTICAS ====================
.stats-container {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(278px, 278px));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

// Reducir tamaño de las StatsCard
.stats-grid :deep(.q-card) {
  min-height: 70px !important;
  padding: 10px 12px !important;
  width: 278px !important;
  max-width: 278px !important;
}

.stats-grid :deep(.card-title) {
  font-size: 0.7rem !important;
  margin-bottom: 4px !important;
  font-weight: 600 !important;
}

.stats-grid :deep(.card-value) {
  font-size: 1.3rem !important;
  font-weight: 700 !important;
}

// Hacer las cards clicables
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.urgent-cards-container {
  margin-top: 48px;
  padding: 32px 24px;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.urgent-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
  color: black;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.urgent-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  padding: 20px 0;
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

.filters-right {
  display: flex;
  align-items: center;
}

.filter-item {
  min-width: 200px;
}

.table-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.create-news-btn {
  font-weight: 600;
  padding: 8px 24px;
  font-size: 0.9rem;
  white-space: nowrap;
}

// Estilos para las celdas de la tabla
:deep(.q-table) {
  tbody td {
    white-space: normal !important;
    word-wrap: break-word !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    max-width: 200px;
    padding: 16px 12px;
    vertical-align: top;
    line-height: 1.6;
  }

  tbody tr {
    height: auto !important;
    min-height: 60px;
  }

  // Columnas específicas con anchos máximos diferentes
  tbody td:nth-child(2), // Aprendiz
  tbody td:nth-child(8) { // Instructor
    max-width: 200px;
    min-width: 150px;
  }

  tbody td:nth-child(5) { // Programa
    max-width: 200px;
    min-width: 150px;
  }

  tbody td:nth-child(6) { // Tipo
    max-width: 160px;
    min-width: 140px;
  }

  tbody td:nth-child(7) { // Estado
    max-width: 150px;
    min-width: 120px;
    white-space: normal !important;
  }

  tbody td:nth-child(1), // Fecha
  tbody td:nth-child(3), // Cédula
  tbody td:nth-child(4) { // Ficha
    min-width: 100px;
  }

  tbody td:nth-child(9), // Tiempo
  tbody td:nth-child(10) { // Acciones
    min-width: 90px;
  }

  thead th {
    white-space: normal !important;
    word-wrap: break-word !important;
    vertical-align: middle;
    padding: 14px 12px;
    font-weight: 600;
  }

  // Espaciado entre filas
  tbody tr:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

@media (max-width: 1024px) {
  .urgent-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left {
    width: 100%;
  }

  .filters-right {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }

  .create-news-btn {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .urgent-cards-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .filter-item {
    width: 100%;
    min-width: unset;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    gap: 0.5rem;
  }
}

// Estilos para los modales de estadísticas
.statistics-content {
  max-height: 400px;
  overflow-y: auto;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #e9ecef;
  }
}

.stat-label {
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
  font-size: 1rem;
}

.stat-count {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.2rem;
  margin-right: 8px;
}
</style>