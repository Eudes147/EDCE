<template>
  <header class="flex justify-between items-center w-full px-margin-desktop py-sm h-16 bg-background border-b border-outline-variant sticky top-0 z-20">
    <div class="flex items-center gap-4">
      <h2 class="font-h3 text-h3 text-on-surface">Gestion des Tests</h2>
    </div>
    <div class="flex items-center gap-sm">
      <div class="relative group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon color="text-outline" name="search" />
        </div>
        <input 
          v-model="searchTest" 
          class="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-64 transition-all" 
          placeholder="Rechercher un test..." 
          type="text"
        >
      </div>
      <button class="p-2 rounded-full hover:bg-surface-container transition-colors relative">
        <Icon color="text-on-surface-variant" name="notifications" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
      </button>
      <div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant"></div>
    </div>
  </header>

  <div class="p-margin-desktop space-y-lg">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-md">
      <div class="flex flex-wrap gap-sm">
        <select v-model="classe" class="px-4 py-2 bg-white border border-outline-variant rounded-lg text-body-sm font-label-md focus:ring-primary focus:border-primary text-doomu-text">
          <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
        </select>
        <select v-model="monthSelected" class="px-4 py-2 bg-white border border-outline-variant rounded-lg text-body-sm font-label-md focus:ring-primary focus:border-primary text-doomu-text">
          <option v-for="(month, index) in months" :key="index" :value="month">{{ month.charAt(0).toUpperCase() + month.slice(1) }}</option>
        </select>
      </div>
      <button 
        @click="openCreateModal"
        class="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-white rounded-lg hover:shadow-lg transition-all active:scale-95 font-label-md"
      >
        <Icon name="add" />
        Ajouter test
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
        <div class="flex items-center justify-between mb-sm">
          <span class="p-2 bg-primary/10 rounded-lg"><Icon color="text-primary" name="description" /></span>
        </div>
        <p class="text-label-sm text-on-surface-variant">Total des Tests</p>
        <h3 class="text-h3 font-h3 text-on-surface">{{ glassCard.total }}</h3>
      </div>
      <div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
        <div class="flex items-center justify-between mb-sm">
          <span class="p-2 bg-secondary-container/10 rounded-lg"><Icon color="text-secondary-container" name="pending" /></span>
        </div>
        <p class="text-label-sm text-on-surface-variant">Test d'Evaluation</p>
        <h3 class="text-h3 font-h3 text-on-surface">{{ glassCard.evaluation }}</h3>
      </div>
      <div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
        <div class="flex items-center justify-between mb-sm">
          <span class="p-2 bg-tertiary-container/10 rounded-lg"><Icon color="text-tertiary-container" name="history_edu" /></span>
        </div>
        <p class="text-label-sm text-on-surface-variant">Test de Sunday School</p>
        <h3 class="text-h3 font-h3 text-on-surface">{{ glassCard.sunday_school }}</h3>
      </div>
    </div>

    <div class="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
              <th class="px-md py-4 font-label-md">Nom du Test</th>
              <th class="px-md py-4 font-label-md">Classe</th>
              <th class="px-md py-4 font-label-md">Créé par</th>
              <th class="px-md py-4 font-label-md">Date</th>
              <th class="px-md py-4 font-label-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant">
            <tr v-for="test in filteredAndPaginatedTests" :key="test.id" class="hover:bg-surface-container-lowest transition-colors group">
              <td class="px-md py-4">
                <div class="flex items-center gap-3">
                  <div :class="test.typeTest === 'EVALUATION' ? 'p-2 bg-primary/5 rounded border border-primary/10' : 'p-2 bg-secondary-container/5 rounded border border-secondary-container/10'">
                    <Icon :color="test?.typeTest === 'EVALUATION' ? 'text-primary' : 'text-secondary-container'" :name="test?.typeTest === 'EVALUATION' ? 'picture_as_pdf' : 'assignment'" />
                  </div>
                  <div>
                    <span class="block font-label-md text-on-surface">{{ test.titleTest }}</span>
                    <span :class="test.typeTest === 'EVALUATION' ? 'text-label-sm text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full' : 'text-label-sm text-secondary-container px-2 py-0.5 bg-secondary-container/10 rounded-full'">{{ test.typeTest }}</span>
                  </div>
                </div>
              </td>
              <td class="px-md py-4 text-body-sm text-on-surface-variant">{{ test.classe }}</td>
              <td class="px-md py-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold uppercase text-slate-700">
                    {{ getTeacherById(test.authorId)?.first_name?.charAt(0) || '?' }}
                  </div>
                  <span class="text-body-sm font-label-md">
                    {{ getTeacherById(test.authorId) ? (getTeacherById(test.authorId)?.first_name + ' ' + getTeacherById(test.authorId)?.last_name) : '-- --' }}
                  </span>
                </div>
              </td>
              <td class="px-md py-4 text-body-sm text-on-surface-variant">{{ formatDate(test.created_at) }}</td>
              <td class="px-md py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openViewModal(test)" class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Voir"><Icon color="text-on-surface-variant" name="visibility" /></button>
                  <button @click="openEditModal(test)" class="p-2 text-on-surface-variant hover:text-secondary-container hover:bg-secondary-container/10 rounded-lg transition-colors" title="Éditer"><Icon color="text-on-surface-variant" name="edit" /></button>
                  <button class="p-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-lg transition-colors" title="Télécharger"><Icon color="text-on-surface-variant" name="download" /></button>
                  <button @click="openDeleteModal(test)" class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Supprimer"><Icon color="text-on-surface-variant" name="delete" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredAndPaginatedTests.length === 0">
              <td colspan="5" class="text-center py-8 text-on-surface-variant text-body-sm">Aucun test trouvé pour cette configuration.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalFilteredCount > 0" class="flex items-center justify-between px-md py-4 bg-surface-container-lowest border-t border-outline-variant">
        <span class="text-body-sm text-on-surface-variant">
          Affichage {{ Math.min(start + 1, totalFilteredCount) }}-{{ Math.min(end, totalFilteredCount) }} de {{ totalFilteredCount }} tests
        </span>
        <div class="flex gap-xs items-center">
          <button 
            class="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <Icon name="chevron_left" color="text-on-surface-variant" />
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            :class="['px-3 py-1 rounded font-label-md transition-colors', currentPage === page ? 'bg-primary text-white shadow-sm' : 'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container']" 
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button 
            class="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <Icon name="chevron_right" color="text-on-surface-variant" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <Modal v-model="activeTestModal" :title="isEditMode ? 'Modifier l\'épreuve' : 'Ajouter un nouveau test'" size="md">
    <form @submit.prevent="handleSubmitForm" id="testForm" class="space-y-4">
      <div class="space-y-xs">
        <label class="block font-label-md text-on-surface">Titre du Test</label>
        <input v-model="titleTest" required class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-doomu-text outline-none" placeholder="ex: Evaluation Mai 2026" type="text">
      </div>

      <div class="space-y-xs">
        <label class="block font-label-md text-on-surface">Classe concernée</label>
        <div class="flex flex-wrap gap-2 p-2 min-h-[44px] bg-surface-container-low border border-outline-variant rounded-lg cursor-pointer">
          <select v-model="classe" class="w-full bg-transparent border-none focus:ring-0 text-body-sm p-1 outline-none text-doomu-text">
            <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
          </select>
        </div>
      </div>

      <div class="space-y-xs">
        <label class="block font-label-md text-on-surface">Type de test</label>
        <div class="grid grid-cols-3 gap-1">
          <label class="flex items-center gap-3 p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
            <input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="EVALUATION">
            <span class="font-label-md text-doomu-text">Évaluation</span>
          </label>
          <label class="flex items-center gap-1 p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
            <input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="SUNDAY_SCHOOL">
            <span class="font-label-md text-doomu-text">Sun_School</span>
          </label>
          <label class="flex items-center gap-3 p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
            <input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="CONCOURS">
            <span class="font-label-md text-doomu-text">Concours</span>
          </label>
        </div>
      </div>
      <div class="space-y-xs">
        <div class="grid grid-cols-2 gap-sm">
          <label class="block font-label-md text-on-surface">Lien du Test (drive)
            <input v-model="sujetTest" required class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-doomu-text outline-none" placeholder="ex: Evaluation Mai 2026" type="text">
          </label>
          <label class="block font-label-md text-on-surface">Lien de la Correction
            <input v-model="correctionTest" required class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-doomu-text outline-none" placeholder="ex: Evaluation Mai 2026" type="text">
          </label>
        </div>
        
      </div>
    </form>
    <template #footer>
      <button type="button" class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg" @click="activeTestModal = false">Annuler</button>
      <button type="submit" form="testForm" :disabled="isLoadingTests" class="px-6 py-2 bg-primary text-white rounded-lg shadow-sm">
        {{ isLoadingTests ? 'Traitement...' : isEditMode ? 'Enregistrer' : 'Créer le test' }}
      </button>
    </template>
  </Modal>

  <Modal v-model="showViewModal" title="Détails du Test" size="md">
    <div v-if="selectedTest" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Nom de l'épreuve</p>
          <p class="font-semibold text-doomu-text text-base">{{ selectedTest.titleTest }}</p>
        </div>
        <div>
          <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Type</p>
          <p class="font-medium text-doomu-text">{{ selectedTest.typeTest }}</p>
        </div>
        <div>
          <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Classe</p>
          <p class="font-medium text-doomu-text">{{ selectedTest.classe }}</p>
        </div>
        <div>
          <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Date d'édition</p>
          <p class="font-medium text-doomu-text">{{ formatDate(selectedTest.created_at) }}</p>
        </div>
        <div class="col-span-2 border-t border-outline-variant/30 pt-3">
          <p class="text-xs text-doomu-text-muted uppercase tracking-wider">Auteur pédagogique</p>
          <p class="font-medium text-primary">
            {{ getTeacherById(selectedTest.authorId) ? (getTeacherById(selectedTest.authorId)?.first_name + ' ' + getTeacherById(selectedTest.authorId)?.last_name) : 'Non renseigné' }}
          </p>
        </div>
      </div>
    </div>
    <template #footer>
      <button class="px-4 py-2 bg-doomu-bg hover:bg-doomu-border rounded-lg text-doomu-text transition-colors w-full" @click="showViewModal = false">Fermer</button>
    </template>
  </Modal>

  <Modal v-model="showDeleteModal" title="Supprimer l'épreuve" size="sm">
    <div v-if="selectedTest" class="space-y-3 text-center py-2">
      <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
        <Icon name="delete" class="text-[24px]" />
      </div>
      <p class="text-body font-medium text-doomu-text">Supprimer définitivement ce test ? Cette action détruira toutes les notes des élèves liées à cette épreuve.</p>
      <p class="text-sm font-bold text-error bg-error/5 p-2 rounded border border-error/20">
        {{ selectedTest.titleTest }} ({{ selectedTest.classe }})
      </p>
    </div>
    <template #footer>
      <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text w-full hover:bg-doomu-bg" @click="showDeleteModal = false">Annuler</button>
      <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:bg-error-dark" @click="confirmDelete" :disabled="isLoadingTests">Supprimer</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { computed, ref, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { classes } from '~/stores/child'
