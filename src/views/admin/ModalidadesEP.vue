<template>
  <q-page class="q-pa-md modalities-page">
    <BackButton class="q-mb-lg" />

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader title="Modalidades de Etapa Productiva" description="Configura las modalidades y requisitos de cada etapa productiva." />
          </q-card-section>
        </q-card>

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
              label="Nueva Modalidad"
              custom-class="gradient-btn"
              icon="add"
              @click="openModalityFormDialog"
            />
          </div>
        </div>

        <Table
          card
          :rows="rowsModalities"
          :columns="columns"
          v-model:pagination="pagination"
          :loanding-table="loandingTable"
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

          <template #body-cell-standardHours="props">
            <q-td :props="props">
              {{ props.row.standardHours || props.row.standard_hours || 0 }} horas
            </q-td>
          </template>

          <template #body-cell-options="props">
            <q-td :props="props" class="text-center table-options">
              <ButtonTableOptions
                icon="edit"
                color="grey-7"
                tooltip="Editar"
                @click="populateModalityFormForEdit(props.row)"
              />
              <ButtonTableOptions
                :icon="props.row.status === 0 ? 'block' : 'check_circle'"
                :color="props.row.status === 0 ? 'negative' : 'positive'"
                :tooltip="props.row.status === 0 ? 'Desactivar' : 'Activar'"
                @click="toggleModalityStatus(props.row)"
              />
              <ButtonTableOptions
                icon="visibility"
                color="grey"
                tooltip="Ver"
                @click="openModalityDetailsDialog(props.row)"
              />
            </q-td>
          </template>

          <template #no-data>
            <div class="q-pa-md flex flex-center column text-grey full-width">
              <q-icon name="school" size="2.5em" color="positive" />
              <div class="text-subtitle2 q-mt-sm">
                No hay modalidades registradas
              </div>
            </div>
          </template>
        </Table>

        <!-- Modal de Detalles -->
        <Modal v-model="showDetailDialog" width="900px" max-width="90vw">
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon name="school" class="q-mr-sm" />
                {{ selectedModality?.name || 'Modalidad' }}
              </div>
              <Button
                icon="close"
                flat
                round
                dense
                custom-class="icon-button"
                v-close-popup
              />
            </div>
          </template>

          <template #body>
            <div class="row">
              <div class="col-12 q-px-md q-py-sm">
                <div class="text-h6 text-primary q-mb-sm">
                  Información General
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <div class="detail-item">
                      <strong>Nombre:</strong>
                      <div class="text-grey-14">
                        {{ selectedModality?.name || '-' }}
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="detail-item">
                      <strong>Horas Estándar:</strong>
                      <div class="text-grey-14">
                        {{ selectedModality?.standardHours || selectedModality?.standard_hours || 0 }} horas
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="detail-item">
                      <strong>Descripción:</strong>
                      <div class="text-grey-14">
                        {{ selectedModality?.description || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 q-px-md q-py-sm">
                <div class="text-h6 text-primary q-mb-sm">
                  Requerimientos
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-4">
                    <div class="detail-item">
                      <strong>Instructor de Seguimiento:</strong>
                      <div class="text-grey-14">
                        {{ selectedModality?.requires_follow_up_instructor ? 'Sí' : 'No' }}
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="detail-item">
                      <strong>Instructor Técnico:</strong>
                      <div class="text-grey-14">
                        {{ selectedModality?.requires_technical_instructor ? 'Sí' : 'No' }}
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="detail-item">
                      <strong>Instructor de Proyecto:</strong>
                      <div class="text-grey-14">
                        {{ selectedModality?.requires_project_instructor ? 'Sí' : 'No' }}
                      </div>
                    </div>
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

        <!-- Modal de Crear/Editar -->
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
                <q-icon name="school" class="q-mr-sm" />
                {{ isEditMode ? 'Editar Modalidad' : 'Nueva Modalidad' }}
              </div>
              <Button icon="close" flat round dense v-close-popup />
            </div>
          </template>

          <template #body>
            <q-form @submit.prevent="submitModalityForm">
              <div class="row q-col-gutter-md q-pa-md">
                <div class="col-12">
                  <div class="text-h6 q-mb-sm">Información General</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="formData.name"
                        outlined
                        dense
                        label="Nombre de Modalidad *"
                        :rules="[val => !!val || 'El nombre es requerido']"
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model.number="formData.standard_hours"
                        outlined
                        dense
                        label="Horas Estándar *"
                        type="number"
                        min="0"
                        :rules="[val => !!val || 'Las horas son requeridas']"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="formData.description"
                        outlined
                        dense
                        label="Descripción"
                        type="textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-12 q-mt-md">
                  <div class="text-h6 q-mb-sm">Requerimientos de Instructores</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-4">
                      <q-select
                        v-model="formData.requires_follow_up_instructor"
                        outlined
                        dense
                        label="Instructor de Seguimiento *"
                        :options="yesNoOptions"
                        emit-value
                        map-options
                        :rules="[val => val !== null || 'Campo requerido']"
                      />
                    </div>
                    <div class="col-12 col-md-4">
                      <q-select
                        v-model="formData.requires_technical_instructor"
                        outlined
                        dense
                        label="Instructor Técnico *"
                        :options="yesNoOptions"
                        emit-value
                        map-options
                        :rules="[val => val !== null || 'Campo requerido']"
                      />
                    </div>
                    <div class="col-12 col-md-4">
                      <q-select
                        v-model="formData.requires_project_instructor"
                        outlined
                        dense
                        label="Instructor de Proyecto *"
                        :options="yesNoOptions"
                        emit-value
                        map-options
                        :rules="[val => val !== null || 'Campo requerido']"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-12 q-mt-lg">
                  <div class="row justify-end q-gutter-sm">
                    <Button
                      custom-class="boton-cerrar"
                      label="Cancelar"
                      @click="closeModalityFormDialog"
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
import { ref, onMounted } from 'vue'
import { getData, postData, putData } from 'src/services/apiClient'
import { useNotifications } from 'src/composables/useNotifications'
import BackButton from 'src/components/BackButton.vue'
import Table from 'src/components/Table.vue'
import Button from 'src/components/Button.vue'
import ButtonTableOptions from 'src/components/ButtonTableOptions.vue'
import Modal from 'src/components/Modal.vue'
import PageHeader from 'src/components/PageHeader.vue'

// ==================== NOTIFICACIONES ====================
const { error, success } = useNotifications()

// ==================== ESTADOS PRINCIPALES ====================
const loading = ref(false)
const loandingTable = ref(false)

const rowsModalities = ref([])
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const selectedModality = ref(null)

const statusAvailable = [
  { label: 'Todos los estados', value: '' },
  { label: 'Activo', value: 0 },
  { label: 'Inactivo', value: 1 }
]

const yesNoOptions = [
  { label: 'Sí', value: 1 },
  { label: 'No', value: 0 }
]

const getDefaultFormData = () => ({
  _id: '',
  name: '',
  description: '',
  standard_hours: 0,
  requires_follow_up_instructor: 1,
  requires_technical_instructor: 1,
  requires_project_instructor: 0
})

const formData = ref(getDefaultFormData())

const filtersData = ref({
  search: '',
  status: ''
})

const columns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'standardHours', label: 'Horas Estándar', align: 'center', field: 'standardHours' },
  { name: 'status', label: 'Estado', align: 'center', field: 'status' },
  { name: 'options', label: 'Acciones', align: 'center' }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const handlePaginationRequest = props => {
  if (!props?.pagination) return
  pagination.value = {
    page: props.pagination.page,
    rowsPerPage: props.pagination.rowsPerPage,
    rowsNumber: props.pagination.rowsNumber ?? pagination.value.rowsNumber
  }
  fetchModalities()
}

const resetPaginationState = () => {
  pagination.value.page = 1
}

const handleSearchChange = () => {
  resetPaginationState()
  fetchModalities()
}

const handleStatusChange = () => {
  resetPaginationState()
  fetchModalities()
}

const handleAddDialogVisibility = value => {
  if (!value) {
    isEditMode.value = false
    resetModalityForm()
  }
}

const fetchModalities = async () => {
  const { page, rowsPerPage } = pagination.value
  loandingTable.value = true
  try {
    const params = {
      page,
      limit: rowsPerPage
    }

    const trimmedSearch = filtersData.value.search?.trim()
    if (trimmedSearch) {
      params.search = trimmedSearch
    }

    if (filtersData.value.status !== '' && filtersData.value.status !== null) {
      params.status = filtersData.value.status
    }

    const response = await getData('/modalities/listModalities', { params })

    const modalities = response?.msg?.modalities ?? []
    rowsModalities.value = modalities
    pagination.value.rowsNumber = response?.msg?.totalDocuments ?? modalities.length
  } catch (err) {
    const message = err?.response?.data?.msg || err?.message || 'Error al listar las modalidades'
    error(message)
    rowsModalities.value = []
    pagination.value.rowsNumber = 0
  } finally {
    loandingTable.value = false
  }
}

const openModalityFormDialog = () => {
  isEditMode.value = false
  resetModalityForm()
  showAddDialog.value = true
}

const closeModalityFormDialog = () => {
  showAddDialog.value = false
  handleAddDialogVisibility(false)
}

const openModalityDetailsDialog = row => {
  selectedModality.value = row
  showDetailDialog.value = true
}

const resetModalityForm = () => {
  formData.value = getDefaultFormData()
}

const populateModalityFormForEdit = row => {
  showAddDialog.value = true
  isEditMode.value = true
  formData.value = {
    _id: row._id,
    name: row.name ?? '',
    description: row.description ?? '',
    standard_hours: row.standard_hours ?? row.standardHours ?? 0,
    requires_follow_up_instructor: row.requires_follow_up_instructor ?? 1,
    requires_technical_instructor: row.requires_technical_instructor ?? 1,
    requires_project_instructor: row.requires_project_instructor ?? 0
  }
}

const buildModalityPayload = () => ({
  name: formData.value.name?.trim(),
  description: formData.value.description?.trim(),
  standard_hours: formData.value.standard_hours,
  requires_follow_up_instructor: formData.value.requires_follow_up_instructor,
  requires_technical_instructor: formData.value.requires_technical_instructor,
  requires_project_instructor: formData.value.requires_project_instructor
})

const submitModalityForm = async () => {
  loading.value = true
  const payload = buildModalityPayload()

  if (!isEditMode.value) {
    try {
      const response = await postData('/modalities/saveModalities', payload)
      success(response?.msg || 'Modalidad creada correctamente')
      showAddDialog.value = false
      handleAddDialogVisibility(false)
      await fetchModalities()
    } catch (err) {
      error(err?.response?.data?.errors || err?.message || 'Error al crear la modalidad')
    } finally {
      loading.value = false
    }
    return
  }

  try {
    const response = await putData(`/modalities/updateModalities/${formData.value._id}`, payload)
    success(response?.msg || 'Modalidad actualizada correctamente')
    showAddDialog.value = false
    handleAddDialogVisibility(false)
    await fetchModalities()
  } catch (err) {
    error(err?.response?.data?.msg || err?.message || 'Error al actualizar la modalidad')
  } finally {
    loading.value = false
  }
}

const toggleModalityStatus = async row => {
  loading.value = true
  try {
    const isInactive = row.status == 1
    const endpoint = isInactive
      ? `/modalities/activeModalities/${row._id}`
      : `/modalities/inactiveModalities/${row._id}`
    const response = await putData(endpoint)
    success(response?.msg || 'Estado actualizado correctamente')
    await fetchModalities()
  } catch (err) {
    error(err?.response?.data?.msg || err?.message || 'No fue posible cambiar el estado')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchModalities()
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

.filter-item.status {
  width: 200px;
}

.table-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.icon-button {
  min-height: 36px;
  width: 36px;
  padding: 0;
  border-radius: 50%;
  background: transparent !important;
  box-shadow: none !important;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-primary);
  color: white;
  padding: 16px 24px;
}

.detail-item {
  padding: 8px 0;
}

.detail-item strong {
  display: block;
  color: var(--color-primary);
  margin-bottom: 4px;
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
}

@media (max-width: 768px) {
  .filter-item,
  .filter-item.search,
  .filter-item.status {
    width: 100%;
    min-width: unset;
  }

  .actions-right {
    width: 100%;
  }
}
</style>
