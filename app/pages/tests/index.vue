<template>
  <div v-if="isLoadingTests">
    <Loader name='des tests' />
  </div>
  <div v-else-if="totalTests" class="flex-1 w-full bg-background overflow-x-hidden p-2.5 sm:p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant/30 pb-3">
      <div class="flex items-center justify-between w-full sm:w-auto">
        <div>
          <h2 class="font-h2 text-lg sm:text-xl md:text-2xl font-bold text-primary">Gestion des Tests</h2>
          <p class="font-body-sm text-[11px] sm:text-xs md:text-sm text-on-surface-variant">Créez, modifiez et téléchargez les épreuves scolaires.</p>
        </div>
        
        <button 
          @click="showMobileSearch = !showMobileSearch" 
          class="sm:hidden p-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface-variant transition-colors"
        >
          <Icon :name="showMobileSearch ? 'close' : 'search'" size="1.15rem" />
        </button>
      </div>
      
      <div 
        class="w-full sm:w-64 transition-all duration-300"
        :class="[showMobileSearch ? 'block' : 'hidden sm:block']"
      >
        <div class="relative">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface-variant/60">
            <Icon name="search" size="1.1rem" />
          </div>
          <input 
            v-model="searchTest" 
            class="w-full pl-9 pr-4 py-2 bg-white border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/40" 
            placeholder="Rechercher un test..." 
            type="text"
          >
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div class="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
        <select v-model="classe" class="w-full sm:w-auto px-2.5 py-2 bg-white border border-outline-variant rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/10 text-on-surface focus:outline-none cursor-pointer">
          <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
        </select>
        <select v-model="monthSelected" class="w-full sm:w-auto px-2.5 py-2 bg-white border border-outline-variant rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/10 text-on-surface focus:outline-none cursor-pointer">
          <option v-for="(month, index) in months" :key="index" :value="month">{{ month.charAt(0).toUpperCase() + month.slice(1) }}</option>
        </select>
      </div>
      
      <button 
        @click="openCreateModal"
        class="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 shadow-sm transition-all active:scale-98 text-xs font-semibold w-full sm:w-auto"
      >
        <Icon name="add" size="1.1rem" />
        Ajouter un test
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
      <div class="glass-card p-3 flex items-center gap-3 ultra-shadow transition-all hover:border-primary">
        <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon name="description" size="1.15rem" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total des Tests</p>
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-on-surface mt-0.5">{{ glassCard.total }}</h3>
        </div>
      </div>

      <div class="glass-card p-3 flex items-center gap-3 ultra-shadow transition-all hover:border-primary">
        <div class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
          <Icon name="pending" size="1.15rem" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Test d'Évaluation</p>
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-on-surface mt-0.5">{{ glassCard.evaluation }}</h3>
        </div>
      </div>

      <div class="glass-card p-3 flex items-center gap-3 ultra-shadow transition-all hover:border-primary">
        <div class="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
          <Icon name="history_edu" size="1.15rem" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Test de Sunday School</p>
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-on-surface mt-0.5">{{ glassCard.sunday_school }}</h3>
        </div>
      </div>
    </div>

    <div class="glass-card overflow-hidden ultra-shadow w-full">
      <div class="overflow-x-auto w-full custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[650px] table-auto">
          <thead>
            <tr class="bg-surface-container-low/60 text-on-surface-variant border-b border-outline-variant/40">
              <th class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Nom du Test</th>
              <th class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Classe</th>
              <th class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Créé par</th>
              <th class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Date</th>
              <th class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 text-right w-36">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30 text-xs sm:text-sm">
            <tr v-for="test in filteredAndPaginatedTests" :key="test.id" class="hover:bg-surface-container-low/30 transition-colors group">
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2.5">
                  <div :class="test.typeTest === 'EVALUATION' ? 'p-1.5 bg-primary/5 rounded-lg border border-primary/10 shrink-0' : 'p-1.5 bg-secondary/5 rounded-lg border border-secondary/10 shrink-0'">
                    <Icon :name="test?.typeTest === 'EVALUATION' ? 'picture_as_pdf' : 'assignment'" size="1.1rem" :color="test?.typeTest === 'EVALUATION' ? 'text-primary' : 'text-secondary'" />
                  </div>
                  <div class="truncate max-w-[180px]">
                    <span class="block text-xs sm:text-sm font-semibold text-on-surface truncate">{{ test.titleTest }}</span>
                    <span :class="[
                      'inline-block text-[8px] font-bold px-1.5 py-0.2 mt-0.5 rounded uppercase border',
                      test.typeTest === 'EVALUATION' ? 'bg-primary/5 text-primary border-primary/10' : 'bg-secondary/5 text-secondary border-secondary/10'
                    ]">{{ test.typeTest }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2.5 text-xs font-medium text-on-surface-variant">{{ test.classe }}</td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-full bg-surface-container text-[9px] font-bold uppercase text-on-surface border border-outline-variant flex items-center justify-center shrink-0">
                    {{ getTeacherById(test.authorId)?.first_name?.charAt(0) || '?' }}
                  </div>
                  <span class="text-xs font-medium text-on-surface truncate max-w-[100px]">
                    {{ getTeacherById(test.authorId) ? (getTeacherById(test.authorId)?.first_name + ' ' + getTeacherById(test.authorId)?.last_name?.substring(0,1) + '.') : '--' }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2.5 text-xs font-mono text-on-surface-variant tracking-wide">{{ formatDate(test.created_at) }}</td>
              <td class="px-4 py-2.5 text-right">
                <div class="flex items-center justify-end gap-px sm:gap-0.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openViewModal(test)" class="p-1 text-on-surface-variant hover:text-primary rounded transition-colors" title="Voir"><Icon size="1.1rem" name="visibility" /></button>
                  <button @click="openEditModal(test)" class="p-1 text-on-surface-variant hover:text-secondary rounded transition-colors" title="Éditer"><Icon size="1.1rem" name="edit" /></button>
                  <button class="p-1 text-on-surface-variant hover:text-tertiary rounded transition-colors" title="Télécharger"><Icon size="1.1rem" name="download" /></button>
                  <button @click="openDeleteModal(test)" class="p-1 text-error hover:bg-error/5 rounded transition-colors" title="Supprimer"><Icon size="1.1rem" name="delete" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredAndPaginatedTests.length === 0">
              <td colspan="5" class="text-center py-6 text-on-surface-variant italic text-xs">Aucun test trouvé pour cette configuration.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalFilteredCount > 0" class="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-2.5 bg-white border-t border-outline-variant/30">
        <span class="text-[11px] text-on-surface-variant font-medium order-2 sm:order-1">
          {{ Math.min(start + 1, totalFilteredCount) }}-{{ Math.min(end, totalFilteredCount) }} de {{ totalFilteredCount }}
        </span>
        <div class="flex gap-1 items-center order-1 sm:order-2">
          <button 
            class="p-1 border border-outline-variant/60 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <Icon name="chevron_left" size="1.1rem" />
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            :class="['px-2 py-0.5 rounded-md text-[11px] font-bold transition-all', currentPage === page ? 'bg-primary text-white shadow-sm' : 'bg-transparent border border-outline-variant/60 text-on-surface hover:bg-surface-container']" 
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button 
            class="p-1 border border-outline-variant/60 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <Icon name="chevron_right" size="1.1rem" />
          </button>
        </div>
      </div>
    </div>

    <Modal v-model="activeTestModal" :title="isEditMode ? 'Modifier l\'Épreuve' : 'Créer un nouveau Test'" size="md">
      <form @submit.prevent="handleSubmitForm" id="testForm" class="space-y-4 py-1">
        <div>
          <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Titre de l'épreuve <span class="text-error">*</span></label>
          <input 
            v-model="titleTest" 
            class="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium" 
            placeholder="Ex: Évaluation Mensuelle de Doctrine" type="text" required 
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Type de Test</label>
            <select v-model="typeTest" class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium">
              <option value="EVALUATION">EVALUATION</option>
              <option value="SUNDAY_SCHOOL">SUNDAY_SCHOOL</option>
              <option value="CONCOURS">CONCOURS</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Classe</label>
            <select v-model="classe" class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium">
              <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5"> Lien Drive du test (URL)</label>
          <textarea 
            v-model="sujetTest" 
            rows="3"
            class="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium"
            placeholder="Ex: https://drive.google.com/..."
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5"> Lien Drive du corrigé (URL)</label>
          <textarea 
            v-model="correctionTest" 
            rows="2"
            class="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium"
            placeholder="Ex: https://drive.google.com/..."
          ></textarea>
        </div>
      </form>

      <template #footer>
        <button type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors text-sm font-medium" @click="activeTestModal = false">
          Annuler
        </button>
        <button type="submit" form="testForm" class="px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow-sm text-sm hover:opacity-90 transition-opacity disabled:bg-primary/10" :disabled="isCreateLoading">
          {{ isEditMode ? 'Sauvegarder' : 'Créer l\'épreuve' }}
        </button>
      </template>
    </Modal>

    <Modal v-model="showViewModal" title="Détails de l'Épreuve" size="lg">
      <div v-if="selectedTest" class="space-y-4 py-1 text-sm text-on-surface">
        <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 space-y-2">
          <h4 class="text-base font-bold text-primary">{{ selectedTest.titleTest }}</h4>
          <div class="flex flex-wrap gap-4 text-xs font-medium text-on-surface-variant">
            <span>Classe : <b class="text-on-surface">{{ selectedTest.classe }}</b></span>
            <span>Type : <b class="text-on-surface">{{ selectedTest.typeTest }}</b></span>
            <span>Date : <b class="text-on-surface">{{ formatDate(selectedTest.created_at) }}</b></span>
          </div>
        </div>

        <div v-if="selectedTest.sujetTest" class="space-y-1">
          <span class="block text-xs font-bold uppercase text-on-surface-variant tracking-wide">Énoncé / Sujet :</span>
          <div class="bg-white p-3 border border-outline-variant rounded-lg font-mono text-xs whitespace-pre-line max-h-40 overflow-y-auto custom-scrollbar">
            {{ selectedTest.sujetTest }}
          </div>
        </div>

        <div v-if="selectedTest.correctionTest" class="space-y-1">
          <span class="block text-xs font-bold uppercase text-on-surface-variant tracking-wide">Corrigé :</span>
          <div class="bg-white p-3 border border-outline-variant rounded-lg font-mono text-xs whitespace-pre-line max-h-40 overflow-y-auto custom-scrollbar">
            {{ selectedTest.correctionTest }}
          </div>
        </div>
      </div>

      <template #footer>
        <button type="button" class="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold shadow-sm text-sm hover:opacity-90 transition-opacity w-full sm:w-auto" @click="showViewModal = false">
          Fermer
        </button>
      </template>
    </Modal>

    <Modal v-model="showDeleteModal" title="Confirmer la suppression" size="sm">
      <div v-if="selectedTest" class="space-y-2 py-1 text-center sm:text-left">
        <p class="text-sm font-medium text-on-surface">
          Êtes-vous sûr de vouloir supprimer définitivement l'épreuve <span class="font-bold text-error">"{{ selectedTest.titleTest }}"</span> ?
        </p>
        <p class="text-xs text-on-surface-variant">Cette action est irréversible et retirera le test du catalogue.</p>
      </div>

      <template #footer>
        <button type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors text-sm font-medium" @click="showDeleteModal = false">
          Annuler
        </button>
        <button type="button" class="px-5 py-2 bg-error text-white rounded-lg font-semibold shadow-sm text-sm hover:opacity-90 transition-opacity" @click="confirmDelete" :disabled="isLoadingTests">
          Supprimer
        </button>
      </template>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { computed, onMounted, ref, watch } from 'vue'
import { useTeacher } from '~/composables/useTeacher'
import { useTest } from '~/composables/useTest'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import { classes } from '~/stores/child'
import type { ClasseType } from '~/types/classe'
import type { Month } from '~/types/index'
import type { Test, TypeTest } from '~/types/test'

definePageMeta({
  layout: 'dashboard',
})

// Configuration recherche mobile
const showMobileSearch = ref(false)

// Configuration des composables et stores
const toast = useToast()
const authStore = useAuthStore()
const { totalTests, getTestbyType, createTest, updateTest, deleteTest, fetchAllTests, isTestLoading: isLoadingTests } = useTest()
const { getTeacherById, fetchAllTeachers } = useTeacher()

// Contrôleurs d'états pour les ouvertures de fenêtres modales
const activeTestModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const isCreateLoading=ref(false)

// Éléments de formulaire et cibles réactives
const selectedTest = ref<Test | null>(null)
const titleTest = ref('')
const typeTest = ref<TypeTest>('EVALUATION')
const classe = ref<ClasseType>('JuniorA')
const searchTest = ref('')
const sujetTest = ref('')
const correctionTest = ref('')

// États de navigation/pagination
const currentPage = ref(1)
const itemsPerPage = 3
const start = computed(() => (currentPage.value - 1) * itemsPerPage)
const end = computed(() => currentPage.value * itemsPerPage)

const child_classes = ref(classes)
const months = ref<Month[]>([
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
])
const monthSelected = ref<Month>('janvier')

// Téléchargement synchrone initial des bases de données
onMounted(async () => {
  await Promise.all([
    fetchAllTeachers(),
    fetchAllTests()
  ])
  authStore.initializeFromCookies()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '--'
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}

// Réinitialisation automatique de l'index de pagination lors de recherches
watch([classe, monthSelected, searchTest], () => {
  currentPage.value = 1
})

// --- MOTEUR DES PROPRIETES CALCULEES (FILTRAGES COUPLÉS) ---
const testTotal = computed(() => {
  return totalTests.value(classe.value, monthSelected.value) || []
})

const searchedTests = computed(() => {
  if (!searchTest.value.trim()) return testTotal.value
  const query = searchTest.value.toLowerCase().trim()
  return testTotal.value.filter((t: Test) => t.titleTest.toLowerCase().includes(query))
})

const filteredAndPaginatedTests = computed(() => {
  return searchedTests.value.slice(start.value, end.value)
})

const totalFilteredCount = computed(() => searchedTests.value.length)
const totalPages = computed(() => Math.ceil(totalFilteredCount.value / itemsPerPage) || 1)

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// --- CONTRÔLEURS ET MANAGEMENT DES EVENEMENTS ---
const openCreateModal = () => {
  isEditMode.value = false
  selectedTest.value = null
  titleTest.value = ''
  typeTest.value = 'EVALUATION'
  sujetTest.value = ''
  correctionTest.value = ''
  activeTestModal.value = true
}

const openEditModal = (test: Test) => {
  isEditMode.value = true
  selectedTest.value = test
  titleTest.value = test.titleTest
  typeTest.value = test.typeTest
  classe.value = test.classe
  sujetTest.value = test.sujetTest || ''
  correctionTest.value = test.correctionTest || ''
  activeTestModal.value = true
}

const openViewModal = (test: Test) => {
  selectedTest.value = test
  showViewModal.value = true
}

const openDeleteModal = (test: Test) => {
  selectedTest.value = test
  showDeleteModal.value = true
}

// Traitement unifié d'écriture (POST / PUT)
const handleSubmitForm = async () => {
  if (!titleTest.value.trim()) {
    toast.warning('Donnée manquante', 'Le titre de l\'épreuve ne peut pas être vide.')
    return
  }
  else if(!sujetTest.value.trim().startsWith("https://drive.google.com") || !correctionTest.value.trim().startsWith("https://drive.google.com")){
    toast.warning("Copié le bon lien drive du drive et de son corrigé.")
    return
  }


  try {
    if (isEditMode.value && selectedTest.value) {
      // 📝 Mode Modification (PUT)
      isCreateLoading.value=true
      await updateTest(selectedTest.value.id, {
        titleTest: titleTest.value,
        classe: classe.value,
        typeTest: typeTest.value,
        sujetTest: sujetTest.value,
        correctionTest: correctionTest.value
      })
      isCreateLoading.value=false
      toast.success('Test modifié', `L'épreuve "${titleTest.value}" a été actualisée.`)
    } else {
      // ➕ Mode Création (POST)
      isCreateLoading.value=true
      await createTest({
        titleTest: titleTest.value,
        classe: classe.value,
        typeTest: typeTest.value,
        sujetTest: sujetTest.value,
        correctionTest: correctionTest.value,
        authorId: authStore.user?.id || ""
      })
      isCreateLoading.value=false
      toast.success('Test créé', `Le nouveau test "${titleTest.value}" a bien été ajouté au catalogue.`)
    }
    activeTestModal.value = false
  } catch (err) {
    toast.error('Erreur opération', 'La synchronisation avec le serveur a échoué.')
  }
}

// Validation finale de suppression (DELETE)
const confirmDelete = async () => {
  if (!selectedTest.value) return
  const title = selectedTest.value.titleTest
  try {
    await deleteTest(selectedTest.value.id)
    toast.success('Test supprimé', `L'épreuve "${title}" a bien été retirée.`)
    showDeleteModal.value = false
    selectedTest.value = null
  } catch (err) {
    toast.error('Échec de la suppression', 'Impossible de retirer cette épreuve.')
  }
}

// Statistiques KPI Cards
const getCount = computed(() => {
  return (liste: Test[]) => (liste?.length || 0).toString().padStart(2, '0')
})

const glassCard = computed(() => {
  const currentTestsArray = testTotal.value
  return {
    total: getCount.value(currentTestsArray),
    sunday_school: getCount.value(getTestbyType.value(currentTestsArray, 'SUNDAY_SCHOOL')),
    evaluation: getCount.value(getTestbyType.value(currentTestsArray, 'EVALUATION')),
    concours: getCount.value(getTestbyType.value(currentTestsArray, 'CONCOURS')),
  }
})
</script>

<style scoped>
.ultra-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.glass-card { background: #FFFFFF; border: 1px solid #E8E4DE; border-radius: 16px; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E4DE; border-radius: 10px; }
</style>