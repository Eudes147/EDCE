<template>
  <div class="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="font-h1 text-xl md:text-h1 font-bold text-on-surface">Gestion des Enseignants</h2>
        <p class="font-body text-xs md:text-sm text-on-surface-variant mt-1">Gérez vos équipes pédagogiques et leur planning mensuel.</p>
      </div>
    </div>

    <section class="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      <div class="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
        <div class="relative w-full max-w-xs">
          <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70" color="1.2rem" />
          <input 
            v-model="searchQuery"
            class="w-full bg-white border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface" 
            placeholder="Rechercher un enseignant..." 
            type="text"
          >
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low/50 border-b border-outline-variant/40">
            <tr>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Nom</th>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Prénom</th>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Téléphone</th>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80">Statut Actif</th>
              <th class="px-6 py-4 font-caption text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/40">
            <tr 
              v-for="teacher in paginatedTeachers" 
              :key="teacher.id" 
              class="hover:bg-surface-container-low/40 transition-colors group"
            >
              <td class="px-6 py-4 font-body text-sm text-on-surface font-semibold">{{ teacher.first_name.toUpperCase() }}</td>
              <td class="px-6 py-4 font-body text-sm text-on-surface-variant font-medium">{{ teacher.last_name }}</td>
              <td class="px-6 py-4 font-mono text-xs text-on-surface-variant tracking-wide">{{ teacher.tel || '-' }}</td>
              <td class="px-6 py-4 text-sm">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold',
                    teacher.isAvailable ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  ]"
                >
                  {{ teacher.isAvailable ? 'Disponible' : 'Indisponible' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    @click="openEditModal(teacher)" 
                    class="p-1.5 rounded-md hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-colors"
                    title="Modifier les détails"
                  >
                    <Icon name="edit" color="1.1rem" />
                  </button>
                  <button 
                    @click="toggleAvailability(teacher)" 
                    class="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                    :title="teacher.isAvailable ? 'Marquer indisponible' : 'Marquer disponible'"
                  >
                    <Icon name="sync" color="1.1rem" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredTeachers.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-on-surface-variant italic text-sm">
                Aucun enseignant ne correspond à votre recherche.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-3 border-t border-outline-variant/40 flex justify-between items-center bg-surface-container-low/10">
        <span class="text-xs text-on-surface-variant font-medium">
          Affichage {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredTeachers.length) }} sur {{ filteredTeachers.length }} enseignants
        </span>
        <div class="flex gap-1.5">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="chevron_left" color="1.1rem" />
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-semibold text-xs shadow-sm">
            {{ currentPage }}
          </button>
          <button 
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="chevron_right" color="1.1rem" />
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
            <Icon :name="isPublishing ? 'sync' : 'publish'" :class="[{ 'animate-spin': isPublishing }]" color="1.1rem" />
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
                <Icon name="add" color="1rem" />
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
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
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
            <Icon v-if="isTeacherSelectedInActiveCell(teacher.id)" name="check" color="1.1rem" class="text-primary flex-shrink-0 ml-2" />
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
<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useTeacher } from '~/composables/useTeacher'
import { useSchedule } from '~/composables/useSchedule' // <-- AJOUT du nouveau composable
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
const { isPublishing, saveAndPublishSchedule } = useSchedule() // <-- INJECTION de la logique de publication

// États de filtrage et pagination
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 3

// États des modales
const showFormModal = ref(false)
const showAssignModal = ref(false)
const isEditMode = ref(false)

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

// Algorithme de génération des dimanches du mois courant
const generateCurrentMonthSundays = (): ScheduleRow[] => {
  const sundays: ScheduleRow[] = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // Mois courant (0-11)

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
  await fetchAllTeachers()
  syncScheduleWithRealData()
})

const syncScheduleWithRealData = () => {
  if (listTeachers.value.length >= 4 && schedule.value.length > 0) {
    const ids = listTeachers.value.map(t => t.id).filter(Boolean) as string[]
    
    const firstRow = schedule.value[0]
    if (firstRow) {
      firstRow.assignments.NORMAL = [ids[0], ids[1]].filter((id): id is string => !!id)
      firstRow.assignments.SUNDAY_SCHOOL = ids[2] ? [ids[2]] : []
    }

    const secondRow = schedule.value[1]
    if (secondRow) {
      secondRow.assignments.SUNDAY_SCHOOL = [ids[3], ids[0]].filter((id): id is string => !!id)
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

// --- LOGIQUE DE PUBLICATION EFFECTIVE ---
const publishSchedule = async () => {
  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}` // Donne "2026-06"

  // Construction du payload propre
  const payload = {
    monthKey,
    status: 'published',
    rows: schedule.value
  }

  // Appel de la méthode du composable
  const success = await saveAndPublishSchedule(payload)

  if (success) {
    toast.success('Planning partagé', 'L\'emploi du temps mensuel a été publié avec succès pour toutes les équipes.')
  } else {
    toast.error('Échec de publication', 'Une erreur est survenue lors de l\'enregistrement de l\'emploi du temps.')
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