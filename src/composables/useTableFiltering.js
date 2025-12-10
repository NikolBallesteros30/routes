/**
 * @deprecated Este composable usa filter y está deprecado
 * El filtrado debe hacerse en el backend usando query parameters
 * Usar useApiData con queryParams en su lugar
 */

import { ref } from 'vue'

export function useTableFiltering(items, searchFields = ['name']) {
  console.warn('useTableFiltering está deprecado. El filtrado debe hacerse en el backend usando query parameters en useApiData.')
  
  const searchTerm = ref('')
  const statusFilter = ref('all')
  const additionalFilters = ref({})

  function setAdditionalFilter(key, value) {
    additionalFilters.value[key] = value
  }

  function clearFilters() {
    searchTerm.value = ''
    statusFilter.value = 'all'
    additionalFilters.value = {}
  }

  // Retornar los items sin filtrar - el filtrado debe hacerse en el backend
  const filteredItems = items

  return {
    searchTerm,
    statusFilter,
    additionalFilters,
    filteredItems,
    setAdditionalFilter,
    clearFilters
  }
}
