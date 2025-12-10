<template>
  <q-page class="q-pa-md personal-data-page">
    <BackButton />
    
    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader 
              title="Mis Datos Personales" 
              description="Consulta y actualiza tu información personal y académica"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Sección de Estadísticas -->
    <div class="stats-section q-mb-xl">
      <div v-if="loadingStats" class="stats-loading">
        <q-spinner color="primary" size="3em" />
        <p class="q-mt-md text-grey-7">Cargando estadísticas...</p>
      </div>
      <div v-else class="stats-grid">
        <StatsCard
          title="Total de Actividades"
          :value="stats.totalActivities"
          color="var(--color-primary)"
          icon="assignment"
          class="cursor-pointer stats-card-clickable"
          @click="openStatsModal('total')"
        />
        <StatsCard
          title="Actividades Completadas"
          :value="stats.completedActivities"
           color="var(--color-primary)"
          icon="check_circle"
          class="cursor-pointer stats-card-clickable"
          @click="openStatsModal('completed')"
        />
        <StatsCard
          title="Actividades Pendientes"
          :value="stats.pendingActivities"
        color="var(--color-primary)"
          icon="pending_actions"
          class="cursor-pointer stats-card-clickable"
          @click="openStatsModal('pending')"
        />
        <StatsCard
          title="Progreso"
          :value="`${stats.progressPercentage}%`"

          icon="trending_up"
          class="cursor-pointer stats-card-clickable"
          @click="openStatsModal('progress')"
        />
      </div>
    </div>

    <div class="datos-container">
      <div class="page-header-section">
        <div class="editar-datos-link" @click="abrirModalEdicion">
          <q-icon name="edit" size="20px" class="icon-editar" />
          <span class="edit-text">Editar</span>
        </div>
      </div>

      <div class="datos-content">
          <!-- Información Personal -->
          <div class="datos-info-card">
            <div class="card-header">
              <q-icon name="person" size="24px" color="#44b900" />
              <h3 class="card-title">Información Personal</h3>
            </div>
            <div class="datos-list">
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="badge" size="18px" class="item-icon" />
                  <span>Nombre Completo</span>
                </div>
                <div class="datos-item-value">{{ usuario?.firstName || '-' }} {{ usuario?.lastName || '' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="credit_card" size="18px" class="item-icon" />
                  <span>Documento</span>
                </div>
                <div class="datos-item-value">{{ usuario?.documentNumber || '-' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="email" size="18px" class="item-icon" />
                  <span>Correo Personal</span>
                </div>
                <div class="datos-item-value">{{ usuario?.email?.personal || '-' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="business" size="18px" class="item-icon" />
                  <span>Correo Institucional</span>
                </div>
                <div class="datos-item-value">{{ usuario?.email?.institutional || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Información Académica y Contacto -->
          <div class="datos-info-card">
            <div class="card-header">
              <q-icon name="school" size="24px" color="#44b900" />
              <h3 class="card-title">Información Académica</h3>
            </div>
            <div class="datos-list">
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="phone" size="18px" class="item-icon" />
                  <span>Teléfono</span>
                </div>
                <div class="datos-item-value">{{ usuario?.phone || '-' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="description" size="18px" class="item-icon" />
                  <span>Ficha</span>
                </div>
                <div class="datos-item-value ficha-badge">{{ getFichaNumber(usuario) || '-' }}</div>
              </div>
              <div class="datos-item programa-item">
                <div class="datos-item-label">
                  <q-icon name="book" size="18px" class="item-icon" />
                  <span>Programa</span>
                </div>
                <q-tooltip 
                  v-if="getProgramName(usuario) && getProgramName(usuario).length > 50"
                  max-width="400px"
                  anchor="top middle"
                  self="bottom middle"
                >
                  <div style="padding: 8px; word-wrap: break-word;">
                    {{ getProgramName(usuario) }}
                  </div>
                </q-tooltip>
                <div 
                  :class="getProgramName(usuario) && getProgramName(usuario).length > 50 ? 'datos-item-value programa-text' : 'datos-item-value'"
                  style="cursor: help;"
                >
                  {{ getProgramName(usuario) || '-' }}
                </div>
              </div>
            </div>
          </div>

          <div class="datos-instructores">
            <div class="datos-label instructores-title">Instructores Asignados</div>
            
            <!-- Mensaje cuando no hay instructores -->
            <div v-if="!instructores || instructores.length === 0 || (instructores.length === 1 && instructores[0].nombre === 'Cargando...')" class="no-instructores-message">
              <q-icon name="info" size="32px" color="grey-6" class="q-mb-sm" />
              <p class="text-grey-7 text-center">No tienes instructores asignados en este momento.</p>
            </div>
            
            <!-- Lista de instructores cuando sí hay -->
            <template v-else>
              <div v-for="(instructor, index) in instructores" :key="index" class="instructor-card">
                <div class="instructor-circle">{{ obtenerIniciales(instructor.nombre) }}</div>
                <div class="instructor-nombre">{{ instructor.nombre }}</div>
              </div>
              <Button label="Contactar" custom-class="gradient-btn" :noCaps="true" @click="abrirModalContactar" />
            </template>
          </div>
        </div>
      </div>

      <!-- ==================== MODAL DE ESTADÍSTICAS DETALLADAS ==================== -->
      <Modal v-model="showStatsDialog" width="900px" max-width="95vw">
        <template #header>
          <q-icon :name="statsModalConfig.icon" class="q-mr-sm" />
          <span class="modal-title-white">{{ statsModalConfig.title }}</span>
        </template>

        <template #body>
          <div class="stats-modal-content">
            <!-- Total de Actividades -->
            <div v-if="statsModalType === 'total'" class="detail-section">
              <div class="section-title q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                Desglose Completo de Actividades
              </div>
              
              <div class="detail-cards-grid">
                <div class="detail-info-card">
                  <div class="detail-card-icon" style="background: var(--color-primary);">
                    <q-icon name="assignment" size="32px" color="white" />
                  </div>
                  <div class="detail-card-content">
                    <div class="detail-card-label">Total de Actividades</div>
                    <div class="detail-card-value">{{ statsDetails.total || 0 }}</div>
                  </div>
                </div>

                <div class="detail-info-card">
                  <div class="detail-card-icon" style="background: #2e7d32;">
                    <q-icon name="check_circle" size="32px" color="white" />
                  </div>
                  <div class="detail-card-content">
                    <div class="detail-card-label">Aprobadas</div>
                    <div class="detail-card-value success">{{ statsDetails.approved || 0 }}</div>
                  </div>
                </div>

                <div class="detail-info-card">
                  <div class="detail-card-icon" style="background: #ed6c02;">
                    <q-icon name="pending" size="32px" color="white" />
                  </div>
                  <div class="detail-card-content">
                    <div class="detail-card-label">Pendientes</div>
                    <div class="detail-card-value warning">{{ statsDetails.pending || 0 }}</div>
                  </div>
                </div>

                <div class="detail-info-card">
                  <div class="detail-card-icon" style="background: #d32f2f;">
                    <q-icon name="cancel" size="32px" color="white" />
                  </div>
                  <div class="detail-card-content">
                    <div class="detail-card-label">Rechazadas</div>
                    <div class="detail-card-value error">{{ statsDetails.rejected || 0 }}</div>
                  </div>
                </div>
              </div>

              <div v-if="statsDetails.activeProjects !== undefined" class="additional-info q-mt-lg">
                <div class="info-box">
                  <q-icon name="folder_open" size="28px" color="primary" />
                  <div class="info-box-content">
                    <span class="info-box-label">Proyectos Activos:</span>
                    <span class="info-box-value">{{ statsDetails.activeProjects }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actividades Completadas -->
            <div v-else-if="statsModalType === 'completed'" class="detail-section">
              <div class="section-title q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                Detalle de Actividades Completadas
              </div>
              
              <div class="completion-summary">
                <div class="summary-card success-card">
                  <q-icon name="check_circle" size="64px" />
                  <div class="summary-number">{{ statsDetails.approved || 0 }}</div>
                  <div class="summary-label">Actividades Aprobadas</div>
                  <div class="summary-percentage">
                    {{ calculatePercentage(statsDetails.approved, statsDetails.total) }}%
                  </div>
                </div>
              </div>

              <div class="progress-bars q-mt-lg">
                <div class="progress-item">
                  <div class="progress-label">
                    <span>Tasa de Completitud</span>
                    <span class="progress-value">{{ calculatePercentage(statsDetails.approved, statsDetails.total) }}%</span>
                  </div>
                  <q-linear-progress 
                    :value="calculatePercentage(statsDetails.approved, statsDetails.total) / 100" 
                    color="positive" 
                    size="20px" 
                    rounded
                  />
                </div>
              </div>
            </div>

            <!-- Actividades Pendientes -->
            <div v-else-if="statsModalType === 'pending'" class="detail-section">
              <div class="section-title q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                Detalle de Actividades Pendientes
              </div>
              
              <div class="completion-summary">
                <div class="summary-card warning-card">
                  <q-icon name="pending_actions" size="64px" />
                  <div class="summary-number">{{ statsDetails.pending || 0 }}</div>
                  <div class="summary-label">Actividades por Completar</div>
                  <div class="summary-percentage">
                    {{ calculatePercentage(statsDetails.pending, statsDetails.total) }}%
                  </div>
                </div>
              </div>

              <div v-if="statsDetails.pending > 0" class="alert-box warning-alert q-mt-lg">
                <q-icon name="warning" size="32px" />
                <div class="alert-content">
                  <div class="alert-title">¡Atención!</div>
                  <div class="alert-message">
                    Tienes {{ statsDetails.pending }} {{ statsDetails.pending === 1 ? 'actividad pendiente' : 'actividades pendientes' }} por completar.
                    Te recomendamos ponerte al día lo antes posible.
                  </div>
                </div>
              </div>

              <div v-if="statsDetails.rejected > 0" class="alert-box error-alert q-mt-md">
                <q-icon name="error" size="32px" />
                <div class="alert-content">
                  <div class="alert-title">Actividades Rechazadas</div>
                  <div class="alert-message">
                    Tienes {{ statsDetails.rejected }} {{ statsDetails.rejected === 1 ? 'actividad rechazada' : 'actividades rechazadas' }}.
                    Revisa los comentarios del instructor y vuélvelas a enviar.
                  </div>
                </div>
              </div>
            </div>

            <!-- Progreso General -->
            <div v-else-if="statsModalType === 'progress'" class="detail-section">
              <div class="section-title q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                Análisis de Progreso General
              </div>
              
              <div class="progress-overview">
                <div class="progress-circle-container">
                  <div class="progress-circle">
                    <q-circular-progress
                      :value="stats.progressPercentage"
                      size="200px"
                      :thickness="0.15"
                      color="primary"
                      track-color="grey-3"
                      show-value
                      class="text-primary"
                    >
                      <div class="progress-circle-content">
                        <div class="progress-circle-value">{{ stats.progressPercentage }}%</div>
                        <div class="progress-circle-label">Completado</div>
                      </div>
                    </q-circular-progress>
                  </div>
                </div>

                <div class="progress-stats">
                  <div class="stat-row">
                    <div class="stat-icon" style="background: var(--color-primary);">
                      <q-icon name="assignment" color="white" size="24px" />
                    </div>
                    <div class="stat-info">
                      <div class="stat-label">Total</div>
                      <div class="stat-value">{{ statsDetails.total || 0 }}</div>
                    </div>
                  </div>

                  <div class="stat-row">
                    <div class="stat-icon" style="background: #2e7d32;">
                      <q-icon name="check_circle" color="white" size="24px" />
                    </div>
                    <div class="stat-info">
                      <div class="stat-label">Completadas</div>
                      <div class="stat-value">{{ statsDetails.approved || 0 }}</div>
                    </div>
                  </div>

                  <div class="stat-row">
                    <div class="stat-icon" style="background: #ed6c02;">
                      <q-icon name="pending" color="white" size="24px" />
                    </div>
                    <div class="stat-info">
                      <div class="stat-label">Pendientes</div>
                      <div class="stat-value">{{ statsDetails.pending || 0 }}</div>
                    </div>
                  </div>

                  <div class="stat-row">
                    <div class="stat-icon" style="background: #d32f2f;">
                      <q-icon name="cancel" color="white" size="24px" />
                    </div>
                    <div class="stat-info">
                      <div class="stat-label">Rechazadas</div>
                      <div class="stat-value">{{ statsDetails.rejected || 0 }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="statsDetails.activeProjects !== undefined" class="projects-info q-mt-lg">
                <div class="projects-card">
                  <q-icon name="work" size="48px" color="primary" />
                  <div class="projects-content">
                    <div class="projects-number">{{ statsDetails.activeProjects }}</div>
                    <div class="projects-label">{{ statsDetails.activeProjects === 1 ? 'Proyecto Activo' : 'Proyectos Activos' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <Button label="Cerrar" custom-class="boton-cerrar" v-close-popup />
        </template>
      </Modal>

      <Modal
        v-model="showEditDialog"
        variant="edit"
        width="900px"
        max-width="95vw"
        persistent
      >
        <template #header>
          <div class="modal-header">
            <div class="text-h6 flex items-center">
              <q-icon name="edit" class="q-mr-sm" />
              Editar Mis Datos
            </div>
          </div>
        </template>

        <template #body>
          <q-form ref="formRef" v-if="formData.correo !== null" @submit.prevent="mostrarModalConfirmacion">
            <div class="modal-content-grid">
              <div class="modal-column">
                <div class="section-title">Información Personal</div>
                <q-input 
                  v-model="usuario.firstName" 
                  filled 
                  dense 
                  label="Nombre" 
                  readonly 
                  class="input-readonly" 
                />
                <q-input 
                  v-model="usuario.lastName" 
                  filled 
                  dense 
                  label="Apellido" 
                  readonly 
                  class="input-readonly" 
                />
                <q-input
                  v-model="formData.correo"
                  filled
                  dense
                  label="Correo Personal"
                  type="email"
                  class="input-editable"
                  :rules="[emailRule]"
                />
              </div>

              <div class="modal-column">
                <div class="section-title">Información de Contacto</div>
                <q-input
                  v-model="formData.telefono"
                  filled
                  dense
                  label="Teléfono *"
                  class="input-editable"
                  :rules="[requiredRule, phoneRule]"
                />
                <q-input 
                  v-model="usuario.email.institutional" 
                  filled 
                  dense 
                  label="Correo Institucional" 
                  readonly 
                  class="input-readonly" 
                />
              </div>
            </div>
          </q-form>
        </template>

        <template #footer>
          <div class="row justify-end q-gutter-sm full-width">
            <Button
              custom-class="boton-cerrar"
              label="Cancelar"
              @click="cancelarEdicion"
            />
            <Button
              label="Guardar cambios"
              custom-class="gradient-btn"
              @click="mostrarModalConfirmacion"
            />
          </div>
        </template>
      </Modal>

      <Modal
        v-model="showConfirmationDialog"
        variant="view"
        width="600px"
        max-width="90vw"
        persistent
      >
        <template #header>
          <div class="modal-header">
            <div class="text-h6 flex items-center">
              <q-icon name="help_outline" class="q-mr-sm" />
              Confirmar Cambios
            </div>
          </div>
        </template>

        <template #body>
          <div class="q-pa-md text-center">
            <div class="text-h6 q-mb-md">¿Está seguro de que desea guardar los cambios?</div>
          </div>
        </template>

        <template #footer>
          <div class="row justify-end q-gutter-sm full-width">
            <Button
              custom-class="boton-cerrar"
              label="Cancelar"
              @click="cancelarConfirmacion"
            />
            <Button
              label="Aceptar"
              custom-class="gradient-btn"
              :loading="loading"
              @click="confirmarCambios"
            />
          </div>
        </template>
      </Modal>

      <!-- Modal de contacto -->
      <Modal
        v-model="showContactDialog"
        variant="view"
        width="800px"
        max-width="95vw"
      >
        <template #header>
          <div class="modal-header">
            <div class="text-h6 flex items-center">
              <q-icon name="contact_phone" class="q-mr-sm" />
              Contacto Instructor
            </div>
          </div>
        </template>

        <template #body>
          <div class="tabla-contenedor">
            <table class="tabla-instructores">
              <thead>
                <tr>
                  <th>Nombre:</th>
                  <th>Teléfono:</th>
                  <th>Correo:</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(instructor, index) in instructores" :key="index">
                  <td>{{ instructor.nombre }}</td>
                  <td>{{ instructor.telefono }}</td>
                  <td>
                    <a :href="'mailto:' + instructor.correo" class="correo-link">
                      {{ instructor.correo }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { useNotifications } from 'src/composables/useNotifications'
import { putData, getData } from 'src/services/apiClient'
import Modal from 'src/components/Modal.vue'
import Button from 'src/components/Button.vue'
import BackButton from 'src/components/BackButton.vue'
import PageHeader from 'src/components/PageHeader.vue'
import StatsCard from 'src/components/cards/StatsCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const { success, error: notifyError, warning, info } = useNotifications()

// ==================== COMPOSABLE PARA MANEJO DE FORMULARIOS ====================
// Simplificación del composable para editación de datos
const getDefaultFormData = () => ({
  _id: '',
  correo: '',
  telefono: ''
})

// Estados del formulario
const loading = ref(false)
const showEditDialog = ref(false)
const showConfirmationDialog = ref(false)
const formData = ref(getDefaultFormData())
const formDataOriginal = ref(getDefaultFormData())
const cambiosRealizados = ref([])

const instructores = ref([
  { nombre: 'Cargando...', telefono: '-', correo: '-' }
])

// ==================== ESTADÍSTICAS ====================
const stats = ref({
  totalActivities: 0,
  completedActivities: 0,
  pendingActivities: 0,
  progressPercentage: 0
})
const loadingStats = ref(true)

// Caché de estadísticas
const statsCache = ref({
  personal: null,
  progress: null,
  lastFetch: null
})
const CACHE_DURATION = 5 * 60 * 1000

// Modal de estadísticas
const showStatsDialog = ref(false)
const statsModalType = ref('')
const statsDetails = ref({
  total: 0,
  approved: 0,
  pending: 0,
  rejected: 0,
  activeProjects: 0
})

const statsModalConfig = computed(() => {
  const configs = {
    total: {
      title: 'Detalle Total de Actividades',
      icon: 'assignment'
    },
    completed: {
      title: 'Actividades Completadas',
      icon: 'check_circle'
    },
    pending: {
      title: 'Actividades Pendientes',
      icon: 'pending_actions'
    },
    progress: {
      title: 'Análisis de Progreso',
      icon: 'trending_up'
    }
  }
  return configs[statsModalType.value] || configs.total
})

// Validaciones y utilidades
const requiredRule = (value) => !!value || 'Este campo es requerido'
const emailRule = (value) => {
  if (!value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || 'Email inválido'
}
const phoneRule = (value) => {
  if (!value) return true
  const phoneRegex = /^3\d{9}$/
  return phoneRegex.test(value) || 'El teléfono debe tener 10 dígitos y comenzar con 3'
}

const usuario = computed(() => authStore.user)
const showContactDialog = ref(false)
const formRef = ref(null)

// ==================== FUNCIONES DEL FORMULARIO ====================

const isCacheValid = () => {
  if (!statsCache.value.lastFetch) return false
  const now = Date.now()
  return (now - statsCache.value.lastFetch) < CACHE_DURATION
}

const openStatsModal = (type) => {
  statsModalType.value = type
  showStatsDialog.value = true
  if (isCacheValid() && statsCache.value.personal) {
    console.log('📦 Modal cargado desde caché (instantáneo)')
    return
  }
  console.log('ℹ️ Mostrando datos actuales en modal')
}

const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0
  return Math.round((value / total) * 100)
}

// Funciones de edición
const resetForm = () => {
  formData.value = getDefaultFormData()
  formDataOriginal.value = getDefaultFormData()
}

const buildFormDataFromUser = (user) => {
  if (!user) return getDefaultFormData()
  return {
    _id: user._id || '',
    correo: user.email?.personal || '',
    telefono: sanitizePhone(user.phone || '')
  }
}

const sanitizePhone = (value) => {
  if (!value && value !== 0) return ''
  return String(value).replace(/[^0-9]/g, '')
}

// Abrir modal de edición
const abrirModalEdicion = () => {
  const editData = buildFormDataFromUser(usuario.value)
  formData.value = { ...editData }
  formDataOriginal.value = { ...editData }
  showEditDialog.value = true
}

// Cancelar edición
const cancelarEdicion = () => {
  showEditDialog.value = false
  resetForm()
}

// Mostrar modal de confirmación
async function mostrarModalConfirmacion() {
  if (formRef.value) {
    const isValid = await formRef.value.validate()
    if (!isValid) {
      warning('Por favor, completa correctamente todos los campos requeridos.')
      return
    }
  }

  const telefonoOriginal = sanitizePhone(formDataOriginal.value.telefono)
  const correoOriginal = (formDataOriginal.value.correo || '').trim()
  const telefonoActual = sanitizePhone(formData.value.telefono)
  const correoActual = (formData.value.correo || '').trim()

  formData.value.telefono = telefonoActual

  const resumen = []

  if (correoActual !== correoOriginal) {
    resumen.push({
      campo: 'Correo personal',
      anterior: correoOriginal || '(vacío)',
      nuevo: correoActual || '(vacío)'
    })
  }

  if (telefonoActual !== telefonoOriginal) {
    resumen.push({
      campo: 'Teléfono',
      anterior: telefonoOriginal || '(vacío)',
      nuevo: telefonoActual || '(vacío)'
    })
  }

  if (resumen.length === 0) {
    info('No se han realizado cambios.')
    return
  }

  cambiosRealizados.value = resumen
  showEditDialog.value = false
  showConfirmationDialog.value = true
}

// Cancelar confirmación
const cancelarConfirmacion = () => {
  showConfirmationDialog.value = false
  showEditDialog.value = true
}

// Confirmar y guardar cambios
async function confirmarCambios() {
  loading.value = true
  try {
    const userId = authStore.user?._id || authStore.user?.id || authStore.user?.uid

    if (!userId) {
      notifyError('No se pudo identificar al usuario para actualizar.')
      return
    }

    const telefonoActual = sanitizePhone(formData.value.telefono)
    const correoActual = (formData.value.correo || '').trim()

    const payload = {
      _id: userId,
      phone: telefonoActual,
      email: correoActual
    }

    await putData('/apprentices/updatePartApprentice', payload)
    
    const usuarioActualizado = {
      ...usuario.value,
      phone: telefonoActual,
      email: {
        ...(usuario.value?.email || {}),
        personal: correoActual,
        institutional: usuario.value?.email?.institutional || ''
      }
    }
    
    authStore.setUser(usuarioActualizado)

    try {
      const authStorage = JSON.parse(localStorage.getItem('auth') || '{}')
      localStorage.setItem('auth', JSON.stringify({ ...authStorage, user: usuarioActualizado }))
    } catch (storageError) {
      console.warn('No se pudo sincronizar el usuario en localStorage:', storageError)
    }
    
    showConfirmationDialog.value = false
    resetForm()

    success('¡Tus datos han sido guardados permanentemente!')
  } catch (err) {
    console.error('Error al actualizar datos:', err)
    const errorMsg = err.response?.data?.msg || 
                     err.response?.data?.message || 
                     (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join('. ') : null) ||
                     err.message || 
                     'No se pudo guardar la información. Inténtalo de nuevo.'
    notifyError(errorMsg)
  } finally {
    loading.value = false
  }
}

// ==================== FUNCIONES AUXILIARES ====================

function obtenerIniciales(nombre) {
  if (!nombre || nombre === 'Cargando...') return '?'
  const palabras = nombre.trim().split(' ')
  if (palabras.length >= 2) {
    return (palabras[0][0] + palabras[1][0]).toUpperCase()
  }
  return nombre.substring(0, 2).toUpperCase()
}

function getFichaNumber(user) {
  if (user?.fichaNumber) {
    return user.fichaNumber
  }
  
  if (user?.ficha || user?.fiche) {
    return user.ficha || user.fiche
  }
  
  if (user?.recordNumber && Array.isArray(user.recordNumber) && user.recordNumber.length > 0) {
    let activeFiche = null
    let idx = 0
    while (idx < user.recordNumber.length && !activeFiche) {
      if (user.recordNumber[idx] && user.recordNumber[idx].status === 0) {
        activeFiche = user.recordNumber[idx]
      }
      idx++
    }
    if (!activeFiche && user.recordNumber.length > 0) {
      activeFiche = user.recordNumber[0]
    }
    
    if (activeFiche?.fiche && typeof activeFiche.fiche === 'object' && activeFiche.fiche.number) {
      return activeFiche.fiche.number
    }
    
    if (activeFiche?.fiche) {
      return 'Ficha asignada'
    }
  }
  
  return ''
}

function getProgramName(user) {
  if (user?.programName) {
    return user.programName
  }
  
  if (user?.programa) {
    return typeof user.programa === 'string' 
      ? user.programa 
      : user.programa?.name || ''
  }
  
  if (user?.recordNumber && Array.isArray(user.recordNumber) && user.recordNumber.length > 0) {
    let activeFiche = null
    let idx = 0
    while (idx < user.recordNumber.length && !activeFiche) {
      if (user.recordNumber[idx] && user.recordNumber[idx].status === 0) {
        activeFiche = user.recordNumber[idx]
      }
      idx++
    }
    if (!activeFiche && user.recordNumber.length > 0) {
      activeFiche = user.recordNumber[0]
    }
    
    if (activeFiche?.fiche && typeof activeFiche.fiche === 'object') {
      if (activeFiche.fiche.program?.name) {
        return activeFiche.fiche.program.name
      }
      
      if (activeFiche.fiche.program) {
        return 'Programa asociado'
      }
    }
  }
  
  return ''
}

function extractObjectId(obj) {
  if (!obj) return null
  if (typeof obj === 'string') return obj
  if (obj.$oid) return obj.$oid
  if (obj._id) {
    if (typeof obj._id === 'string') return obj._id
    if (obj._id.$oid) return obj._id.$oid
  }
  return null
}

function decodeJWT(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null
    }

    const base64Url = token.split('.')[1]
    if (!base64Url) {
      return null
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const atobFn =
      (typeof window !== 'undefined' && typeof window.atob === 'function' && window.atob.bind(window)) ||
      (typeof globalThis !== 'undefined' && typeof globalThis.atob === 'function' && globalThis.atob.bind(globalThis))

    if (!atobFn) {
      console.warn('No se pudo decodificar el token: atob no está disponible en este entorno.')
      return null
    }

    const binaryString = atobFn(base64)

    let encoded = ''
    let idx = 0
    while (idx < binaryString.length) {
      const hex = binaryString.charCodeAt(idx).toString(16).padStart(2, '0')
      encoded += '%' + hex
      idx++
    }

    const jsonPayload = decodeURIComponent(encoded)
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error al decodificar JWT:', error)
    return null
  }
}

// ==================== FUNCIONES DE ESTADÍSTICAS ====================

async function cargarEstadisticas() {
  try {
    loadingStats.value = true
    
    if (isCacheValid() && statsCache.value.personal && statsCache.value.progress) {
      const personalStatsData = statsCache.value.personal
      const activitiesProgressData = statsCache.value.progress
      
      if (personalStatsData) {
        stats.value.totalActivities = personalStatsData.activities?.total || 0
        stats.value.completedActivities = personalStatsData.activities?.approved || 0
        stats.value.pendingActivities = personalStatsData.activities?.pending || 0
        
        statsDetails.value = {
          total: personalStatsData.activities?.total || 0,
          approved: personalStatsData.activities?.approved || 0,
          pending: personalStatsData.activities?.pending || 0,
          rejected: personalStatsData.activities?.rejected || 0,
          activeProjects: personalStatsData.activeProjects || 0
        }
      }
      
      if (activitiesProgressData) {
        stats.value.progressPercentage = Math.round(activitiesProgressData.progressPercentage || 0)
      }
      
      console.log('📊 Estadísticas cargadas desde caché')
      loadingStats.value = false
      return
    }
    
    console.log('🔄 Cargando estadísticas desde API...')
    const [personalStatsResponse, activitiesProgressResponse] = await Promise.all([
      getData('/statistics/apprentice/personal-stats'),
      getData('/statistics/apprentice/activities-progress')
    ])
    
    const personalStatsData = personalStatsResponse?.data || personalStatsResponse?.msg || personalStatsResponse
    const activitiesProgressData = activitiesProgressResponse?.data || activitiesProgressResponse?.msg || activitiesProgressResponse
    
    statsCache.value.personal = personalStatsData
    statsCache.value.progress = activitiesProgressData
    statsCache.value.lastFetch = Date.now()
    
    if (personalStatsData) {
      stats.value.totalActivities = personalStatsData.activities?.total || 0
      stats.value.completedActivities = personalStatsData.activities?.approved || 0
      stats.value.pendingActivities = personalStatsData.activities?.pending || 0
      
      statsDetails.value = {
        total: personalStatsData.activities?.total || 0,
        approved: personalStatsData.activities?.approved || 0,
        pending: personalStatsData.activities?.pending || 0,
        rejected: personalStatsData.activities?.rejected || 0,
        activeProjects: personalStatsData.activeProjects || 0
      }
    }
    
    if (activitiesProgressData) {
      stats.value.progressPercentage = Math.round(activitiesProgressData.progressPercentage || 0)
      
      if (!personalStatsData) {
        stats.value.totalActivities = activitiesProgressData.totalActivities || 0
        stats.value.completedActivities = activitiesProgressData.completedActivities || 0
        stats.value.pendingActivities = activitiesProgressData.pendingActivities || 0
        
        statsDetails.value = {
          total: activitiesProgressData.totalActivities || 0,
          approved: activitiesProgressData.completedActivities || 0,
          pending: activitiesProgressData.pendingActivities || 0,
          rejected: 0,
          activeProjects: 0
        }
      }
    }
    
    console.log('✅ Estadísticas cargadas')
  } catch (error) {
    console.error('❌ Error al cargar estadísticas:', error)
    stats.value = {
      totalActivities: 0,
      completedActivities: 0,
      pendingActivities: 0,
      progressPercentage: 0
    }
    statsDetails.value = {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      activeProjects: 0
    }
  } finally {
    loadingStats.value = false
  }
}

async function cargarDatosCompletos() {
  try {
    if (usuario.value?.recordNumber && Array.isArray(usuario.value.recordNumber) && usuario.value.recordNumber.length > 0) {
      if (usuario.value?.fichaNumber && usuario.value?.programName) {
        return
      }
    }

    const auth = JSON.parse(localStorage.getItem('auth') || '{}')
    const token = authStore.token || auth?.token
    
    if (!token) {
      return
    }

    let apprenticeData = null
    let recordNumber = null

    try {
      const currentToken = authStore.token || auth?.token || token
      
      const decoded = decodeJWT(currentToken || token)
      const apprenticeId = decoded?.uid?._id || decoded?.uid?.id || usuario.value?._id || usuario.value?.id
      
      const response = await getData('/apprentices/apprenticeById')
      
      if (response) {
        const responseData = response?.data || response?.msg || response
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          apprenticeData = responseData[0]
        } else if (responseData && typeof responseData === 'object') {
          apprenticeData = responseData
        }

        if (apprenticeData) {
          recordNumber = apprenticeData.recordNumber || []
        }
      }
    } catch (apiError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No se pudo obtener datos de la API, usando token como fallback')
      }
      
      const decoded = decodeJWT(token)
      apprenticeData = decoded?.uid || decoded?.user || null
      
      if (apprenticeData) {
        recordNumber = apprenticeData.recordNumber || []
      }
    }

    if (!apprenticeData) {
      if (usuario.value?.recordNumber) {
        apprenticeData = usuario.value
        recordNumber = usuario.value.recordNumber
      } else {
        return
      }
    }

    if (!recordNumber && usuario.value?.recordNumber) {
      recordNumber = usuario.value.recordNumber
    }
    
    const usuarioActualizado = {
      ...usuario.value,
      ...(apprenticeData || {}),
      recordNumber: recordNumber || usuario.value?.recordNumber || []
    }
    
    if (recordNumber && Array.isArray(recordNumber) && recordNumber.length > 0) {
      let activeFiche = null
      let i = 0
      while (i < recordNumber.length) {
        if (recordNumber[i].status === 0) {
          activeFiche = recordNumber[i]
          break
        }
        i++
      }
      if (!activeFiche && recordNumber.length > 0) {
        activeFiche = recordNumber[0]
      }
      
      if (activeFiche?.fiche && typeof activeFiche.fiche === 'object' && !Array.isArray(activeFiche.fiche)) {
        if (activeFiche.fiche.number && !usuarioActualizado.fichaNumber) {
          usuarioActualizado.fichaNumber = activeFiche.fiche.number
        }
        
        if (activeFiche.fiche.program) {
          if (typeof activeFiche.fiche.program === 'object' && activeFiche.fiche.program.name) {
            usuarioActualizado.programName = activeFiche.fiche.program.name
          } else if (typeof activeFiche.fiche.program === 'string') {
            usuarioActualizado.programId = activeFiche.fiche.program
          }
        }
        
        usuarioActualizado.ficheId = activeFiche.fiche._id || extractObjectId(activeFiche.fiche)
      } else {
        const ficheId = extractObjectId(activeFiche?.fiche)
        if (ficheId) {
          usuarioActualizado.ficheId = ficheId
        }
      }
    }
    
    authStore.setUser(usuarioActualizado)
  } catch (error) {
    console.error('Error al cargar datos completos del aprendiz:', error)
  }
}

async function cargarInstructores() {
  try {
    instructores.value = [{ nombre: 'Cargando...', telefono: '-', correo: '-' }]
    
    const ficheId = usuario.value?.ficheId || usuario.value?.recordNumber?.[0]?.fiche?._id
    
    if (!ficheId) {
      instructores.value = []
      return
    }
    
    try {
      const response = await getData(`/fiches/ficheById/${ficheId}`)
      const ficheData = response?.data || response?.msg || response
      
      const instructoresData = ficheData?.instructors || 
                               ficheData?.instructor || 
                               ficheData?.Instructor ||
                               []
      
      if (!instructoresData || (Array.isArray(instructoresData) && instructoresData.length === 0)) {
        instructores.value = []
        return
      }
      
      const instructoresList = Array.isArray(instructoresData) ? instructoresData : [instructoresData]
      
      instructores.value = instructoresList.map(inst => ({
        nombre: inst.name || inst.Name || `${inst.firstName || ''} ${inst.lastName || ''}`.trim() || 'Instructor',
        telefono: inst.phone || inst.Phone || inst.phoneNumber || '-',
        correo: inst.email?.institutional || inst.email?.personal || inst.email || inst.Email || '-'
      }))
      
      instructores.value = instructores.value.filter(inst => inst.nombre && inst.nombre !== 'Instructor')
      
    } catch (ficheError) {
      if (usuario.value?.instructors || usuario.value?.instructor) {
        const userInstructors = usuario.value?.instructors || [usuario.value?.instructor]
        
        instructores.value = userInstructors.map(inst => ({
          nombre: inst.name || inst.Name || `${inst.firstName || ''} ${inst.lastName || ''}`.trim() || 'Instructor',
          telefono: inst.phone || inst.Phone || '-',
          correo: inst.email?.institutional || inst.email?.personal || inst.email || '-'
        }))
        
        instructores.value = instructores.value.filter(inst => inst.nombre && inst.nombre !== 'Instructor')
      } else {
        instructores.value = []
      }
    }
    
  } catch (error) {
    console.error('Error al cargar instructores:', error)
    instructores.value = []
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    notifications.warning('Debes iniciar sesión para acceder a esta página')
    router.push('/login')
    return
  }

  console.log('🚀 Iniciando carga de datos personales...')
  await Promise.all([
    cargarDatosCompletos(),
    cargarInstructores(),
    cargarEstadisticas()
  ])
  console.log('✅ Datos personales cargados')
})
</script>

<style scoped>
.personal-data-page {
  background: #f5f7fb;
  min-height: 100vh;
}

.hero-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%);
}

/* Sección de Estadísticas */
.stats-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stats-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.stats-card-clickable {
  transition: all 0.3s ease;
  cursor: pointer;
}

.stats-card-clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.stats-card-clickable:active {
  transform: translateY(-2px);
}

/* ==================== ESTILOS DEL MODAL DE ESTADÍSTICAS ==================== */
.stats-modal-content {
  padding: 24px;
  min-height: 300px;
}

.detail-section {
  width: 100%;
}

.section-title {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 4px solid var(--color-primary);
  display: flex;
  align-items: center;
}

/* Cards de información detallada */
.detail-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.detail-info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.detail-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.detail-card-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.detail-card-content {
  width: 100%;
}

.detail-card-label {
  font-size: 0.95rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.detail-card-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.detail-card-value.success {
  color: #2e7d32;
}

.detail-card-value.warning {
  color: #ed6c02;
}

.detail-card-value.error {
  color: #d32f2f;
}

/* Información adicional */
.additional-info {
  width: 100%;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #1976d2;
}

.info-box-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-box-label {
  font-size: 0.95rem;
  color: #666;
  font-weight: 600;
}

.info-box-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1976d2;
}

/* Resumen de completitud */
.completion-summary {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.summary-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  text-align: center;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.summary-card.success-card {
  border: 3px solid #2e7d32;
}

.summary-card.warning-card {
  border: 3px solid #ed6c02;
}

.summary-card .q-icon {
  color: #2e7d32;
}

.summary-card.warning-card .q-icon {
  color: #ed6c02;
}

.summary-number {
  font-size: 4rem;
  font-weight: 800;
  color: #2c3e50;
}

.summary-label {
  font-size: 1.3rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.summary-percentage {
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  background: #e3f2fd;
  padding: 8px 24px;
  border-radius: 20px;
}

/* Barras de progreso */
.progress-bars {
  width: 100%;
}

.progress-item {
  margin-bottom: 16px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.progress-value {
  color: #2e7d32;
  font-size: 1.2rem;
}

/* Alertas */
.alert-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid;
}

.alert-box.warning-alert {
  background: #fff3e0;
  border-left-color: #ed6c02;
}

.alert-box.warning-alert .q-icon {
  color: #ed6c02;
}

.alert-box.error-alert {
  background: #ffebee;
  border-left-color: #d32f2f;
}

.alert-box.error-alert .q-icon {
  color: #d32f2f;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2c3e50;
}

.alert-message {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

/* Vista de progreso general */
.progress-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.progress-circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-circle {
  position: relative;
}

.progress-circle-content {
  text-align: center;
}

.progress-circle-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
}

.progress-circle-label {
  font-size: 1rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-row:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 600;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

/* Información de proyectos */
.projects-info {
  width: 100%;
}

.projects-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  padding: 32px;
  border-radius: 16px;
  border: 2px solid #5c6bc0;
}

.projects-content {
  text-align: center;
}

.projects-number {
  font-size: 3rem;
  font-weight: 800;
  color: #3f51b5;
}

.projects-label {
  font-size: 1.2rem;
  color: #5c6bc0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-title-white {
  color: white !important;
  font-weight: 700;
  font-size: 1.05rem;
}

.datos-container {
  max-width: 1200px;
  margin: 1rem auto 0;
  padding: 0 1rem;
}

.page-header-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0;
}

.editar-datos-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: transparent;
  border: 1px solid #e0e0e0;
}

.editar-datos-link:hover {
  background: #f5f5f5;
  border-color: #888;
}

.icon-editar {
  color: #888;
}

.edit-text {
  color: #888;
  font-size: 0.9rem;
  font-weight: 500;
}

.datos-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.datos-info-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.datos-info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border-primary);
}

.card-header .q-icon {
  color: #44b900 !important;
}

.card-title {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.datos-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.datos-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid var(--color-primary);
}

.datos-item-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-icon {
  color: #44b900;
  opacity: 0.9;
}

.datos-item-value {
  font-size: 1.15rem;
  font-weight: 500;
  color: #2c3e50;
  line-height: 1.5;
  word-break: break-word;
}

.ficha-badge {
  display: inline-block;
  background: var(--gradient-primary-dark);
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  box-shadow: 0 2px 8px rgba(57, 169, 0, 0.3);
}

.programa-item {
  grid-column: 1 / -1;
}

.programa-text {
  font-size: 1rem !important;
  line-height: 1.6;
  color: #2c3e50;
  max-height: 4.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.datos-instructores {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.datos-instructores:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.instructores-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid var(--color-border-primary);
  width: 100%;
}

.no-instructores-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  width: 100%;
  min-height: 150px;
}

.no-instructores-message p {
  font-size: 1.05rem;
  line-height: 1.5;
  margin: 0;
}

.instructor-card {
  display: flex;
  align-items: center;
  background: #f6f8fa;
  border-radius: 2rem;
  border: 1px solid #D9D9D9;
  padding: 0.4rem 1.2rem 0.4rem 0.4rem;
  margin-bottom: 0.2rem;
  min-width: 180px;
  gap: 0.7rem;
}

.instructor-circle {
  background-color: var(--color-primary);
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.instructor-nombre {
  font-size: 1.1rem;
  color: #222;
  font-weight: 500;
}

.data-grid {
  display: grid;
  gap: 16px;
  background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #E0E0E0;
}

.data-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F0F0F0;
}

.data-row:last-child {
  border-bottom: none;
}

.text-weight-bold {
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
}

.data-value {
  color: #34495e;
  font-size: 0.95rem;
  font-weight: 500;
}

.input-readonly {
  opacity: 0.6;
}

.input-readonly .q-field__control {
  background-color: #f5f5f5 !important;
  border-color: #e0e0e0 !important;
}

.input-editable .q-field__control {
  border-color: #1976d2 !important;
  background-color: #fff !important;
}

.input-editable .q-field__control:hover {
  border-color: #1565c0 !important;
}

.tabla-contenedor {
  overflow-x: auto;
  padding: 16px;
}

.tabla-instructores {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.tabla-instructores th {
  font-weight: 700;
  font-size: 1.05rem;
  padding: 8px;
  color: #000;
  background-color: #f0f0f0;
}

.tabla-instructores td {
  font-weight: 600;
  font-size: 1.1rem;
  color: #777;
  padding: 10px 6px;
  border-top: 1px solid #e0e0e0;
}

.correo-link {
  color: #555;
  text-decoration: underline;
  font-weight: 600;
}

/* Estilos del Modal de Edición */
.modal-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1rem;
}

.modal-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .datos-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
  }
  
  .datos-instructores {
    grid-column: 1 / -1;
  }

  .progress-overview {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .detail-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .datos-content {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
}

@media (max-width: 768px) {
  .personal-data-page {
    padding: 0.5rem;
  }
  
  .stats-section {
    padding: 0 0.5rem;
    margin-bottom: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .datos-container {
    margin: 0.5rem auto 0;
    padding: 0 0.5rem;
  }
  
  .page-header-section {
    justify-content: flex-end;
    padding: 0.5rem 0;
  }
  
  .editar-datos-link {
    padding: 6px 12px;
  }
  
  .edit-text {
    font-size: 0.8rem;
  }
  
  .datos-info-card {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .datos-item {
    padding: 0.8rem;
  }
  
  .datos-item-value {
    font-size: 1rem;
  }
  
  .instructor-card {
    min-width: auto;
    width: 100%;
  }
  
  .instructor-circle {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .instructor-nombre {
    font-size: 1rem;
  }

  .modal-content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stats-modal-content {
    padding: 16px;
  }

  .detail-cards-grid {
    grid-template-columns: 1fr;
  }

  .progress-overview {
    grid-template-columns: 1fr;
  }

  .summary-card {
    min-width: auto;
    padding: 24px;
  }

  .summary-number {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .personal-data-page {
    padding: 0.25rem;
  }
  
  .stats-section {
    padding: 0 0.25rem;
    margin-bottom: 1.5rem;
  }
  
  .datos-container {
    padding: 0 0.25rem;
  }
  
  .page-header-section {
    padding: 0.25rem 0;
  }
  
  .datos-content {
    gap: 1rem;
  }
  
  .datos-info-card,
  .datos-instructores {
    padding: 0.8rem;
  }
  
  .card-header {
    margin-bottom: 1rem;
    padding-bottom: 0.8rem;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .datos-list {
    gap: 1rem;
  }
  
  .datos-item {
    padding: 0.6rem;
  }
  
  .datos-item-label {
    font-size: 0.8rem;
  }
  
  .datos-item-value {
    font-size: 0.95rem;
  }
  
  .ficha-badge {
    padding: 0.4rem 0.8rem;
    font-size: 1rem !important;
  }
  
  .instructores-title {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
    padding-bottom: 0.6rem;
  }
  
  .datos-instructores {
    gap: 1rem;
  }

  .detail-card-value {
    font-size: 2rem;
  }

  .summary-number {
    font-size: 2.5rem;
  }

  .progress-circle-value {
    font-size: 2rem;
  }
}
</style>