import { useTest } from '~/composables/useTest'
import { useTeacher } from '~/composables/useTeacher'
import { useToast } from '~/composables/useToast'
import type { Month } from '~/types/index'
import type { ClasseType } from '~/types/classe'
import type { TypeTest, Test } from '~/types/test'

definePageMeta({
  layout: 'dashboard',
})

// Configuration des composables et stores
const toast = useToast()
const authStore = useAuthStore()
const { totalTests, getTestbyType, createTest, updateTest, deleteTest, fetchAllTests, isLoading: isLoadingTests } = useTest()
const { getTeacherById, fetchAllTeachers } = useTeacher()

// Contrôleurs d'états pour les ouvertures de fenêtres modales
const activeTestModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)

// Éléments de formulaire et cibles réactives
const selectedTest = ref<Test | null>(null)
const titleTest = ref('')
const typeTest = ref<TypeTest>('EVALUATION')
const classe = ref<ClasseType>('JuniorA')
const searchTest = ref('')
const sujetTest=ref('')
const correctionTest=ref('')

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
  activeTestModal.value = true
}

const openEditModal = (test: Test) => {
  isEditMode.value = true
  selectedTest.value = test
  titleTest.value = test.titleTest
  typeTest.value = test.typeTest
  classe.value = test.classe
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

  try {
    if (isEditMode.value && selectedTest.value) {
      // 📝 Mode Modification (PUT)
      await updateTest(selectedTest.value.id, {
        titleTest: titleTest.value,
        classe: classe.value,
        typeTest: typeTest.value
      })
      toast.success('Test modifié', `L'épreuve "${titleTest.value}" a été actualisée.`)
    } else {
      // ➕ Mode Création (POST)
      await createTest({
        titleTest: titleTest.value,
        classe: classe.value,
        typeTest: typeTest.value,
        sujetTest: sujetTest.value,
        correctionTest: correctionTest.value,
        authorId: authStore.user?.id || ""
      })
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
    toast.success('Test supprimé', `L'épreuve "${title}" a bien été retirée.`);
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