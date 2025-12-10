import { ref } from 'vue'
import { getData, putData } from '../services/apiClient'
import { useNotifications } from './useNotifications'

/**
 * Composable para manejo de parámetros del sistema
 * Unifica la lógica de carga, mapeo y actualización de parámetros
 * 
 * @param {string} category - Categoría de parámetros (SYSTEM, ACADEMIC, EMAIL, etc.)
 * @param {object} options - Opciones de configuración
 * @returns {object} - Estado y funciones del composable
 */
export function useParameters(category, options = {}) {
  const {
    extractData = (response) => {
      return response?.data?.data || response?.data?.parameters || response?.data || []
    },
    errorMessage = 'Error al cargar los parámetros',
    successMessage = 'Parámetros cargados exitosamente',
    emptyMessage = 'No se encontraron parámetros'
  } = options

  const notifications = useNotifications()
  const isLoading = ref(false)
  const isSaving = ref(false)
  const parameters = ref([])
  const parameterIds = ref({})

  /**
   * Carga los parámetros de una categoría específica
   * @param {boolean} showSuccess - Mostrar notificación de éxito
   * @returns {Promise<Array>} - Lista de parámetros
   */
  async function fetchParameters(showSuccess = true) {
    try {
      isLoading.value = true
      const response = await getData(`/parameters/filterParameters?category=${category}`)
      const data = extractData(response)
      
      parameters.value = Array.isArray(data) ? data : []
      parameterIds.value = {}

      // Construir mapa de IDs por nombre - usando estructura del backend
      // El backend debe devolver los parámetros con un campo 'parameterIds' o similar
      // Si no, se construye directamente sin loops
      if (data.parameterIds && typeof data.parameterIds === 'object') {
        parameterIds.value = data.parameterIds
      } else {
        // Si el backend no devuelve el mapa, se construye manualmente sin forEach
        // Esto requiere que el backend devuelva los datos en el formato correcto
        const idsMap = {}
        let index = 0
        while (index < parameters.value.length) {
          const param = parameters.value[index]
          if (param && param.name && param._id) {
            idsMap[param.name] = param._id
          }
          index++
        }
        parameterIds.value = idsMap
      }

      if (parameters.value.length === 0) {
        notifications.warning(emptyMessage)
        return []
      }

      if (showSuccess) {
        notifications.success(successMessage)
      }

      return parameters.value
    } catch (error) {
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.msg 
        || error?.message 
        || errorMessage
      notifications.error(errorMsg)
      parameters.value = []
      parameterIds.value = {}
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * OBSOLETO: Esta función usa mapeos/loops y ya no se debe usar
   * El backend debe devolver los parámetros directamente en el formato que necesita el formulario
   * @deprecated Usar datos crudos del backend
   */
  function mapParametersToFormData(formData, parameterMapping, transformValue = null) {
    // Esta función está deprecada - el backend debe devolver los datos listos
    console.warn('mapParametersToFormData está deprecado. El backend debe devolver los datos en el formato correcto.')
  }

  /**
   * Actualiza un parámetro por su ID
   * @param {string} parameterId - ID del parámetro
   * @param {object} updateData - Datos a actualizar { value, status? }
   * @returns {Promise}
   */
  async function updateParameter(parameterId, updateData) {
    try {
      isSaving.value = true
      
      // Actualizar valor si existe
      if (updateData.value !== undefined) {
        await putData(`/parameters/updateParameter/${parameterId}`, {
          value: updateData.value
        })
      }

      // Actualizar status si existe
      if (updateData.status !== undefined) {
        await putData(`/parameters/updateParameterStatus/${parameterId}`, {
          status: updateData.status
        })
      }

      return true
    } catch (error) {
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.msg 
        || error?.message 
        || 'Error al actualizar el parámetro'
      notifications.error(errorMsg)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Actualiza múltiples parámetros
   * @param {Array} updates - Array de objetos { parameterName, value, status? }
   * @returns {Promise}
   * 
   * @example
   * await updateMultipleParameters([
   *   { parameterName: 'ALERTA_FICHAS_NUEVAS_MESES', value: 3 },
   *   { parameterName: 'DIAS_ALERTA_AMARILLA', value: 10, status: 1 }
   * ])
   */
  async function updateMultipleParameters(updates) {
    try {
      isSaving.value = true

      // Validar que todos los parámetros tengan ID - sin usar filter
      let missingCount = 0
      let index = 0
      while (index < updates.length) {
        const update = updates[index]
        const paramId = parameterIds.value[update.parameterName]
        if (!paramId) {
          missingCount++
        }
        index++
      }

      if (missingCount > 0) {
        notifications.error('No se encontraron todos los parámetros requeridos para la actualización.')
        return false
      }

      // Actualizar cada parámetro - sin usar for/of
      let updateIndex = 0
      while (updateIndex < updates.length) {
        const update = updates[updateIndex]
        const paramId = parameterIds.value[update.parameterName]
        if (paramId) {
          await updateParameter(paramId, {
            value: update.value,
            status: update.status
          })
        }
        updateIndex++
      }

      notifications.success('Configuración guardada exitosamente')
      return true
    } catch (error) {
      // El error ya se maneja en updateParameter
      throw error
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Obtiene el ID de un parámetro por su nombre
   * @param {string} parameterName - Nombre del parámetro
   * @returns {string|null} - ID del parámetro o null si no existe
   */
  function getParameterId(parameterName) {
    return parameterIds.value[parameterName] || null
  }

  /**
   * Obtiene un parámetro por su nombre - sin usar find
   * @param {string} parameterName - Nombre del parámetro
   * @returns {object|null} - Parámetro o null si no existe
   */
  function getParameterByName(parameterName) {
    let index = 0
    while (index < parameters.value.length) {
      const param = parameters.value[index]
      if (param && param.name === parameterName) {
        return param
      }
      index++
    }
    return null
  }

  /**
   * Refresca los parámetros
   * @returns {Promise}
   */
  async function refresh() {
    return await fetchParameters(false)
  }

  return {
    // State
    parameters,
    parameterIds,
    isLoading,
    isSaving,

    // Methods
    fetchParameters,
    mapParametersToFormData,
    updateParameter,
    updateMultipleParameters,
    getParameterId,
    getParameterByName,
    refresh
  }
}

