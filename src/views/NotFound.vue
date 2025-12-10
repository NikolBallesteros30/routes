<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div class="notfound-container">
        <div class="content-wrapper">
          <q-card class="notfound-card">
            <q-card-section class="text-center q-pa-xl">
              <div class="error-content q-mb-lg">
                <div class="error-number">404</div>
                <div class="error-line"></div>
              </div>
              
              <div class="error-title q-mb-sm">Página No Encontrada</div>
              
              <div class="error-subtitle q-mb-xl">
                La página que intentas visitar no existe o ha sido movida a otra ubicación.
              </div>
              
              <div class="actions-container">
                <q-btn
                  label="Volver al Inicio"
                  unelevated
                  no-caps
                  @click="goHome"
                  icon="home"
                  class="btn-primary"
                />
                <q-btn
                  label="Regresar"
                  flat
                  no-caps
                  @click="goBack"
                  icon="arrow_back"
                  class="btn-secondary"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
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

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.notfound-container {
  min-height: 100vh;
  background: #f5f7fb;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
}

.notfound-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecef;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-number {
  font-size: 7rem;
  font-weight: 700;
  color: #39a900;
  letter-spacing: -0.03em;
  line-height: 1;
}

.error-line {
  width: 80px;
  height: 3px;
  background: #39a900;
  border-radius: 2px;
}

.error-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: -0.01em;
}

.error-subtitle {
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
  max-width: 450px;
  margin: 0 auto;
}

.actions-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #39a900;
  color: white;
  padding: 12px 36px;
  font-weight: 600;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #2d8700;
  box-shadow: 0 4px 12px rgba(57, 169, 0, 0.25);
}

.btn-secondary {
  color: #6c757d;
  padding: 12px 36px;
  font-weight: 600;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f8f9fa;
  color: #39a900;
}

/* Responsive */
@media (max-width: 768px) {
  .error-number {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-subtitle {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .error-number {
    font-size: 5rem;
  }
  
  .error-line {
    width: 60px;
  }
  
  .error-title {
    font-size: 1.3rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 11px 28px;
    font-size: 0.9rem;
    width: 100%;
  }
  
  .actions-container {
    flex-direction: column;
    width: 100%;
  }
}
</style>








