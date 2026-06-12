<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-[1400px] mx-auto space-y-4 md:space-y-8">
    
    <div class="flex justify-between items-end px-1">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-surface">Gestion des Enseignants</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-1">Gérez vos équipes pédagogiques et leur planning mensuel.</p>
      </div>
    </div>

    <section class="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      
      <div class="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-surface-container-low/30">
        <div class="relative w-full sm:max-w-xs">
          <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size="1.15rem" />
          <input 
            v-model="searchQuery"
            class="w-full bg-white border border-outline-variant rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface placeholder:text-on-surface-variant/50" 
            placeholder="Rechercher un enseignant..." 
            type="text"
          >
        </div>
      </div>
      
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse table-auto">
          <thead class="bg-surface-container-low/50 border-b border-outline-variant/40">
            <tr>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Enseignant</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 hidden sm:table-cell">Téléphone</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Statut</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 text-right w-28">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/40">
            <tr 
              v-for="teacher in paginatedTeachers" 
              :key="teacher.id" 
              class="hover:bg-surface-container-low/40 transition-colors group"
            >
              <td class="px-4 py-3.5 md:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 border border-primary/10">
                    {{ teacher.first_name.substring(0, 1) }}{{ teacher.last_name.substring(0, 1) }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-body text-xs sm:text-sm text-on-surface font-semibold truncate">
                      {{ teacher.first_name.toUpperCase() }} {{ teacher.last_name }}
                    </span>
                    <span class="font-mono text-[10px] text-on-surface-variant sm:hidden mt-0.5">{{ teacher.tel || '-' }}</span>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3.5 md:px-6 font-mono text-xs text-on-surface-variant tracking-wide hidden sm:table-cell">
                {{ teacher.tel || '-' }}
              </td>

              <td class="px-4 py-3.5 md:px-6 text-sm">
                <span 
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                    teacher.isAvailable ? 'bg-success/5 border-success/20 text-success' : 'bg-error/5 border-error/20 text-error'
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', teacher.isAvailable ? 'bg-success animate-pulse' : 'bg-error']"></span>
                  {{ teacher.isAvailable ? 'Disponible' : 'Indisponible' }}
                </span>
              </td>

              <td class="px-4 py-3.5 md:px-6 text-right">
                <div class="flex items-center justify-end gap-0.5 sm:gap-1">
                  <button 
                    @click="openEditModal(teacher)" 
                    class="p-1.5 rounded-lg hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-colors"
                    title="Modifier les détails"
                  >
                    <Icon name="edit" size="1.15rem" />
                  </button>
                  <button 
                    @click="toggleAvailability(teacher)" 
                    class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                    :title="teacher.isAvailable ? 'Marquer indisponible' : 'Marquer disponible'"
                  >
                    <Icon name="sync" size="1.15rem" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredTeachers.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-on-surface-variant italic text-xs sm:text-sm">
                Aucun enseignant ne correspond à votre recherche.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 sm:px-6 border-t border-outline-variant/40 flex justify-between items-center bg-surface-container-low/10">
        <span class="text-[11px] sm:text-xs text-on-surface-variant font-medium">
          Affichage {{ filteredTeachers.length === 0 ? 0 : startIndex + 1 }}-{{ Math.min(endIndex, filteredTeachers.length) }} sur {{ filteredTeachers.length }}
        </span>
        <div class="flex gap-1">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="chevron_left" size="1.1rem" />
          </button>
          <button class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs shadow-sm">
            {{ currentPage }}
          </button>
          <button 
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="chevron_right" size="1.1rem" />
          </button>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 class="font-h2 text-lg md:text-h2 font-bold text-on-surface">Emploi du Temps Mensuel</h3>
          <p class="font-body text-xs md:text-sm text-on-surface-variant">Affectations régulées pour le mois courant</p>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button 
            @click="publishSchedule"
            :disabled="isPublishing"
            class="flex items-center justify-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-lg font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Icon :name="isPublishing ? 'sync' : 'publish'" :class="[{ 'animate-spin': isPublishing }]" size="1.1rem" />
            <span>{{ isPublishing ? 'Publication...' : "Publier l'emploi du temps" }}</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-[1px] bg-outline-variant/60 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div class="bg-surface-container-high p-4 font-bold text-on-surface text-center text-xs md:text-sm uppercase tracking-wider">Dates (Dimanches)</div>
        <div class="bg-surface-container-high p-4 font-bold text-primary text-center text-xs md:text-sm uppercase tracking-wider">NORMAL</div>
        <div class="bg-surface-container-high p-4 font-bold text-secondary text-center text-xs md:text-sm uppercase tracking-wider">SUNDAY_SCHOOL</div>
        <div class="bg-surface-container-high p-4 font-bold text-tertiary text-center text-xs md:text-sm uppercase tracking-wider">DLT</div>

        <template v-for="(row, rowIndex) in schedule" :key="row.dateLabel">
          <div class="bg-surface-container-low/60 p-4 flex items-center justify-center font-bold text-on-surface text-xs md:text-sm text-center">
            {{ row.dateLabel }}
          </div>

          <div 
            v-for="slotType in (['NORMAL', 'SUNDAY_SCHOOL', 'DLT'] as const)"
            :key="slotType"
            @click="openAssignmentManager(rowIndex, slotType)"
            :class="[
              'p-3 transition-colors cursor-pointer min-h-[85px] flex flex-col justify-center gap-1.5 relative group bg-white',
              slotType === 'NORMAL' ? 'hover:bg-primary/5' : slotType === 'SUNDAY_SCHOOL' ? 'hover:bg-secondary/5' : 'hover:bg-tertiary/5'
            ]"
          >
            <span 
              v-for="tId in row.assignments[slotType]" 
              :key="tId"
              :class="[
                'text-[10px] md:text-xs px-2 py-1 rounded-md text-center font-semibold block truncate border',
                slotType === 'NORMAL' ? 'bg-primary/5 text-primary border-primary/10' : slotType === 'SUNDAY_SCHOOL' ? 'bg-secondary/5 text-secondary border-secondary/10' : 'bg-tertiary/5 text-tertiary border-tertiary/10'
              ]"
            >
              {{ getTeacherDisplayName(tId) }}
            </span>

            <div 
              v-if="row.assignments[slotType].length < 2" 
              class="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded"
            >
              <div class="bg-white p-1.5 rounded-full shadow-md border border-outline-variant/40 flex items-center justify-center text-primary">
                <Icon name="add" size="1rem" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <Modal v-model="showFormModal" :title="isEditMode ? 'Modifier l\'Enseignant' : 'Inscrire un Enseignant'" size="md">
      <div class="py-1">
        <form @submit.prevent="submitForm" id="teacherForm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Nom <span class="text-error">*</span></label>
              <input 
                v-model="form.first_name" 
                class="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium" 
                placeholder="Ex: Tshibamba" type="text" required 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Prénom <span class="text-error">*</span></label>
              <input 
                v-model="form.last_name" 
                class="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium" 
                placeholder="Ex: Caleb" type="text" required 
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Téléphone <span class="text-error">*</span></label>
            <input 
              v-model="form.tel" 
              class="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium font-mono" 
              placeholder="Ex: +229..." type="tel" required 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Quartier de Résidence</label>
            <input 
              v-model="form.quarter" 
              class="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface font-medium" 
              placeholder="Ex: Fidjrossè" type="text" 
            />
          </div>
        </form>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <button type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors text-sm font-medium order-2 sm:order-1" @click="showFormModal = false">Annuler</button>
          <button type="submit" form="teacherForm" class="px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow-sm text-sm hover:opacity-90 transition-opacity order-1 sm:order-2" :disabled="isLoading">Sauvegarder</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showAssignModal" title="Affectation des Moniteurs (Max 2)" size="md">
      <div v-if="activeCell && schedule[activeCell.rowIndex]" class="space-y-4 py-1">
        <div class="bg-primary/5 p-4 rounded-xl border border-primary/10 text-xs md:text-sm space-y-1">
          <p class="text-on-surface-variant font-medium">Dimanche : <span class="font-bold text-on-surface">{{ schedule[activeCell.rowIndex]?.dateLabel }}</span></p>
          <p class="text-on-surface-variant font-medium">Créneau ciblé : <span class="font-bold text-primary">{{ activeCell.slotType }}</span></p>
        </div>

        <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Sélectionnez les moniteurs (disponibles uniquement) :</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
          <div 
            v-for="teacher in listTeachers.filter(t => t.isAvailable)" 
            :key="teacher.id"
            @click="toggleTeacherInCell(teacher.id)"
            :class="[
              'p-3 border rounded-xl cursor-pointer text-sm font-semibold flex items-center justify-between transition-all',
              isTeacherSelectedInActiveCell(teacher.id) ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-outline-variant/60 text-on-surface hover:bg-surface-container-low'
            ]"
          >
            <span class="truncate">{{ teacher.first_name }} {{ teacher.last_name }}</span>
            <Icon v-if="isTeacherSelectedInActiveCell(teacher.id)" name="check" size="1.1rem" class="text-primary flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold shadow-sm w-full hover:opacity-90 transition-opacity text-sm" @click="showAssignModal = false">
          Confirmer l'affectation
        </button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 5px; width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E4DE; border-radius: 10px; }
