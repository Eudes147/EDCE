<template>
  <header class="flex justify-between items-center w-full px-margin-desktop py-sm h-16 bg-background border-b border-outline-variant sticky top-0 z-20">
    <div class="flex items-center gap-4">
      <h2 class="font-h3 text-h3 text-on-surface font-bold">Gestion des Tests</h2>
    </div>
    <div class="flex items-center gap-sm">
      <div class="relative">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <Icon name="search" color="text-on-surface-variant/70" />
        </div>
        <input 
          v-model="searchTest" 
          class="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-64 transition-all text-sm text-on-surface" 
          placeholder="Rechercher un test..." 
          type="text"
        >
      </div>
      <button class="p-2 rounded-full hover:bg-surface-container transition-colors relative">
        <Icon name="notifications" color="text-on-surface-variant" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
      </button>
      <div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container-low"></div>
    </div>
  </header>

  <div class="p-margin-desktop space-y-lg">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
      <div class="flex flex-wrap gap-sm">
        <select v-model="classe" class="px-4 py-2 bg-white border border-outline-variant rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary text-on-surface focus:outline-none">
          <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
        </select>
        <select v-model="monthSelected" class="px-4 py-2 bg-white border border-outline-variant rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary text-on-surface focus:outline-none">
          <option v-for="(month, index) in months" :key="index" :value="month">{{ month.charAt(0).toUpperCase() + month.slice(1) }}</option>
        </select>
      </div>
      <button 
        @click="openCreateModal"
        class="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 shadow-sm transition-all active:scale-95 text-sm font-semibold"
      >
        <Icon name="add" color="text-white" />
        Ajouter un test
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <div class="bg-white border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
        <div class="flex items-center justify-between mb-sm">
          <span class="p-2 bg-primary/10 rounded-lg"><Icon name="description" color="text-primary" /></span>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total des Tests</p>
        <h3 class="text-2xl font-bold text-on-surface mt-1">{{ glassCard.total }}</h3>
      </div>
      <div class="bg-white border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
        <div class="flex items-center justify-between mb-sm">
          <span class="p-2 bg-secondary/10 rounded-lg"><Icon name="pending" color="text-secondary" /></span>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Test d'Évaluation</p>
        <h3 class="text-2xl font-bold text-on-surface mt-1">{{ glassCard.evaluation }}</h3>
      </div>
      <div class="bg-white border border-outline-variant p-md rounded-xl hover:shadow-sm transition-shadow">
        <div class="flex items-center justify-between mb-sm">
          <span class="p-2 bg-tertiary/10 rounded-lg"><Icon name="history_edu" color="text-tertiary" /></span>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Test de Sunday School</p>
        <h3 class="text-2xl font-bold text-on-surface mt-1">{{ glassCard.sunday_school }}</h3>
      </div>
    </div>

    <div class="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low/50 text-on-surface-variant border-b border-outline-variant">
              <th class="px-md py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Nom du Test</th>
              <th class="px-md py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Classe</th>
              <th class="px-md py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Créé par</th>
              <th class="px-md py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Date</th>
              <th class="px-md py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 text-right w-44">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/40">
            <tr v-for="test in filteredAndPaginatedTests" :key="test.id" class="hover:bg-surface-container-low/30 transition-colors group">
              <td class="px-md py-4">
                <div class="flex items-center gap-3">
                  <div :class="test.typeTest === 'EVALUATION' ? 'p-2 bg-primary/5 rounded-lg border border-primary/10' : 'p-2 bg-secondary/5 rounded-lg border border-secondary/10'">
                    <Icon :name="test?.typeTest === 'EVALUATION' ? 'picture_as_pdf' : 'assignment'" :color="test?.typeTest === 'EVALUATION' ? 'text-primary' : 'text-secondary'" />
                  </div>
                  <div>
                    <span class="block text-sm font-semibold text-on-surface">{{ test.titleTest }}</span>
                    <span :class="[
                      'inline-block text-[10px] font-bold px-2 py-0.5 mt-0.5 rounded-full uppercase border',
                      test.typeTest === 'EVALUATION' ? 'bg-primary/5 text-primary border-primary/10' : 'bg-secondary/5 text-secondary border-secondary/10'
                    ]">{{ test.typeTest }}</span>
                  </div>
                </div>
              </td>
              <td class="px-md py-4 text-sm font-medium text-on-surface-variant">{{ test.classe }}</td>
              <td class="px-md py-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-surface-container text-[10px] font-bold uppercase text-on-surface border border-outline-variant flex items-center justify-center">
                    {{ getTeacherById(test.authorId)?.first_name?.charAt(0) || '?' }}
                  </div>
                  <span class="text-sm font-medium text-on-surface">
                    {{ getTeacherById(test.authorId) ? (getTeacherById(test.authorId)?.first_name + ' ' + getTeacherById(test.authorId)?.last_name) : '-- --' }}
                  </span>
                </div>
              </td>
              <td class="px-md py-4 text-xs font-mono text-on-surface-variant tracking-wide">{{ formatDate(test.created_at) }}</td>
              <td class="px-md py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openViewModal(test)" class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-md transition-colors" title="Voir"><Icon name="visibility" color="text-on-surface-variant" /></button>
                  <button @click="openEditModal(test)" class="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-md transition-colors" title="Éditer"><Icon name="edit" color="text-on-surface-variant" /></button>
                  <button class="p-1.5 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/5 rounded-md transition-colors" title="Télécharger"><Icon name="download" color="text-on-surface-variant" /></button>
                  <button @click="openDeleteModal(test)" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-md transition-colors" title="Supprimer"><Icon name="delete" color="text-on-surface-variant" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredAndPaginatedTests.length === 0">
              <td colspan="5" class="text-center py-8 text-on-surface-variant italic text-sm">Aucun test trouvé pour cette configuration.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalFilteredCount > 0" class="flex items-center justify-between px-md py-4 bg-white border-t border-outline-variant/40">
        <span class="text-xs text-on-surface-variant font-medium">
          Affichage {{ Math.min(start + 1, totalFilteredCount) }}-{{ Math.min(end, totalFilteredCount) }} de {{ totalFilteredCount }} tests
        </span>
        <div class="flex gap-1.5 items-center">
          <button 
            class="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-on-surface-variant"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <Icon name="chevron_left" color="text-on-surface-variant" />
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            :class="['px-3 py-1 rounded text-xs font-semibold transition-all', currentPage === page ? 'bg-primary text-white shadow-sm' : 'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container']" 
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button 
            class="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-on-surface-variant"
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
    <div class="py-1">
      <form @submit.prevent="handleSubmitForm" id="testForm" class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">Titre du Test</label>
          <input v-model="titleTest" required class="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface text-sm font-medium focus:outline-none" placeholder="ex: Évaluation Mai 2026" type="text">
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">Classe concernée</label>
          <div class="bg-white border border-outline-variant rounded-lg p-1.5">
            <select v-model="classe" class="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-1 focus:outline-none text-on-surface">
              <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">Type de test</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label class="flex items-center gap-3 p-3 border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors bg-white">
              <input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="EVALUATION">
              <span class="text-sm font-semibold text-on-surface">Évaluation</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors bg-white">
              <input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="SUNDAY_SCHOOL">
              <span class="text-sm font-semibold text-on-surface">Sunday School</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors bg-white">
              <input v-model="typeTest" class="w-4 h-4 text-primary focus:ring-primary" name="testType" type="radio" value="CONCOURS">
              <span class="text-sm font-semibold text-on-surface">Concours</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">Lien du Test (Drive)</label>
            <input v-model="sujetTest" required class="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface text-sm font-medium focus:outline-none" placeholder="Lien URL du sujet" type="text">
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">Lien de la Correction</label>
            <input v-model="correctionTest" required class="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface text-sm font-medium focus:outline-none" placeholder="Lien URL du corrigé" type="text">
          </div>
        </div>
      </form>
    </div>
    <template #footer>
      <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
        <button type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors text-sm font-medium order-2 sm:order-1" @click="activeTestModal = false">Annuler</button>
        <button type="submit" form="testForm" :disabled="isLoadingTests" class="px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow-sm text-sm hover:opacity-90 transition-opacity order-1 sm:order-2">
          {{ isLoadingTests ? 'Traitement...' : isEditMode ? 'Enregistrer' : 'Créer le test' }}
        </button>
      </div>
    </template>
  </Modal>

  <Modal v-model="showViewModal" title="Détails du Test" size="md">
    <div v-if="selectedTest" class="space-y-4 py-1">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wide">Nom de l'épreuve</p>
          <p class="font-semibold text-on-surface text-base mt-0.5">{{ selectedTest.titleTest }}</p>
        </div>
        <div>
          <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wide">Type</p>
          <p class="font-semibold text-on-surface mt-0.5">{{ selectedTest.typeTest }}</p>
        </div>
        <div>
          <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wide">Classe</p>
          <p class="font-semibold text-on-surface mt-0.5">{{ selectedTest.classe }}</p>
        </div>
        <div>
          <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wide">Date d'édition</p>
          <p class="font-semibold text-on-surface mt-0.5">{{ formatDate(selectedTest.created_at) }}</p>
        </div>
        <div class="sm:col-span-2 border-t border-outline-variant/50 pt-3">
          <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wide">Auteur pédagogique</p>
          <p class="font-bold text-primary mt-0.5 text-sm">
            {{ getTeacherById(selectedTest.authorId) ? (getTeacherById(selectedTest.authorId)?.first_name + ' ' + getTeacherById(selectedTest.authorId)?.last_name) : 'Non renseigné' }}
          </p>
        </div>
      </div>
    </div>
    <template #footer>
      <button class="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors text-sm font-semibold w-full" @click="showViewModal = false">Fermer</button>
    </template>
  </Modal>

  <Modal v-model="showDeleteModal" title="Supprimer l'épreuve" size="sm">
    <div v-if="selectedTest" class="space-y-4 text-center py-2">
      <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
        <Icon name="delete" color="text-error" />
      </div>
      <p class="text-sm font-medium text-on-surface px-2">Supprimer définitivement ce test ? Cette action détruira toutes les notes des élèves liées à cette épreuve.</p>
      <div class="text-sm font-bold text-error bg-error/5 p-3 rounded-xl border border-error/10">
        {{ selectedTest.titleTest }} ({{ selectedTest.classe }})
      </div>
    </div>
    <template #footer>
      <div class="flex gap-2 w-full">
        <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface w-full hover:bg-surface-container transition-colors text-sm font-medium" @click="showDeleteModal = false">Annuler</button>
        <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:bg-error/90 transition-opacity text-sm font-semibold" @click="confirmDelete" :disabled="isLoadingTests">Supprimer</button>
      </div>
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