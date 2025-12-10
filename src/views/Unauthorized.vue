<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div class="flex flex-center" style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <q-card class="unauthorized-card">
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="block" size="6rem" color="negative" class="q-mb-md" />
            <div class="text-h3 text-weight-bold q-mb-md">Acceso Denegado</div>
            <div class="text-h6 text-grey-7 q-mb-lg">
              No tienes permisos para acceder a esta página
            </div>
            <div class="text-body1 text-grey-6 q-mb-xl">
              Por favor, contacta al administrador si crees que esto es un error.
            </div>
            <q-btn
              label="Volver al Inicio"
              color="primary"
              size="lg"
              unelevated
              @click="goHome"
              icon="home"
            />
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  const userRole = localStorage.getItem('userRole')
  
  if (userRole === 'ADMINISTRADOR' || userRole === 'administrador') {
    router.push('/app/inicio')
  } else if (userRole === 'INSTRUCTOR' || userRole === 'instructor') {
    router.push('/app/instructor/bitacoras')
  } else if (userRole === 'APRENDIZ' || userRole === 'aprendiz' || userRole === 'apprentice') {
    router.push('/app/aprendiz/inicio')
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.unauthorized-card {
  max-width: 600px;
  width: 90%;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
</style>
