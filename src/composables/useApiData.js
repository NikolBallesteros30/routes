import { ref } from 'vue'
import { getData } from '../services/apiClient'
import { useNotifications } from './useNotifications'

/**
 * Composable genérico para operaciones de lectura de datos de la API
 * @param {string} endpoint - Endpoint de la API (ej: '/companies/listCompanies')
 * @param {object} options - Opciones de configuración
 * @returns {object} - Estado y funciones del composable
 */
export function useApiData(endpoint, options = {}) {
  const {
    errorMessage = 'Error al cargar los datos',
    showEmptyInfo = false,
    emptyMessage = 'No hay datos disponibles'
  } = options

  const data = ref([])
  const isLoading = ref(false)
  const notifications = useNotifications()

  /**
   * Obtiene los datos del endpoint - SIN TRANSFORMACIONES
   * Los datos vienen crudos del backend y se muestran directamente
   */
  async function fetchData(queryParams = {}) {
    try {
      isLoading.value = true
      data.value = []
      
      // Construir URL con query params si existen - sin usar forEach
      let url = endpoint
      if (Object.keys(queryParams).length > 0) {
        const params = new URLSearchParams()
        const keys = Object.keys(queryParams)
        let keyIndex = 0
        while (keyIndex < keys.length) {
          const key = keys[keyIndex]
          if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
            params.append(key, queryParams[key])
          }
          keyIndex++
        }
        url = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`
      }
      
      const responseData = await getData(url)
      
      // Extraer datos del backend - manejar diferentes estructuras de respuesta
      // El backend puede devolver datos en múltiples formatos según la colección Postman
      let extractedData = null
      
      // Caso 1: responseData es directamente un array
      if (Array.isArray(responseData)) {
        extractedData = responseData
      }
      // Caso 2: responseData.msg existe y es un array (formato más común según Postman)
      else if (responseData?.msg && Array.isArray(responseData.msg)) {
        extractedData = responseData.msg
      }
      // Caso 3: responseData.data existe y es un array
      else if (responseData?.data && Array.isArray(responseData.data)) {
        extractedData = responseData.data
      }
      // Caso 4: Propiedades específicas comunes del backend (prioridad)
      else if (responseData && typeof responseData === 'object') {
        // Buscar propiedades comunes primero - 'companies' tiene prioridad para este endpoint
        const commonProperties = ['companies', 'registrations', 'apprentices', 'modalities', 
                                   'instructors', 'news', 'novedades', 'parameters', 'projects', 'activities',
                                   'fiches', 'documents', 'requests', 'logs']
        let propIndex = 0
        while (propIndex < commonProperties.length && !extractedData) {
          const prop = commonProperties[propIndex]
          if (responseData[prop] && Array.isArray(responseData[prop])) {
            extractedData = responseData[prop]
          }
          propIndex++
        }
        
        // Si no se encontró en propiedades comunes, buscar cualquier propiedad que sea array
        if (!extractedData) {
          const keys = Object.keys(responseData)
          let keyIndex = 0
          while (keyIndex < keys.length && !extractedData) {
            const key = keys[keyIndex]
            const value = responseData[key]
            if (Array.isArray(value)) {
              extractedData = value
            }
            keyIndex++
          }
        }
      }
      
      // Validar que extractedData sea un array válido
      if (extractedData && Array.isArray(extractedData)) {
        data.value = extractedData
      } else {
        // Si no se encontró un array válido, usar array vacío
        data.value = []
      }
      
      if (data.value.length === 0 && showEmptyInfo) {
        notifications.info(emptyMessage)
      }
    } catch (error) {
      data.value = []
      const msg = error.response?.data?.message || error.response?.data?.msg || error?.message || errorMessage
      notifications.error(msg)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Refresca los datos
   */
  async function refresh() {
    await fetchData()
  }

  return {
    data,
    isLoading,
    fetchData,
    refresh
  }
}
