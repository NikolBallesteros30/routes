<template>
  <q-page class="q-pa-md pre-registration-page">
    <BackButton to="/app/aprendiz/inicio" />

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader title="Pre-Registro de Etapa Productiva"
              description="Gestiona tu proceso de pre-registro y documentación requerida" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Pestañas -->
    <div class="tabs-container">
      <Button :class="['tab-btn', { active: activeTab === 'solicitudes' }]" label="Pre-Registro"
        @click="activeTab = 'solicitudes'" />
      <Button :class="['tab-btn', { active: activeTab === 'nuevo' }]" label="Validación de Documentos"
        @click="activeTab = 'nuevo'" />
    </div>

    <div class="contenido-principal">
      <!-- PRE-REGISTROS -->
      <div v-if="activeTab === 'solicitudes'" class="tab-panel">
        <div class="q-pa-md">
          <div class="container">
            <!-- Barra de búsqueda -->
            <div class="row items-center q-mb-md q-gutter-sm">
              <div class="col-12 col-md-3">
                <q-input v-model="filtersData.search" dense outlined placeholder="Buscar por número..."
                  @keyup.enter="handleSearchChange" clearable @clear="clearFilters">
                  <template v-slot:prepend>
                    <q-icon name="search" color="green-8" />
                  </template>
                </q-input>
              </div>
              <div class="col-auto">
                <Button label="+ Pre-registro Individual" custom-class="gradient-btn" @click="openFormDialogRegistration"
                  style="height: 36px; padding: 8px 16px;" />
              </div>
              <div class="col-auto">
                <Button label="+ Pre-registro Grupal" custom-class="gradient-btn" @click="openFormDialogGroupRegistration"
                  style="height: 36px; padding: 8px 16px;" />
              </div>
            </div>

            <!-- Tabla de mis registros -->
            <Table :rows="rowsRegistrations" :columns="columns" row-key="_id"
              no-data-label="No tienes registros de EP. ¡Crea tu primer registro!" :rows-per-page-options="[10, 20, 50]"
              :initial-rows-per-page="10" :loandingTable="loadingTable" v-model:pagination="pagination"
              @request="handlePaginationRequest">
              
              <template #body-cell-project_type="props">
                <q-td :props="props">
                  <q-badge :color="getProjectTypeColor(props.row.project_type)">
                    {{ getProjectTypeLabel(props.row.project_type) }}
                  </q-badge>
                </q-td>
              </template>
              
              <template #body-cell-registration_status="props">
                <q-td :props="props">
                  <q-badge :color="getStatusColor(props.row.registration_status)">
                    {{ getStatusLabel(props.row.registration_status) }}
                  </q-badge>
                </q-td>
              </template>

              <template #body-cell-modality="props">
                <q-td :props="props">
                  {{ props.row.modality || 'N/A' }}
                </q-td>
              </template>

              <template #body-cell-company="props">
                <q-td :props="props">
                  {{ props.row.company || 'N/A' }}
                </q-td>
              </template>

              <template #body-cell-scheduled_start_date="props">
                <q-td :props="props">
                  {{ formatDate(props.row.scheduled_start_date) }}
                </q-td>
              </template>

              <template #body-cell-opciones="props">
                <q-td :props="props" class="text-center">
                  <ButtonTableOptions 
                    icon="visibility" 
                    tooltip="Ver detalles" 
                    @click="openDetailsDialogRegistration(props.row)" 
                  />
                </q-td>
              </template>
            </Table>
          </div>
        </div>

        <!-- Modal de Detalles -->
        <Modal v-model="showDetailDialog" variant="view" width="800px" max-width="95vw">
          <template #header>
            <q-icon name="visibility" size="24px" class="q-mr-sm" />
            <span class="text-h6">Detalles del Registro EP</span>
          </template>
          <template #body>
            <div v-if="selectedRegistration" class="modal-content-grid">
              <div class="modal-column">
                <div class="section-title">Información General</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Tipo de Registro:</div>
                    <div class="data-value">
                      <q-badge :color="getProjectTypeColor(selectedRegistration.project_type)">
                        {{ getProjectTypeLabel(selectedRegistration.project_type) }}
                      </q-badge>
                    </div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Modalidad:</div>
                    <div class="data-value">{{ selectedRegistration.modality || 'N/A' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Empresa:</div>
                    <div class="data-value">{{ selectedRegistration.company || 'N/A' }}</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Fecha de Inicio:</div>
                    <div class="data-value">{{ formatDate(selectedRegistration.scheduled_start_date) }}</div>
                  </div>
                </div>
              </div>
              
              <div class="modal-column">
                <div class="section-title">Estado y Detalles</div>
                <div class="data-grid">
                  <div class="data-row">
                    <div class="text-weight-bold">Estado:</div>
                    <div class="data-value">
                      <q-badge :color="getStatusColor(selectedRegistration.registration_status)">
                        {{ getStatusLabel(selectedRegistration.registration_status) }}
                      </q-badge>
                    </div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Total Horas Solicitadas:</div>
                    <div class="data-value">{{ selectedRegistration.total_requested_hours }} horas</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Días Laborales:</div>
                    <div class="data-value">{{ selectedRegistration.working_days }} días/semana</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Horas Diarias:</div>
                    <div class="data-value">{{ selectedRegistration.daily_hours }} horas/día</div>
                  </div>
                  <div class="data-row">
                    <div class="text-weight-bold">Fecha de Registro:</div>
                    <div class="data-value">{{ formatDate(selectedRegistration.registration_date) }}</div>
                  </div>
                </div>
              </div>

              <!-- Observaciones del Aprendiz -->
              <div v-if="selectedRegistration.apprentice_observations && selectedRegistration.apprentice_observations.length > 0 && selectedRegistration.apprentice_observations.some(obs => obs && obs.descripcion)" class="col-12">
                <div class="section-title">Mis Observaciones</div>
                <div class="data-grid">
                  <div class="data-row" v-for="(obs, index) in selectedRegistration.apprentice_observations" :key="index">
                    <div class="text-weight-bold">{{ formatDate(obs.fecha) }} - {{ obs.escrito_por }}:</div>
                    <div class="data-value">{{ obs.descripcion }}</div>
                  </div>
                </div>
              </div>

              <!-- Observaciones del Admin -->
              <div v-if="selectedRegistration.admin_observations && selectedRegistration.admin_observations.length > 0 && selectedRegistration.admin_observations.some(obs => obs && obs.descripcion)" class="col-12">
                <div class="section-title">Observaciones del Administrador</div>
                <div class="data-grid">
                  <div class="data-row" v-for="(obs, index) in selectedRegistration.admin_observations" :key="index">
                    <div class="text-weight-bold">{{ formatDate(obs.fecha) }} - {{ obs.escrito_por }}:</div>
                    <div class="data-value">{{ obs.descripcion }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <Button label="Cerrar" custom-class="boton-cerrar" @click="closeDetailsDialogRegistration" />
          </template>
        </Modal>

        <!-- Modal de Creación/Edición -->
        <Modal v-model="showAddDialog" variant="edit" width="900px" max-width="98vw">
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon :name="isEditMode ? 'edit' : 'add'" size="24px" class="q-mr-sm" />
                {{ isEditMode ? 'Editar' : 'Nuevo' }} Registro de Etapa Productiva
              </div>
            </div>
          </template>
          <template #body>
            <q-form ref="formRef" class="q-pa-md">
              <div class="modal-column">
                
                <!-- Número de Registro (solo en edición) -->
                <div v-if="isEditMode" class="col-12">
                  <q-input v-model="formDataRegistration.registration_number" label="Número de Registro" filled dense
                    readonly hint="Número de registro asignado" />
                </div>

                <!-- Información del aprendiz (solo lectura) -->
                <div class="col-12">
                  <q-banner class="bg-blue-1">
                    <template v-slot:avatar>
                      <q-icon name="account_circle" color="primary" />
                    </template>
                    <div class="text-body2">
                      <strong>Registrando para:</strong> {{ apprenticeName }}
                    </div>
                  </q-banner>
                </div>

                <div class="section-title">Detalles de la Etapa Productiva</div>
                <!-- Seleccionar Modalidad -->
                  <q-select 
                  v-model="formDataRegistration.modality_id" 
                  :options="modalityOptions" 
                  option-value="_id"
                    option-label="name" 
                    emit-value map-options label="Modalidad EP *" 
                    filled 
                    dense
                    :rules="[requiredRule]">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay modalidades disponibles
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                <!-- Fecha de Inicio Programada -->
                  <q-input 
                  v-model="formDataRegistration.scheduled_start_date" 
                  label="Fecha de Inicio Programada *"
                    filled 
                    dense 
                    type="date" 
                    :rules="[requiredRule]" />

                  <!-- Días Laborales por Semana -->
                  <q-input 
                    v-model.number="formDataRegistration.working_days" 
                    label="Días Laborales por Semana *" 
                    filled
                    dense 
                    type="number"
                    min="1"
                    max="7"
                    :rules="[requiredRule, (val) => {const num = parseInt(val) || 0; return (num >= 1 && num <= 7) || 'Debe estar entre 1 y 7'}]" />

                  <!-- Horas Diarias -->
                  <q-input 
                    v-model.number="formDataRegistration.daily_hours" 
                    label="Horas Diarias *" 
                    filled 
                    dense
                    type="number"
                    min="1"
                    max="24" 
                    :rules="[requiredRule, (val) => {const num = parseInt(val) || 0; return (num >= 1 && num <= 24) || 'Debe estar entre 1 y 24'}]" />

              </div>

                <div class="modal-column">
                  <div class="section-title">Configuración de Horas</div>

                <!-- Total Horas Solicitadas -->
                <div class="col-12 col-md-6">
                  <q-input 
                  v-model.number="formDataRegistration.total_requested_hours" 
                  label="Total Horas Solicitadas *"
                    filled 
                    dense 
                    type="number" 
                    :readonly="!isHoursBasedModality"
                    :disable="!isHoursBasedModality"
                    :rules="isHoursBasedModality ? [requiredRule, (val) => (parseInt(val) || 0) > 0 || 'Debe ser mayor a 0'] : []"
                    :bg-color="!isHoursBasedModality ? 'grey-3' : 'white'">
                    <template v-slot:prepend>
                      <q-icon name="schedule" :color="isHoursBasedModality ? 'primary' : 'grey'" />
                    </template>
                    <template v-slot:hint v-if="!isHoursBasedModality">
                      Esta modalidad no usa horas
                    </template>
                  </q-input>
                </div>

                <!-- Total Meses Solicitados -->
                <div class="col-12 col-md-6">
                  <q-input 
                  v-model.number="formDataRegistration.total_requested_months" 
                  label="Total Meses Solicitados *"
                    filled 
                    dense 
                    type="number" 
                    :readonly="!isMonthsBasedModality"
                    :disable="!isMonthsBasedModality"
                    :rules="isMonthsBasedModality ? [requiredRule, (val) => (parseInt(val) || 0) > 0 || 'Debe ser mayor a 0'] : []"
                    :bg-color="!isMonthsBasedModality ? 'grey-3' : 'white'">
                    <template v-slot:prepend>
                      <q-icon name="calendar_month" :color="isMonthsBasedModality ? 'primary' : 'grey'" />
                    </template>
                    <template v-slot:hint v-if="!isMonthsBasedModality">
                      Esta modalidad no usa meses
                    </template>
                  </q-input>
                </div>

                <!-- ARL del SENA Requerida -->
                <div class="col-12 col-md-6">
                  <q-checkbox 
                    v-model="formDataRegistration.sena_required_arl" 
                    label="ARL del SENA Requerida" 
                    color="primary" />
                </div>

                <!-- Tipo de Proyecto -->
                <div class="col-12 col-md-6">
                  <q-select 
                    v-model="formDataRegistration.project_type" 
                    label="Tipo de Proyecto" 
                    filled 
                    dense
                    :options="[{ label: 'Proyecto Individual', value: 0 }]"
                    emit-value
                    map-options
                    readonly
                  />
                </div>

                <div class="section-title">Información Empresas</div>

                  <!-- Seleccionar Empresa -->
                <div class="col-12 col-md-6">
                  <q-select 
                  v-model="formDataRegistration.company_id" 
                  :options="companyOptionsForForm"
                    option-value="_id" 
                    option-label="name" 
                    emit-value map-options label="Empresa *" 
                    filled 
                    dense
                    :rules="[requiredRule]"  
                    use-input 
                    input-debounce="300"
                    @filter="filterCompaniesForForm">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay empresas disponibles
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <!-- Botón para crear nueva empresa -->
                <div class="col-12 col-md-6">
                  <Button label="+ Crear Nueva Empresa" custom-class="gradient-btn" @click="openFormDialogCompany"
                    style="width: 100%; height: 40px;" />
                </div>

                <!-- Advertencia si está editando -->
                <div v-if="isEditMode" class="col-12">
                  <q-banner class="bg-orange-1">
                    <template v-slot:avatar>
                      <q-icon name="warning" color="orange" />
                    </template>
                    <div class="text-body2">
                      Solo puedes editar registros que aún no han sido validados por el administrador.
                    </div>
                  </q-banner>
                </div>
              </div>
            </q-form>
              </template>

              <template #footer>
                <!-- Botones de acción -->
                <div class="col-12 q-mt-md">
                  <div class="row justify-end q-gutter-sm">
                    <Button label="Cancelar" custom-class="boton-cerrar" @click="closeFormDialogRegistration" />
                    <Button v-if="!isEditMode" label="Registrar y Enviar" custom-class="boton-enviar"
                      @click="handleSubmitAndSend" :loading="loading" />
                    <Button v-if="isEditMode" label="Actualizar" custom-class="boton-enviar"
                      @click="submitFormRegistration" :loading="loading" />
                    <Button v-if="isEditMode && canSend(selectedRegistration)" label="Enviar a Validación"
                      custom-class="boton-enviar" @click="handleSendFromModal" :loading="loading" />
                  </div>
                </div>
          </template>
        </Modal>

        <!-- Modal de Nueva Empresa -->
        <Modal v-model="showCompanyDialog" variant="edit" width="700px" max-width="98vw">
          <template #header>
            <div class="modal-header">
              <q-icon name="business" size="24px" class="q-mr-sm" />
              <span class="text-h6">Registrar Nueva Empresa</span>
            </div>
          </template>
          <template #body>
            <q-form ref="newCompanyFormRef" class="q-pa-md">
              <div class="modal-column">
                <div class="section-title">Datos de la empresa</div>
                  <q-input 
                  v-model="formDataCompany.companyNit" 
                  label="NIT de la Empresa *" filled dense
                    :rules="[requiredRule]" />
                
                  <q-input v-model="formDataCompany.name" 
                  label="Nombre de la Empresa *" 
                  filled 
                  dense
                    :rules="[requiredRule]"  />
                
                  <q-input v-model="formDataCompany.location" 
                  label="Ubicación/Ciudad *" 
                  filled 
                  dense
                    :rules="[requiredRule]" />
              </div>
               
               <div class="modal-column">
                <div class="section-title">Contacto de la empresa</div>
                  <q-input 
                  v-model="formDataCompany.legalRepresentativeName" 
                  label="Nombre del Representante Legal *"
                    filled 
                    dense 
                    :rules="[requiredRule]"  />
                
                  <q-input 
                  v-model="formDataCompany.legalRepresentativeEmail" 
                  label="Email del Representante *" filled
                    dense 
                    type="email" 
                    :rules="[requiredRule]" />
               
                  <q-input 
                  v-model="formDataCompany.legalRepresentativePhone" 
                  label="Teléfono del Representante *"
                    filled 
                    dense 
                    :rules="[requiredRule]"/>

                  <q-input 
                  v-model="formDataCompany.legalRepresentativePosition" 
                  label="Cargo del Representante *"
                    filled 
                    dense 
                    :rules="[requiredRule]" />
               </div>
            </q-form>
          </template>
          <template #footer>
            <Button label="Cancelar" custom-class="boton-cerrar" @click="closeFormDialogCompany" />
            <Button label="Registrar Empresa" custom-class="boton-enviar" @click="submitFormCompany"
              :loading="loading" />
          </template>
        </Modal>

        <!-- Modal de Pre-registro Grupal -->
        <Modal v-model="showGroupDialog" variant="edit" width="900px" max-width="98vw" persistent>
          <template #header>
            <q-icon name="groups" size="24px" class="q-mr-sm" />
            <span class="text-h6">Pre-registro Grupal de Etapa Productiva</span>
          </template>
          <template #body>
            <q-form ref="groupFormRef" class="q-pa-md">
              <!-- Paso 1: Información del Proyecto -->
              <div v-if="currentStep === 1" class="modal-column">
                <div class="section-title">Información del Proyecto</div>
                
                <q-input 
                  v-model="formDataGroupRegistration.projectName" 
                  label="Nombre del Proyecto" 
                  filled 
                  dense
                  :rules="[requiredRule]"
                  hint="Ingrese el nombre descriptivo del proyecto grupal"
                />
                
                <q-input 
                  v-model="formDataGroupRegistration.projectDescription" 
                  label="Descripción del Proyecto" 
                  type="textarea" 
                  filled 
                  dense
                  rows="4"
                  :rules="[requiredRule]"
                  hint="Mínimo 10 caracteres requeridos"
                  counter
                  maxlength="500"
                />
                
                <q-select 
                  v-model="formDataGroupRegistration.projectType" 
                  label="Tipo de Proyecto" 
                  filled 
                  dense
                  :options="[{ label: 'Proyecto Grupal', value: 1 }]"
                  emit-value
                  map-options
                  :rules="[requiredRule]"
                  readonly
                />
              </div>

              <!-- Paso 2: Configuración de Etapa Productiva -->
              <div v-if="currentStep === 2" class="modal-column">
                <div class="section-title">Configuración de Etapa Productiva</div>
                
                <q-select 
                  v-model="formDataGroupRegistration.modality_id" 
                  label="Modalidad EP" 
                  filled 
                  dense
                  :options="modalityOptions"
                  option-value="_id"
                  option-label="name"
                  emit-value
                  map-options
                  :rules="[requiredRule]"
                  use-input
                  input-debounce="300"
                />
                
                <q-input 
                  v-model="formDataGroupRegistration.scheduled_start_date" 
                  label="Fecha de Inicio Programada" 
                  filled 
                  dense
                  type="date"
                  :rules="[requiredRule]"
                  hint="dd/mm/aaaa"
                />
                
                <q-input 
                  v-if="isHoursBasedModalityGroup"
                  v-model="formDataGroupRegistration.total_requested_hours" 
                  label="Total Horas Solicitadas" 
                  filled 
                  dense
                  type="number"
                  min="1"
                  placeholder="880"
                />
                
                <q-input 
                  v-if="isMonthsBasedModalityGroup"
                  v-model="formDataGroupRegistration.total_requested_months" 
                  label="Total Meses Solicitados" 
                  filled 
                  dense
                  type="number"
                  min="1"
                  max="12"
                  placeholder="6"
                  hint="Duración del proyecto en meses"
                />
                
                <q-input
                  v-model="formDataGroupRegistration.total_requested_months"
                  label="Total de Meses Solicitados"
                  type="number"
                  min="1"
                  max="24"
                  outlined
                  dense
                  :disable="isHoursBasedModalityGroup"
                  :rules="[val => !val || val > 0 || 'Debe ser mayor a 0']"
                />
              </div>

              <!-- Paso 3: Información de Empresas -->
              <div v-if="currentStep === 3" class="modal-column">
                <div class="section-title">Información Empresas</div>
                
                <q-select 
                  v-model="formDataGroupRegistration.company_id" 
                  label="Empresa" 
                  filled 
                  dense
                  :options="companyOptionsForForm"
                  option-value="_id"
                  option-label="name"
                  emit-value
                  map-options
                  use-input
                  input-debounce="300"
                  @filter="filterCompaniesForForm"
                  clearable
                />
                
                <Button 
                  label="+ CREAR NUEVA EMPRESA" 
                  custom-class="gradient-btn" 
                  @click="openFormDialogCompany" 
                  style="width: 100%; margin-top: 10px;"
                />
              </div>

              <!-- Paso 4: Selección de Compañeros -->
              <div v-if="currentStep === 4" class="modal-column">
                <div class="section-title">Selección de Compañeros</div>
                
                <q-banner class="bg-blue-1 q-mb-md">
                  <template v-slot:avatar>
                    <q-icon name="account_circle" color="primary" />
                  </template>
                  <div class="text-body2">
                    <strong>Líder del grupo:</strong> {{ apprenticeName }}<br>
                    <small>Ingresa tu documento y el de tus compañeros para el registro grupal</small>
                  </div>
                </q-banner>
                
                <q-banner class="bg-orange-1 q-mb-md">
                  <template v-slot:avatar>
                    <q-icon name="info" color="warning" />
                  </template>
                  <div class="text-body2">
                    <strong>Importante:</strong> Los aprendices no deben tener otros pre-registros activos (individuales o grupales) para poder ser incluidos en este grupo.
                  </div>
                </q-banner>
                
                <q-input 
                  v-model="formDataGroupRegistration.leaderDocument" 
                  label="Tu Número de Documento" 
                  filled 
                  dense
                  :rules="[requiredRule]"
                  hint="Tu documento como líder del grupo"
                />
                
                <div class="text-h6 q-my-md">Agregar Compañeros al Grupo</div>
                
                <div class="row q-col-gutter-sm q-mb-md">
                  <div class="col">
                    <q-input 
                      v-model="newMemberDocument" 
                      label="Número de Documento del Compañero" 
                      filled 
                      dense
                      @keyup.enter="addGroupMember"
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn 
                      icon="add" 
                      color="primary" 
                      @click="addGroupMember" 
                      :disable="!newMemberDocument.trim()"
                    />
                  </div>
                </div>
                
                <div v-if="formDataGroupRegistration.groupMembers?.length > 0">
                  <div class="text-subtitle1 q-mb-sm">Integrantes del Proyecto ({{ formDataGroupRegistration.groupMembers.length + 1 }} total):</div>
                  
                  <!-- Líder del grupo -->
                  <q-card flat bordered class="q-mb-xs">
                    <q-card-section class="row items-center q-py-sm">
                      <q-icon name="account_circle" color="primary" class="q-mr-sm" />
                      <div class="col">
                        <div class="text-weight-bold">{{ apprenticeName }}</div>
                        <div class="text-caption">Líder del registro</div>
                      </div>
                      <q-badge color="primary" label="LÍ" />
                    </q-card-section>
                  </q-card>
                  
                  <!-- Miembros del grupo -->
                  <q-card flat bordered class="q-mb-xs" v-for="(member, index) in formDataGroupRegistration.groupMembers" :key="index">
                    <q-card-section class="row items-center q-py-sm">
                      <q-icon name="person" color="grey-6" class="q-mr-sm" />
                      <div class="col">
                        <div class="text-weight-medium">{{ member }}</div>
                        <div class="text-caption">Miembro del grupo</div>
                      </div>
                      <q-btn 
                        flat 
                        round 
                        dense 
                        icon="remove" 
                        color="negative" 
                        @click="removeGroupMember(index)"
                        size="sm"
                      />
                    </q-card-section>
                  </q-card>
                </div>
                
                <q-banner v-if="formDataGroupRegistration.groupMembers?.length === 0" color="warning" class="q-mt-md">
                  <template v-slot:avatar>
                    <q-icon name="warning" />
                  </template>
                  Debe agregar al menos 1 compañero para el registro grupal
                </q-banner>
              </div>
              
              <!-- Navegación entre pasos -->
              <div class="row justify-between q-mt-lg">
                <Button 
                  v-if="currentStep > 1" 
                  label="Anterior" 
                  custom-class="boton-cerrar" 
                  @click="currentStep--"
                />
                <div v-else></div>
                
                <div class="q-gutter-sm">
                  <Button 
                    v-if="currentStep < 4" 
                    label="Siguiente" 
                    custom-class="gradient-btn" 
                    @click="nextStep"
                  />
                  <Button 
                    v-if="currentStep === 4" 
                    label="REGISTRAR GRUPO Y ENVIAR" 
                    custom-class="boton-enviar" 
                    @click="submitGroupRegistration"
                    :disable="loading || formDataGroupRegistration.groupMembers?.length === 0"
                    :loading="loading"
                  />
                </div>
              </div>
            </q-form>
          </template>
          <template #footer>
            <div class="row justify-end q-gutter-sm full-width">
              <Button label="CANCELAR" custom-class="boton-cerrar" @click="closeGroupDialog" :disable="loading" />
            </div>
          </template>
        </Modal>
      </div>

      <!-- VALIDACIÓN DE DOCUMENTOS -->
      <div v-if="activeTab === 'nuevo'" class="tab-panel">
        <div class="container">
          <q-card class="section-card q-mb-lg">
            <q-card-section class="section-content">
              <div class="message-section q-mb-lg">
                <div class="message-text q-mb-md">
                  Tu prerregistro ha sido aprobado exitosamente.
                </div>
                <div class="message-text">
                  Para continuar con el proceso, por favor envía los siguientes documentos utilizando las plantillas
                  adjuntas:
                </div>
              </div>

              <div class="recommendation-box q-mb-xl">
                <div class="recommendation-content">
                  <q-icon name="info" size="20px" class="q-mr-sm" />
                  <div class="recommendation-text">
                    Te recomendamos revisar cuidadosamente que toda la información esté completa y firmada antes de
                    enviarla.
                  </div>
                </div>
              </div>

              <div class="upload-section q-mb-xl">
                <div class="upload-label-group q-mb-md">
                  <div class="upload-label">Seleccionar archivo</div>
                  <div class="upload-sublabel">Formatos permitidos: PDF</div>
                </div>
                <div class="upload-input-group">
                  <q-file v-model="selectedFile" filled dense accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    :disable="loading" clearable class="custom-file-input" @update:model-value="handleFileChange">
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
              </div>

              <div v-if="selectedFile" class="file-info-box q-mb-lg">
                <q-icon name="description" size="18px" class="q-mr-sm" />
                <span class="file-name">{{ selectedFile.name }}</span>
                <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
              </div>

              <div class="form-actions">
                <Button label="Enviar Documentos" custom-class="boton-enviar" :loading="loading"
                  :disable="!selectedFile" @click="openConfirmationDialog" />
                <Button label="Cancelar" custom-class="boton-cerrar" :disable="loading" @click="handleCancel" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Modal de confirmación -->
        <Modal v-model="showConfirmationDialog" width="500px" max-width="95vw" persistent>
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon name="send" class="q-mr-sm" />
                Confirmar Envío
              </div>
            </div>
          </template>

          <template #body>
            <div class="q-pa-md text-center">
              <div class="text-h6 q-mb-md">¿Está seguro de que desea enviar este documento?</div>
              <p class="confirmation-text text-body1">
                Una vez enviado, el documento será revisado por el equipo administrativo.
                Recibirás una notificación cuando tu documento haya sido validado.
              </p>
            </div>
          </template>

          <template #footer>
            <div class="row justify-end q-gutter-sm full-width">
              <Button label="Cancelar" custom-class="boton-cerrar" @click="closeConfirmationDialog"
                :disable="loading" />
              <Button label="Enviar" custom-class="boton-enviar" @click="submitDocuments" :loading="loading" />
            </div>
          </template>
        </Modal>

        <!-- Modal de cancelación -->
        <Modal v-model="showCancellationDialog" width="500px" max-width="95vw" persistent>
          <template #header>
            <div class="modal-header">
              <div class="text-h6 flex items-center">
                <q-icon name="cancel" class="q-mr-sm" color="negative" />
                Confirmar Cancelación
              </div>
            </div>
          </template>

          <template #body>
            <div class="q-pa-md text-center">
              <div class="text-h6 q-mb-md">¿Estás seguro de que deseas cancelar?</div>
              <p class="confirmation-text text-body1">
                Se perderá el archivo seleccionado y tendrás que volver a seleccionarlo si decides continuar más tarde.
              </p>
            </div>
          </template>

          <template #footer>
            <div class="row justify-end q-gutter-sm full-width">
              <Button label="No, continuar" custom-class="boton-enviar" @click="closeCancellationDialog"
                :disable="loading" />
              <Button label="Sí, cancelar" custom-class="boton-cerrar" @click="confirmCancel" :disable="loading" />
            </div>
          </template>
        </Modal>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getData, postData, putData } from 'src/services/apiClient'
import { useNotifications } from 'src/composables/useNotifications'
import { useAuthStore } from 'src/stores/authStore'
import { useEntityManager } from 'src/composables/useEntityManager'
import Button from 'src/components/Button.vue'
import BackButton from 'src/components/BackButton.vue'
import PageHeader from 'src/components/PageHeader.vue'
import Modal from 'src/components/Modal.vue'
import Table from 'src/components/Table.vue'
import ButtonTableOptions from 'src/components/ButtonTableOptions.vue'

// ==================== CONSTANTES ====================
const REGISTRATION_STATUS = { APPROVED: 0, PENDING: 1, REJECTED: 2 }
const REGISTRATION_STATUS_LABELS = {
  [REGISTRATION_STATUS.APPROVED]: 'Aprobado',
  [REGISTRATION_STATUS.PENDING]: 'Pendiente',
  [REGISTRATION_STATUS.REJECTED]: 'Rechazado'
}

const router = useRouter()
const $q = useQuasar()
const notifications = useNotifications()
const requiredRule = (value) => !!value || 'Este campo es requerido'
const authStore = useAuthStore()

// ==================== ENTITY MANAGER - REGISTRATIONS ====================
const {
  loading,
  loadingTable,
  rows: rowsRegistrations,
  showAddDialog,
  showDetailDialog,
  isEditMode,
  selectedEntity: selectedRegistration,
  formData: formDataRegistration,
  filtersData,
  pagination,
  handlePaginationRequest,
  handleSearchChange,
  clearFilters,
  openFormDialog: openFormDialogRegistration,
  closeFormDialog: closeFormDialogRegistration,
  openDetailsDialog: openDetailsDialogRegistration,
  closeDetailsDialog: closeDetailsDialogRegistration,
  populateFormForEdit: populateFormForEditRegistration,
  fetchEntities: fetchRegistrations
} = useEntityManager({
  entityName: 'registro',
  entityNamePlural: 'registros',
  getDefaultFormData: () => ({
    _id: '',
    registration_number: '',
    modality_id: '',
    company_id: '',
    scheduled_start_date: '',
    total_requested_hours: '',
    working_days: '',
    daily_hours: '',
    sena_required_arl: false,
    project_type: 0, // Siempre Individual para este formulario
    companyData: null
  }),
  endpoints: {
    list: 'preRegistrations/listPreRegistrations',
    create: 'preRegistrations/savePreRegistration',
    update: (id) => `preRegistrations/updatePreRegistration/${id}`
  },
  buildFilterParams: (filters, params) => {
    const apprenticeId = authStore.user?._id || authStore.user?.id || authStore.user?.userId
    params.apprentice = apprenticeId

    if (filters.search?.trim()) {
      params.registrationNumber = filters.search.trim()
    }

    return params
  },
  processResponse: (response) => {
    let data = []
    
    // Extraer los datos de la respuesta
    if (response?.msg?.preRegistrations && Array.isArray(response.msg.preRegistrations)) {
      data = response.msg.preRegistrations
    }

    // Mapear los datos para la tabla
    const processed = data.map(item => {
      return {
        _id: item._id,
        registration_number: item.folderIdRegister || 'N/A',
        modality: item.modalityId?.name || 'Sin modalidad',
        modality_id: item.modalityId, // Mantener el objeto completo para el modal
        company: item.companyId?.name || 'Sin empresa', 
        company_id: item.companyId, // Mantener el objeto completo para el modal
        scheduled_start_date: item.startDate,
        total_requested_hours: item.totalRequestedHours || 0,
        project_type: item.projectType !== undefined ? item.projectType : 0,
        registration_status: item.status !== undefined ? item.status : 2,
        working_days: item.workingDays || 0,
        daily_hours: item.dailyHours || 0,
        sena_required_arl: item.senaRequiredArl || false,
        // Campos adicionales para el modal
        apprentice_id: item.apprenticeId?._id || item.apprenticeId,
        validatedById: item.validatedById,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        registration_date: item.createdAt || item.updatedAt, // Fecha de creación del registro
        apprentice_observations: item.observations || [],
        admin_observations: item.adminObservations || ''
      }
    })

    return {
      data: processed,
      total: response?.msg?.totalDocuments || processed.length
    }
  },
  buildPayload: (formData) => {
    const projectType = parseInt(formData.project_type)
    const payload = {
      modalityId: formData.modality_id,
      startDate: formData.scheduled_start_date,
      workingDays: parseInt(formData.working_days) || 5,
      dailyHours: parseInt(formData.daily_hours) || 8,
      senaRequiredArl: formData.sena_required_arl || false,
      projectType: projectType
    }

    // Para registros individuales, siempre enviar totalRequestedHours
    const hours = parseInt(formData.total_requested_hours) || 0
    if (hours > 0) {
      payload.totalRequestedHours = hours
    }

    if (formData.companyData && Object.keys(formData.companyData).length > 0) {
      payload.companyData = formData.companyData
    } else {
      payload.companyId = formData.company_id
    }

    return payload
  },
  messages: {
    createSuccess: 'Registro de EP creado exitosamente. Pendiente de validación administrativa.',
    updateSuccess: 'Registro actualizado exitosamente',
    listError: 'Error al cargar tus registros'
  }
})

// ==================== ESTADOS ADICIONALES ====================
const activeTab = ref('solicitudes')
const formRef = ref(null)
const newCompanyFormRef = ref(null)
const modalityOptions = ref([])
const companyOptionsForForm = ref([])
const allCompanies = ref([])
const showConfirmationDialog = ref(false)
const showCancellationDialog = ref(false)
const selectedFile = ref(null)
const showCompanyDialog = ref(false)
const showGroupDialog = ref(false)
const formDataGroupRegistration = ref({
  projectName: '',
  projectDescription: '',
  projectType: 1,
  modality_id: '',
  company_id: '',
  scheduled_start_date: '',
  total_requested_hours: '',
  total_requested_months: '',
  companyData: null,
  leaderDocument: '',
  groupMembers: []
})
const groupFormRef = ref(null)
const newMemberDocument = ref('')
const currentStep = ref(1)

const projectTypeOptions = [
  { label: 'Proyecto Individual', value: 0 },
  { label: 'Proyecto Grupal', value: 1 }
]

const formDataCompany = ref({
  companyNit: '',
  name: '',
  location: '',
  legalRepresentativePhone: '',
  legalRepresentativeName: '',
  legalRepresentativeEmail: '',
  legalRepresentativePosition: ''
})

const apprenticeName = computed(() => {
  const user = authStore.user
  return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Aprendiz'
})

const columns = [
  { name: 'project_type', label: 'Tipo de Registro', field: 'project_type', sortable: true, align: 'left' },
  { name: 'modality', label: 'Modalidad', field: 'modality', sortable: true, align: 'left' },
  { name: 'company', label: 'Empresa', field: 'company', sortable: true, align: 'left' },
  { name: 'scheduled_start_date', label: 'Fecha Inicio', field: 'scheduled_start_date', sortable: true, align: 'center' },
  { name: 'total_requested_hours', label: 'Horas Totales', field: 'total_requested_hours', sortable: true, align: 'center' },
  { name: 'registration_status', label: 'Estado', field: 'registration_status', sortable: true, align: 'center' },
  { name: 'opciones', label: 'Opciones', align: 'center' }
]

// ==================== COMPUTED PROPERTIES ====================
const isHoursBasedModality = computed(() => {
  if (!formDataRegistration.value.modality_id) return false
  const selectedModality = modalityOptions.value.find(m => m._id === formDataRegistration.value.modality_id)
  if (!selectedModality) return false
  
  return selectedModality.standardHours > 0
})

const isMonthsBasedModality = computed(() => {
  if (!formDataRegistration.value.modality_id) return false
  const selectedModality = modalityOptions.value.find(m => m._id === formDataRegistration.value.modality_id)
  if (!selectedModality) return false
  
  // Por ahora las modalidades del backend solo manejan horas
  // En el futuro se puede agregar campos como 'standardMonths' si es necesario
  const months = selectedModality.standardMonths || 0
    
  return months > 0
})

const isHoursBasedModalityGroup = computed(() => {
  if (!formDataGroupRegistration.value.modality_id) return false
  const selectedModality = modalityOptions.value.find(m => m._id === formDataGroupRegistration.value.modality_id)
  if (!selectedModality) return false
  
  return selectedModality.standardHours > 0
})

const isMonthsBasedModalityGroup = computed(() => {
  if (!formDataGroupRegistration.value.modality_id) return false
  const selectedModality = modalityOptions.value.find(m => m._id === formDataGroupRegistration.value.modality_id)
  if (!selectedModality) return false
  
  const months = selectedModality.standardMonths || 0
  return months > 0
})

// ==================== FUNCIONES PERSONALIZADAS ====================
async function submitFormRegistration() {
  try {
    loading.value = true
    
    // Validar campos requeridos
    if (!formDataRegistration.value.modality_id) {
      notifications.error('Debe seleccionar una modalidad')
      return
    }
    
    if (!formDataRegistration.value.company_id && (!formDataRegistration.value.companyData || Object.keys(formDataRegistration.value.companyData).length === 0)) {
      notifications.error('Debe seleccionar o registrar una empresa')
      return
    }
    
    if (!formDataRegistration.value.scheduled_start_date) {
      notifications.error('Debe seleccionar la fecha de inicio programada')
      return
    }
    
    if (!formDataRegistration.value.working_days || parseInt(formDataRegistration.value.working_days) <= 0) {
      notifications.error('Debe ingresar los días laborales')
      return
    }
    
    if (!formDataRegistration.value.daily_hours || parseInt(formDataRegistration.value.daily_hours) <= 0) {
      notifications.error('Debe ingresar las horas diarias')
      return
    }
    
    // Para registros individuales, project_type siempre es 0
    const projectType = 0
    
    // Construir payload usando la función existente
    const payload = {
      modalityId: formDataRegistration.value.modality_id,
      startDate: formDataRegistration.value.scheduled_start_date,
      workingDays: parseInt(formDataRegistration.value.working_days) || 5,
      dailyHours: parseInt(formDataRegistration.value.daily_hours) || 8,
      senaRequiredArl: formDataRegistration.value.sena_required_arl || false,
      projectType: projectType
    }

    // Solo enviar totalRequestedHours para registros individuales
    const hours = parseInt(formDataRegistration.value.total_requested_hours) || 0
    if (hours > 0) {
      payload.totalRequestedHours = hours
    }

    if (formDataRegistration.value.companyData && Object.keys(formDataRegistration.value.companyData).length > 0) {
      payload.companyData = formDataRegistration.value.companyData
    } else {
      payload.companyId = formDataRegistration.value.company_id
    }

    // Usar postData directamente con savePreRegistration
    const result = await postData('preRegistrations/savePreRegistration', payload)
    
    // Capturar mensaje del backend (viene como msg)
    const successMessage = result?.msg || 'Pre-registro guardado exitosamente'
    notifications.success(successMessage)
    
    // Cerrar modal y refrescar datos
    closeFormDialogRegistration()
    await fetchRegistrations()
    
    return result
    
  } catch (error) {
    // Extraer mensaje específico del backend
    let errorMessage = 'Error al guardar el pre-registro'
    
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      // Si hay un array de errores, mostrar el primer error o concatenar todos
      errorMessage = error.response.data.errors.join('. ')
    } else if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    notifications.error(errorMessage)
    throw error
  } finally {
    loading.value = false
  }
}

// ==================== WATCHERS ====================
watch(() => formDataRegistration.value.modality_id, async (newModalityId) => {
  if (newModalityId) {
    try {
      // Obtener los detalles completos de la modalidad del backend
      // Intentar primero con endpoint específico, si no existe usar el listado
      let modalityDetails
      try {
        modalityDetails = await getData(`modalities/getModality/${newModalityId}`)
      } catch {
        // Si no existe endpoint específico, usar los datos de la lista
        modalityDetails = modalityOptions.value.find(m => m._id === newModalityId)
      }
      
      if (modalityDetails) {
        const hours = modalityDetails.standardHours || modalityDetails.totalRequestedHours || 0
        const months = modalityDetails.standardMonths || modalityDetails.totalRequestedMonths || 0
        const workingDays = modalityDetails.workingDays || modalityDetails.working_days || 5
        const dailyHours = modalityDetails.dailyHours || modalityDetails.daily_hours || 8

        // Los campos working_days y daily_hours se mantienen vacíos para que el aprendiz los digite

        // Resetear ambos campos primero
        formDataRegistration.value.total_requested_hours = ''
        formDataRegistration.value.total_requested_months = ''

        // El tipo de proyecto se mantiene para que el usuario lo seleccione manualmente

        // Asignar el valor correspondiente según la modalidad
        if (hours > 0) {
          formDataRegistration.value.total_requested_hours = hours.toString()
        } else if (months > 0) {
          formDataRegistration.value.total_requested_months = months.toString()
        }
      }
    } catch (error) {
      // Fallback: usar datos básicos de la modalidad en la lista
      const selectedModality = modalityOptions.value.find(m => m._id === newModalityId)
      if (selectedModality) {
        const hours = selectedModality.standardHours || 0
        
        formDataRegistration.value.total_requested_hours = ''
        formDataRegistration.value.total_requested_months = ''
        
        if (hours > 0) {
          formDataRegistration.value.total_requested_hours = hours.toString()
        }
      }
    }
  }
})

// Watcher para el formulario grupal
watch(() => formDataGroupRegistration.value.modality_id, async (newModalityId) => {
  if (newModalityId) {
    try {
      let modalityDetails
      try {
        modalityDetails = await getData(`modalities/getModality/${newModalityId}`)
      } catch {
        modalityDetails = modalityOptions.value.find(m => m._id === newModalityId)
      }
      
      if (modalityDetails) {
        const hours = modalityDetails.standardHours || modalityDetails.totalRequestedHours || 0
        const months = modalityDetails.standardMonths || modalityDetails.totalRequestedMonths || 0
        
        // Limpiar campos
        formDataGroupRegistration.value.total_requested_hours = ''
        formDataGroupRegistration.value.total_requested_months = ''
        
        if (hours > 0) {
          formDataGroupRegistration.value.total_requested_hours = hours.toString()
        } else if (months > 0) {
          formDataGroupRegistration.value.total_requested_months = months.toString()
        } else {
          // Valores por defecto
          formDataGroupRegistration.value.total_requested_months = '6'
        }
      }
    } catch (error) {
      const selectedModality = modalityOptions.value.find(m => m._id === newModalityId)
      if (selectedModality) {
        const hours = selectedModality.standardHours || 0
        
        formDataGroupRegistration.value.total_requested_hours = ''
        formDataGroupRegistration.value.total_requested_months = ''
        
        if (hours > 0) {
          formDataGroupRegistration.value.total_requested_hours = hours.toString()
        } else {
          formDataGroupRegistration.value.total_requested_months = '6'
        }
      }
    }
  }
})

// ==================== FUNCIONES DE UI ====================
function getStatusLabel(status) {
  return REGISTRATION_STATUS_LABELS[status] || 'Desconocido'
}

function getStatusColor(status) {
  const colors = {
    [REGISTRATION_STATUS.APPROVED]: 'positive',   // 0: Verde para aprobado
    [REGISTRATION_STATUS.PENDING]: 'orange',      // 1: Naranja para pendiente  
    [REGISTRATION_STATUS.REJECTED]: 'negative'    // 2: Rojo para rechazado
  }
  return colors[status] || 'grey'
}

function getProjectTypeLabel(projectType) {
  const types = {
    0: 'Individual',
    1: 'Grupal'
  }
  return types[projectType] || 'Desconocido'
}

function getProjectTypeColor(projectType) {
  const colors = {
    0: 'blue',     // Individual - azul
    1: 'purple'    // Grupal - morado
  }
  return colors[projectType] || 'grey'
}

function canEdit(record) {
  return record.registration_status === REGISTRATION_STATUS.PENDING ||
    record.registration_status === REGISTRATION_STATUS.REJECTED
}

function canSend(record) {
  if (!record) return false
  return record.registration_status === REGISTRATION_STATUS.PENDING ||
    record.registration_status === REGISTRATION_STATUS.REJECTED
}

function formatDate(date) {
  if (!date) return 'N/A'
  
  // Si la fecha viene en formato UTC (termina en Z), extraer solo la parte de la fecha
  if (typeof date === 'string' && date.includes('T')) {
    const datePart = date.split('T')[0] // Obtener solo la parte de fecha (YYYY-MM-DD)
    const [year, month, day] = datePart.split('-')
    return `${day}/${month}/${year}`
  }
  
  // Para otros formatos de fecha
  const d = new Date(date)
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// ==================== FUNCIONES DE CARGA ====================
async function loadModalities() {
  try {
    const payload = await getData('modalities/listModalities')
    let data = []

    if (payload?.modalities && Array.isArray(payload.modalities)) {
      data = payload.modalities
    } else if (payload?.msg && Array.isArray(payload.msg)) {
      data = payload.msg
    } else if (payload?.data && Array.isArray(payload.data)) {
      data = payload.data
    } else if (Array.isArray(payload)) {
      data = payload
    }

    modalityOptions.value = data.filter(item => item.status === 0)

    if (modalityOptions.value.length === 0) {
      notifications.warning('No hay modalidades activas disponibles. Contacta al administrador.')
    }
  } catch (error) {
    notifications.error('Error al cargar las modalidades. Por favor, recarga la página.')
  }
}

async function loadCompanies() {
  try {
    const payload = await getData('companies/listCompanies')
    let data = []

    if (payload?.msg?.companies && Array.isArray(payload.msg.companies)) {
      data = payload.msg.companies
    } else if (payload?.companies && Array.isArray(payload.companies)) {
      data = payload.companies
    } else if (payload?.msg && Array.isArray(payload.msg)) {
      data = payload.msg
    } else if (payload?.data && Array.isArray(payload.data)) {
      data = payload.data
    } else if (Array.isArray(payload)) {
      data = payload
    }

    allCompanies.value = data.filter(item => item)
    companyOptionsForForm.value = [...allCompanies.value]
  } catch (error) {
    notifications.error('Error al cargar las empresas: ' + error.message)
  }
}

function filterCompaniesForForm(val, update) {
  update(() => {
    if (!val || val.trim() === '') {
      companyOptionsForForm.value = [...allCompanies.value]
    } else {
      const needle = val.toLowerCase()
      companyOptionsForForm.value = allCompanies.value.filter(company => {
        const companyName = (company.name || '').toLowerCase()
        return companyName.startsWith(needle)
      })
    }
  })
}

// ==================== FUNCIONES DE EMPRESA ====================
function openFormDialogCompany() {
  formDataCompany.value = {
    companyNit: '',
    name: '',
    location: '',
    legalRepresentativePhone: '',
    legalRepresentativeName: '',
    legalRepresentativeEmail: '',
    legalRepresentativePosition: ''
  }
  showCompanyDialog.value = true
}

function closeFormDialogCompany() {
  showCompanyDialog.value = false
  if (newCompanyFormRef.value) {
    newCompanyFormRef.value.resetValidation()
  }
}

async function submitFormCompany() {
  if (!newCompanyFormRef.value) return

  const isValid = await newCompanyFormRef.value.validate()
  if (!isValid) {
    notifications.error('Por favor completa todos los campos')
    return
  }

  try {
    formDataRegistration.value.companyData = { ...formDataCompany.value }
    formDataRegistration.value.company_id = ''

    notifications.success(`Empresa "${formDataCompany.value.name}" registrada temporalmente.`)
    closeFormDialogCompany()
  } catch (error) {
    notifications.error('Error al registrar la empresa')
  }
}

// ==================== FUNCIONES DE PRE-REGISTRO GRUPAL ====================
function openFormDialogGroupRegistration() {
  // Resetear datos del formulario grupal
  formDataGroupRegistration.value = {
    projectName: '',
    projectDescription: '',
    projectType: 1, // Grupal por defecto
    modality_id: '',
    company_id: '',
    scheduled_start_date: '',
    total_requested_hours: '',
    total_requested_months: '',
    companyData: null,
    leaderDocument: '',
    groupMembers: []
  }
  currentStep.value = 1
  showGroupDialog.value = true
}

function closeGroupDialog() {
  showGroupDialog.value = false
  currentStep.value = 1
  if (groupFormRef.value) {
    groupFormRef.value.resetValidation()
  }
}

function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

function addGroupMember() {
  if (!newMemberDocument.value.trim()) return
  
  const document = newMemberDocument.value.trim()
  
  // Validar que no se repita el documento
  if (formDataGroupRegistration.value.groupMembers.includes(document)) {
    notifications.warning('Este documento ya está en el grupo')
    return
  }
  
  // Validar que no sea el documento del líder
  if (document === formDataGroupRegistration.value.leaderDocument) {
    notifications.warning('No puedes agregarte a ti mismo como miembro')
    return
  }
  
  // Validar formato básico del documento (solo números, 8-10 dígitos)
  if (!/^\d{8,10}$/.test(document)) {
    notifications.warning('El documento debe tener entre 8 y 10 dígitos numéricos')
    return
  }
  
  formDataGroupRegistration.value.groupMembers.push(document)
  newMemberDocument.value = ''
  notifications.positive(`Documento ${document} agregado al grupo`)
}

function removeGroupMember(index) {
  formDataGroupRegistration.value.groupMembers.splice(index, 1)
}

async function validateApprenticesStatus() {
  try {
    const allApprentices = [
      formDataGroupRegistration.value.leaderDocument,
      ...formDataGroupRegistration.value.groupMembers
    ]
    
    // Verificar el estado de cada aprendiz (esto sería ideal si hubiera un endpoint)
    console.log('Verificando estado de aprendices:', allApprentices)
    
    // Por ahora solo retornamos true, pero aquí podrías hacer validaciones adicionales
    return true
  } catch (error) {
    console.error('Error validating apprentices:', error)
    return true
  }
}

async function submitGroupRegistration() {
  try {
    loading.value = true
    
    console.log('=== DEBUG REGISTRO GRUPAL ===')
    console.log('Documentos a validar:', [
      formDataGroupRegistration.value.leaderDocument,
      ...formDataGroupRegistration.value.groupMembers
    ])
    console.log('Registros actuales en tabla:', rowsRegistrations.value)
    
    // Validar campos requeridos
    if (!formDataGroupRegistration.value.projectName.trim()) {
      notifications.error('Debe ingresar el nombre del proyecto')
      return
    }
    
    if (!formDataGroupRegistration.value.projectDescription.trim() || formDataGroupRegistration.value.projectDescription.length < 10) {
      notifications.error('La descripción debe tener al menos 10 caracteres')
      return
    }
    
    if (!formDataGroupRegistration.value.modality_id) {
      notifications.error('Debe seleccionar una modalidad')
      return
    }
    
    if (!formDataGroupRegistration.value.company_id && (!formDataGroupRegistration.value.companyData || Object.keys(formDataGroupRegistration.value.companyData).length === 0)) {
      notifications.error('Debe seleccionar o registrar una empresa')
      return
    }
    
    if (!formDataGroupRegistration.value.scheduled_start_date) {
      notifications.error('Debe seleccionar la fecha de inicio programada')
      return
    }
    
    if (!formDataGroupRegistration.value.leaderDocument.trim()) {
      notifications.error('Debe ingresar su número de documento')
      return
    }
    
    if (!formDataGroupRegistration.value.groupMembers || formDataGroupRegistration.value.groupMembers.length === 0) {
      notifications.error('Debe agregar al menos 1 compañero al grupo')
      return
    }
    
    // Construir payload según el formato del backend
    const payload = {
      projectName: formDataGroupRegistration.value.projectName,
      projectType: formDataGroupRegistration.value.projectType,
      projectDescription: formDataGroupRegistration.value.projectDescription,
      modalityId: formDataGroupRegistration.value.modality_id,
      startDate: formDataGroupRegistration.value.scheduled_start_date,
      totalRequestedMonths: parseInt(formDataGroupRegistration.value.total_requested_months) || 0,
      apprentices: [
        formDataGroupRegistration.value.leaderDocument, // Líder primero
        ...formDataGroupRegistration.value.groupMembers // Luego los miembros
      ]
    }
    
    // Agregar horas o meses según la modalidad
    const hours = parseInt(formDataGroupRegistration.value.total_requested_hours) || 0
    const months = parseInt(formDataGroupRegistration.value.total_requested_months) || 0
    
    if (isHoursBasedModalityGroup.value && hours > 0) {
      payload.totalRequestedHours = hours
    } else if (isMonthsBasedModalityGroup.value && months > 0) {
      payload.totalRequestedMonths = months
    } else if (isHoursBasedModalityGroup.value) {
      // Si es modalidad basada en horas pero no se especificó, usar un valor por defecto
      payload.totalRequestedHours = 880 // Valor típico para EP
    } else {
      // Si es modalidad basada en meses pero no se especificó, usar un valor por defecto
      payload.totalRequestedMonths = 6 // Valor típico para EP
    }
    
    // Agregar empresa
    if (formDataGroupRegistration.value.companyData && Object.keys(formDataGroupRegistration.value.companyData).length > 0) {
      payload.companyData = formDataGroupRegistration.value.companyData
    } else {
      payload.companyId = formDataGroupRegistration.value.company_id
    }
    
    // Enviar al backend
    console.log('Payload a enviar:', payload)
    
    const result = await postData('projectPreRegistrations/saveProjectPreRegistration', payload)
    
    // Capturar mensaje del backend (viene como msg)
    const successMessage = result?.msg || 'Pre-registro de proyecto creado exitosamente'
    notifications.success(successMessage)
    
    // Cerrar modal y refrescar datos
    closeGroupDialog()
    await fetchRegistrations()
    
    return result
    
  } catch (error) {
    console.error('=== ERROR EN PRE-REGISTRO GRUPAL ===')
    console.error('Error object:', error)
    console.error('Response data:', error.response?.data)
    console.error('Response status:', error.response?.status)
    
    // Extraer mensaje específico del backend
    let errorMessage = 'Error al guardar el pre-registro grupal'
    
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      errorMessage = error.response.data.errors.join('. ')
    } else if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    notifications.error(`Error: ${errorMessage}`)
    
  } finally {
    loading.value = false
  }
}

// ==================== FUNCIONES ESPECIALES DE REGISTRO ====================
async function handleSubmitAndSend() {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    notifications.error('Por favor complete todos los campos correctamente')
    return
  }

  try {
    await submitFormRegistration()
    notifications.info('El registro fue creado y enviado para validación administrativa')
  } catch (error) {
    // El error ya se maneja en submitFormRegistration
  }
}

