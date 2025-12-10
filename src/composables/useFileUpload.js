import { ref } from 'vue'
import { useNotifications } from './useNotifications'
import { FILE_SIZE_LIMITS, FILE_EXTENSIONS } from '../constants'

export function useFileUpload() {
  const notifications = useNotifications()
  const uploadFile = ref(null)
  const isUploading = ref(false)

  /**
   * Valida un archivo según el tipo especificado
   * @param {File} file - Archivo a validar
   * @param {string} type - Tipo de validación: 'excel', 'pdf', 'document', o 'all'
   * @returns {boolean} - true si el archivo es válido
   */
  function validateFile(file, type = 'all') {
    const maxSize = FILE_SIZE_LIMITS.MAX_UPLOAD_SIZE
    
    if (!file) {
      notifications.error('Por favor selecciona un archivo')
      return false
    }

    if (file.size > maxSize) {
      notifications.error(
        `El archivo supera el tamaño máximo permitido de ${FILE_SIZE_LIMITS.MAX_UPLOAD_SIZE_MB}MB`
      )
      return false
    }

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    let allowedExtensions = []
    let errorMessage = 'Formato de archivo no permitido'

    switch (type) {
      case 'excel':
        allowedExtensions = FILE_EXTENSIONS.ALL_UPLOAD
        errorMessage = 'Formato de archivo no permitido. Use Excel (.xlsx, .xls) o CSV (.csv)'
        break
      case 'pdf':
      case 'document':
        allowedExtensions = FILE_EXTENSIONS.DOCUMENTS
        // Validar también por tipo MIME
        if (file.type !== 'application/pdf') {
          notifications.error('Formato de archivo no permitido. Use PDF')
          return false
        }
        errorMessage = 'Formato de archivo no permitido. Use PDF'
        break
      case 'all':
      default:
        allowedExtensions = [...FILE_EXTENSIONS.ALL_UPLOAD, ...FILE_EXTENSIONS.DOCUMENTS]
        errorMessage = 'Formato de archivo no permitido'
        break
    }

    // Sin usar includes - buscar con while loop
    let extensionIndex = 0
    let found = false
    while (extensionIndex < allowedExtensions.length && !found) {
      if (allowedExtensions[extensionIndex] === fileExtension) {
        found = true
      }
      extensionIndex++
    }
    if (!found) {
      notifications.error(errorMessage)
      return false
    }

    return true
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  function resetUpload() {
    uploadFile.value = null
  }

  function handleFileRejected(rejectedEntries, fileType = 'excel') {
    if (!rejectedEntries || rejectedEntries.length === 0) return
    
    const reason = rejectedEntries[0].failedPropValidation
    let message = 'Archivo rechazado'
    
    if (reason === 'max-file-size') {
      message = `El archivo supera el tamaño máximo permitido de ${FILE_SIZE_LIMITS.MAX_UPLOAD_SIZE_MB}MB`
    } else if (reason === 'accept') {
      if (fileType === 'pdf' || fileType === 'document') {
        message = 'Formato de archivo no permitido. Use PDF'
      } else {
        message = 'Formato de archivo no permitido. Use Excel (.xlsx, .xls) o CSV (.csv)'
      }
    }
    
    notifications.error(message)
  }

  return {
    uploadFile,
    isUploading,
    validateFile,
    formatFileSize,
    resetUpload,
    handleFileRejected
  }
}