</style>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useTeacher } from '~/composables/useTeacher'
import { useToast } from '~/composables/useToast'
import type { Teacher } from '~/types/teacher'

definePageMeta({
  layout: 'dashboard'
})

type SlotType = 'NORMAL' | 'SUNDAY_SCHOOL' | 'DLT'

interface ScheduleRow {
  dateLabel: string
  assignments: Record<SlotType, string[]>
}

// Déclaration des composables
const toast = useToast()
const { listTeachers, fetchAllTeachers, updateTeacher, isLoading } = useTeacher()

// États de filtrage et pagination
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 3

// États des modales
const showFormModal = ref(false)
const showAssignModal = ref(false)
const isEditMode = ref(false)
const isPublishing = ref(false)
const hasExistingSchedule = ref(false) // Permet d'arbitrer entre POST et PUT

// Cible active de formulaire
const selectedTeacher = ref<Teacher | null>(null)
const form = reactive({
  id: '',
  first_name: '',
  last_name: '',
  tel: '',
  quarter: ''
})

// --- STRUCTURE ET ÉTAT DU PLANNING MENSUEL ---
const schedule = ref<ScheduleRow[]>([])
const activeCell = ref<{ rowIndex: number; slotType: SlotType } | null>(null)

// Format de clé dynamique pour le mois actuel "YYYY-MM" (2026-06)
const currentMonthKey = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
})

