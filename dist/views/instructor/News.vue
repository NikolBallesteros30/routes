NOVEDADES INSTRUCTOR 
<template>
  <div class="novedades-page">
    
    <div v-if="!mostrarVistaHistorial">
      <BackButton class="q-mb-lg"/>
      <div class="content">
  <PageHeader title="Novedades y Reportes de Seguimiento" description="Consulta anuncios y reportes de seguimiento de aprendices." />

       <div class="filters-section">
          <div class="filters-row">
            <div class="filter-item">
              <q-input
                v-model="filtroAprendiz"
                dense
                outlined
                placeholder="Buscar Aprendiz"
                clearable
                @keyup.enter="aplicarFiltros"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="filter-item">
              <q-input
                v-model="filtroFicha"
                dense
                outlined
                placeholder="Buscar Ficha"
                clearable
                @keyup.enter="aplicarFiltros"
              />
            </div>

            <div class="filter-item">
              <q-input
                v-model="filtroPrograma"
                dense
                outlined
                placeholder="Buscar Programa"
                clearable
                @keyup.enter="aplicarFiltros"
              />
            </div>

            <div class="filter-buttons">
              <Button
                label="Filtrar"
                icon="filter_list"
                custom-class="gradient-btn"
                @click="aplicarFiltros"
              />
              <Button
                label="Limpiar"
                icon="clear"
                custom-class="boton-cerrar"
                @click="limpiarFiltros"
              />
            </div>
          </div>

          <div class="action-buttons-row">
            <Button
              label="Registrar novedad"
              icon="add"
              custom-class="gradient-btn btn-registrar-custom"
              @click="abrirModalRegistro"
            />
            <Button
              label="Plantillas"
              icon="description"
              custom-class="gradient-btn"
              @click="verPlantillas"
            />
          </div>
        </div>

        <!-- Table -->
        <Table
          :rows="novedadesFiltradas"
          :columns="columnas"
          row-key="documento"
          :rows-per-page-options="[5, 10, 15, 20]"
        >
          <template #body-cell-aprendiz="props">
            <q-td :props="props" class="text-left">
              <div class="aprendiz-cell">
                <div class="aprendiz-nombre">{{ props.row.aprendiz }}</div>
                <div class="aprendiz-documento">{{ props.row.documento }}</div>
              </div>
            </q-td>
          </template>

          <template #body-cell-ficha="props">
            <q-td :props="props" class="text-left">
              <div class="ficha-cell">
                <div class="ficha-numero">{{ props.row.ficha }}</div>
                <div class="ficha-programa">{{ props.row.programa }}</div>
              </div>
            </q-td>
          </template>

          <!-- Custom column for Estado with checkmark and X -->
          <template #body-cell-estado="props">
            <q-td :props="props" class="text-center">
              <div v-if="props.row.estado === 'Validado'" class="estado-badge estado-validado">
                <q-icon name="check" size="18px" />
                <span>{{ props.row.estado }}</span>
              </div>
              <div v-else-if="props.row.estado === 'Rechazado'" class="estado-badge estado-rechazado">
                <q-icon name="close" size="18px" />
                <span>{{ props.row.estado }}</span>
              </div>
              <div v-else class="estado-badge estado-pendiente">
                <span>{{ props.row.estado }}</span>
              </div>
            </q-td>
          </template>

          <!-- Custom column for Acciones - historial -->
          <template #body-cell-acciones="props">
            <q-td :props="props" class="text-center actions-column">
              <ButtonTableOptions
                icon="history"
                color="grey-7"
                tooltip="Ver historial"
                @click="verHistorial(props.row)"
              />
            </q-td>
          </template>
        </Table>
      </div>
    </div>

    <div v-else class="historial-page">
      <div class="historial-header">
        <Button
          icon="arrow_back"
          flat
          round
          dense
          custom-class="icon-button"
          class="back-button-historial"
          :aria-label="'Volver a novedades'"
          @click="cerrarHistorial"
        />
        <div class="historial-title-section">
          <h1 class="historial-main-title">Historial de Novedades</h1>
          <h2 class="historial-subtitle">{{ aprendizSeleccionado?.aprendiz }}</h2>
          <div class="historial-info">
            <span class="info-item">
              <strong>Ficha:</strong> {{ aprendizSeleccionado?.ficha || '2924076' }}
            </span>
            <span class="info-item">
              <strong>Programa:</strong> {{ aprendizSeleccionado?.programa || 'Análisis y desarrollo de software' }}
            </span>
          </div>
        </div>
      </div>

      <div class="historial-content">
        <div class="historial-table-container">
          <Table
            :rows="historialNovedades"
            :columns="columnasHistorial"
            row-key="id"
            :rows-per-page-options="[5, 10, 15, 20]"
          >
            <!-- Columna Fecha -->
            <template #body-cell-fecha="props">
              <q-td :props="props" class="text-center">
                <div class="fecha-cell">{{ props.row.fecha }}</div>
              </q-td>
            </template>

            <!-- Columna Tipo de Novedad -->
            <template #body-cell-tipoNovedad="props">
              <q-td :props="props" class="text-center">
                <div class="tipo-novedad-cell">{{ props.row.tipoNovedad }}</div>
              </q-td>
            </template>

            <!-- Columna Estado -->
            <template #body-cell-estado="props">
              <q-td :props="props" class="text-center">
                <div v-if="props.row.estado === 'Permanente'" class="estado-badge estado-validado">
                  <q-icon name="check" size="16px" />
                  <span>{{ props.row.estado }}</span>
                </div>
                <div v-else-if="props.row.estado === 'Validado'" class="estado-badge estado-validado">
                  <q-icon name="check" size="16px" />
                  <span>{{ props.row.estado }}</span>
                </div>
                <div v-else-if="props.row.estado === 'En proceso'" class="estado-badge estado-pendiente">
                  <span>{{ props.row.estado }}</span>
                </div>
                <div v-else class="estado-badge estado-pendiente">
                  <span>{{ props.row.estado }}</span>
                </div>
              </q-td>
            </template>

            <!-- Columna Observación -->
            <template #body-cell-observacion="props">
              <q-td :props="props" class="text-left">
                <div class="observacion-cell">{{ props.row.observacion }}</div>
              </q-td>
            </template>

            <!-- Columna Documento -->
            <template #body-cell-documento="props">
              <q-td :props="props" class="text-center">
                <div class="documento-cell">
                  <Button
                    label="Ver PDF"
                    flat
                    :noCaps="true"
                    custom-class="link-button"
                    @click="verDocumento(props.row.documento)"
                  />
                </div>
              </q-td>
            </template>

            <!-- Columna Acciones -->
            <template #body-cell-acciones="props">
              <q-td :props="props" class="text-center">
                <div class="acciones-cell">
                  <ButtonTableOptions
                    icon="visibility"
                    color="grey-7"
                    tooltip="Ver detalle"
                    @click="abrirModalDetalle(props.row)"
                  />
                </div>
              </q-td>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <!-- Modal para registrar novedad -->
    <Modal
      v-model="showRegisterDialog"
      width="650px"
      max-width="95vw"
      @update:model-value="handleRegisterDialogVisibility"
    >
      <template #header>
        <div class="modal-header-custom">
          <q-icon name="upload" size="24px" class="q-mr-sm" />
          <span class="text-h6">Registrar nueva novedad</span>
        </div>
      </template>
      
      <template #body>
        <div class="modal-form">
          <!-- Aprendiz con búsqueda -->
          <div class="q-mb-md">
            <label class="form-label">Aprendiz</label>
            <q-input
              v-model="nuevaNovedad.aprendizBusqueda"
              placeholder="Buscar Aprendiz"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- Tipo de novedad -->
          <div class="q-mb-md">
            <label class="form-label">Tipo de novedad</label>
            <q-select
              v-model="nuevaNovedad.tipo"
              :options="tiposNovedadModal"
              placeholder="Seleccionar tipo"
              outlined
              dense
            />
          </div>

          <!-- Descripción detallada -->
          <div class="q-mb-md">
            <label class="form-label">Descripción detallada</label>
            <q-input
              v-model="nuevaNovedad.descripcion"
              placeholder="Describe la novedad a detalle"
              outlined
              type="textarea"
              rows="4"
            />
          </div>

          <!-- Fecha del evento -->
          <div class="q-mb-md">
            <label class="form-label">Fecha del evento</label>
            <q-input
              v-model="nuevaNovedad.fechaEvento"
              placeholder="dd/mm/aaaa"
              outlined
              dense
              mask="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="nuevaNovedad.fechaEvento" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <Button label="Cerrar" flat :noCaps="true" custom-class="boton-cerrar" v-close-popup />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Evidencia -->
          <div class="q-mb-md">
            <label class="form-label">Evidencia</label>
            <Button
              icon="upload"
              label="Cargar Archivo PDF"
              custom-class="gradient-btn full-width"
              @click="cargarArchivo"
            />
            <div v-if="nuevaNovedad.archivoNombre" class="archivo-cargado q-mt-sm">
              <q-icon name="picture_as_pdf" color="red" size="20px" />
              <span class="q-ml-sm">{{ nuevaNovedad.archivoNombre }}</span>
              <Button
                icon="close"
                flat
                round
                dense
                :noCaps="true"
                custom-class="icon-button"
                class="q-ml-auto"
                @click="eliminarArchivo"
              />
            </div>
          </div>

          <!-- Checkbox confirmación -->
          <div class="q-mb-md">
            <q-checkbox
              v-model="nuevaNovedad.requiereRevision"
              label="Confirmo que esta novedad requiere revisión administrativa."
              dense
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <Button
            label="Cancelar"
            custom-class="boton-cerrar"
            :noCaps="true"
            flat
            @click="cerrarModalRegistro"
          />
          <Button
            label="Registrar"
            custom-class="gradient-btn"
            :noCaps="true"
            :disable="!nuevaNovedad.requiereRevision"
            @click="mostrarConfirmacion"
          />
        </div>
      </template>
    </Modal>

    <!-- Modal de confirmación -->
    <Modal
      v-model="showConfirmationDialog"
      width="450px"
      max-width="90vw"
    >
      <template #header>
        <div class="confirmacion-header">
          <q-icon name="help_outline" size="24px" color="grey-7" class="q-mr-sm" />
          <span class="text-h6">Confirmar registro</span>
        </div>
      </template>
      
      <template #body>
        <div class="confirmacion-body">
          <p class="confirmacion-texto">
            ¿Está seguro que desea registrar esta novedad?
          </p>
          <p class="confirmacion-subtexto">
            Esta acción enviará la novedad para revisión administrativa.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <Button
            label="Cancelar"
            flat
            :noCaps="true"
            custom-class="boton-cerrar"
            @click="cerrarConfirmacion"
          />
          <Button
            label="Confirmar"
            custom-class="gradient-btn"
            :noCaps="true"
            @click="confirmarGuardado"
          />
        </div>
      </template>
    </Modal>

    <!-- Modal de detalle de novedad - MÁS PEQUEÑO -->
    <Modal
      v-model="showDetailDialog"
      width="500px"
      max-width="95vw"
      @update:model-value="handleDetailDialogVisibility"
    >
      <template #header>
        <div class="modal-header-custom">
          <q-icon name="description" size="20px" class="q-mr-sm" />
          <span class="text-h6">Detalle de Novedad</span>
        </div>
      </template>
      
      <template #body>
        <div class="detalle-novedad" v-if="novedadSeleccionada">
          <!-- Información del aprendiz -->
          <div class="detalle-section">
            <h3 class="detalle-section-title">Información del Aprendiz</h3>
            <div class="detalle-grid">
              <div class="detalle-item">
                <label class="detalle-label">Aprendiz:</label>
                <span class="detalle-value">{{ novedadSeleccionada.aprendiz || aprendizSeleccionado?.aprendiz }}</span>
              </div>
              <div class="detalle-item">
                <label class="detalle-label">Ficha:</label>
                <span class="detalle-value">{{ novedadSeleccionada.ficha || aprendizSeleccionado?.ficha }}</span>
              </div>
              <div class="detalle-item">
                <label class="detalle-label">Programa:</label>
                <span class="detalle-value">{{ novedadSeleccionada.programa || aprendizSeleccionado?.programa }}</span>
              </div>
            </div>
          </div>

          <!-- Detalles de la novedad -->
          <div class="detalle-section">
            <h3 class="detalle-section-title">Detalles de la Novedad</h3>
            <div class="detalle-grid">
              <div class="detalle-item">
                <label class="detalle-label">Fecha:</label>
                <span class="detalle-value">{{ novedadSeleccionada.fechaRegistro || novedadSeleccionada.fecha }}</span>
              </div>
              <div class="detalle-item">
                <label class="detalle-label">Tipo:</label>
                <span class="detalle-value">{{ novedadSeleccionada.tipoNovedad }}</span>
              </div>
              <div class="detalle-item">
                <label class="detalle-label">Estado:</label>
                <span class="detalle-value">
                  <span :class="`estado-badge estado-${novedadSeleccionada.estado?.toLowerCase()?.replace(' ', '-')}`">
                    {{ novedadSeleccionada.estado }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- Descripción completa -->
          <div class="detalle-section">
            <h3 class="detalle-section-title">Descripción</h3>
            <div class="descripcion-completa">
              {{ novedadSeleccionada.descripcionCompleta || novedadSeleccionada.observacion }}
            </div>
          </div>

          <!-- Acciones realizadas -->
          <div class="detalle-section">
            <h3 class="detalle-section-title">Acciones</h3>
            <div class="acciones-realizadas">
              {{ novedadSeleccionada.accionesRealizadas || 'Pendiente por revisión administrativa.' }}
            </div>
          </div>

          <!-- Documentos adjuntos -->
          <div class="detalle-section">
            <h3 class="detalle-section-title">Documentos</h3>
            <div class="documentos-adjuntos">
              <div class="documento-item" v-if="novedadSeleccionada.documento">
                <q-icon name="picture_as_pdf" color="red" size="20px" />
                <span class="documento-nombre">{{ novedadSeleccionada.documento }}</span>
                <Button
                  label="Ver"
                  flat
                  :noCaps="true"
                  custom-class="link-button"
                  @click="verDocumento(novedadSeleccionada.documento)"
                />
              </div>
              <div v-else class="sin-documentos">
                No hay documentos adjuntos
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <Button
            label="Cerrar"
            custom-class="boton-cerrar"
            :noCaps="true"
            flat
            @click="cerrarModalDetalle"
          />
        </div>
      </template>
    </Modal>

    <!-- Modal Plantillas Seguimientos -->
    <Modal
      v-model="showTemplatesDialog"
      width="500px"
      max-width="95vw"
    >
      <template #header>
        <div class="modal-header-custom">
          <span>Plantillas<br/>Seguimientos</span>
        </div>
      </template>

      <template #body>
        <div class="plantillas-list">
          <q-list>
            <q-item 
              v-for="plantilla in plantillas" 
              :key="plantilla.id"
              class="plantilla-item"
            >
              <q-item-section avatar>
                <q-icon :name="plantilla.icon" color="grey-7" size="md" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="plantilla-nombre">{{ plantilla.nombre }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="plantilla-actions">
                  <ButtonTableOptions
                    icon="visibility"
                    color="grey-7"
                    tooltip="Visualizar"
                    @click="visualizarPlantilla(plantilla)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <Button
            label="Cerrar"
            custom-class="boton-cerrar"
            :noCaps="true"
            flat
            @click="cerrarPlantillas"
          />
        </div>
      </template>
    </Modal>

    <!-- Modal Visualizar Plantilla -->
    <Modal
      v-model="showPreviewDialog"
      width="900px"
      max-width="95vw"
    >
      <template #header>
        <div class="modal-header-custom">
          <q-icon name="visibility" size="sm" class="q-mr-sm" />
          <span>Visualizar Plantilla</span>
        </div>
      </template>

      <template #body>
        <div class="plantilla-viewer">
          <!-- Simulación del PDF con imagen -->
          <div class="pdf-container">
            <div class="pdf-toolbar">
              <ButtonTableOptions
                icon="download"
                color="grey-8"
                tooltip="Descargar"
                @click="descargarPlantillaVisualizada"
              />
            </div>
            <div class="pdf-preview">
              <!-- Aquí se cargaría el PDF real -->
              <div class="pdf-placeholder">
                <q-icon name="description" size="64px" color="grey-5" />
                <p class="text-grey-6">Vista previa de la plantilla</p>
                <small class="text-grey-5">Formato de seguimiento de etapa productiva</small>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <Button
            label="Cerrar"
            custom-class="boton-cerrar"
            :noCaps="true"
            flat
            @click="cerrarVisualizarPlantilla"
          />
        </div>
      </template>
    </Modal>

    <!-- Input file oculto -->
    <input 
      ref="fileInput" 
      type="file" 
      accept="application/pdf" 
      style="display: none;" 
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import Table from 'src/components/Table.vue'
import Modal from 'src/components/Modal.vue'
import Button from 'src/components/Button.vue'
import ButtonTableOptions from 'src/components/ButtonTableOptions.vue'
import BackButton from 'src/components/BackButton.vue'
import PageHeader from 'src/components/PageHeader.vue'

const router = useRouter()
const $q = useQuasar()

const fileInput = ref(null)
const mostrarVistaHistorial = ref(false)
const showRegisterDialog = ref(false)
const showConfirmationDialog = ref(false)
const showDetailDialog = ref(false)
const showTemplatesDialog = ref(false)
const showPreviewDialog = ref(false)
const novedadSeleccionada = ref(null)
const aprendizSeleccionado = ref(null)
const plantillaSeleccionada = ref(null)

// Filtros
const filtroAprendiz = ref('')
const filtroFicha = ref('')
const filtroPrograma = ref('')

// Datos para el historial
const historialNovedades = ref([
  {
    id: 1,
    fecha: '05/10/2025',
    tipoNovedad: 'Deserción',
    estado: 'Pendiente',
    observacion: 'Ausencia continua de 18 días consecutivos',
    documento: 'documento_desercion.pdf',
    fechaRegistro: '05/10/2025',
    descripcionCompleta: 'El aprendiz ha estado ausente de manera continua durante un período de 18 días consecutivos, sin presentar hasta la fecha ninguna justificación formal que respalde su inasistencia. Se han realizado diversos intentos de contacto por los medios registrados, incluyendo llamadas telefónicas y mensajes, sin obtener respuesta ni comunicación alguna por parte del aprendiz.',
    accionesRealizadas: 'Pendiente por revisión administrativa.'
  },
  {
    id: 2,
    fecha: '02/10/2025',
    tipoNovedad: 'Desempeño',
    estado: 'En proceso',
    observacion: 'Deficiencia técnica identificada',
    documento: 'evaluacion_desempeno.pdf',
    fechaRegistro: '02/10/2025',
    descripcionCompleta: 'El aprendiz presenta dificultades significativas en el desarrollo de competencias técnicas requeridas para el programa. Se han identificado deficiencias en la resolución de problemas prácticos y en la aplicación de conocimientos teóricos.',
    accionesRealizadas: 'Plan de mejora implementado. Seguimiento en curso.'
  },
  {
    id: 3,
    fecha: '28/09/2025',
    tipoNovedad: 'Cambio Horario',
    estado: 'Validado',
    observacion: 'Ajuste de horario aprobado',
    documento: 'solicitud_horario.pdf',
    fechaRegistro: '28/09/2025',
    descripcionCompleta: 'Solicitud de cambio de horario por motivos laborales. El aprendiz presentó documentación que respalda su nueva situación laboral y la necesidad de ajustar su horario de formación.',
    accionesRealizadas: 'Solicitud aprobada por coordinación académica. Horario ajustado satisfactoriamente.'
  }
])

const columnasHistorial = [
  {
    name: 'fecha',
    label: 'Fecha',
    align: 'center',
    field: 'fecha',
    sortable: true,
    width: '120px'
  },
  {
    name: 'tipoNovedad',
    label: 'Tipo de Novedad',
    align: 'center',
    field: 'tipoNovedad',
    sortable: true,
    width: '150px'
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true,
    width: '130px'
  },
  {
    name: 'observacion',
    label: 'Observación',
    align: 'left',
    field: 'observacion',
    sortable: true
  },
  {
    name: 'documento',
    label: 'Documento',
    align: 'center',
    field: 'documento',
    sortable: true,
    width: '120px'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
    field: 'acciones',
    width: '100px'
  }
]

const tiposNovedadModal = ['Seleccionar tipo', 'Deserción', 'Problemas de desempeño', 'Cambio de condiciones', 'Otra']

const novedades = ref([
  {
    aprendiz: 'Luis Fernando Torres',
    documento: '11123638',
    ficha: '2924076',
    programa: 'Análisis y desarrollo de software',
    tipo: 'Deserción',
    fechaProgramada: '05/10/2025',
    fechaRealizada: '05/10/2025',
    estado: 'Validado',
    descripcion: 'El aprendiz decidió retirarse del programa por motivos personales y laborales.',
    evidencia: 'carta_retiro_luis_torres.pdf'
  },
  {
    aprendiz: 'María Amanda Ortiz',
    documento: '11684758',
    ficha: '3698456',
    programa: 'Hotelería y turismo',
    tipo: 'Desempeño',
    fechaProgramada: '06/10/2025',
    fechaRealizada: '08/10/2025',
    estado: 'Pendiente',
    descripcion: 'La aprendiz presenta bajo rendimiento académico en las últimas evaluaciones.',
    evidencia: null
  },
  {
    aprendiz: 'Gabriela Alejandra Ballesteros',
    documento: '1034968784',
    ficha: '2926076',
    programa: 'Análisis y desarrollo de software',
    tipo: 'Cambio de Condiciones',
    fechaProgramada: '10/10/2025',
    fechaRealizada: '05/10/2025',
    estado: 'Rechazado',
    descripcion: 'Solicitud de aplazamiento del programa por motivos de salud.',
    evidencia: 'certificado_medico.pdf'
  }
])

const columnas = [
  {
    name: 'aprendiz',
    label: 'Aprendiz/Documento',
    align: 'left',
    field: 'aprendiz',
    sortable: true
  },
  {
    name: 'ficha',
    label: 'Ficha/Programa',
    align: 'left',
    field: 'ficha',
    sortable: true
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'center',
    field: 'tipo',
    sortable: true
  },
  {
    name: 'fechaProgramada',
    label: 'Fecha Programada',
    align: 'center',
    field: 'fechaProgramada',
    sortable: true
  },
  {
    name: 'fechaRealizada',
    label: 'Fecha Realizada',
    align: 'center',
    field: 'fechaRealizada',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
    field: 'acciones'
  }
]

const novedadesFiltradas = computed(() => {
  let resultado = [...novedades.value]
  
  if (filtroAprendiz.value && filtroAprendiz.value.trim()) {
    const needle = filtroAprendiz.value.toLowerCase().trim()
    resultado = resultado.filter(item => 
      item && item.aprendiz && item.aprendiz.toLowerCase().includes(needle)
    )
  }
  
  if (filtroFicha.value && filtroFicha.value.trim()) {
    const needle = filtroFicha.value.toLowerCase().trim()
    resultado = resultado.filter(item => 
      item && item.ficha && item.ficha.toLowerCase().includes(needle)
    )
  }
  
  if (filtroPrograma.value && filtroPrograma.value.trim()) {
    const needle = filtroPrograma.value.toLowerCase().trim()
    resultado = resultado.filter(item => 
      item && item.programa && item.programa.toLowerCase().includes(needle)
    )
  }
  
  return resultado
})

const nuevaNovedad = ref({
  aprendizBusqueda: '',
  tipo: 'Seleccionar tipo',
  descripcion: '',
  fechaEvento: '',
  archivo: null,
  archivoNombre: '',
  requiereRevision: false
})

const aplicarFiltros = () => {
  const totalResultados = novedadesFiltradas.value.length
  $q.notify({
    message: `Mostrando ${totalResultados} resultado${totalResultados !== 1 ? 's' : ''}`,
    color: 'positive',
    icon: 'check',
    position: 'top'
  })
}

const limpiarFiltros = () => {
  filtroAprendiz.value = ''
  filtroFicha.value = ''
  filtroPrograma.value = ''
  
  $q.notify({
    message: 'Filtros limpiados - Mostrando todas las novedades',
    color: 'info',
    icon: 'clear',
    position: 'top'
  })
}

const toggleFilters = () => {
  $q.notify({
    message: 'Filtros activos',
    color: 'green-7',
    icon: 'filter_alt'
  })
}

const abrirModalRegistro = () => {
  nuevaNovedad.value = {
    aprendizBusqueda: '',
    tipo: 'Seleccionar tipo',
    descripcion: '',
    fechaEvento: '',
    archivo: null,
    archivoNombre: '',
    requiereRevision: false
  }
  showRegisterDialog.value = true
}

const cerrarModalRegistro = () => {
  showRegisterDialog.value = false
}

const cargarArchivo = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type === 'application/pdf') {
      nuevaNovedad.value.archivo = file
      nuevaNovedad.value.archivoNombre = file.name
      $q.notify({
        message: 'Archivo cargado correctamente',
        color: 'positive',
        icon: 'check_circle'
      })
    } else {
      $q.notify({
        message: 'Solo se permiten archivos PDF',
        color: 'negative',
        icon: 'error'
      })
    }
  }
}

