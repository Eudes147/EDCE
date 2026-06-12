<template>
  <div class="min-h-screen p-3 sm:p-6 bg-background">
    <div class="max-w-4xl mx-auto">

      <div class="mb-6 md:mb-8 px-1">
        <div class="flex items-center justify-between mb-4 relative">
          <div
            v-for="step in steps"
            :key="step.id"
            class="flex flex-col items-center gap-1.5 group cursor-pointer flex-1 z-10"
            @click="goToStep(step.id)"
          >
            <div
              :class="[
                'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-label-md font-bold transition-all duration-300 flex-shrink-0',
                currentStep > step.id 
                  ? 'bg-primary-container text-on-primary' 
                  : currentStep === step.id 
                    ? 'bg-primary-container text-on-primary ring-2 ring-primary/20' 
                    : 'bg-surface-variant text-on-surface-variant'
              ]"
            >
              <Icon name="check" v-if="currentStep > step.id" class="text-[16px] sm:text-[20px]" />
              <span v-else>{{ step.id }}</span>
            </div>
            <span
              :class="[
                'text-[10px] sm:text-label-sm font-medium text-center max-w-[65px] sm:max-w-none truncate sm:whitespace-nowrap',
                currentStep >= step.id ? 'text-primary' : 'text-on-surface-variant'
              ]"
            >
              {{ step.label }}
            </span>
          </div>

          <div class="absolute top-4 sm:top-5 left-0 right-0 h-[2px] bg-outline-variant/40 -z-0 flex justify-between px-[12%]">
            <div
              v-for="step in steps.slice(0, -1)"
              :key="`progress-${step.id}`"
              class="flex-1 h-full mx-2 relative overflow-hidden"
            >
              <div
                class="h-full bg-primary-container transition-all duration-500"
                :style="{ width: currentStep > step.id ? '100%' : '0%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all duration-500">
        
        <div v-show="currentStep === 1" class="p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header class="mb-5">
            <h2 class="font-h2 text-on-surface mb-1 font-semibold text-lg sm:text-xl">Informations de la séance</h2>
            <p class="text-xs sm:text-body-md text-on-surface-variant opacity-70">Définissez les détails logistiques de votre rencontre aujourd'hui.</p>
          </header>

          <div class="space-y-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs sm:text-label-md text-on-surface font-medium">Titre de la séance</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="ex: Leçon sur la Parabole du Semeur"
                class="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs sm:text-body-md outline-none text-doomu-text"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs sm:text-label-md text-on-surface font-medium">Type de séance</label>
                <select
                  v-model="form.type"
                  class="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs sm:text-body-md outline-none text-doomu-text"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="SUNDAY_SCHOOL">SUNDAY SCHOOL</option>
                  <option value="DLT">DLT (Devant le trône)</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs sm:text-label-md text-on-surface font-medium">Classe</label>
                <select
                  v-model="form.classe"
                  class="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs sm:text-body-md outline-none text-doomu-text"
                >
                  <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div v-show="currentStep === 2" class="p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <header class="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <h2 class="font-h2 text-on-surface mb-1 font-semibold text-lg sm:text-xl">Registre des présences</h2>
              <p class="text-xs sm:text-body-md text-on-surface-variant opacity-70">Cochez les enfants présents lors de cette séance.</p>
            </div>
            <div class="bg-surface-container-high px-3 py-1.5 rounded-full flex items-center gap-2 border border-outline-variant/20 self-start md:self-auto">
              <Icon name="group" class="text-primary text-[16px] sm:text-[18px]" />
              <span class="text-xs sm:text-label-md text-primary font-bold">{{ selectedCount }} / {{ children.length }} présent(s)</span>
            </div>
          </header>

          <div class="mb-4 flex flex-col xs:flex-row gap-2 items-stretch xs:items-center">
            <div class="flex-1 bg-surface-container-low rounded-lg px-3 py-2 flex items-center gap-2.5 border border-outline-variant/20">
              <Icon name="search" color="text-outline" size="1.1rem" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Chercher un enfant..."
                class="bg-transparent border-none focus:ring-0 text-xs sm:text-body-sm w-full outline-none text-doomu-text"
              />
            </div>
            <button
              @click="toggleSelectAll"
              class="whitespace-nowrap px-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/20 text-center"
            >
              Tout basculer
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-[320px] overflow-y-auto pr-1">
            <div
              v-for="child in filteredChildren"
              :key="child.id"
              @click="toggleChild(child.id)"
              :class="[
                'flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-200',
                child.selected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-outline-variant/20 hover:bg-surface-container-low'
              ]"
            >
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                {{ child.name.charAt(0) }}
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-label-md text-on-surface truncate font-medium text-doomu-text">{{ child.name }}</p>
                <p class="text-[9px] sm:text-[10px] text-outline uppercase tracking-wider">{{ child.nivScolaire || 'Élève' }}</p>
              </div>

              <div
                :class="[
                  'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                  child.selected ? 'bg-primary border-primary' : 'border-outline-variant bg-transparent'
                ]"
              >
                <Icon v-if="child.selected" name="check" class="text-white text-[12px] sm:text-[16px]" />
              </div>
            </div>
          </div>
        </div>

        <div v-show="currentStep === 3" class="p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <header class="mb-5">
            <h2 class="font-h2 text-on-surface mb-1 font-semibold text-lg sm:text-xl">Récapitulatif & Validation</h2>
            <p class="text-xs sm:text-body-md text-on-surface-variant opacity-70">Choisissez un superviseur de séance puis validez le résumé.</p>
          </header>

          <div class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="bg-surface-container-low p-3 sm:p-4 rounded-xl border border-outline-variant/20">
                <p class="text-[10px] sm:text-xs text-outline mb-0.5 uppercase tracking-wider font-medium">Thème choisi</p>
                <p class="text-xs sm:text-sm font-semibold text-doomu-text truncate">{{ form.title || '--' }}</p>
              </div>
              <div class="bg-surface-container-low p-3 sm:p-4 rounded-xl border border-outline-variant/20">
                <p class="text-[10px] sm:text-xs text-outline mb-0.5 uppercase tracking-wider font-medium">Métriques Cibles</p>
                <p class="text-[11px] sm:text-sm text-doomu-text leading-tight">
                  Type: <span class="font-bold text-primary">{{ form.type }}</span> <br>
                  Classe: <span class="font-bold text-primary">{{ form.classe.toUpperCase() }}</span>
                </p>
              </div>
              <div class="bg-surface-container-low p-3 sm:p-4 rounded-xl border border-outline-variant/20">
                <p class="text-[10px] sm:text-xs text-outline mb-0.5 uppercase tracking-wider font-medium">Appel Émarge</p>
                <p class="text-sm sm:text-xl font-bold text-secondary">{{ selectedCount }} Présents</p>
              </div>
            </div>

            <div>
              <h3 class="text-xs sm:text-label-md text-on-surface font-semibold mb-3 flex items-center gap-2">
                <Icon name="person_pin" class="text-primary"/>
                Désigner le Superviseur Obligatoire
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-[180px] overflow-y-auto pr-1">
                <div
                  v-for="teacher in filteredTeachers"
                  :key="teacher.id"
                  @click="toggleSupervisorSelection(teacher.id)"
                  :class="[
                    'flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-200',
                    teacher.selected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-outline-variant/20 hover:bg-surface-container-low'
                  ]"
                >
                  <div class="w-8 h-8 rounded-full bg-secondary-container text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {{ teacher.first_name.charAt(0) }}
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-on-surface truncate text-doomu-text">
                      {{ teacher.first_name.toUpperCase() }} {{ teacher.last_name }}
                    </p>
                  </div>

                  <div
                    :class="[
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                      teacher.selected ? 'bg-primary border-primary' : 'border-outline-variant bg-transparent'
                    ]"
                  >
                    <Icon v-if="teacher.selected" name="check" class="text-white text-[10px]" />
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-primary/5 p-3 rounded-xl border border-primary/10 flex items-start gap-2.5">
              <Icon name="info" class="text-primary mt-0.5 shrink-0" size="1.1rem" />
              <p class="text-[11px] sm:text-xs text-on-surface-variant leading-normal">
                Une fois créée, cette séance sera indexée instantanément dans l'historique et analysable par la direction administrative de l'EDCE.
              </p>
            </div>
          </div>
        </div>

        <div class="px-4 sm:px-6 md:px-8 py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-outline-variant/20">
          <button
            @click="handleCancel"
            class="px-4 py-2 rounded-lg text-xs sm:text-label-md text-on-surface-variant hover:bg-surface-container transition-all text-center order-3 sm:order-1"
          >
            Annuler
          </button>
          
          <div class="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 order-1 sm:order-2 sm:ml-auto w-full sm:w-auto">
            <button
              v-show="currentStep > 1"
              @click="prevStep"
              class="px-4 py-2 rounded-lg text-xs sm:text-label-md text-on-surface border border-outline-variant hover:bg-surface-container transition-all text-center w-full sm:w-auto"
            >
              Retour
            </button>
            
            <button
              v-show="currentStep < 3"
              @click="nextStep"
              class="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs sm:text-sm text-center w-full sm:w-auto"
            >
              Continuer
            </button>
            
            <button
              v-show="currentStep === 3"
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
            >
              <Icon v-if="!isSubmitting" name="check_circle" class="text-[16px] sm:text-[18px]" />
              <Icon v-else name="sync" class="text-[16px] sm:text-[18px] animate-spin" />
              {{ isSubmitting ? 'Création...' : 'Créer la séance' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-outline-variant/20 shadow-xl text-center animate-in zoom-in-95 duration-300">
          <div class="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check_circle" class="text-[32px] sm:text-[40px] text-primary" />
          </div>
          <h3 class="text-h3 text-on-surface mb-2 font-bold text-base sm:text-lg">Séance Créée !</h3>
          <p class="text-body-md text-on-surface-variant mb-6 text-xs sm:text-sm">
            Le registre d'émargement et la leçon ont été sauvegardés avec succès.
          </p>
          <button
            @click="finishProcess"
            class="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all text-xs sm:text-sm"
          >
            Terminer
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { definePageMeta, useRouter } from '#imports'
import { classes } from '~/stores/child'
import { useChildren } from '~/composables/useChild'
import { useTeacher } from '~/composables/useTeacher'
import { useSeance } from '~/composables/useSeance'
import { useToast } from '~/composables/useToast'
import type { ClasseType } from '~/types/classe'
import type { SeanceType } from '~/types/seance'
import type { Child } from '~/types/child'
import { useAuthStore } from '~/stores/auth'
import { useParticipantSeance } from '~/composables/useParticipant'

// --- CORRECTION DU TYPE POUR L'UI ---
// On crée un type local qui inclut la propriété 'selected' requise par le template
type ChildWithSelection = Child & { selected: boolean }

definePageMeta({
  layout: 'dashboard'
})

// --- INSTANCIATION DES COMPOSABLES ---
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const { childrenPerClass, fetchAllChildren } = useChildren()
const { listTeachers, fetchAllTeachers } = useTeacher()

// Composable Séances (Gestion de la fiche racine)
const seanceStore = useSeance()
const { createSeance, listSeances } = seanceStore

// Composable Participants (Gestion de l'émargement des présents)
const participantSeanceStore = useParticipantSeance()
const { createParticipantSeance } = participantSeanceStore

// --- ÉTATS DU STEPPER & INTERFACE ---
const currentStep = ref(1)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const searchTerm = ref('')

// Formulaire racine réactif
const form = ref({
  title: '',
  date: new Date(),
  type: 'NORMAL' as SeanceType,
  classe: 'Petit' as ClasseType,
  authorId: authStore.user ? authStore.user.id : "", 
  supervisorId: ''
})

const steps = [
  { id: 1, label: 'Infos de base' },
  { id: 2, label: 'Présences' },
  { id: 3, label: 'Confirmation' }
]

// --- CACHING DES LISTES LOCALES ---
// Utilisation du type étendu pour éviter les erreurs 2339
const children = ref<ChildWithSelection[]>([])
const teachers = ref<any[]>([])

// --- FONCTION DE SYNCHRONISATION DE LA CLASSE ---
// Centralise la logique pour éviter les crashs si le store est vide au départ
const updateChildrenList = (targetClass: ClasseType) => {
  const targets = childrenPerClass.value[targetClass] || []
  children.value = targets.map(c => ({
    ...c,
    selected: false
  }))
}

// Recalcule la liste des enfants et des superviseurs si la classe change à l'Étape 1
watch(() => form.value.classe, (newClass) => {
  updateChildrenList(newClass)

  teachers.value = listTeachers.value
    .filter(t => t.id !== form.value.authorId)
    .map(t => ({
      ...t,
      selected: false
    }))
}, { immediate: true })

// Dans ton bloc "CACHING DES LISTES LOCALES / WATCHERS"

// 1. Ton watcher existant pour les enfants :
watch(childrenPerClass, () => {
  updateChildrenList(form.value.classe)
}, { deep: true })

// 2. LA CORRECTION : Ajoute ce watcher pour les enseignants 🟢
watch(listTeachers, (newList) => {
  teachers.value = newList
    .filter(t => t.id !== form.value.authorId)
    .map(t => ({
      ...t,
      selected: false
    }))
}, { deep: true, immediate: true })


// --- PROPRIÉTÉS CALCULÉES (FILTRES RECHERCHE) ---
const filteredChildren = computed<ChildWithSelection[]>(() => {
  if (!searchTerm.value.trim()) return children.value
  return children.value.filter(c => c.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

const filteredTeachers = computed(() => {
  return teachers.value
})

const selectedCount = computed(() => {
  return children.value.filter(c => c.selected).length
})

// --- ACTIONS MÉTIERS (SÉLECTIONS) ---
const toggleChild = (id: string) => {
  const child = children.value.find(c => c.id === id)
  if (child) child.selected = !child.selected
}

const toggleSelectAll = () => {
  const allSelected = children.value.every(c => c.selected)
  children.value.forEach(c => (c.selected = !allSelected))
}

const toggleSupervisorSelection = (id: string) => {
  teachers.value.forEach(t => {
    if (t.id === id) {
      t.selected = !t.selected
      form.value.supervisorId = t.selected ? t.id : ''
    } else {
      t.selected = false
    }
  })
}

// --- NAVIGATIONS DU STEPPER ---
const goToStep = (step: number) => {
  if (step < currentStep.value || validateStep(currentStep.value)) {
    currentStep.value = step
  }
}

const nextStep = () => {
  if (validateStep(currentStep.value)) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const validateStep = (step: number): boolean => {
  if (step === 1) {
    if (!form.value.title.trim()) {
      toast.warning('Champ requis', 'Veuillez donner un titre à la leçon du jour.')
      return false
    }
  }
  if (step === 2) {
    if (selectedCount.value === 0) {
      toast.info('Émargement vide', 'Veuillez cocher au moins un enfant présent pour continuer.')
      return false
    }
  }
  return true
}

// --- 📤 VALIDATION ET ENVOI CRÉATION SÉANCE + PARTICIPANTS (ONE BY ONE) ---
const handleSubmit = async () => {
  if (!form.value.supervisorId) {
    toast.info('Superviseur manquant', "Faites le choix obligatoire d'un superviseur témoin.")
    return
  }

  isSubmitting.value = true
  try {
    // 1. Création de la fiche séance sur le serveur
    await createSeance({
      title: form.value.title,
      type: form.value.type,
      classe: form.value.classe,
      authorId: form.value.authorId,
      supervisorId: form.value.supervisorId
    })

    // 2. Récupération de la séance qu'on vient d'insérer en prenant la plus récente du tableau mis à jour
    const updatedSeances = listSeances.value
    const latestSeance = updatedSeances[updatedSeances.length - 1]

    if (!latestSeance || !latestSeance.id) {
      throw new Error("Impossible de retrouver l'identifiant de la séance créée.")
    }

    // 3. Filtrer uniquement les enfants cochés présents
    const checkedChildren = children.value.filter(c => c.selected)

    // 4. Inscription des participants "One by One" via le composable dédié
    for (const child of checkedChildren) {
      await createParticipantSeance({
        id: `part-seance-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, // ID unique dynamique
        seanceId: latestSeance.id, // L'ID récupéré dynamiquement du serveur
        childId: child.id
      })
    }
    
    // Tout s'est bien passé ! Affichage du modal de succès.
    showSuccessModal.value = true
  } catch (error) {
    console.error(error)
    toast.error('Erreur', "Échec lors de la création de la séance ou de l'émargement des élèves.")
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  if (confirm('Voulez-vous vraiment annuler ? Les émargements courants seront perdus.')) {
    router.push('/children')
  }
}

const finishProcess = () => {
  showSuccessModal.value = false
  router.push('/children')
}

onMounted(async () => {
  await fetchAllChildren()
  await fetchAllTeachers()
  // Sécurité pour forcer le premier rendu si les données sont déjà là en cache
  updateChildrenList(form.value.classe)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>