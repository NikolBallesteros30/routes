<template>
  <q-page class="q-pa-md search-groups-page">
    <BackButton class="q-mb-lg" />

    <div class="full-width row">
      <div class="col-12">
        <q-card class="shadow-1 hero-card q-mb-xl">
          <q-card-section>
            <PageHeader title="Buscar Ficha" description="Busca fichas por código, instructor o estado." />
          </q-card-section>
        </q-card>

        <div class="container">
          <div class="row justify-center">
            <div class="col-12 col-md-8">
              <q-select
                v-model="selectedFiche"
                :options="filteredFiches"
                use-input
                input-debounce="300"
                placeholder="Número de ficha"
                outlined
                class="search-select"
                @filter="handleFilterFiches"
                @update:model-value="handleSelectFiche"
              >
                <template #prepend>
                  <q-icon name="search" color="grey-6" size="20px" />
                </template>

                <template #append>
                  <q-icon name="expand_more" color="grey-6" />
                </template>

                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <div v-if="!selectedFiche && showSuggestions && suggestedFiches.length > 0" class="suggestions-container q-mt-md">
                <div
                  v-for="fiche in suggestedFiches"
                  :key="fiche"
                  class="fiche-item"
                  @click="selectFiche(fiche)"
                >
                  Ficha {{ fiche }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from 'src/components/BackButton.vue'
import PageHeader from 'src/components/PageHeader.vue'

const router = useRouter()

// State
const selectedFiche = ref(null)
const showSuggestions = ref(false)
const allFiches = ref([
  '2926076',
  '2926065',
  '2926034',
  '2589667'
])
const filteredFiches = ref([...allFiches.value])

// Suggested fiches
const suggestedFiches = computed(() => allFiches.value)

// Event Handlers
function handleFilterFiches(val, update) {
  if (val === '') {
    update(() => {
      filteredFiches.value = [...allFiches.value]
      showSuggestions.value = false
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    const filtered = []
    let index = 0
    while (index < allFiches.value.length) {
      const fiche = allFiches.value[index]
      if (fiche && fiche.toLowerCase().includes(needle)) {
        filtered.push(fiche)
      }
      index++
    }
    filteredFiches.value = filtered
    showSuggestions.value = filteredFiches.value.length > 0
  })
}

function handleSelectFiche(fiche) {
  if (fiche) {
    router.push(`/app/admin/documentos/${fiche}`)
  }
}

function selectFiche(fiche) {
  selectedFiche.value = fiche
  handleSelectFiche(fiche)
}
</script>

<style lang="sass" scoped>
.search-groups-page
  background: #f5f7fb
  min-height: 100vh

.hero-card
  border-radius: 20px
  background: linear-gradient(135deg, #ffffff 0%, #f2fbf7 100%)

.container
  max-width: 800px
  margin: 0 auto

.search-select
  width: 100%

.suggestions-container
  background: white
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  padding: 10px
  max-height: 300px
  overflow-y: auto

.fiche-item
  padding: 12px 16px
  cursor: pointer
  border-radius: 4px
  transition: background-color 0.2s ease

.fiche-item:hover
  background-color: #f5f5f5
</style>