// Algorithme de génération des dimanches du mois courant
const generateCurrentMonthSundays = (): ScheduleRow[] => {
  const sundays: ScheduleRow[] = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const date = new Date(year, month, 1)

  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1)
  }

  while (date.getMonth() === month) {
    const dayNum = date.getDate()
    let displayDay = `${dayNum}`
    
    if (dayNum === 1) {
      displayDay = '1er'
    }

    const monthsShort = [
      'Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 
      'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
    ]
    const currentMonthLabel = monthsShort[month] || ''

    sundays.push({
      dateLabel: `Dim ${displayDay} ${currentMonthLabel}`,
      assignments: {
        NORMAL: [],
        SUNDAY_SCHOOL: [],
        DLT: []
      }
    })

    date.setDate(date.getDate() + 7)
  }

  return sundays
}

// Chargement initial
onMounted(async () => {
  schedule.value = generateCurrentMonthSundays()
  
  // Exécution parallèle du chargement des enseignants et de l'EDT existant
  await Promise.all([
    fetchAllTeachers(),
    loadExistingSchedule()
  ])
})

// Récupération de l'emploi du temps existant si disponible (GET)
const loadExistingSchedule = async () => {
  try {
    const response = await $fetch<any>(`/api/schedules/${currentMonthKey.value}`, {
      method: 'GET'
    })

    if (response && response.success && Array.isArray(response.rows)) {
      schedule.value = response.rows
      hasExistingSchedule.value = true
      console.log(`[Vue Schedule] Planning existant chargé pour ${currentMonthKey.value}`)
    }
  } catch (error: any) {
    // Si l'erreur est un 404, c'est normal (aucun planning créé pour l'instant)
    if (error.statusCode === 404) {
      hasExistingSchedule.value = false
      console.log(`[Vue Schedule] Aucun planning préexistant pour ${currentMonthKey.value}. Mode création (POST).`)
    } else {
      console.error('[Vue Schedule] Erreur lors de la vérification du planning existant:', error)
    }
  }
}

// --- LOGIQUE FILTRAGE TABLEAU ---
const filteredTeachers = computed(() => {
  if (!searchQuery.value.trim()) return listTeachers.value
  const query = searchQuery.value.toLowerCase()
  return listTeachers.value.filter(t => 
    t.first_name.toLowerCase().includes(query) || 
    t.last_name.toLowerCase().includes(query)
  )
})

