import axios from 'axios';

// Función optimizada para obtener el token desde localStorage
function getCurrentToken() {
  try {
    // Buscar en todas las claves posibles del localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      try {
        const parsed = JSON.parse(value);
        // Si encontramos un objeto que tenga token, usarlo
        if (parsed && parsed.token && typeof parsed.token === 'string') {
          return parsed.token;
        }
      } catch (e) {
        // Ignorar errores de parsing
        continue;
      }
    }
    
    return '';
    
  } catch (error) {
    console.error('Error al leer el token desde localStorage:', error);
    return '';
  }
}

export const apiClient = axios.create({
    baseURL: 'https://backend-dekn.onrender.com/api', // Añadir /api si es necesario
    timeout: 120000 // 2 minutos por defecto
});

/**
 * INTERCEPTOR DE REQUEST - Se ejecuta ANTES de cada petición HTTP
 * Propósito: Agregar automáticamente el token de autenticación a todas las requests
 * 
 * ¿Por qué es necesario?
 * - Evita tener que pasar el token manualmente en cada llamada API
 * - Garantiza que siempre se envíe el token más actualizado
 * - Centraliza la lógica de autenticación en un solo lugar
 * 
 * Uso automático: Se ejecuta en TODAS las llamadas (getData, postData, putData, deleteData)
 */
apiClient.interceptors.request.use((config) => {
  const token = getCurrentToken();
  if (token) {
    config.headers['x-token'] = token; // Agrega el header de autenticación
  }
  return config;
});

/**
 * INTERCEPTOR DE RESPONSE - Se ejecuta DESPUÉS de recibir respuesta del servidor
 * Propósito: Manejar errores de autenticación de forma global
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde con 401 (Unauthorized/Token expirado)
    if (error.response?.status === 401) {
      // Limpiar todas las claves de localStorage
      localStorage.clear();
      // Redirigir al login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);