function handleSendFromModal() {
  $q.dialog({
    title: '¿Enviar registro a validación?',
    message: '¿Estás seguro de enviar este registro al administrador para su validación?',
    cancel: { label: 'Cancelar', color: 'negative', flat: true },
    ok: { label: 'Enviar', color: 'primary' },
    persistent: true
  }).onOk(async () => {
    try {
      loading.value = true
      const validationData = {
        registration_status: REGISTRATION_STATUS.PENDING,
        admin_observations: 'Registro enviado para validación'
      }

      await putData(`registrations/validateRegistration?apprentice=${formDataRegistration.value._id}`, validationData)
      notifications.success('Registro enviado exitosamente para validación')
      closeFormDialogRegistration()
      await fetchRegistrations()
    } catch (error) {
      const errorMessage = error.response?.data?.message
        || error.response?.data?.msg
        || error?.message
        || 'Error al enviar el registro'
      notifications.error(errorMessage)
    } finally {
      loading.value = false
    }
  })
}

// ==================== FUNCIONES DE VALIDACIÓN DE DOCUMENTOS ====================
async function submitDocuments() {
  if (!selectedFile.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor selecciona un archivo',
      position: 'top'
    })
    return
  }

  try {
    loading.value = true

    const formData = new FormData()
    formData.append('documento', selectedFile.value)

    await new Promise(resolve => setTimeout(resolve, 2000))

    $q.notify({
      type: 'positive',
      message: 'Documento enviado exitosamente',
      position: 'top'
    })

    closeConfirmationDialog()
    resetDocumentForm()

  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Error al enviar el documento',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

function handleFileChange(file) {
  if (file) {
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      $q.notify({
        type: 'warning',
        message: 'El archivo excede el tamaño máximo permitido (10MB)',
        position: 'top'
      })
      selectedFile.value = null
      return
    }

    const allowedTypes = ['application/pdf']

    if (!allowedTypes.includes(file.type)) {
      $q.notify({
        type: 'warning',
        message: 'Tipo de archivo no permitido. Solo se aceptan PDF',
        position: 'top'
      })
      selectedFile.value = null
    }
  }
}