const totalPages = computed(() => Math.ceil(filteredTeachers.value.length / itemsPerPage) || 1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const paginatedTeachers = computed(() => filteredTeachers.value.slice(startIndex.value, endIndex.value))

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

// --- LOGIQUE METIER PLANNING ---
const getTeacherDisplayName = (id: string): string => {
  const teacher = listTeachers.value.find(t => t.id === id)
  return teacher ? `${teacher.first_name} ${teacher.last_name.substring(0, 1)}.` : 'Inconnu'
}

const openAssignmentManager = (rowIndex: number, slotType: SlotType) => {
  activeCell.value = { rowIndex, slotType }
  showAssignModal.value = true
}

const isTeacherSelectedInActiveCell = (teacherId: string): boolean => {
  if (!activeCell.value) return false
  const row = schedule.value[activeCell.value.rowIndex]
  if (!row) return false
  const cell = row.assignments[activeCell.value.slotType]
  return cell.includes(teacherId)
}

const toggleTeacherInCell = (teacherId: string) => {
  if (!activeCell.value) return
  
  const row = schedule.value[activeCell.value.rowIndex]
  if (!row) return

  const currentCell = row.assignments[activeCell.value.slotType]
  const index = currentCell.indexOf(teacherId)

  if (index > -1) {
    currentCell.splice(index, 1)
    toast.info('Affectation retirée')
  } else {
    if (currentCell.length >= 2) {
      toast.warning('Limite atteinte', 'Un maximum de 2 enseignants peut être affecté à ce créneau.')
      return
    }
    currentCell.push(teacherId)
    toast.success('Moniteur affecté au planning')
  }
}

// --- LOGIQUE DE PUBLICATION EFFECTIVE (POST / PUT) ---
const publishSchedule = async () => {
  if (isPublishing.value) return
  isPublishing.value = true

  try {
    // Arbitrage dynamique selon l'état actuel de la base
    const method = hasExistingSchedule.value ? 'PUT' : 'POST'
    const url = hasExistingSchedule.value 
      ? `/api/schedules/${currentMonthKey.value}` 
      : '/api/schedules'

    const payload = {
      monthKey: currentMonthKey.value,
      status: 'published',
      rows: schedule.value
    }

    const response = await $fetch<any>(url, {
      method,
      body: payload
    })

    if (response && response.success) {
      hasExistingSchedule.value = true // Fixé à true car l'entité existe désormais en base
      toast.success(
        hasExistingSchedule.value ? 'Planning mis à jour' : 'Planning partagé', 
        `L'emploi du temps mensuel a été enregistré avec succès pour ${currentMonthKey.value}.`
      )
    }
  } catch (err: any) {
    console.error('[Vue Schedule publish] Échec :', err)
    toast.error('Échec de publication', err.statusMessage || 'Une erreur est survenue lors de l\'enregistrement.')
  } finally {
    isPublishing.value = false
  }
}

// --- CONTROLEURS DES FORMULAIRES ENSEIGNANTS ---
const openAddModal = () => {
  isEditMode.value = false
  selectedTeacher.value = null
  form.id = ''
  form.first_name = ''
  form.last_name = ''
  form.tel = ''
  form.quarter = ''
  showFormModal.value = true
}

const openEditModal = (teacher: Teacher) => {
  isEditMode.value = true
  selectedTeacher.value = teacher
  form.id = teacher.id
  form.first_name = teacher.first_name
  form.last_name = teacher.last_name
  form.tel = teacher.tel || ''
  form.quarter = teacher.quarter || ''
  showFormModal.value = true
}

const toggleAvailability = async (teacher: Teacher) => {
  try {
    await updateTeacher(teacher.id, { isAvailable: !teacher.isAvailable })
    toast.success('Statut changé', `Le profil est désormais marqué comme ${!teacher.isAvailable ? 'Disponible' : 'Indisponible'}.`)
  } catch (err) {
    toast.error('Erreur de mise à jour')
  }
}

const submitForm = async () => {
  if (!form.first_name.trim() || !form.last_name.trim() || !form.tel.trim()) {
    toast.warning('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires (*).')
    return
  }

  try {
    if (isEditMode.value) {
      await updateTeacher(form.id, {
        quarter: form.quarter,
        tel: form.tel
      })
      toast.success('Modifications enregistrées', `La fiche de ${form.first_name} a été mise à jour.`)
    } else {
      toast.success('Nouvelle fiche créée', `L'enseignant ${form.first_name} a rejoint l'EDCE.`)
    }
    showFormModal.value = false
  } catch (err) {
    toast.error('Erreur réseau', 'Impossible d\'enregistrer les modifications.')
  }
}
</script>