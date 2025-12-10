<template>
  <q-page class="q-pa-md companies-page">
    <BackButton class="q-mb-lg" />

    <div class="full-width row">
      <div class="col-12">
        <!-- Tarjeta de Header -->
        <q-card class="shadow-1 hero-card q-mb-md">
          <q-card-section>
            <PageHeader 
              title="Gestión de Empresas" 
              description="Lista, crea y administra las empresas registradas en el sistema." 
            />
          </q-card-section>
        </q-card>

        <!-- Contenedor para alinear cards y tabla -->
        <div class="content-container">
          <!-- Banner de error si falla la carga de estadísticas -->
          <q-banner v-if="statsErrorMessage" class="q-mb-md bg-red-1 text-red-8" rounded>
            {{ statsErrorMessage }}
          </q-banner>

          <!-- Card: Empresas Activas -->
          <div class="stats-wrapper q-mb-lg">
            <StatsCard
              title="EMPRESAS ACTIVAS"
              :value="companyStats.activeCount ?? 0"
              color="#39A900"
            />
            <StatsCard
              title="TOTAL EMPRESAS"
              :value="companyStats.totalCount ?? 0"
              color="#39A900"
            />
            <StatsCard
              title="EMPRESAS INACTIVAS"
              :value="companyStats.inactiveCount ?? 0"
              color="#39A900"
            />
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
                  placeholder="Buscar por nombre o NIT..."
                  @update:model-value="handleSearchChange"
                >
                  <template #prepend>
                    <q-icon name="search" color="green-8" />
                  </template>
                </q-input>
              </div>

              <div class="filter-item status">
                <q-select
                  v-model="filtersData.status"
                  :options="statusAvailable"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  label="Filtrar por Estado"
                  @update:model-value="handleStatusChange"
                >
                  <template #prepend>
                    <q-icon name="filter_list" color="green-8" />
                  </template>
                </q-select>
              </div>
            </div>

            <div class="actions-right row items-center q-gutter-sm">
              <Button
                label="Carga Masiva"
                custom-class="gradient-btn"
                icon="cloud_upload"
                @click="openBulkUploadDialog"
              />
              <Button
                label="Añadir Empresa"
                custom-class="gradient-btn"
                icon="domain_add"
                @click="openFormDialogCompanies"
              />
            </div>
          </div>

          <Table
            card
            :rows="rowsCompanies"
            :columns="columns"
            v-model:pagination="pagination"
            :loanding-table="loadingTable"
            row-key="_id"
            @request="handlePaginationRequest"
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.status === 0 ? 'positive' : 'negative'"
                  class="text-uppercase"
                >
                  {{ props.row.status === 0 ? 'Activa' : 'Inactiva' }}
                </q-badge>
              </q-td>
            </template>

            <template #body-cell-options="props">
              <q-td :props="props" class="text-center table-options">
                <ButtonTableOptions
                  icon="edit"
                  color="grey-7"
                  tooltip="Editar"
                  @click="populateFormForEditCompanies(props.row)"
                />
                <ButtonTableOptions
                  :icon="props.row.status === 0 ? 'block' : 'check_circle'"
                  :color="props.row.status === 0 ? 'negative' : 'positive'"
                  :tooltip="props.row.status === 0 ? 'Desactivar' : 'Activar'"
                  @click="toggleStatusCompanies(props.row)"
                />
                <ButtonTableOptions
                  icon="visibility"
                  color="grey"
                  tooltip="Ver"
                  @click="openDetailsDialogCompanies(props.row)"
                />
              </q-td>
            </template>

            <template #no-data>
              <div class="q-pa-md flex flex-center column text-grey full-width">
                <q-icon name="business" size="2.5em" color="positive" />
                <div class="text-subtitle2 q-mt-sm">
                  No hay empresas registradas
                </div>
              </div>
            </template>
          </Table>
        </div>

        <!-- Modal de Detalles -->
        <Modal v-model="showDetailDialog" variant="view" width="900px" max-width="90vw">
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon name="business" class="q-mr-sm" />
                {{ selectedCompanies?.name || 'Empresa' }}
              </div>
            </div>
          </template>

          <template #body>
            <div v-if="selectedCompanies" class="modal-content-grid">
              <div class="modal-column">
                <div class="section-title">Datos de la empresa</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Número NIT:</div>
                    <div class="data-value">{{ selectedCompanies?.companyNit || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Razón social:</div>
                    <div class="data-value">{{ selectedCompanies?.name || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Ubicación:</div>
                    <div class="data-value">{{ selectedCompanies?.location || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Dirección:</div>
                    <div class="data-value">{{ selectedCompanies?.address || '-' }}</div>
                  </div>
                </div>
              </div>

              <div class="modal-column">
                <div class="section-title">Contacto de la empresa</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Jefe inmediato:</div>
                    <div class="data-value">{{ selectedCompanies?.legalRepresentativeName || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Cargo:</div>
                    <div class="data-value">{{ selectedCompanies?.legalRepresentativePosition || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Teléfono:</div>
                    <div class="data-value">{{ selectedCompanies?.legalRepresentativePhone || '-' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Email:</div>
                    <div class="data-value">{{ selectedCompanies?.legalRepresentativeEmail || '-' }}</div>
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

        <!-- Modal de Añadir/Editar -->
        <Modal
          v-model="showAddDialog"
          variant="edit"
          width="900px"
          max-width="95vw"
          persistent
          @update:model-value="handleAddDialogVisibility"
        >
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon name="business" class="q-mr-sm" />
                {{ isEditMode ? 'Editar Empresa' : 'Añadir nueva empresa' }}
              </div>
            </div>
          </template>

          <template #body>
            <q-form ref="companyFormRef" @submit.prevent="submitFormCompanies" greedy no-error-focus>
              <div class="modal-content-grid">
                <div class="modal-column">
                  <div class="section-title">Datos de la empresa</div>
                  <q-input
                    v-model="formData.companyNit"
                    filled
                    dense
                    label="Número NIT *"
                    :disable="isEditMode"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[
                      val => !!val || 'El NIT es requerido',
                      val => nitRegex.test(val) || 'El NIT debe contener solo números y mínimo 9 dígitos'
                    ]"
                  />
                  <q-input
                    v-model="formData.name"
                    filled
                    dense
                    label="Razón social *"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[
                      val => !!val || 'El nombre es requerido',
                      val => nameRegex.test(val) || 'El nombre solo debe contener letras'
                    ]"
                  />
                  <q-select
                    v-model="formData.department"
                    filled
                    dense
                    label="Departamento *"
                    :options="departmentsOptions"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[val => !!val || 'El departamento es requerido']"
                  />

                  <q-select
                    v-model="formData.city"
                    filled
                    dense
                    label="Ciudad *"
                    :options="citiesOptions"
                    :disable="!formData.department"
                    :menu-props="{ zIndex: 9999, cover: true }"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[val => !!val || 'La ciudad es requerida']"
                  />
                  

                  <q-input
                    v-model="formData.address"
                    filled
                    dense
                    label="Dirección *"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[val => !!val || 'La dirección es requerida']"
                  />
                </div>

                <div class="modal-column">
                  <div class="section-title">Contacto de la empresa</div>
                  <q-input
                    v-model="formData.legalRepresentativeName"
                    filled
                    dense
                    label="Jefe inmediato *"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[
                      val => !!val || 'El jefe inmediato es requerido',
                      val => nameRegex.test(val) || 'El nombre solo debe contener letras'
                    ]"
                  />
                  <q-input
                    v-model="formData.legalRepresentativePosition"
                    filled
                    dense
                    label="Cargo *"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[val => !!val || 'El cargo es requerido']"
                  />
                  <q-input
                    v-model="formData.legalRepresentativePhone"
                    filled
                    dense
                    label="Teléfono *"
                    mask="##########"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[
                      val => !!val || 'El teléfono es requerido',
                      val => phoneRegex.test(val) || 'El teléfono debe tener 10 dígitos y comenzar con 3'
                    ]"
                  />
                  <q-input
                    v-model="formData.legalRepresentativeEmail"
                    filled
                    dense
                    label="Email *"
                    type="email"
                    lazy-rules
                    class="q-mb-md"
                    :rules="[
                      val => !!val?.trim() || 'El email es requerido',
                      val => emailRegex.test((val || '').trim()) || 'Email inválido'
                    ]"
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
                @click="closeFormDialogCompanies"
              />
              <Button
                :label="isEditMode ? 'Actualizar' : 'Añadir Empresa'"
                type="submit"
                custom-class="gradient-btn"
                :loading="loading"
                @click="submitFormCompanies"
              />
            </div>
          </template>
        </Modal>

        <!-- Modal de Carga Masiva -->
        <Modal v-model="showUploadDialog" width="600px" max-width="95vw" persistent>
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon name="cloud_upload" class="q-mr-sm" />
                Carga Masiva de Empresas
              </div>
            </div>
          </template>

          <template #body>
            <div class="q-pa-md">
              <div class="q-mb-md">
                <p class="text-body1 q-mb-sm">
                  Sube un archivo Excel (.xlsx) o CSV (.csv) con la información de las empresas.
                </p>
                <p class="text-caption text-grey-7">
                  El archivo debe contener las siguientes columnas: NIT, Razón Social,
                  Ubicación, Nombre Representante, Cargo, Teléfono, Email.
                </p>
              </div>

              <q-file
                v-model="selectedFile"
                outlined
                label="Seleccionar archivo"
                accept=".xlsx,.xls,.csv"
                max-file-size="5242880"
                clearable
              >
                <template #prepend>
                  <q-icon name="attach_file" />
                </template>
                <template #hint>
                  Formatos permitidos: Excel (.xlsx, .xls) o CSV (.csv). Tamaño máximo: 5MB.
                </template>
              </q-file>

              <div v-if="selectedFile" class="q-my-md">
                <q-banner class="bg-green-1 text-green-8" rounded>
                  <template #avatar>
                    <q-icon name="check_circle" color="green" />
                  </template>
                  Archivo seleccionado: {{ selectedFile.name }}
                </q-banner>
              </div>

              <div class="q-mt-md flex justify-end">
                <Button
                  label="Subir Archivo"
                  custom-class="gradient-btn"
                  :loading="loading"
                  :disable="!selectedFile"
                  @click="submitBulkUpload"
                />
              </div>
            </div>
          </template>
        </Modal>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { getData } from '../../services/apiClient.js'
import { useEntityManager } from 'src/composables/useEntityManager'
import { useColombia } from 'src/composables/useColombia'
import BackButton from 'src/components/BackButton.vue'
import Table from 'src/components/Table.vue'
import Button from 'src/components/Button.vue'
import ButtonTableOptions from 'src/components/ButtonTableOptions.vue'
import Modal from 'src/components/Modal.vue'
import PageHeader from 'src/components/PageHeader.vue'
import StatsCard from 'src/components/cards/StatsCard.vue'

// ==================== COMPOSABLE CONFIGURATION ====================

// Referencia al formulario para validación
const companyFormRef = ref(null)

// 1️⃣ Form structure
const getDefaultFormData = () => ({
  _id: '',
  companyNit: '',
  name: '',
  department: '',
  city: '',
  address: '',
  legalRepresentativeName: '',
  legalRepresentativePhone: '',
  legalRepresentativeEmail: '',
  legalRepresentativePosition: ''
})

// 2️⃣ API endpoints
const endpoints = {
  list: '/companies/listCompanies',
  create: '/companies/saveCompanies',
  update: (id) => `/companies/updateCompanies/${id}`,
  activate: (id) => `/companies/activeCompanies/${id}`,
  deactivate: (id) => `/companies/inActiveCompanies/${id}`,
  bulkUpload: '/companies/loadMassiveCompanie'
}

// 3️⃣ Custom messages
const customMessages = {
  createSuccess: 'Empresa creada correctamente',
  updateSuccess: 'Empresa actualizada correctamente',
  listError: 'Error al listar las empresas',
  statusSuccess: 'Estado actualizado correctamente',
  statusError: 'No fue posible cambiar el estado',
  bulkUploadSuccess: 'Carga masiva realizada correctamente',
  bulkUploadError: 'Error al cargar el archivo',
  noData: 'No hay empresas registradas'
}

// 4️⃣ Function to build payload
const buildCompaniesPayload = (formData) => {
  const city = formData.city?.trim() || ''
  const location = city ? (/colombia/i.test(city) ? city : `${city}, Colombia`) : ''

  return {
    companyNit: formData.companyNit?.trim(),
    name: formData.name?.trim(),
    location,
    address: formData.address?.trim(),
    legalRepresentativeName: formData.legalRepresentativeName?.trim(),
    legalRepresentativePhone: formData.legalRepresentativePhone?.trim(),
    legalRepresentativeEmail: formData.legalRepresentativeEmail?.trim(),
    legalRepresentativePosition: formData.legalRepresentativePosition?.trim()
  }
}

// Procesar respuesta específica del endpoint /companies/listCompanies
function processCompaniesResponse(response) {
  // Esperado: response.msg.companies + response.msg.totalDocuments
  const msg = response?.msg || response?.data || response || {}
  let entities = msg?.companies ?? msg?.docs ?? msg?.data ?? msg?.["companies"] ?? []
  if (entities && typeof entities === 'object' && !Array.isArray(entities)) {
    entities = entities.docs ?? entities.items ?? entities.data ?? []
  }
  if (!Array.isArray(entities)) entities = []

  const total = msg?.totalDocuments ?? msg?.total ?? msg?.totalItems ?? msg?.count ?? response?.total ?? entities.length

  return { data: entities, total }
}

// NOTE: No se mapean filtros desde el frontend - el backend recibirá los parámetros tal como
// los expone la UI. La paginación se envía con `page` y `limit`.

// 5️⃣ Initialize composable with standardized names
const {
  // States
  loading,
  loadingTable,
  rows,
  showAddDialog,
  showDetailDialog,
  showUploadDialog,
  isEditMode,
  selectedEntity,
  selectedFile,
  formData,
  filtersData,
  pagination,

  // Functions for pagination
  handlePaginationRequest,
  

  // Functions for filters
  handleSearchChange,
  handleStatusChange,

  // Functions for modals
  openFormDialog,
  closeFormDialog,
  openDetailsDialog,
  openBulkUploadDialog,
  handleAddDialogVisibility,

  // Functions for form
  resetForm,
  populateFormForEdit,

  // Functions for API
  fetchEntities,
  submitForm,
  toggleStatus,
  submitBulkUpload
} = useEntityManager({
  entityName: 'company',
  entityNamePlural: 'companies',
  getDefaultFormData,
  endpoints,
  messages: customMessages,
  buildPayload: buildCompaniesPayload,
  processResponse: processCompaniesResponse
})

// ==================== ALIAS WITH STANDARDIZED NAMES ====================
// Following convention: functionName + Entity

// States
const rowsCompanies = rows
const selectedCompanies = selectedEntity

// Functions for modals
const openFormDialogCompanies = openFormDialog
const closeFormDialogCompanies = closeFormDialog
const openDetailsDialogCompanies = openDetailsDialog

// Functions for API
const fetchCompanies = fetchEntities
// Wrap toggleStatus to update counts/UI immediately after success
const originalToggleStatus = toggleStatus
const toggleStatusCompanies = async (row) => {
  try {
    const prevStatus = row?.status
    // llamar a la función original que hace la petición al backend
    await originalToggleStatus(row)

    // determinar nuevo estado (backend invierte el status)
    const newStatus = prevStatus === 0 ? 1 : 0

    // actualizar el objeto en rowsCompanies (si existe en la lista)
    const idx = rowsCompanies.value.findIndex(r => r._id === (row._id || row.id))
    if (idx !== -1) {
      rowsCompanies.value[idx].status = newStatus
    }

    // actualizar contadores y lista activa
    if (newStatus === 0) {
      companyStats.value.activeCount = Number(companyStats.value.activeCount || 0) + 1
      companyStats.value.inactiveCount = Math.max(0, Number(companyStats.value.inactiveCount || 0) - 1)
      // añadir a activeList si no existe
      const exists = (companyStats.value.activeList || []).some(c => c._id === (row._id || row.id))
      if (!exists) {
        const item = idx !== -1 ? rowsCompanies.value[idx] : (row ?? {})
        companyStats.value.activeList = [...(companyStats.value.activeList || []), item]
      }
    } else {
      companyStats.value.activeCount = Math.max(0, Number(companyStats.value.activeCount || 0) - 1)
      companyStats.value.inactiveCount = Number(companyStats.value.inactiveCount || 0) + 1
      // eliminar de activeList si existe
      companyStats.value.activeList = (companyStats.value.activeList || []).filter(c => c._id !== (row._id || row.id))
    }
  } catch (err) {
    // Error silenciado (el composable ya puede mostrar mensajes al usuario)
  }
}

// Sobrescribir submitForm para validar el formulario antes de enviar
const submitFormCompanies = async () => {
  // Validar el formulario antes de enviar
  const isValid = await companyFormRef.value?.validate()
  
  if (!isValid) {
    // Si hay errores, no hacer nada - los errores ya se muestran en cada campo
    return
  }
  
  try {
    // Enviar formulario (composable)
    await submitForm()

    // Después de éxito: actualizar estadísticas y tabla sin recargar
    // Intentamos primero actualizar solo las estadísticas; luego refrescamos la tabla
    try {
      await fetchActiveCompaniesCount()
    } catch (e) {
      // Silenciar error al actualizar conteo
    }

    // Refrescar listado para mostrar la nueva/actualizada empresa
    try {
      await fetchCompanies()
    } catch (e) {
      // Silenciar error al refrescar tabla
    }

    // Cerrar modal si procede (el composable ya puede hacerlo, esto es seguro)
    closeFormDialogCompanies()
  } catch (err) {
    // Silenciar error de envío (el composable puede encargarse)
  }
}

// ==================== COMPANY SPECIFIC DATA ====================

// Colombia composable: departamentos y ciudades
const { departments, getCitiesByDepartment, getDepartmentByCity } = useColombia()

// Mapeo de departamentos a array de strings para usar en q-select
const departmentsOptions = computed(() => {
  try {
    const deps = (departments && departments.value) || []
    return deps.map(d => (d && d.value) || d)
  } catch (e) {
    return []
  }
})

// Opciones de ciudades mostradas en el select, derivadas del composable
const citiesOptions = ref([])

// Bandera para suprimir la limpieza automática de ciudad cuando estamos populando el formulario
const suppressCityClear = ref(false)

// Cuando el usuario selecciona un departamento, actualizamos las opciones de ciudad
watch(() => formData.value?.department, async (newDep) => {
  const depName = (newDep || '').toString().trim()
  if (depName) {
    const ciudades = getCitiesByDepartment(depName)
    citiesOptions.value = ciudades || []
    // limpiar ciudad seleccionada si cambia el departamento
    if (formData.value && !suppressCityClear.value) formData.value.city = ''
  } else {
    citiesOptions.value = []
    if (formData.value && !suppressCityClear.value) formData.value.city = ''
  }
}, { immediate: true })

// Cuando se carga un formulario para edición, si existe location en formato 'Ciudad, Colombia', intentamos inferir departamento
async function populateFormForEditCompanies(row) {
  // Primero delega al composable para que rellene formData base
  await populateFormForEdit(row)
  // Esperar un tick para que las reactividades internas se estabilicen
  await nextTick()

  // Prioridad: si formData ya trae department/city (por el composable), mantenerlos
  const currentDept = formData.value?.department || selectedCompanies?.department || row?.department || ''
  const currentCity = formData.value?.city || selectedCompanies?.city || row?.city || ''

  if (currentDept) {
    // Suprimir la limpieza automática mientras ajustamos opciones y valor de ciudad
    suppressCityClear.value = true
    try {
      // Asegurar options de ciudades según departamento y mantener ciudad si aplica
      citiesOptions.value = getCitiesByDepartment(String(currentDept)) || []
      if (formData.value) formData.value.department = currentDept
      if (currentCity) {
        // Si la ciudad está disponible para ese departamento, úsala; si no, la dejamos para posible cambio manual
        if (citiesOptions.value.includes(currentCity)) {
          if (formData.value) formData.value.city = currentCity
        } else {
          // asignar ciudad aunque no esté en options (usuario podrá cambiarla)
          if (formData.value) formData.value.city = currentCity
        }
      }
    } finally {
      // esperar tick y reactivar la limpieza normal
      await nextTick()
      suppressCityClear.value = false
    }
    return
  }

  // Si no hay departamento directo, intentar inferir desde location
  const existingLocation = selectedCompanies?.location || row?.location || ''
  if (existingLocation) {
    const cityCandidate = existingLocation.split(',')[0].trim()
    const dep = getDepartmentByCity(cityCandidate)
    if (dep) {
      suppressCityClear.value = true
      try {
        // setear departamento y opciones de ciudad
        if (formData.value) formData.value.department = dep
        citiesOptions.value = getCitiesByDepartment(dep)
        // si la ciudad candidata está en las opciones, asignarla
        if (citiesOptions.value && citiesOptions.value.includes(cityCandidate)) {
          if (formData.value) formData.value.city = cityCandidate
        } else {
          // si no está en opciones, asignar igualmente para que el usuario pueda editar
          if (formData.value) formData.value.city = cityCandidate
        }
      } finally {
        await nextTick()
        suppressCityClear.value = false
      }
    }
  }
}

// Status filter options
const statusAvailable = [
  { label: 'Todos los estados', value: '' },
  { label: 'Activo', value: 0 },
  { label: 'Inactivo', value: 1 }
]

// Table columns
const columns = [
  { name: 'companyNit', label: 'NIT', align: 'center', field: 'companyNit' },
  { name: 'name', label: 'Nombre', align: 'center', field: 'name' },
  { name: 'location', label: 'Locación', align: 'center', field: 'location' },
  { name: 'legalRepresentativePhone', label: 'Teléfono', align: 'center', field: 'legalRepresentativePhone' },
  { name: 'legalRepresentativeName', label: 'Nombre Jefe', align: 'center', field: 'legalRepresentativeName' },
  { name: 'legalRepresentativeEmail', label: 'Email', align: 'center', field: 'legalRepresentativeEmail' },
  { name: 'legalRepresentativePosition', label: 'Cargo', align: 'center', field: 'legalRepresentativePosition' },
  { name: 'status', label: 'Estado', align: 'center', field: 'status' },
  { name: 'options', label: 'Acciones', align: 'center' }
]

// Expresiones regulares para validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
const nitRegex = /^[0-9]{9,}$/
const phoneRegex = /^3[0-9]{9}$/

// ==================== LIFECYCLE ====================

onMounted(async () => {
  await fetchCompanies()
  // Obtener conteo de empresas activas para la card
  fetchActiveCompaniesCount().catch(() => {})
})

// ==================== COMPANY STATISTICS ====================
const companyStats = ref({
  activeCount: 0,
  inactiveCount: 0,
  totalCount: 0,
  activeList: []
})

// Mensaje de error visible en la UI
const statsErrorMessage = ref('')

// Usar getData para obtener la info y asignar el valor a companyStats.activeCount / inactiveCount
const fetchActiveCompaniesCount = async () => {
  statsErrorMessage.value = ''
  try {
    const resp = await getData(`/statistics/companies/by-status`)
    const payload = resp?.data ?? resp

    // extraer active
    let active =
      payload?.data?.active ??
      payload?.active ??
      payload?.msg?.active ??
      payload?.data?.totalActive

    // extraer lista si viene
    const possibleList =
      payload?.data?.companies ??
      payload?.companies ??
      payload?.data?.docs ??
      payload?.data?.activeCompanies ??
      []

    const list = Array.isArray(possibleList) ? possibleList :
      (possibleList && typeof possibleList === 'object' ? (possibleList.docs ?? possibleList.items ?? []) : [])

    if ((active === undefined || active === null) && Array.isArray(list)) {
      active = list.length
    }

    const inactive =
      payload?.data?.inactive ??
      payload?.inactive ??
      payload?.msg?.inactive ??
      payload?.data?.totalInactive ??
      (payload?.total ? (payload.total - (active || 0)) : 0)

    // total: preferir payload.total, si no existe usar suma active+inactive o lista length
    let total = payload?.total ?? payload?.data?.total ?? null
    if (total === null || total === undefined) {
      total = (Number(active || 0) + Number(inactive || 0)) || (Array.isArray(list) ? list.length : 0)
    }

    companyStats.value.activeCount = Number(active) || 0
    companyStats.value.inactiveCount = Number(inactive) || 0
    companyStats.value.activeList = list || []
    companyStats.value.totalCount = Number(total) || 0
  } catch (err) {
    const backendPayload = err?.response?.data ?? err?.data ?? err?.message ?? err
    try {
      statsErrorMessage.value = typeof backendPayload === 'string' ? backendPayload : JSON.stringify(backendPayload)
    } catch {
      statsErrorMessage.value = String(backendPayload)
    }
    companyStats.value.activeCount = 0
    companyStats.value.inactiveCount = 0
    companyStats.value.totalCount = 0
    companyStats.value.activeList = []
  }
}
</script>

<style lang="scss" scoped>
.companies-page {
  background: #f5f7fb;
  min-height: 100vh;
}

.hero-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%);
  margin-bottom: 1.5rem;
}

.content-container {
  width: 100%;
}

.filters-wrapper {
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 0;
  margin-bottom: 1.5rem;
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

.filter-item.status {
  width: 200px;
}

.table-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Card de estadísticas */
.stats-wrapper {
  display: flex;
  gap: 8px; /* espacio reducido entre cards */
  align-items: center;
  justify-content: center; /* centrar las 3 cards */
  flex-wrap: wrap;
}

/* eliminar empuje al extremo derecho para centrar correctamente */
.stats-card-right {
  margin-left: 8px;
}

/* ocultar banner temporalmente (reemplaza .CLASE_X por la clase real) */
.CLASE_X {
  display: none !important;
}

@media (max-width: 1024px) {
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

  .stats-wrapper {
    flex-wrap: wrap;
  }
}

@media (max-width: 1200px) {
  .stats-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-wrapper {
    flex-direction: column;
    gap: 16px;
  }

  .filter-item,
  .filter-item.search,
  .filter-item.status,
  .filter-item.location {
    width: 100%;
    min-width: unset;
  }

  .actions-right {
    width: 100%;
  }

  /* Responsive para el modal - convertir a una sola columna en móviles */
  .modal-content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .data-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 6px 0;
  }

  .data-row .text-weight-bold {
    margin-bottom: 4px;
  }

  .text-weight-bold {
    font-size: 0.9rem;
  }

  .data-value {
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
    padding-left: 10px;
  }

  .data-grid {
    gap: 12px;
    padding: 15px;
  }
}
</style>