function openConfirmationDialog() {
  if (!selectedFile.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor selecciona un archivo antes de continuar',
      position: 'top'
    })
    return
  }
  showConfirmationDialog.value = true
}

function closeConfirmationDialog() {
  showConfirmationDialog.value = false
}

function closeCancellationDialog() {
  showCancellationDialog.value = false
}

function confirmCancel() {
  resetDocumentForm()
  closeCancellationDialog()
}

function handleCancel() {
  if (selectedFile.value) {
    showCancellationDialog.value = true
  }
}

function resetDocumentForm() {
  selectedFile.value = null
}

// ==================== LIFECYCLE ====================
onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.token) {
    notifications.error('No estás autenticado. Por favor inicia sesión nuevamente.')
    router.push('/').catch(() => { })
    return
  }

  await Promise.all([
    fetchRegistrations(),
    loadModalities(),
    loadCompanies()
  ])
})
</script>

<style scoped>
.pre-registration-page {
  background: #f5f7fb;
  min-height: 100vh;
}

.hero-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%);
}

/* Responsividad para PageHeader */
:deep(.hero-card .q-card-section) {
  padding: 20px;
}

@media (max-width: 480px) {
  :deep(.hero-card .q-card-section) {
    padding: 15px;
  }
}

@media (max-width: 320px) {
  :deep(.hero-card .q-card-section) {
    padding: 12px;
  }
}

