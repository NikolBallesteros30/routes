<template>
  <q-page class="statistics-page">
    <div class="content-wrapper">
      <BackButton class="q-mb-lg" />

      <div class="full-width row">
        <div class="col-12">
          <q-card class="shadow-1 hero-card q-mb-xl">
            <q-card-section>
              <PageHeader title="Estadísticas " description="Visualiza métricas y gráficos clave del sistema." />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="container">
        <div class="cards-grid">
          <MenuCard
            v-for="card in statisticsCards"
            :key="card.route"
            :title="card.title"
            :subtitle="card.subtitle"
            :img-src="card.imgSrc"
            :route="card.route"
            :color="card.color"
            :text-color="card.textColor"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>



<script setup>
import { ref } from 'vue'
import BackButton from 'src/components/BackButton.vue'
import PageHeader from 'src/components/PageHeader.vue'
import MenuCard from 'src/components/cards/MenuCard.vue'


import Proyectosimg from 'src/assets/Proyecto_Productivo.jpg'
import Activityimg from 'src/assets/Estadisticas_Generales.jpg'
import FichesImg from 'src/assets/Aprendices.jpg'
import PreRegistroImg from 'src/assets/Preregistro.jpg'
import Programasimg from 'src/assets/Pasantia_ONG.jpg'
import Temporalimg from 'src/assets/Horas_Instructor.jpg'

const statisticsCards = ref([
  {
    title: 'PROYECTOS',
    subtitle: 'Estadísticas de proyectos formativos del sistema',
    imgSrc: Proyectosimg,
    route: { name: 'StatisticProjects' },
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'ACTIVIDADES',
    subtitle: 'Indicadores y análisis de actividades',
    imgSrc: Activityimg,
    route: { name: 'StatisticActivities' },
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'FICHAS',
    subtitle: 'Indicadores y análisis de fichas del sistema',
    imgSrc:FichesImg ,
    route: { name: 'StatisticFiches' },
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'PRE-REGISTROS',
    subtitle: 'Indicadores y análisis de pre-registros del sistema',
    imgSrc: PreRegistroImg,
    route: { name: 'StatisticPreRegistrations' },
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'PROGRAMAS',
    subtitle: 'Indicadores y análisis de programas formativos',
    imgSrc: Programasimg,
    route: { name: 'StatisticPrograms' },
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'TEMPORAL',
    subtitle: 'Indicadores y análisis temporales de registros',
    imgSrc: Temporalimg,
    route: { name: 'StatisticTemporal' },
    color: 'var(--color-primary)',
    textColor: 'white'
  }
])
</script>

<style lang="sass" scoped>
.statistics-page
  background: #f5f7fb
  min-height: 100vh
  display: flex
  justify-content: center

.content-wrapper
  width: 75%
  max-width: 1400px
  padding: 20px 0

.hero-card
  border-radius: 20px
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%)

.container
  display: flex
  justify-content: center
  align-items: flex-start
  margin-top: 20px

.cards-grid
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 24px
  width: 100%
  padding: 0
  justify-items: stretch
  align-items: stretch

@media (max-width: 1200px)
  .cards-grid
    grid-template-columns: repeat(2, 1fr)
    gap: 20px

@media (max-width: 768px)
  .content-wrapper
    width: 95%
  
  .cards-grid
    grid-template-columns: 1fr
    gap: 16px

:deep(.menu-card)
  height: 100%
  min-height: 200px
  transition: transform 0.2s ease, box-shadow 0.2s ease

:deep(.menu-card):hover
  transform: translateY(-2px)
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
</style>