const eliminarArchivo = () => {
  nuevaNovedad.value.archivo = null
  nuevaNovedad.value.archivoNombre = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const mostrarConfirmacion = () => {
  if (!nuevaNovedad.value.aprendizBusqueda) {
    $q.notify({
      message: 'Por favor busque y seleccione un aprendiz',
      color: 'negative',
      icon: 'warning'
    })
    return
  }

  if (nuevaNovedad.value.tipo === 'Seleccionar tipo' || !nuevaNovedad.value.tipo) {
    $q.notify({
      message: 'Por favor seleccione un tipo de novedad',
      color: 'negative',
      icon: 'warning'
    })
    return
  }

  if (!nuevaNovedad.value.descripcion) {
    $q.notify({
      message: 'Por favor ingrese una descripción detallada',
      color: 'negative',
      icon: 'warning'
    })
    return
  }

  if (!nuevaNovedad.value.fechaEvento) {
    $q.notify({
      message: 'Por favor ingrese la fecha del evento',
      color: 'negative',
      icon: 'warning'
    })
    return
  }

  if (!nuevaNovedad.value.requiereRevision) {
    $q.notify({
      message: 'Debe confirmar que la novedad requiere revisión administrativa',
      color: 'warning',
      icon: 'info'
    })
    return
  }

  showConfirmationDialog.value = true
}

const cerrarConfirmacion = () => {
  showConfirmationDialog.value = false
}

const confirmarGuardado = () => {
  const nuevaNovedadCompleta = {
    aprendiz: nuevaNovedad.value.aprendizBusqueda,
    documento: '00000000',
    ficha: '0000000',
    programa: 'Programa ejemplo',
    tipo: nuevaNovedad.value.tipo,
    fechaProgramada: nuevaNovedad.value.fechaEvento,
    fechaRealizada: nuevaNovedad.value.fechaEvento,
    estado: 'Pendiente',
    descripcion: nuevaNovedad.value.descripcion,
    evidencia: nuevaNovedad.value.archivoNombre
  }
  
  novedades.value.unshift(nuevaNovedadCompleta)
  
  showConfirmationDialog.value = false
  showRegisterDialog.value = false
  
  $q.notify({
    message: 'Novedad realizada satisfactoriamente',
    caption: 'La novedad se registró exitosamente y se enviará para su aprobación administrativa.',
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
    timeout: 4000,
    actions: [
      { label: 'Cerrar', color: 'white', handler: () => { } }
    ]
  })
}

const verHistorial = (row) => {
  aprendizSeleccionado.value = { ...row }
  mostrarVistaHistorial.value = true
}

const cerrarHistorial = () => {
  mostrarVistaHistorial.value = false
  aprendizSeleccionado.value = null
}

const verDocumento = (documento) => {
  $q.notify({
    message: `Abriendo documento: ${documento}`,
    color: 'info',
    icon: 'description'
  })
}

const abrirModalDetalle = (novedad) => {
  novedadSeleccionada.value = novedad
  showDetailDialog.value = true
}

const cerrarModalDetalle = () => {
  showDetailDialog.value = false
  novedadSeleccionada.value = null
}

const handleRegisterDialogVisibility = (value) => {
  if (!value) {
    showRegisterDialog.value = false
  }
}

const handleDetailDialogVisibility = (value) => {
  if (!value) {
    showDetailDialog.value = false
    novedadSeleccionada.value = null
  }
}

const verPlantillas = () => {
  showTemplatesDialog.value = true
}

const cerrarPlantillas = () => {
  showTemplatesDialog.value = false
}

const visualizarPlantilla = (plantilla) => {
  plantillaSeleccionada.value = plantilla
  showPreviewDialog.value = true
}

const cerrarVisualizarPlantilla = () => {
  showPreviewDialog.value = false
  plantillaSeleccionada.value = null
}

const descargarPlantillaVisualizada = () => {}
</script>

<style scoped>
.novedades-page {
  min-height: calc(100vh - 90px - 56px);
  background-color: #f5f5f5;
  padding-bottom: 30px;
}

.content {
  padding: 0 30px 30px;
}

.page-title {
  color: var(--color-primary);
  font-size: 32px;
  font-weight: bold;
  margin: 20px 0 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filters-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filters-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.action-buttons-row {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: flex-start;
}

.boton-custom {
  background-color: var(--color-primary);
  color: white;
  border-radius: 15px;
  border: none;
  padding: 10px 25px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.boton-custom:hover {
  background-color: var(--color-primary-hover);
}

.boton-custom:active {
  transform: scale(0.98);
}

.btn-registrar-custom {
  min-width: 200px;
}

.aprendiz-cell,
.ficha-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.aprendiz-nombre,
.ficha-numero {
  font-weight: 600;
  color: #333;
}

.aprendiz-documento,
.ficha-programa {
  font-size: 12px;
  color: #666;
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 13px;
}

.estado-validado {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.estado-validado .q-icon {
  color: #2e7d32;
}

.estado-rechazado {
  background-color: #ffebee;
  color: #c62828;
}

.estado-rechazado .q-icon {
  color: #c62828;
}

.estado-pendiente {
  background-color: #fff3e0;
  color: #e65100;
}

.estado-en-proceso {
  background-color: #e3f2fd;
  color: #1565c0;
}

.modal-form {
  padding: 10px 0;
}

.modal-header-custom {
  display: flex;
  align-items: center;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.archivo-cargado {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

:deep(.q-checkbox__label) {
  font-size: 13px;
  color: #555;
}

.confirmacion-header {
  display: flex;
  align-items: center;
}

.confirmacion-body {
  padding: 20px 0;
}

.confirmacion-texto {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.confirmacion-subtexto {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.modal-footer-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  width: 100%;
}

.historial-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.historial-header {
  background-color: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-button-historial {
  margin-top: 8px;
}

.historial-title-section {
  flex: 1;
}

.historial-main-title {
  color: #333;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.historial-subtitle {
  color: var(--color-primary);
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.historial-info {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.info-item {
  font-size: 14px;
  color: #666;
}

.info-item strong {
  color: #333;
}

.historial-content {
  padding: 30px;
}

.historial-table-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

:deep(.historial-table-container .q-table__top) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

:deep(.historial-table-container .q-th) {
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
}

:deep(.historial-table-container .q-td) {
  padding: 12px 8px;
  border-bottom: 1px solid #e0e0e0;
}

:deep(.historial-table-container .q-tr:nth-child(even)) {
  background-color: #f8f9fa;
}

:deep(.historial-table-container .q-tr:hover) {
  background-color: #e8f5e9;
}

.fecha-cell,
.tipo-novedad-cell,
.observacion-cell,
.documento-cell {
  font-size: 13px;
  font-weight: 500;
}

.observacion-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.acciones-cell {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.detalle-novedad {
  padding: 5px 0;
}

.detalle-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.detalle-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.detalle-section-title {
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.detalle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.detalle-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detalle-label {
  font-weight: 600;
  color: #666;
  font-size: 13px;
}

.detalle-value {
  color: #333;
  font-size: 14px;
}

.descripcion-completa,
.acciones-realizadas {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid var(--color-border-primary);
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  max-height: 120px;
  overflow-y: auto;
}

.documentos-adjuntos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.documento-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.documento-nombre {
  flex: 1;
  font-size: 13px;
  color: #333;
}

.sin-documentos {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 15px;
  font-size: 13px;
}

.plantillas-list {
  max-height: 300px;
  overflow-y: auto;
}

.plantilla-item {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.plantilla-item:last-child {
  border-bottom: none;
}

.plantilla-nombre {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.plantilla-actions {
  display: flex;
  gap: 8px;
}

.plantilla-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pdf-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.pdf-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  overflow: auto;
}

.pdf-placeholder {
  text-align: center;
  color: #999;
}

.pdf-placeholder .q-icon {
  margin-bottom: 10px;
}

.pdf-placeholder p {
  margin-bottom: 5px;
}

.pdf-placeholder small {
  font-size: 12px;
  color: #bbb;
}

.app-button.link-button {
  background: transparent !important;
  color: var(--color-primary);
  padding: 0 12px;
  box-shadow: none;
}

.app-button.link-button:hover {
  color: var(--color-primary-hover);
  box-shadow: none;
}

.app-button.icon-button {
  background: transparent !important;
  color: #4a4a4a;
  box-shadow: none;
  min-width: 40px;
  min-height: 40px;
}


@media (max-width: 1024px) {
  .content {
    padding: 0 20px 20px;
  }
  
  .historial-content {
    padding: 20px;
  }
  
  .filters-section {
    padding: 15px;
  }
  
  .page-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 0 15px 15px;
  }

  .page-title {
    font-size: 24px;
    margin: 15px 0 20px;
  }

  .filters-section {
    padding: 15px;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    width: 100%;
    min-width: 100%;
  }

  .filter-buttons {
    width: 100%;
    justify-content: stretch;
  }

  .filter-buttons > * {
    flex: 1;
  }

  .action-buttons-row {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-registrar-custom {
    width: 100%;
    min-width: auto;
  }
  
  .modal-footer-buttons {
    flex-direction: column;
  }

  .historial-header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
  }

  .historial-content {
    padding: 15px;
  }

  .historial-main-title {
    font-size: 24px;
  }

  .historial-subtitle {
    font-size: 18px;
  }

  .historial-info {
    flex-direction: column;
    gap: 8px;
  }

  :deep(.historial-table-container .q-table) {
    font-size: 12px;
  }

  :deep(.historial-table-container .q-th) {
    font-size: 11px;
    padding: 8px 4px;
  }

  :deep(.historial-table-container .q-td) {
    padding: 8px 4px;
  }

  .detalle-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .documento-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .documento-item .q-btn {
    align-self: flex-end;
  }
  
  .detalle-section {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 0 10px 10px;
  }
  
  .historial-content {
    padding: 10px;
  }

  .page-title {
    font-size: 20px;
    margin: 10px 0 15px;
  }

  .filters-section {
    padding: 12px;
    margin-bottom: 20px;
  }

  .boton-custom {
    padding: 8px 16px;
    font-size: 13px;
  }

  :deep(.historial-table-container) {
    font-size: 11px;
  }
  
  :deep(.historial-table-container .q-th) {
    font-size: 10px;
    padding: 6px 3px;
  }
  
  .fecha-cell,
  .tipo-novedad-cell,
  .observacion-cell,
  .documento-cell {
    font-size: 10px;
  }

  .historial-main-title {
    font-size: 20px;
  }

  .historial-subtitle {
    font-size: 16px;
  }

  .info-item {
    font-size: 12px;
  }

  .detalle-section-title {
    font-size: 14px;
  }

  .detalle-label {
    font-size: 12px;
  }

  .detalle-value {
    font-size: 13px;
  }

  .descripcion-completa,
  .acciones-realizadas {
    font-size: 12px;
    padding: 10px;
    max-height: 100px;
  }
}

@media (max-width: 360px) {
  .content {
    padding: 0 8px 8px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .filters-section {
    padding: 10px;
  }
  
  .boton-custom {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .historial-main-title {
    font-size: 18px;
  }
  
  .historial-subtitle {
    font-size: 14px;
  }
}

@media (hover: none) and (pointer: coarse) {
  .boton-custom,
  .q-btn {
    min-height: 44px;
    min-width: 44px;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .novedades-page {
    min-height: auto;
  }
  
  .historial-page {
    min-height: auto;
  }
  
  .modal-form {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>