.tabs-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.tab-btn {
  min-width: 200px;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 500;
  background: #d9d9d9;
  color: #000;
  transition: 0.3s;
}

.tab-btn:hover {
  background: #c0c0c0;
}

.tab-btn.active {
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-content {
  padding: 25px 20px;
}

.message-section {
  text-align: center;
}

.message-text {
  font-size: 15px;
  color: #5f6368;
  line-height: 1.6;
}

.recommendation-box {
  background: #fff3cd;
  border-left: 6px solid #ffc107;
  border-radius: 8px;
  padding: 15px;
}

.recommendation-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.recommendation-text {
  font-size: 14px;
  color: #856404;
  line-height: 1.6;
  flex: 1;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-label-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.upload-label {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  line-height: 1.2;
}

.upload-sublabel {
  font-size: 12px;
  color: #666;
  line-height: 1.2;
}

.upload-input-group {
  width: 280px;
}

.custom-file-input {
  width: 100%;
}

.file-info-box {
  background: #e8f5e9;
  border-left: 4px solid #44b900;
  padding: 12px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-size: 13px;
  font-weight: 600;
  color: #1b5e20;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.confirmation-text {
  color: #5f6368;
  line-height: 1.6;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividad para tablets */
@media (max-width: 768px) {
  .pre-registration-page {
    padding: 0.5rem;
  }

  .hero-card {
    border-radius: 15px;
    margin-bottom: 1.5rem;
  }

  .tabs-container {
    gap: 15px;
    margin-bottom: 20px;
  }

  .tab-btn {
    min-width: 180px;
    padding: 10px 25px;
    font-size: 14px;
  }

  .container {
    padding: 0 10px;
  }

  /* Responsividad para barra de búsqueda en tablet */
  .row.items-center.q-mb-md.q-gutter-sm {
    gap: 12px;
  }

  .upload-input-group {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .form-actions button {
    width: 100%;
  }

  .recommendation-box {
    padding: 12px;
  }

  .section-content {
    padding: 20px 15px;
  }
}

/* Responsividad para móviles */
@media (max-width: 480px) {
  .pre-registration-page {
    padding: 0.25rem;
  }

  .hero-card {
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  .tabs-container {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding: 0 10px;
  }

  .tab-btn {
    min-width: 100%;
    max-width: 280px;
    padding: 12px 20px;
    font-size: 13px;
  }

  .container {
    padding: 0 5px;
  }

  /* Responsividad para barra de búsqueda */
  .row.items-center.q-mb-md.q-gutter-sm {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .row.items-center.q-mb-md.q-gutter-sm > div {
    width: 100%;
    margin: 0;
  }

  .col-12.col-md-3,
  .col-auto {
    flex: none;
    width: 100%;
    max-width: 100%;
  }

  .section-content {
    padding: 15px 10px;
  }

  .message-text {
    font-size: 14px;
  }

  .upload-label {
    font-size: 13px;
  }

  .recommendation-text {
    font-size: 13px;
  }

  .recommendation-box {
    padding: 10px;
  }

  .form-actions {
    margin-top: 20px;
  }

  .upload-section {
    gap: 12px;
  }

  .upload-label-group {
    text-align: center;
  }
}

/* Responsividad para dispositivos muy pequeños (300px - 400px) */
@media (max-width: 400px) {
  .pre-registration-page {
    padding: 0.125rem;
  }

  .hero-card {
    border-radius: 10px;
    margin-bottom: 0.75rem;
  }

  .tabs-container {
    padding: 0 5px;
    margin-bottom: 10px;
  }

  .tab-btn {
    padding: 10px 15px;
    font-size: 12px;
    border-radius: 25px;
  }

  .container {
    padding: 0;
  }

  /* Barra de búsqueda en pantallas muy pequeñas */
  .q-pa-md {
    padding: 8px !important;
  }

  .row.items-center.q-mb-md.q-gutter-sm {
    margin-bottom: 12px;
    gap: 8px;
  }

  .section-content {
    padding: 12px 8px;
  }

  .message-text {
    font-size: 13px;
  }

  .recommendation-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  .recommendation-text {
    font-size: 12px;
  }

  .recommendation-box {
    padding: 8px;
  }

  .upload-label {
    font-size: 12px;
  }

  .upload-sublabel {
    font-size: 11px;
  }

  .file-name {
    font-size: 12px;
  }

  .file-size {
    font-size: 11px;
  }

  .file-info-box {
    padding: 10px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  /* Ajustes específicos para la tabla en móviles muy pequeños */
  :deep(.q-table) {
    font-size: 12px;
  }

  :deep(.q-table th) {
    padding: 8px 4px;
    font-size: 11px;
  }

  :deep(.q-table td) {
    padding: 8px 4px;
    font-size: 12px;
  }

  :deep(.q-btn) {
    min-height: 32px;
  }

  :deep(.q-input) {
    font-size: 14px;
  }
}

/* Responsividad extrema para 300px */
@media (max-width: 320px) {
  .pre-registration-page {
    padding: 0;
  }

  .hero-card {
    margin-bottom: 0.5rem;
    border-radius: 8px;
  }

  .tabs-container {
    margin-bottom: 8px;
    padding: 0 2px;
  }

  .tab-btn {
    padding: 8px 12px;
    font-size: 11px;
    min-width: 100%;
  }

  .section-content {
    padding: 10px 6px;
  }

  /* Barra de búsqueda responsive extrema */
  .q-pa-md {
    padding: 6px !important;
  }

  .row.items-center.q-mb-md.q-gutter-sm {
    margin-bottom: 8px;
    gap: 6px;
  }

  /* Inputs y botones más pequeños */
  :deep(.q-input) {
    font-size: 12px;
  }

  :deep(.q-input .q-field__label) {
    font-size: 11px;
  }

  :deep(.q-input .q-field__control) {
    min-height: 36px;
  }

  .message-text {
    font-size: 12px;
    line-height: 1.4;
  }

  .recommendation-text {
    font-size: 11px;
    line-height: 1.4;
  }

  .upload-label {
    font-size: 11px;
  }

  .upload-sublabel {
    font-size: 10px;
  }

  .form-actions {
    gap: 8px;
    margin-top: 15px;
  }

  /* Ajustes para inputs en pantallas muy pequeñas */
  :deep(.q-input .q-field__control) {
    min-height: 40px;
  }

  :deep(.q-btn) {
    min-height: 36px;
    font-size: 12px;
    padding: 8px 16px;
  }

  /* Tabla responsiva extrema */
  :deep(.q-table) {
    font-size: 11px;
  }

  :deep(.q-table th),
  :deep(.q-table td) {
    padding: 6px 2px;
    font-size: 10px;
  }

  :deep(.q-table .q-btn) {
    min-width: 30px;
    min-height: 30px;
    padding: 4px;
  }

  /* Ocultar columnas menos importantes en pantallas muy pequeñas */
  :deep(.q-table th:nth-child(3)),
  :deep(.q-table td:nth-child(3)),
  :deep(.q-table th:nth-child(4)),
  :deep(.q-table td:nth-child(4)) {
    display: none;
  }
}
</style>