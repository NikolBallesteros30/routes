<template>
    <q-page class="q-pa-md">
      <BackButton />
      
      <PageHeader 
        title="Mis Aprendices" 
        description="Listado y gestión de aprendices asignados." 
      />
      
      <div class="container">
        <!-- Filtros de búsqueda -->
        <div class="filters-section q-mb-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="filtersData.search"
                dense
                outlined
                placeholder="Buscar por nombre, documento o email"
                clearable
                @keyup.enter="applyFiltersApprentices"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filtersData.status"
                :options="STATUS_OPTIONS"
                dense
                outlined
                label="Estado"
                clearable
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-5">
              <div class="row q-col-gutter-sm">
                <div class="col-auto">
                  <Button
                    label="Filtrar"
                    icon="filter_list"
                    custom-class="gradient-btn"
                    @click="applyFiltersApprentices"
                  />
                </div>
                <div class="col-auto">
                  <Button
                    label="Limpiar"
                    icon="clear"
                    custom-class="boton-cerrar"
                    @click="clearFiltersApprentices"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Tabla de aprendices -->
        <Table
          card
          :rows="rowsApprentices"
          :columns="columns"
          row-key="_id"
          :loading="loadingTable"
          :pagination="pagination"
          :rows-per-page-options="[10, 20, 50, 100]"
          @request="handlePaginationRequestApprentices"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.row.status)">
                {{ getStatusLabel(props.row.status) }}
              </q-badge>
            </q-td>
          </template>
  
          <template #body-cell-opciones="props">
            <q-td :props="props">
              <div class="row q-gutter-xs justify-center">
                <ButtonTableOptions
                  icon="visibility"
                  tooltip="Ver detalles"
                  color="primary"
                  @click="handleViewDetails(props.row)"
                />
                <ButtonTableOptions
                  icon="edit"
                  tooltip="Editar"
                  color="primary"
                  @click="handleEdit(props.row)"
                />
              </div>
            </q-td>
          </template>
  
          <template #no-data>
            <div class="q-pa-md flex flex-center column text-grey full-width">
              <q-icon name="person_off" size="2.5em" color="grey-5" />
              <div class="text-subtitle2 q-mt-sm">
                No hay aprendices registrados
              </div>
            </div>
          </template>
        </Table>
      </div>
  
      <!-- Modal de Detalles -->
      <Modal
        v-model="showDetailDialog"
        width="1200px"
        max-width="98vw"
      >
        <template #header>
          <div class="modal-header-content">
            <div class="text-h6">Detalles del Aprendiz</div>
          </div>
        </template>
        <template #body>
          <div v-if="selectedApprentice" class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Datos Personales</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Tipo de Documento:</div>
                  <div class="data-value">{{ selectedApprentice.documentType || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Número de Documento:</div>
                  <div class="data-value">{{ selectedApprentice.documentNumber || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Nombres:</div>
                  <div class="data-value">{{ selectedApprentice.firstName || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Apellidos:</div>
                  <div class="data-value">{{ selectedApprentice.lastName || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Estado:</div>
                  <div class="data-value">
                    <q-badge :color="getStatusColor(selectedApprentice.status)">
                      {{ getStatusLabel(selectedApprentice.status) }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Datos de Contacto</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Teléfono:</div>
                  <div class="data-value">{{ selectedApprentice.phone || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Email Personal:</div>
                  <div class="data-value">{{ getPersonalEmail(selectedApprentice) || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Email Institucional:</div>
                  <div class="data-value">{{ getInstitutionalEmail(selectedApprentice) || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Número de Ficha:</div>
                  <div class="data-value">{{ getRecordNumber(selectedApprentice) || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <Button 
            label="Cerrar"
            custom-class="boton-cerrar"
            @click="showDetailDialog = false" 
          />
        </template>
      </Modal>
  
      <!-- Modal de Edición -->
      <Modal
        v-model="showEditModal"
        width="900px"
        max-width="98vw"
      >
        <template #header>
          <div class="modal-header-content">
            <div class="text-h6">Editar Aprendiz</div>
          </div>
        </template>
        <template #body>
          <q-form ref="formRef" @submit.prevent="handleSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Datos de Identificación</div>
                <q-select
                  filled
                  v-model="itemBeingEdited.documentType"
                  :options="DOCUMENT_TYPE_OPTIONS"
                  label="Tipo de Documento *"
                  :rules="[requiredRule]"
                  disable
                  hint="El tipo de documento no se puede editar"
                  emit-value
                  map-options
                />
                <q-input
                  filled
                  v-model="itemBeingEdited.documentNumber"
                  label="Número de Documento *"
                  :rules="[
                    requiredRule,
                    numericRule,
                    minLengthRule(7),
                    maxLengthRule(20),
                    noSpacesRule
                  ]"
                  disable
                  hint="El número de documento no se puede editar"
                />
                <div class="text-h6 q-mb-md q-mt-lg section-title">Nombres</div>
                <q-input
                  filled
                  v-model="itemBeingEdited.firstName"
                  label="Nombres *"
                  :rules="[
                    requiredRule,
                    minLengthRule(VALIDATION_RULES.MIN_NAME_LENGTH),
                    maxLengthRule(VALIDATION_RULES.MAX_NAME_LENGTH),
                    lettersOnlyRule
                  ]"
                />
                <q-input
                  filled
                  v-model="itemBeingEdited.lastName"
                  label="Apellidos *"
                  :rules="[
                    requiredRule,
                    minLengthRule(VALIDATION_RULES.MIN_NAME_LENGTH),
                    maxLengthRule(VALIDATION_RULES.MAX_NAME_LENGTH),
                    lettersOnlyRule
                  ]"
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md section-title">Datos de Contacto</div>
                <q-input
                  filled
                  v-model="itemBeingEdited.phone"
                  label="Teléfono *"
                  type="tel"
                  :rules="[requiredRule, phoneRule, noSpacesRule]"
                />
                <q-input
                  filled
                  v-model="itemBeingEdited.emailPersonal"
                  label="Email Personal *"
                  type="email"
                  :rules="[
                    requiredRule,
                    emailRule,
                    maxLengthRule(VALIDATION_RULES.MAX_EMAIL_LENGTH),
                    noSpacesRule
                  ]"
                />
                <div class="text-h6 q-mb-md q-mt-lg section-title">Email Institucional</div>
                <q-input
                  filled
                  v-model="itemBeingEdited.emailInstitutional"
                  label="Email Institucional *"
                  type="email"
                  :rules="[
                    requiredRule,
                    emailRule,
                    maxLengthRule(VALIDATION_RULES.MAX_EMAIL_LENGTH),
                    noSpacesRule
                  ]"
                  hint="Debe terminar en @sena.edu.co"
                />
                <div class="text-h6 q-mb-md q-mt-lg section-title">Número de Ficha</div>
                <q-input
                  filled
                  v-model="itemBeingEdited.recordNumber"
                  label="Número de Ficha *"
                  :rules="[requiredRule, numericRule, noSpacesRule]"
                  hint="Número de ficha del aprendiz"
                />
              </div>
            </div>
          </q-form>
        </template>
        <template #footer>
          <Button 
            label="Cancelar" 
            custom-class="boton-cerrar"
            @click="showEditModal = false" 
          />
          <Button 
            label="Guardar" 
            @click="handleSubmit" 
            :loading="loading" 
          />
        </template>
      </Modal>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getData, putData } from 'src/services/apiClient'
  import { useNotifications } from 'src/composables/useNotifications'
  import { useEntityManager } from 'src/composables/useEntityManager'
  import { useAuthStore } from 'src/stores/authStore'
  import BackButton from 'src/components/BackButton.vue'
  import Button from 'src/components/Button.vue'
  import Table from 'src/components/Table.vue'
  import Modal from 'src/components/Modal.vue'
  import PageHeader from 'src/components/PageHeader.vue'
  import ButtonTableOptions from 'src/components/ButtonTableOptions.vue'
  
  // ==================== CONSTANTS ====================
  const STATUS = { ACTIVE: 0, INACTIVE: 1 }
  const STATUS_LABELS = { ACTIVE: 'Activo', INACTIVE: 'Inactivo' }
  const STATUS_OPTIONS = [
    { label: 'Todos los estados', value: '' },
    { label: 'Activo', value: STATUS.ACTIVE },
    { label: 'Inactivo', value: STATUS.INACTIVE }
  ]
  const VALIDATION_RULES = {
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
    PHONE_LENGTH: 10,
    MAX_EMAIL_LENGTH: 100
  }
  const DOCUMENT_TYPE_OPTIONS = [
    { label: 'Cédula de Ciudadanía', value: 'CC' },
    { label: 'Tarjeta de Identidad', value: 'TI' },
    { label: 'Cédula de Extranjería', value: 'CE' },
    { label: 'Pasaporte', value: 'PA' }
  ]
  
  // ==================== ROUTER AND COMPOSABLES ====================
  const route = useRoute()
  const router = useRouter()
  const notifications = useNotifications()
  const authStore = useAuthStore()
  
  // Get instructor ID from token/store
  const instructorId = computed(() => {
    const user = authStore.user
    if (user?._id) return user._id
    if (user?.id) return user.id
    if (user?.uid?._id) return user.uid._id
    if (user?.uid?.id) return user.uid.id
    
    // Try to decode token if available
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}')
      const token = authStore.token || auth?.token
      if (token) {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          return payload?.uid?._id || payload?.uid?.id || payload?.uid
        }
      }
    } catch (e) {
      // Ignore decoding errors
    }
    return null
  })
  
  // ==================== VALIDATIONS ====================
  const requiredRule = (value) => !!value || 'Este campo es requerido'
  const numericRule = (value) => {
    if (!value && value !== 0) return true
    return !isNaN(value) || 'Debe ser un número'
  }
  const minLengthRule = (min) => (value) => {
    if (!value) return true
    return value.length >= min || `Debe tener al menos ${min} caracteres`
  }
  const maxLengthRule = (max) => (value) => {
    if (!value) return true
    return value.length <= max || `No debe exceder ${max} caracteres`
  }
  const noSpacesRule = (value) => {
    if (!value) return true
    let index = 0
    while (index < value.length) {
      if (value[index] === ' ') {
        return 'No debe contener espacios'
      }
      index++
    }
    return true
  }
  const lettersOnlyRule = (value) => {
    if (!value) return true
    const regex = /^[a-zA-ZÀ-ÿ\s]+$/
    return regex.test(value) || 'Solo debe contener letras y espacios'
  }
  const phoneRule = (value) => {
    if (!value) return true
    const phoneRegex = /^3\d{9}$/
    return phoneRegex.test(value) || 'El teléfono debe tener 10 dígitos y comenzar con 3'
  }
  const emailRule = (value) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || 'Email inválido'
  }
  
  // ==================== COMPOSABLE CONFIGURATION ====================

  // 1️⃣ Form structure
  const getDefaultFormData = () => ({
    _id: '',
    documentNumber: '',
    documentType: '',
    firstName: '',
    lastName: '',
    emailPersonal: '',
    emailInstitutional: '',
    phone: '',
    recordNumber: ''
  })

  // 2️⃣ API endpoints
  const endpoints = {
    list: '/apprentices/listApprentice',
    update: (id) => `/apprentices/updateEntireApprentice/${id}`
  }

  // 3️⃣ Custom messages
  const customMessages = {
    listError: 'Error al cargar aprendices',
    updateSuccess: 'Aprendiz actualizado exitosamente',
    updateError: 'Error al actualizar el aprendiz',
    noData: 'No hay aprendices registrados'
  }

  // 4️⃣ Function to process API response
  const processApprenticesResponse = (response) => {
    let data = response?.Apprentice || response?.apprentices || response?.data || response?.msg || []
    
    // If data is an object and not an array, search for arrays within the object
    if (!Array.isArray(data) && typeof data === 'object') {
      const keys = Object.keys(data)
      for (const key of keys) {
        if (Array.isArray(data[key])) {
          data = data[key]
          break
        }
      }
    }
    
    const apprenticesArray = Array.isArray(data) ? data : []
    
    return {
      data: apprenticesArray,
      total: response?.total || response?.totalDocuments || response?.totalApprentices || apprenticesArray.length
    }
  }

  // 5️⃣ Initialize composable
  const {
    // States
    loadingTable,
    loading,
    rows,
    showDetailDialog,
    showAddDialog,
    selectedEntity,
    formData,
    filtersData,
    pagination,
    // Functions for pagination
    handlePaginationRequest,
    resetPaginationState,
    // Functions for filters
    handleSearchChange,
    handleStatusChange,
    // Functions for modals
    openDetailsDialog,
    openFormDialog,
    closeFormDialog,
    populateFormForEdit,
    // Functions for API
    fetchEntities
  } = useEntityManager({
    entityName: 'apprentice',
    entityNamePlural: 'apprentices',
    getDefaultFormData,
    endpoints,
    messages: customMessages,
    processResponse: processApprenticesResponse
  })

  // ==================== ALIAS WITH STANDARDIZED NAMES ====================
  // Following convention: functionName + Entity

  // States
  const rowsApprentices = rows
  const selectedApprentice = selectedEntity

  // ==================== INSTRUCTOR SPECIFIC DATA ====================
  
  const formRef = ref(null)
  const showEditModal = ref(false)
  
  const itemBeingEdited = ref({
    _id: '',
    documentNumber: '',
    documentType: '',
    firstName: '',
    lastName: '',
    emailPersonal: '',
    emailInstitutional: '',
    phone: '',
    recordNumber: ''
  })
  
  // ==================== TABLE COLUMNS ====================
  const columns = [
    { name: 'documentNumber', label: 'Documento', field: 'documentNumber', sortable: true, align: 'left' },
    { name: 'firstName', label: 'Nombres', field: 'firstName', sortable: true, align: 'left' },
    { name: 'lastName', label: 'Apellidos', field: 'lastName', sortable: true, align: 'left' },
    { name: 'phone', label: 'Teléfono', field: 'phone', sortable: true, align: 'left' },
    { name: 'status', label: 'Estado', field: 'status', sortable: true, align: 'center' },
    { name: 'opciones', label: 'Opciones', align: 'center' }
  ]
  
  // ==================== COMPUTED ====================
  // Filtering is now handled by the composable, but we can add local filtering if needed
  const filteredItems = computed(() => {
    // The composable handles search and status filters via API
    // If we need additional local filtering, we can add it here
    return rowsApprentices.value
  })
  
  // ==================== HELPER FUNCTIONS ====================
  const getPersonalEmail = (apprentice) => apprentice?.email?.personal || ''
  const getInstitutionalEmail = (apprentice) => apprentice?.email?.institutional || ''
  const getRecordNumber = (apprentice) => {
    const records = apprentice?.recordNumber
    return Array.isArray(records) && records.length > 0 
      ? records[0]?.fiche || records[0] || ''
      : ''
  }
  const getStatusLabel = (status) => status === STATUS.ACTIVE ? STATUS_LABELS.ACTIVE : STATUS_LABELS.INACTIVE
  const getStatusColor = (status) => status === STATUS.ACTIVE ? 'positive' : 'negative'
  
  // ==================== CUSTOM API FUNCTIONS ====================
  
  // Override fetchEntities to include instructor projects logic
  const fetchApprentices = async (requestProps = null) => {
    loadingTable.value = true
    try {
      // First get instructor projects using GET /projects/getProject
      let projectApprenticeIds = []
      
      if (instructorId.value) {
        try {
          // Get all projects using Projects route
          const projectsResponse = await getData('/projects/getProject')
          const projects = projectsResponse?.data || projectsResponse?.msg || projectsResponse || []
          const projectsArray = Array.isArray(projects) ? projects : []
          
          // Filter projects where instructor is assigned
          const instructorProjects = projectsArray.filter(project => {
            if (!project.instructors || !Array.isArray(project.instructors)) return false
            
            return project.instructors.some(inst => {
              const instId = inst.id || inst._id || (typeof inst === 'string' ? inst : null)
              return instId === instructorId.value || instId === String(instructorId.value)
            })
          })
          
          // Extract apprentice IDs from instructor projects
          instructorProjects.forEach(project => {
            if (project.apprentices && Array.isArray(project.apprentices)) {
              project.apprentices.forEach(apprentice => {
                const apprenticeId = apprentice.id || apprentice._id || (typeof apprentice === 'string' ? apprentice : null)
                if (apprenticeId && !projectApprenticeIds.includes(apprenticeId)) {
                  projectApprenticeIds.push(apprenticeId)
                }
              })
            }
          })
        } catch (projectsError) {
          console.warn('Error al obtener proyectos del instructor:', projectsError)
          notifications.warning('No se pudieron obtener los proyectos. Mostrando todos los aprendices.')
        }
      }
      
      let allApprentices = []
      
      if (projectApprenticeIds.length > 0) {
        // Get complete details of each apprentice from projects
        const apprenticePromises = projectApprenticeIds.map(async (apprenticeId) => {
          try {
            const apprenticeResponse = await getData(`/apprentices/apprenticeById/${apprenticeId}`)
            const apprenticeData = apprenticeResponse?.data || apprenticeResponse?.msg || apprenticeResponse
            return apprenticeData
          } catch (error) {
            return null
          }
        })
        
        const apprenticeResults = await Promise.all(apprenticePromises)
        allApprentices = apprenticeResults.filter(a => a !== null)
        
        // If not all obtained, get from general list and filter
        if (allApprentices.length < projectApprenticeIds.length) {
          const listResponse = await getData('/apprentices/listApprentice')
          let listData = listResponse?.Apprentice || listResponse?.apprentices || listResponse?.data || listResponse?.msg || []
          
          if (!Array.isArray(listData) && typeof listData === 'object') {
            const keys = Object.keys(listData)
            for (const key of keys) {
              if (Array.isArray(listData[key])) {
                listData = listData[key]
                break
              }
            }
          }
          
          const listApprentices = Array.isArray(listData) ? listData : []
          const filteredApprentices = listApprentices.filter(apprentice => {
            const apprenticeId = apprentice._id || apprentice.id
            return projectApprenticeIds.includes(apprenticeId) || projectApprenticeIds.includes(String(apprenticeId))
          })
          
          // Combine and remove duplicates
          const existingIds = allApprentices.map(a => a._id || a.id)
          filteredApprentices.forEach(apprentice => {
            const apprenticeId = apprentice._id || apprentice.id
            if (!existingIds.includes(apprenticeId)) {
              allApprentices.push(apprentice)
            }
          })
        }
      } else {
        // If no projects or no instructor, use composable's fetchEntities
        const queryParams = {
          page: requestProps?.pagination?.page || pagination.value.page || 1,
          limit: requestProps?.pagination?.rowsPerPage || pagination.value.rowsPerPage || 10
        }
        
        if (filtersData.value.search) {
          queryParams.search = filtersData.value.search
        }
        
        if (filtersData.value.status !== '' && filtersData.value.status !== null) {
          queryParams.status = filtersData.value.status
        }
        
        const response = await getData(endpoints.list, { params: queryParams })
        const processed = processApprenticesResponse(response)
        allApprentices = processed.data
        pagination.value.rowsNumber = processed.total
      }
      
      // Apply local filters if they exist (for project-based apprentices)
      if (filtersData.value.search && projectApprenticeIds.length > 0) {
        const search = filtersData.value.search.toLowerCase()
        allApprentices = allApprentices.filter(apprentice => {
          const fullName = `${apprentice.firstName || ''} ${apprentice.lastName || ''}`.toLowerCase()
          const document = (apprentice.documentNumber || '').toString().toLowerCase()
          const emailPersonal = (getPersonalEmail(apprentice) || '').toLowerCase()
          const emailInstitutional = (getInstitutionalEmail(apprentice) || '').toLowerCase()
          
          return fullName.includes(search) ||
                 document.includes(search) ||
                 emailPersonal.includes(search) ||
                 emailInstitutional.includes(search)
        })
      }
      
      if (filtersData.value.status !== '' && filtersData.value.status !== null && projectApprenticeIds.length > 0) {
        allApprentices = allApprentices.filter(apprentice => apprentice.status === filtersData.value.status)
      }
      
      // Update local pagination if necessary
      if (requestProps?.pagination) {
        pagination.value.page = requestProps.pagination.page
        pagination.value.rowsPerPage = requestProps.pagination.rowsPerPage
      }
      
      if (projectApprenticeIds.length > 0) {
        pagination.value.rowsNumber = allApprentices.length
      }
      
      rowsApprentices.value = allApprentices
      
      if (rowsApprentices.value.length === 0) {
        if (instructorId.value && projectApprenticeIds.length === 0) {
          notifications.info('No hay aprendices asignados a tus proyectos')
        } else {
          notifications.info('No se encontraron aprendices')
        }
      }
    } catch (error) {
      rowsApprentices.value = []
      pagination.value.rowsNumber = 0
      notifications.error(error.response?.data?.message || error.response?.data?.msg || 'Error al cargar aprendices')
    } finally {
      loadingTable.value = false
    }
  }
  
  // ==================== UI HANDLERS ====================
  const handleViewDetails = (apprentice) => {
    openDetailsDialog(apprentice)
  }
  
  const handleEdit = (apprentice) => {
    // Check if edit route is available (Apprentices route with optional parameter)
    const hasEditRoute = route.matched.some(r => 
      r.path.includes('aprendices') || 
      r.name === 'Apprentices' ||
      r.path.includes('admin/aprendices')
    )
    
    if (hasEditRoute && apprentice._id) {
      // Navigate to edit route if exists
      router.push({
        name: 'Apprentices',
        params: { ficheId: apprentice._id },
        query: { edit: true, apprenticeId: apprentice._id }
      })
    } else {
      // Open edit modal
      itemBeingEdited.value = {
        _id: apprentice._id || '',
        documentNumber: apprentice.documentNumber || '',
        documentType: apprentice.documentType || '',
        firstName: apprentice.firstName || apprentice.firstname || '',
        lastName: apprentice.lastName || apprentice.lastname || '',
        emailPersonal: getPersonalEmail(apprentice),
        emailInstitutional: getInstitutionalEmail(apprentice),
        phone: apprentice.phone || '',
        recordNumber: getRecordNumber(apprentice)
      }
      showEditModal.value = true
    }
  }
  
  // Build custom payload for apprentice update
  const buildApprenticeUpdatePayload = () => ({
    documentNumber: itemBeingEdited.value.documentNumber,
    documentType: itemBeingEdited.value.documentType,
    firstName: itemBeingEdited.value.firstName,
    lastName: itemBeingEdited.value.lastName,
    email: {
      personal: itemBeingEdited.value.emailPersonal,
      institutional: itemBeingEdited.value.emailInstitutional
    },
    phone: itemBeingEdited.value.phone,
    recordNumber: [itemBeingEdited.value.recordNumber]
  })

  const handleSubmit = async () => {
    const isValid = await formRef.value.validate()
    if (!isValid) {
      notifications.error('Por favor complete todos los campos correctamente')
      return
    }
    
    const apprenticeId = itemBeingEdited.value._id
    if (!apprenticeId) {
      notifications.error('ID del aprendiz no válido')
      return
    }
    
    // Update formData with edited values
    formData.value = {
      _id: apprenticeId,
      ...itemBeingEdited.value
    }
    
    // Use composable's endpoint structure
    loading.value = true
    try {
      const payload = buildApprenticeUpdatePayload()
      await putData(endpoints.update(apprenticeId), payload)
      notifications.success('Aprendiz actualizado exitosamente')
      showEditModal.value = false
      formRef.value?.resetValidation()
      await fetchApprentices()
    } catch (error) {
      const data = error.response?.data
      const errorMsg = Array.isArray(data?.errors) 
        ? data.errors.join('\n')
        : data?.message || data?.msg || data?.error || 'Error al actualizar el aprendiz'
      notifications.error(errorMsg)
    } finally {
      loading.value = false
    }
  }
  
  const applyFiltersApprentices = () => {
    resetPaginationState()
    fetchApprentices()
  }
  
  const clearFiltersApprentices = () => {
    filtersData.value.search = ''
    filtersData.value.status = ''
    resetPaginationState()
    fetchApprentices()
  }
  
  const handlePaginationRequestApprentices = (props) => {
    if (!props?.pagination) return
    pagination.value = {
      page: props.pagination.page,
      rowsPerPage: props.pagination.rowsPerPage,
      rowsNumber: props.pagination.rowsNumber ?? pagination.value.rowsNumber
    }
    fetchApprentices(props)
  }
  
  // ==================== LIFECYCLE HOOKS ====================
  onMounted(() => {
    fetchApprentices()
  })
  </script>
  
  <style lang="sass" scoped>
  .container
    max-width: 1400px
    margin: 0 auto
  
  .filters-section
    background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)
    padding: 20px
    border-radius: 8px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
    border: 1px solid #E0E0E0
  
  /* Estilos base para modales */
  .section-title
    color: var(--color-primary)
    font-weight: 600
    font-size: 1.3rem
    margin-bottom: 20px
    padding-left: 12px
    border-left: 4px solid var(--color-primary)
  
  /* Data Grid */
  .data-grid
    display: grid
    gap: 16px
    background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)
    padding: 20px
    border-radius: 8px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
    border: 1px solid #E0E0E0
  
  .data-row
    display: grid
    grid-template-columns: 180px 1fr
    gap: 16px
    align-items: center
    padding: 8px 0
    border-bottom: 1px solid #F0F0F0
  
  .data-row:last-child
    border-bottom: none
  
  .text-weight-bold
    color: #2c3e50
    font-size: 0.95rem
    font-weight: 600
  
  .data-value
    color: #34495e
    font-size: 0.95rem
  
  .modal-header-content
    display: flex
    justify-content: space-between
    align-items: center
    width: 100%
  
  @media (max-width: 768px)
    .data-row
      grid-template-columns: 1fr
      gap: 8px
    
    .filters-section
      padding: 15px
  </style>
  