import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)

  function setAuth(newToken, userData) {
    token.value = newToken
    user.value = userData
    
    // Guardar en localStorage en múltiples formatos para compatibilidad
    const authData = {
      token: newToken,
      user: userData
    }
    
    localStorage.setItem('auth', JSON.stringify(authData))
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.clear()
  }

  function loadAuth() {
    try {
      const authData = localStorage.getItem('auth')
      if (authData) {
        const parsed = JSON.parse(authData)
        token.value = parsed.token
        user.value = parsed.user
      }
    } catch (error) {
      console.error('Error al cargar auth desde localStorage:', error)
      clearAuth()
    }
  }

  // Cargar al inicializar
  loadAuth()

  return {
    token,
    user,
    setAuth,
    clearAuth,
    loadAuth
  }
})