import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // ==================== RUTAS PÚBLICAS ====================
  { 
    path: '/', 
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  { 
    path: '/CambiarContrasena', 
    name: 'ChangePassword', 
    component: () => import('../views/aprendiz/ChangePassword.vue'),
    meta: { requiresAuth: false }
  },
  { 
    path: '/IngresarCodigoContrasena', 
    name: 'EnterPasswordCode', 
    component: () => import('../views/aprendiz/EnterPasswordCode.vue'),
    meta: { requiresAuth: false }
  },
  { 
    path: '/NuevaContrasena', 
    name: 'NewPassword', 
    component: () => import('../views/aprendiz/NewPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/Unauthorized.vue'),
    meta: { requiresAuth: false }
  },
  
  // ==================== RUTAS PROTEGIDAS ====================
  {
    path: '/app',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { 
        path: 'inicio', 
        name: 'Home', 
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'INSTRUCTOR', 'administrador', 'instructor'] }
      },
      
      // ==================== RUTAS DE APRENDIZ ====================
      { 
        path: 'aprendiz/inicio', 
        name: 'ApprenticeHome', 
        component: () => import('../views/aprendiz/ApprenticeHome.vue'),
        meta: { requiresAuth: true, roles: ['APRENDIZ', 'aprendiz', 'apprentice'] }
      },
      { 
        path: 'aprendiz/registros', 
        name: 'ApprenticeRegistrations', 
        component: () => import('../views/aprendiz/PreRegistration.vue'),
        meta: { requiresAuth: true, roles: ['APRENDIZ', 'aprendiz', 'apprentice'] }
      },
      { 
        path: 'aprendiz/bitacoras', 
        name: 'Logbooks', 
        component: () => import('../views/aprendiz/Logbooks.vue'),
        meta: { requiresAuth: true, roles: ['APRENDIZ', 'aprendiz', 'apprentice'] }
      },
      { 
        path: 'aprendiz/datospersonales', 
        name: 'PersonalData', 
        component: () => import('../views/aprendiz/PersonalData.vue'),
        meta: { requiresAuth: true, roles: ['APRENDIZ', 'aprendiz', 'apprentice'] }
      },
      { 
        path: 'aprendiz/misregistros', 
        name: 'MyRegistrations', 
        component: () => import('../views/aprendiz/MyRegistrations.vue'),
        meta: { requiresAuth: true, roles: ['APRENDIZ', 'aprendiz', 'apprentice'] }
      },
      { 
        path: 'aprendiz/procesoep', 
        name: 'ProductiveStageProcess', 
        component: () => import('../views/aprendiz/record.vue'),
        meta: { requiresAuth: true, roles: ['APRENDIZ', 'aprendiz', 'apprentice'] }
      },
      { 
        path: 'aprendiz/registroep', 
        name: 'ProductiveStageRegistration', 
        component: () => import('../views/aprendiz/PreRegistration.vue'),
        meta: { requiresAuth: true, roles: ['APRENDIZ', 'aprendiz', 'apprentice'] }
      },
      
      // ==================== RUTAS DE ADMIN ====================
      { 
        path: 'admin/empresas', 
        name: 'Companies', 
        component: () => import('../views/admin/Companies.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/instructores', 
        name: 'Instructors', 
        component: () => import('../views/admin/Instructors.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/aprendices/:ficheId?', 
        name: 'Apprentices', 
        component: () => import('../views/admin/Apprentices.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/documentos', 
        name: 'Documents', 
        component: () => import('../views/admin/Documents.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/fichas', 
        name: 'Groups', 
        component: () => import('../views/admin/Groups.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/parametros', 
        name: 'Parameters', 
        component: () => import('../views/admin/Parameters.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/reportes', 
        name: 'Reports', 
        component: () => import('../views/admin/Reports.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/modalidades', 
        name: 'Modalities', 
        component: () => import('../views/admin/Modalities.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/novedadesAdmin', 
        name: 'AdminNews', 
        component: () => import('../views/admin/AdminNews.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/buscar-ficha', 
        name: 'SearchGroup', 
        component: () => import('../views/admin/SearchGroup.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/documentos/:ficha/aprendiz/:aprendizId', 
        name: 'ApprenticeDocumentsDetail', 
        component: () => import('../views/admin/ApprenticeDocumentsDetail.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/logs', 
        name: 'LogsAdmin', 
        component: () => import('../views/admin/logs.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/statistics', 
        name: 'Statistics', 
        component: () => import('../views/admin/Statistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      
      // Admin - Parámetros
      { 
        path: 'admin/alertas', 
        name: 'Alerts', 
        component: () => import('../views/admin/parametros/Alerts.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/almacenamiento', 
        name: 'Storage', 
        component: () => import('../views/admin/parametros/Storage.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/horasintructores', 
        name: 'InstructorHours', 
        component: () => import('../views/admin/parametros/InstructorHours.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/seguridad', 
        name: 'Security', 
        component: () => import('../views/admin/parametros/Security.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/plantillas', 
        name: 'Templates', 
        component: () => import('../views/admin/parametros/Templates.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      
      // Admin - Reportes
      { 
        path: 'admin/horasporinstructor', 
        name: 'HoursByInstructor', 
        component: () => import('../views/admin/reportes/HoursByInstructor.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/reporteporaño', 
        name: 'ReportByYear', 
        component: () => import('../views/admin/reportes/ReportByYear.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/reporteporempresa', 
        name: 'ReportByCompany', 
        component: () => import('../views/admin/reportes/ReportByCompany.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/reportepormodalidad', 
        name: 'ReportByModality', 
        component: () => import('../views/admin/reportes/ReportByModality.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/vistareporteporaño', 
        name: 'ReportByYearView', 
        component: () => import('../views/admin/reportes/ReportByYearView.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/vistareporteporempresa', 
        name: 'ReportByCompanyView', 
        component: () => import('../views/admin/reportes/ReportByCompanyView.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/vistareportepormodalidad', 
        name: 'ReportByModalityView', 
        component: () => import('../views/admin/reportes/ReportByModalityView.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/vistareporteporinstructor', 
        name: 'ReportByInstructorView', 
        component: () => import('../views/admin/reportes/ReportByInstructorView.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      
      // Admin - Estadísticas
      { 
        path: 'admin/AdminStatisctic', 
        name: 'AdminStatistic', 
        component: () => import('../views/admin/Statistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/StatisticActivities', 
        name: 'StatisticActivities', 
        component: () => import('../views/admin/StatisticFolder/ActivitiesStatistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/StatisticFiches', 
        name: 'StatisticFiches', 
        component: () => import('../views/admin/StatisticFolder/FichesStatistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/StatisticPreRegistrations', 
        name: 'StatisticPreRegistrations', 
        component: () => import('../views/admin/StatisticFolder/PreRegistrationsStatistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/StatisticPrograms', 
        name: 'StatisticPrograms', 
        component: () => import('../views/admin/StatisticFolder/ProgramsStatistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/StatisticProjects', 
        name: 'StatisticProjects', 
        component: () => import('../views/admin/StatisticFolder/ProjectsStatistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/StatisticTemporal', 
        name: 'StatisticTemporal', 
        component: () => import('../views/admin/StatisticFolder/TemporalStatistic.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      
      // Admin - Registro
      { 
        path: 'admin/Registration', 
        name: 'Registration', 
        component: () => import('../views/admin/registration-process.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/pre-registrations', 
        name: 'PreRegistrations', 
        component: () => import('../views/admin/registration-process/pre-registrations.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/document-validation', 
        name: 'DocumentValidation', 
        component: () => import('../views/admin/registration-process/document-validation.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      { 
        path: 'admin/registrations', 
        name: 'RegistrationView', 
        component: () => import('../views/admin/registration-process/Registration.vue'),
        meta: { requiresAuth: true, roles: ['ADMINISTRADOR', 'administrador'] }
      },
      
      // ==================== RUTAS DE INSTRUCTOR ====================
      { 
        path: 'instructor/bitacoras', 
        name: 'InstructorLogbooks', 
        component: () => import('../views/instructor/Logbooks.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/bitacorasdetalles', 
        name: 'InstructorLogbooksDetails', 
        component: () => import('../views/instructor/LogbooksDetail.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/historial', 
        name: 'InstructorHistory', 
        component: () => import('../views/instructor/History.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/informepersonal', 
        name: 'PersonalReport', 
        component: () => import('../views/instructor/PersonalReport.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/MyApprentices', 
        name: 'MyApprentices', 
        component: () => import('../views/instructor/MyApprentices.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/AssignedApprentices', 
        name: 'AssignedApprentices', 
        component: () => import('../views/instructor/AssignedApprentices.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/GroupSearch', 
        name: 'GroupSearch', 
        component: () => import('../views/instructor/GroupSearch.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/novedades', 
        name: 'InstructorNews', 
        component: () => import('../views/instructor/News.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/seguimientos', 
        name: 'Followups', 
        component: () => import('../views/instructor/Followups.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      },
      { 
        path: 'instructor/vistahoras', 
        name: 'HoursView', 
        component: () => import('../views/instructor/HoursView.vue'),
        meta: { requiresAuth: true, roles: ['INSTRUCTOR', 'instructor'] }
      }
    ]
  },
  
  // ==================== RUTA 404 - DEBE IR AL FINAL ====================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ==================== NAVIGATION GUARD ====================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('userRole')
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Si no hay token, redirigir al login
    if (!token) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Si la ruta tiene roles específicos, verificar
    if (to.meta.roles && to.meta.roles.length > 0) {
      if (!userRole || !to.meta.roles.includes(userRole)) {
        next({ name: 'Unauthorized' })
        return
      }
    }
    
    next()
  } else {
    next()
  }
})

export default router