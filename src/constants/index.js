export const NOTIFICATION_TIMEOUT = { SUCCESS: 3000, ERROR: 4000, WARNING: 3500, INFO: 3000 }
export const NOTIFICATION_POSITION = 'top'
export const NOTIFICATION_ICONS = { SUCCESS: 'check_circle', ERROR: 'error', WARNING: 'warning', INFO: 'info' }
export const STATUS = { ACTIVE: 0, INACTIVE: 1 }
export const STATUS_LABELS = { ACTIVE: 'Activo', INACTIVE: 'Inactivo', ALL: 'Todos los estados' }
export const STATUS_OPTIONS = [{ label: 'Todos los estados', value: 'all' }, { label: 'Activo', value: 0 }, { label: 'Inactivo', value: 1 }]
export const DOCUMENT_TYPES = { CC: 'CC', TI: 'TI', CE: 'CE', PA: 'PA' }
export const DOCUMENT_TYPE_OPTIONS = [{ label: 'Cédula de Ciudadanía', value: 'CC' }, { label: 'Tarjeta de Identidad', value: 'TI' }, { label: 'Cédula de Extranjería', value: 'CE' }, { label: 'Pasaporte', value: 'PA' }]
export const FILE_SIZE_LIMITS = { MAX_UPLOAD_SIZE: 5242880, MAX_UPLOAD_SIZE_MB: 5 }
export const FILE_EXTENSIONS = { 
  EXCEL: ['.xlsx', '.xls'], 
  CSV: ['.csv'], 
  PDF: ['.pdf'],
  ALL_UPLOAD: ['.xlsx', '.xls', '.csv'],
  DOCUMENTS: ['.pdf']
}
export const VALIDATION_RULES = { MIN_NAME_LENGTH: 3, MAX_NAME_LENGTH: 100, MIN_NIT_LENGTH: 8, MAX_NIT_LENGTH: 20, PHONE_LENGTH: 10, MIN_PASSWORD_LENGTH: 8, MAX_EMAIL_LENGTH: 100 }
export const TABLE_HEIGHT = { STANDARD: 410 }
export const DEBOUNCE_DELAY = { INPUT: 500, SEARCH: 300 }
export const REGISTRATION_STATUS = { PENDING: 3, REJECTED: 1, APPROVED: 0 }
export const REGISTRATION_STATUS_LABELS = { 3: 'Pendiente', 1: 'Rechazado', 0: 'Aprobado' }
export const REGISTRATION_STATUS_OPTIONS = [{ label: 'Todos los estados', value: 'all' }, { label: 'Pendiente', value: 3 }, { label: 'Rechazado', value: 1 }, { label: 'Aprobado', value: 0 }]

// Roles de usuario
export const USER_ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  INSTRUCTOR: 'INSTRUCTOR',
  APRENDIZ: 'APRENDIZ'
}

export const ROLE_OPTIONS = [
  { label: 'Administrador', value: USER_ROLES.ADMINISTRADOR },
  { label: 'Instructor', value: USER_ROLES.INSTRUCTOR },
  { label: 'Aprendiz', value: USER_ROLES.APRENDIZ }
]

// Rutas según rol
export const ROLE_ROUTES = {
  [USER_ROLES.ADMINISTRADOR]: '/app/inicio',
  [USER_ROLES.INSTRUCTOR]: '/app/inicio',
  [USER_ROLES.APRENDIZ]: '/app/aprendiz/inicio'
}

// Endpoints de login por rol
export const LOGIN_ENDPOINTS = {
  [USER_ROLES.ADMINISTRADOR]: '/users/login',
  [USER_ROLES.INSTRUCTOR]: '/instructors/login',
  [USER_ROLES.APRENDIZ]: '/apprentices/login'
}

// Categorías de parámetros
export const PARAMETER_CATEGORIES = {
  SYSTEM: 'SYSTEM',
  ACADEMIC: 'ACADEMIC',
  EMAIL: 'EMAIL'
}

// Nombres de parámetros del sistema
export const PARAMETER_NAMES = {
  // Alertas (SYSTEM)
  ALERTA_FICHAS_NUEVAS_MESES: 'ALERTA_FICHAS_NUEVAS_MESES',
  VENCIMIENTO_FICHAS_ANTIGUAS: 'VENCIMIENTO_FICHAS_ANTIGUAS',
  DIAS_ALERTA_AMARILLA: 'DIAS_ALERTA_AMARILLA',
  DIAS_ALERTA_NARANJA: 'DIAS_ALERTA_NARANJA',
  DIAS_ALERTA_ROJA_CRITICA: 'DIAS_ALERTA_ROJA_CRITICA',
  DIAS_ALERTA_BITACORA_PENDIENTE: 'DIAS_ALERTA_BITACORA_PENDIENTE',
  DIAS_ALERTA_SEGUIMIENTO_PENDIENTE: 'DIAS_ALERTA_SEGUIMIENTO_PENDIENTE',
  DIAS_ALERTA_CRITICA_ULTIMO_SEGUIMIENTO: 'DIAS_ALERTA_CRITICA_ULTIMO_SEGUIMIENTO',
  DIAS_ALERTA_REVISION_INSTRUCTOR: 'DIAS_ALERTA_REVISION_INSTRUCTOR',
  
  // Proceso Formativo (ACADEMIC)
  MAX_BITACORAS_POR_NIVEL: 'MAX_BITACORAS_POR_NIVEL',
  SEGUIMIENTOS_TECNICO_TECNOLOGO: 'SEGUIMIENTOS_TECNICO_TECNOLOGO',
  SEGUIMIENTOS_OPERARIO: 'SEGUIMIENTOS_OPERARIO',
  MAX_REGISTROS_APRENDIZ_FICHA: 'MAX_REGISTROS_APRENDIZ_FICHA',
  TIEMPO_MAX_REVISION_BITACORAS: 'TIEMPO_MAX_REVISION_BITACORAS'
}

// Tipos de secciones para parámetros
export const PARAMETER_SECTION_TYPES = {
  // Alertas
  FICHE: 'fiche',
  ESCALATED: 'escalated',
  PROCESS: 'process',
  // Proceso Formativo
  LOGS: 'logs',
  VALIDATIONS: 'validations'
}

