# Plan de Refactorización - FRONTENDEP

## 🎯 Objetivos
1. Unificar nomenclatura de funciones en todo el proyecto
2. Aplicar clean code y mejores prácticas
3. Consistencia en estructuras de datos y flujos
4. Eliminar código duplicado
5. Mejorar legibilidad y mantenibilidad

## 📋 Convenciones Establecidas

### Nomenclatura de Funciones

#### 1. Funciones de Datos (fetch)
```javascript
// ✅ CORRECTO - Plural para colecciones
async function fetchApprentices()
async function fetchCompanies()
async function fetchModalities()
async function fetchRegistrations()
async function fetchInstructors()
async function fetchFiches()
async function fetchDocuments()
async function fetchNews()

// ❌ INCORRECTO
async function fetchRegistros() // Debe ser fetchRegistrations
async function obtenerEmpresas() // Debe ser fetchCompanies
```

#### 2. Funciones de Manejo (handle)
```javascript
// ✅ CORRECTO - Verbos claros
function handleViewDetails(item)
function handleEdit(item)
function handleOpenCreateDialog()
function handleCloseDialog()
function handleSubmit()
function handleToggleStatus(item)
function handleValidate(item, status)
function handleMassiveUpload()

// ❌ INCORRECTO
function verDetalles() // Debe ser handleViewDetails
function editarItem() // Debe ser handleEdit
```

#### 3. Funciones de UI/Utilidad
```javascript
// ✅ CORRECTO
function getStatusLabel(status)
function getStatusColor(status)
function formatDate(date)
function canEdit(item)
function canSend(item)

// ❌ INCORRECTO
function obtenerEtiqueta() // Debe ser get{Entity}Label
```

### Estructura de Archivos Vue

```vue
<template>
  <!-- 1. Layout principal -->
  <div class="q-pa-md">
    <BackButton />
    
    <!-- 2. Título centrado -->
    <div class="text-center q-mb-lg">
      <h1>TÍTULO DE LA VISTA</h1>
    </div>
    
    <!-- 3. Filtros centrados -->
    <div class="container">
      <div class="row items-center justify-center q-mb-md q-gutter-md">
        <!-- Filtros aquí -->
      </div>
      
      <!-- 4. Tabla de datos -->
      <maintable />
    </div>
    
    <!-- 5. Modales -->
    <modalComponent ref="detailsModalRef">...</modalComponent>
    <modalComponent ref="editModalRef">...</modalComponent>
  </div>
</template>

<script setup>
// 1. IMPORTS
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient } from '@/services/apiClient'
import { useNotifications } from '@/composables/useNotifications'
// ... más imports

// 2. COMPOSABLES
const $q = useQuasar()
const notifications = useNotifications()
const authStore = useAuthStore()

// 3. STATE (refs)
const items = ref([])
const selectedItem = ref(null)
const isEditing = ref(false)
const isSaving = ref(false)
const isLoading = ref(false)

// 4. REFS DE COMPONENTES
const detailsModalRef = ref(null)
const editModalRef = ref(null)
const formRef = ref(null)

// 5. COMPUTED PROPERTIES
const filteredItems = computed(() => {
  // lógica de filtrado
})

// 6. WATCHERS
watch(() => something, () => {
  // lógica
})

// 7. COLUMNAS DE TABLA
const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'left' }
]

// 8. FUNCIONES DE DATOS (fetch)
async function fetchItems() {
  try {
    isLoading.value = true
    const response = await apiClient.get('/api/items')
    items.value = response.data.items || []
  } catch (error) {
    notifications.error('Error al cargar items')
  } finally {
    isLoading.value = false
  }
}

// 9. FUNCIONES DE MANEJO (handle)
function handleViewDetails(item) {
  selectedItem.value = item
  detailsModalRef.value?.openDialog()
}

function handleEdit(item) {
  isEditing.value = true
  // lógica de edición
  editModalRef.value?.openDialog()
}

function handleOpenCreateDialog() {
  isEditing.value = false
  // limpiar formulario
  editModalRef.value?.openDialog()
}

function handleCloseDialog() {
  editModalRef.value?.closeDialog()
  if (formRef.value) formRef.value.resetValidation()
}

async function handleSubmit() {
  const isValid = await formRef.value.validate()
  if (!isValid) return
  
  if (isEditing.value) {
    await updateItem()
  } else {
    await createItem()
  }
}

// 10. OPERACIONES CRUD
async function createItem() {
  try {
    isSaving.value = true
    await apiClient.post('/api/items', itemData)
    notifications.success('Item creado exitosamente')
    editModalRef.value?.closeDialog()
    await fetchItems()
  } catch (error) {
    notifications.error('Error al crear item')
  } finally {
    isSaving.value = false
  }
}

async function updateItem() {
  try {
    isSaving.value = true
    await apiClient.put(`/api/items/${itemId}`, itemData)
    notifications.success('Item actualizado exitosamente')
    editModalRef.value?.closeDialog()
    await fetchItems()
  } catch (error) {
    notifications.error('Error al actualizar item')
  } finally {
    isSaving.value = false
  }
}

async function deleteItem(id) {
  try {
    await apiClient.delete(`/api/items/${id}`)
    notifications.success('Item eliminado exitosamente')
    await fetchItems()
  } catch (error) {
    notifications.error('Error al eliminar item')
  }
}

// 11. FUNCIONES DE UI/UTILIDAD
function getStatusLabel(status) {
  return STATUS_LABELS[status] || 'Desconocido'
}

function getStatusColor(status) {
  const colors = { 0: 'positive', 1: 'negative', 3: 'orange' }
  return colors[status] || 'grey'
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CO')
}

// 12. LIFECYCLE HOOKS
onMounted(async () => {
  await fetchItems()
})
</script>

<style scoped>
.container { max-width: 1600px; margin: 0 auto; }
</style>
```

