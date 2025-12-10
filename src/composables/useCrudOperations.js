import { ref } from 'vue'
import { getData, postData, putData, deleteData } from '../services/apiClient'
import { useNotifications } from './useNotifications'

/**
 * useCrudOperations - composable flexible para operaciones CRUD.
 * Parámetros:
 *  - config: {
 *      listUrl: string | (params)=>string,
 *      createUrl: string | (data)=>string,
 *      updateUrl: (id)=>string,
 *      deleteUrl: (id)=>string,
 *      toggleUrl: (id, action)=>string, // opcional
 *      extractList: (response)=>array // opcional, por defecto response.data
 *    }
 */
export function useCrudOperations(config = {}) {
  const notifications = useNotifications()
  const isLoading = ref(false)
  const isSaving = ref(false)
  const items = ref([])

  const extractList = config.extractList || ((res) => res?.data || res?.msg || [])

  function buildUrl(part, arg) {
    if (!part) return undefined
    return typeof part === 'function' ? part(arg) : part
  }

  async function fetchItems(params = {}) {
    try {
      isLoading.value = true

      // construir query si params es objeto simple - sin usar map/filter
      let url = buildUrl(config.listUrl, params) || config.listUrl
      if (typeof params === 'object' && !url?.includes('?')) {
        const qsParts = []
        const keys = Object.keys(params)
        let keyIndex = 0
        while (keyIndex < keys.length) {
          const k = keys[keyIndex]
          if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
            qsParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
          }
          keyIndex++
        }
        const qs = qsParts.join('&')
        if (qs) url = `${url}${url.includes('?') ? '&' : '?'}${qs}`
      }

      const response = await getData(url)
      const data = extractList(response) || []
      items.value = Array.isArray(data) ? data : []

      // notificar solo cuando hay datos (evitar spam)
      if (items.value.length === 0) {
        // no forzar notificación de error; dejar al componente decidir
      }

      return items.value
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.msg || 'Error al cargar los datos'
      notifications.error(errorMessage)
      items.value = []
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createItem(itemData) {
    try {
      isSaving.value = true
      const url = buildUrl(config.createUrl, itemData)
      const res = await postData(url, itemData)
      notifications.success('Registro creado correctamente')
      // refrescar
      await fetchItems(config.lastFetchParams || {})
      return res
    } catch (error) {
      const resp = error?.response?.data
      const message = resp?.message || resp?.msg || error?.message || 'Error al crear el registro'
      notifications.error(message)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  async function updateItem(itemId, itemData) {
    try {
      isSaving.value = true
      const url = buildUrl(config.updateUrl, itemId)
      const res = await putData(url, itemData)
      notifications.success('Registro actualizado correctamente')
      await fetchItems(config.lastFetchParams || {})
      return res
    } catch (error) {
      const resp = error?.response?.data
      const message = resp?.message || resp?.msg || error?.message || 'Error al actualizar el registro'
      notifications.error(message)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  async function deleteItem(itemId) {
    try {
      isLoading.value = true
      const url = buildUrl(config.deleteUrl, itemId)
      const res = await deleteData(url)
      notifications.success('Registro eliminado correctamente')
      await fetchItems(config.lastFetchParams || {})
      return res
    } catch (error) {
      const resp = error?.response?.data
      const message = resp?.message || resp?.msg || error?.message || 'Error al eliminar el registro'
      notifications.error(message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function toggleStatus(item, opts = {}) {
    try {
      isLoading.value = true
      // soporta dos patrones: toggleUrl builder o updateUrl con payload
      if (config.toggleUrl) {
        const action = opts.action || (item.status ? 'disable' : 'activate')
        const url = buildUrl(config.toggleUrl, { id: item._id, action })
        const res = await putData(url)
        notifications.success(`Registro ${action} exitoso`)
        await fetchItems(config.lastFetchParams || {})
        return res
      }

      // fallback: usar updateUrl para setear status
      const newStatus = opts.newStatus !== undefined ? opts.newStatus : (item.status ? 0 : 1)
      const url = buildUrl(config.updateUrl, item._id)
      const res = await putData(url, { ...item, status: newStatus })
      notifications.success(`Estado actualizado correctamente`)
      await fetchItems(config.lastFetchParams || {})
      return res
    } catch (error) {
      const resp = error?.response?.data
      const message = resp?.message || resp?.msg || error?.message || 'Error al cambiar estado'
      notifications.error(message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    isSaving,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    toggleStatus
  }
}

