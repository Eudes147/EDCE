<template>
  <div class="min-h-screen p-6 bg-background">
    <!-- <template #header-title>
      <span class="font-body text-body font-bold text-primary">Seances</span>
    </template> -->
    <div class="max-w-4xl mx-auto">

      <div class="mb-8 px-2">
        <!-- Steps Row (Circles + Labels) -->
        <div class="flex items-center justify-between mb-6">
          <div
            v-for="(step, idx) in steps"
            :key="step.id"
            class="flex flex-col items-center gap-2 group cursor-pointer flex-1"
            @click="goToStep(step.id)"
          >
            <!-- Step Icon Circle -->
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-label-md font-bold transition-all duration-300 flex-shrink-0',
                currentStep > step.id ? 'bg-primary-container text-on-primary' : currentStep === step.id ? 'bg-primary-container text-on-primary ring-2 ring-primary/20' : 'bg-surface-variant text-on-surface-variant'
              ]"
            >
              <Icon name="check" v-if="currentStep > step.id" color="text-[20px]" />
              <span v-else>{{ step.id }}</span>
            </div>
            <!-- Step Label -->
            <span
              :class="[
                'text-label-sm font-medium text-center whitespace-nowrap',
                currentStep >= step.id ? 'text-primary' : 'text-on-surface-variant'
              ]"
            >
              {{ step.label }}
            </span>
          </div>
        </div>

        <!-- Progress Lines Row (Entre les steps) -->
        <div class="flex items-center justify-between px-6">
          <div
            v-for="(step, idx) in steps.slice(0, -1)"
            :key="`progress-${step.id}`"
            class="flex-1 h-1 mx-2 bg-outline-variant relative overflow-hidden rounded-full"
          >
            <div
              class="h-full bg-primary-container transition-all duration-500"
              :style="{ width: currentStep > step.id ? '100%' : '0%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-surface border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all duration-500">
        <!-- Step 1: Basic Info -->
        <div v-show="currentStep === 1" class="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header class="mb-6">
            <h2 class="font-h2 text-h2 text-on-surface mb-2">Informations de la séance</h2>
            <p class="text-body-md text-on-surface-variant opacity-70">Définissez les détails logistiques de votre rencontre aujourd'hui.</p>
          </header>

          <div class="space-y-4">
            <!-- Title Input -->
            <div class="flex flex-col gap-2">
              <label class="text-label-md text-on-surface font-medium">Titre de la séance</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="ex: Leçon sur la Parabole du Semeur"
                class="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none"
              />
            </div>

            <!-- Date & Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface font-medium">Date</label>
                <input
                  v-model="form.date"
                  type="date"
                  class="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface font-medium">Type de séance</label>
                <select
                  v-model="form.type"
                  class="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="SUNDAY_SCHOOL">SUNDAY SCHOOL</option>
                  <option value="DLT">DLT (Devant le trône)</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-label-md text-on-surface font-medium">Classe</label>
              <select
                  v-model="form.classe"
                  class="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none"
                >
                  <option value="Petit">Petit</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Moyen">Moyen</option>
                  <option value="JuniorA">JuniorA</option>
                  <option value="JuniorB">JuniorB</option>
                </select>
            </div>
            <!-- Notes -->
            <div class="flex flex-col gap-2">
              <label class="text-label-md text-on-surface font-medium">Notes & Observations (Optionnel)</label>
              <textarea
                v-model="form.notes"
                placeholder="Points clés abordés, incidents particuliers ou besoins de suivi..."
                rows="4"
                class="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Step 2: Children Attendance -->
        <div v-show="currentStep === 2" class="p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <header class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 class="font-h2 text-h2 text-on-surface mb-2">Registre des présences</h2>
              <p class="text-body-md text-on-surface-variant opacity-70">Cochez les enfants présents lors de cette séance.</p>
            </div>
            <div class="bg-surface-container-high px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/20">
              <Icon name="group" color="text-primary text-[18px]" />
              <span class="text-label-md text-primary font-bold">{{ selectedCount }} / {{ children.length }} sélectionnés</span>
            </div>
          </header>

          <!-- Search & Select All -->
          <div class="mb-4 flex gap-4 items-center">
            <div class="flex-1 bg-surface-container rounded-lg px-4 py-2 flex items-center gap-3 border border-outline-variant/20">
              <Icon name="search" color="text-on-surface-variant" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Chercher un nom..."
                class="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none"
              />
            </div>
            <button
              @click="toggleSelectAll"
              class="whitespace-nowrap px-4 py-2 text-label-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/20"
            >
              Tout sélectionner
            </button>
          </div>

          <!-- Children Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] overflow-y-auto pr-2">
            <div
              v-for="child in filteredChildren"
              :key="child.id"
              @click="toggleChild(child.id)"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                child.selected ? 'bg-primary-container/10 border-primary shadow-sm' : 'bg-surface border-outline-variant/20 hover:bg-surface-container-high'
              ]"
            >
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-dim border border-outline-variant flex-shrink-0">
                <img :src="child.avatar" :alt="child.name" class="w-full h-full object-cover" />
              </div>

              <!-- Child Info -->
              <div class="flex-1 min-w-0">
                <p class="text-label-md text-on-surface truncate font-medium">{{ child.name }}</p>
                <p class="text-[10px] text-outline uppercase tracking-wider">Élève</p>
              </div>

              <!-- Checkbox -->
              <div
                :class="[
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                  child.selected ? 'bg-primary border-primary' : 'border-outline-variant bg-transparent'
                ]"
              >
              
              <Icon v-if="child.selected"  name="check" color="text-on-primary text-[16px]" />
            
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Review -->
        <div v-show="currentStep === 3" class="p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <header class="mb-6">
            <h2 class="font-h2 text-h2 text-on-surface mb-2">Récapitulatif</h2>
            <p class="text-body-md text-on-surface-variant opacity-70">Vérifiez les détails avant de confirmer la création de la séance.</p>
          </header>

          <div class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-surface-container p-4 rounded-xl border border-outline-variant/20">
                <p class="text-label-sm text-outline mb-1 uppercase tracking-wider font-medium">Séance</p>
                <p class="font-h3 text-h3 text-on-surface">{{ form.title || '--' }}</p>
              </div>
              <div class="bg-surface-container p-4 rounded-xl border border-outline-variant/20">
                <p class="text-label-sm text-outline mb-1 uppercase tracking-wider font-medium">Date & Type & Classe</p>
                <p class="text-body-md text-on-surface">
                  <span>{{ formatDate(form.date) || '--' }}</span> •
                  <span class="font-bold text-primary">{{ form.type }}</span>•
                  <span class="font-bold text-primary">{{ form.classe?.toUpperCase() }}</span>
                </p>
              </div>
              <div class="bg-surface-container p-4 rounded-xl border border-outline-variant/20">
                <p class="text-label-sm text-outline mb-1 uppercase tracking-wider font-medium">Total Présents</p>
                <p class="font-h3 text-h3 text-secondary">{{ selectedCount }} Enfants</p>
              </div>
            </div>

            <!-- Notes Card -->
            <div class="bg-surface-container p-6 rounded-xl border border-outline-variant/20">
              <p class="text-label-sm text-outline mb-2 uppercase tracking-wider font-medium">Notes administratives</p>
              <p class="text-body-md text-on-surface italic opacity-80">
                {{ form.notes || 'Aucune note saisie.' }}
              </p>
            </div>

            <!-- Info Banner -->
            <div class="bg-primary-container/5 p-6 rounded-xl border border-primary/10 flex items-start gap-4">
              <Icon name="info" color="text-primary mt-0.5" />
              <p class="text-body-sm text-on-surface-variant">
                Une fois créée, cette séance sera ajoutée à l'historique et les statistiques d'assiduité seront mises à jour pour tous les enfants sélectionnés.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 md:px-8 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/20">
          <button
            @click="handleCancel"
            class="px-6 py-2 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container transition-all"
          >
            Annuler
          </button>
          <div class="flex items-center gap-3">
            <button
              v-show="currentStep > 1"
              @click="prevStep"
              class="px-6 py-2 rounded-lg text-label-md text-on-surface border border-outline-variant hover:bg-surface-container transition-all"
            >
              Retour
            </button>
            <button
              v-show="currentStep < 3"
              @click="nextStep"
              class="bg-primary-container text-on-primary px-8 py-3 rounded-lg font-label-md shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              Continuer
            </button>
            <button
              v-show="currentStep === 3"
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="bg-primary-container text-on-primary px-8 py-3 rounded-lg font-label-md shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                <Icon v-if="!isSubmitting" name="check_circle" color="text-[20px]" />
              
                <Icon v-else name="sync" color="text-[20px] animate-spin" />
              
              {{ isSubmitting ? 'Création...' : 'Créer la séance' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div class="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full border border-outline-variant/20 shadow-lg text-center animate-in zoom-in-95 duration-300">
          <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check_circle" color="text-[40px]" />
          </div>
          <h3 class="font-h3 text-h3 text-on-surface mb-2">Séance Créée !</h3>
          <p class="text-body-md text-on-surface-variant mb-6">
            Le registre a été mis à jour avec succès. Vous allez être redirigé vers le dashboard.
          </p>
          <button
            @click="() => navigateTo('/')"
            class="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md hover:opacity-90 transition-all"
          >
            Terminer
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Page Layout
definePageMeta({
  layout: 'dashboard'
})

// State
const currentStep = ref(1)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const searchTerm = ref('')

// Form Data
const form = ref({
  title: '',
  date: new Date().toLocaleDateString(),
  type: 'NORMAL',
  notes: '',
  classe: 'Petit'
})

// Steps
const steps = [
  { id: 1, label: 'Infos de base' },
  { id: 2, label: 'Présences' },
  { id: 3, label: 'Confirmation' }
]

// Children Data
const children = ref(
  Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    name: ['Jean Dupont', 'Marie Curie', 'Thomas Edison', 'Léa Martin', 'Arthur Rimbaud', 'Sophie Germain', 'Gabriel Faure', 'Chloé Leroy'][i % 8] + ' ' + (Math.floor(i / 8) + 1),
    avatar: `https://avatar.iran.liara.run/public/${((i % 50) + 1)}`,
    selected: false
  }))
)

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}
// Computed
const filteredChildren = computed(() => {
  if (!searchTerm.value) return children.value
  return children.value.filter(child => child.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

const selectedCount = computed(() => {
  return children.value.filter(c => c.selected).length
})

// Methods
const toggleChild = (id: number) => {
  const child = children.value.find(c => c.id === id)
  if (child) {
    child.selected = !child.selected
  }
}

const toggleSelectAll = () => {
  const allSelected = children.value.every(c => c.selected)
  children.value.forEach(c => (c.selected = !allSelected))
}

const goToStep = (step: number) => {
  if (step < currentStep.value || validateStep(currentStep.value)) {
    currentStep.value = step
  }
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const validateStep = (step: number): boolean => {
  if (step === 1) {
    if (!form.value.title.trim()) {
      alert('Veuillez donner un titre à la séance')
      return false
    }
    if (!form.value.date) {
      alert('Veuillez sélectionner une date')
      return false
    }
  }
  if (step === 2) {
    if (selectedCount.value === 0) {
      alert('Veuillez sélectionner au moins un enfant')
      return false
    }
  }
  return true
}

const handleSubmit = async () => {
  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  isSubmitting.value = false
  showSuccessModal.value = true
}

const handleCancel = () => {
  if (confirm('Voulez-vous vraiment annuler ? Toutes les données saisies seront perdues.')) {
    router.push('/')
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>