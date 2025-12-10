import { ref } from 'vue'
import { postData, putData, deleteData } from '../services/apiClient'
import { useNotifications } from './useNotifications'

/**
 * Composable genérico para operaciones CRUD (Create, Update, Delete)
 * @param {string} baseEndpoint - Endpoint base de la API (ej: '/companies')
 * @param {object} options - Opciones de configuración
 * @returns {object} - Estado y funciones del composable
 */
export function useApiMutations(baseEndpoint, options = {}) {
  const {
    createSuccessMessage = 'Registro creado exitosamente',
    updateSuccessMessage = 'Registro actualizado exitosamente',
    deleteSuccessMessage = 'Registro eliminado exitosamente',
    errorMessage = 'Error en la operación'
  } = options

  const isSaving = ref(false)
  const isDeleting = ref(false)
  const notifications = useNotifications()

  /**
   * Crea un nuevo registro
   * @param {object} data - Datos del registro
   * @param {string} customEndpoint - Endpoint personalizado (opcional)
   */
  async function create(data, customEndpoint = null) {
    try {
      isSaving.value = true
      const endpoint = customEndpoint || baseEndpoint
      const response = await postData(endpoint, data)
      notifications.success(createSuccessMessage)
      return response
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.msg || error?.message || errorMessage
      notifications.error(msg)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Actualiza un registro existente
   * @param {string} id - ID del registro
   * @param {object} data - Datos actualizados
   * @param {string} customEndpoint - Endpoint personalizado (opcional)
   */
  async function update(id, data, customEndpoint = null) {
    try {
      isSaving.value = true
      const endpoint = customEndpoint || `${baseEndpoint}/${id}`
      const response = await putData(endpoint, data)
      notifications.success(updateSuccessMessage)
      return response
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.msg || error?.message || errorMessage
      notifications.error(msg)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Elimina un registro
   * @param {string} id - ID del registro
   * @param {string} customEndpoint - Endpoint personalizado (opcional)
   */
  async function remove(id, customEndpoint = null) {
    try {
      isDeleting.value = true
      const endpoint = customEndpoint || `${baseEndpoint}/${id}`
      const response = await deleteData(endpoint)
      notifications.success(deleteSuccessMessage)
      return response
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.msg || error?.message || errorMessage
      notifications.error(msg)
      throw error
    } finally {
      isDeleting.value = false
    }
  }

  /**
   * Actualiza el estado de un registro (activar/desactivar)
   * Soporta dos patrones de uso:
   * 1. toggleStatus(id, status, endpoint) - Patrón simple
   * 2. toggleStatus(id, action, successMessage, callback) - Patrón con callback
   * @param {string} id - ID del registro
   * @param {number|string} statusOrAction - Nuevo estado (0/1) o nombre de acción (ej: 'activeCompanies')
   * @param {string|function} endpointOrMessage - Endpoint personalizado o mensaje de éxito
   * @param {function} [callback] - Función callback opcional (solo para patrón 2)
   */
  async function toggleStatus(id, statusOrAction, endpointOrMessage, callback) {
    try {
      isSaving.value = true
      
      // Patrón 2: toggleStatus(id, action, successMessage, callback)
      if (typeof statusOrAction === 'string' && typeof endpointOrMessage === 'string' && typeof callback === 'function') {
        const action = statusOrAction
        const successMessage = endpointOrMessage
        const endpoint = `${baseEndpoint}/${action}`
        
        await putData(`${endpoint}/${id}`)
        notifications.success(successMessage)
        callback()
        return
      }
      
      // Patrón 1: toggleStatus(id, status, endpoint)
      const status = statusOrAction
      const endpoint = endpointOrMessage || baseEndpoint
      await putData(`${endpoint}/${id}`)
      const statusText = status === 0 ? 'activado' : 'desactivado'
      notifications.success(`Registro ${statusText} exitosamente`)
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.msg || error?.message || errorMessage
      notifications.error(msg)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    isDeleting,
    create,
    update,
    remove,
    toggleStatus
  }
}