## 🔧 Archivos a Refactorizar

### Prioridad Alta
1. ✅ `src/views/admin/RegistrosEP.vue` - Ya tiene nomenclatura correcta
2. ❌ `src/views/aprendiz/RegistroEP.vue` - Necesita: fetchRegistrations (actualmente fetchRegistros)
3. ✅ `src/views/admin/Empresas.vue` - Ya tiene nomenclatura correcta
4. ✅ `src/views/admin/Aprendices.vue` - Ya tiene nomenclatura correcta
5. ✅ `src/views/admin/ModalidadesEP.vue` - Ya tiene nomenclatura correcta

### Prioridad Media
6. ✅ `src/views/admin/Instructores.vue` - Ya tiene nomenclatura correcta
7. ✅ `src/views/admin/Fichas.vue` - Ya tiene nomenclatura correcta
8. ❌ `src/views/admin/Documetos.vue` - Revisar typo en nombre de archivo
9. ❌ `src/views/admin/novedadesAdmin.vue` - Debe ser `NovedadesAdmin.vue` (PascalCase)

### Prioridad Baja
10. Vistas de instructor
11. Vistas de aprendiz
12. Vistas de reportes

## 📝 Cambios Específicos Pendientes

### 1. RegistroEP.vue (Aprendiz)
```javascript
// ❌ ACTUAL
async function fetchRegistros()
async function createRegistro()
async function updateRegistro()
async function handleSendRegistro()

// ✅ DEBE SER
async function fetchRegistrations()
async function createRegistration()
async function updateRegistration()
async function handleSendRegistration()
```

### 2. Documentos.vue
- Renombrar archivo: `Documetos.vue` → `Documentos.vue`

### 3. novedadesAdmin.vue
- Renombrar archivo: `novedadesAdmin.vue` → `NovedadesAdmin.vue`
- Actualizar imports en router.js

## ✅ Checklist de Limpieza

### Código
- [ ] Eliminar console.logs de debug
- [ ] Unificar manejo de errores
- [ ] Extraer constantes duplicadas
- [ ] Documentar funciones complejas
- [ ] Usar composables para lógica reutilizable

### Estilos
- [ ] Unificar clases de Quasar
- [ ] Consistencia en tamaños de fuentes
- [ ] Usar variables de SCSS

### Estructura
- [ ] Todos los modales con mismo patrón
- [ ] Todas las tablas con mismo patrón
- [ ] Todos los formularios validados igual

## 🎨 Estándares de UI

### Filtros
```vue
<div class="row items-center justify-center q-mb-md q-gutter-md">
  <div class="col-12 col-md-4">
    <q-input v-model="searchTerm" dense outlined placeholder="Buscar..." />
  </div>
  <div class="col-12 col-md-4">
    <q-select v-model="filter" :options="options" dense outlined />
  </div>
</div>
```

### Botones de Acción
```vue
<q-btn flat round color="primary" icon="visibility">
  <q-tooltip>Ver detalles</q-tooltip>
</q-btn>
<q-btn flat round color="warning" icon="edit">
  <q-tooltip>Editar</q-tooltip>
</q-btn>
<q-btn flat round color="positive" icon="check">
  <q-tooltip>Aprobar</q-tooltip>
</q-btn>
<q-btn flat round color="negative" icon="close">
  <q-tooltip>Rechazar</q-tooltip>
</q-btn>
```

### Estados
```javascript
const STATUS = { ACTIVE: 0, INACTIVE: 1 }
const REGISTRATION_STATUS = { APPROVED: 0, REJECTED: 1, PENDING: 3 }

// Colores consistentes
const STATUS_COLORS = {
  0: 'positive', // Verde - Aprobado/Activo
  1: 'negative', // Rojo - Rechazado/Inactivo
  3: 'orange'    // Naranja - Pendiente
}
```

## 📦 Próximos Pasos

1. Refactorizar `RegistroEP.vue` (aprendiz) - SIGUIENTE
2. Renombrar archivos con typos
3. Limpiar console.logs
4. Unificar manejo de errores
5. Documentar funciones complejas
6. Crear composable para operaciones CRUD comunes
7. Extraer lógica de tablas a composable
8. Crear tests unitarios básicos

## 💡 Mejoras Futuras

- Crear composable `useCrud.js` para operaciones comunes
- Crear composable `useTableOperations.js` para tablas
- Implementar paginación server-side
- Agregar skeletons de carga
- Implementar cache de datos
- Agregar modo offline
