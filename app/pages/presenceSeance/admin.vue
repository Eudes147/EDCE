<template>
  <div class="p-3 sm:p-4 md:p-8 max-w-[1200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
    
    <!-- ENTÊTE DE LA PAGE -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-surface">Tableau de Bord des Présences</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-0.5">Analyse mensuelle de l'assiduité et rapports de présence des moniteurs.</p>
      </div>

      <!-- FILTRE TEMPOREL DE LA PÉRIODE DYNAMIQUE -->
      <div class="flex items-center gap-2 w-full sm:w-auto bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/40">
        <span class="text-xs font-bold text-on-surface-variant px-2 uppercase tracking-wide">Période</span>
        <select 
          v-model="selectedMonth" 
          @change="loadAdministrativeData"
          class="bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option v-for="month in dynamicMonthsOptions" :key="month.key" :value="month.key">
            {{ month.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- ZONE DE CHARGEMENT -->
    <div v-if="isLoadingAttendance" class="p-16 text-center bg-white border border-outline-variant rounded-xl shadow-sm">
      <div class="animate-spin inline-block w-8 h-8 border-[2px] border-primary border-t-transparent rounded-full mb-3"></div>
      <p class="text-xs sm:text-sm text-on-surface-variant font-medium">Calcul des statistiques administratives...</p>
    </div>

    <div v-else class="space-y-6 sm:space-y-8">
      
      <!-- CARTES DES INDICATEURS CLÉS (KPI) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Taux Global d'Assiduité -->
        <div class="bg-white border border-outline-variant/60 p-4 rounded-xl shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold tracking-wider uppercase text-on-surface-variant">Taux d'assiduité global</span>
            <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">%</div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl sm:text-2xl font-black text-on-surface">{{ statistics.globalRate }}%</span>
          </div>
          <p class="text-[10px] text-on-surface-variant">Ratio de présence sur la totalité des séances émargées.</p>
        </div>

        <!-- Volume de Séances Émargées -->
        <div class="bg-white border border-outline-variant/60 p-4 rounded-xl shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold tracking-wider uppercase text-on-surface-variant">Séances Validées</span>
            <div class="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center text-success font-bold text-xs">✓</div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl sm:text-2xl font-black text-on-surface">{{ statistics.totalSessions }}</span>
          </div>
          <p class="text-[10px] text-on-surface-variant">Nombre de fiches de présence uniques enregistrées.</p>
        </div>

        <!-- Volume d'absences totales -->
        <div class="bg-white border border-outline-variant/60 p-4 rounded-xl shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold tracking-wider uppercase text-on-surface-variant">Manquements cumulés</span>
            <div class="w-7 h-7 rounded-lg bg-error/10 flex items-center justify-center text-error font-bold text-xs">!</div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl sm:text-2xl font-black text-on-surface">{{ statistics.totalAbsences }}</span>
          </div>
          <p class="text-[10px] text-on-surface-variant">Volume de moniteurs marqués absents ce mois-ci.</p>
        </div>
      </div>
      <select 
          v-model="classeSelected" 
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option v-for="sun in classes" :key="sun" :value="sun">{{ sun }}</option>
        </select>
        <select 
          v-model="slotTypeSelected" 
          class="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option v-for="sun in slotTypes" :key="sun" :value="sun">{{ sun }}</option>
        </select>
      <!-- LE TABLEAU MATRICE DES PRÉSENCES -->
      <div class="bg-white border border-outline-variant/70 rounded-xl shadow-sm overflow-hidden">
        <div class="p-4 border-b border-outline-variant/40 bg-surface-container-lowest">
          <h3 class="text-xs sm:text-sm font-bold text-on-surface">Matrice Individuelle des Moniteurs</h3>
          <p class="text-[11px] text-on-surface-variant mt-0.5">Suivi croisé nominatif par rapport aux dimanches de la période.</p>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full border-collapse text-left text-xs">
            <!-- Entête Dynamique des Colonnes -->
            <thead>
              <tr class="bg-surface-container-low/40 border-b border-outline-variant text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                <th class="p-4 min-w-[180px]">Moniteur</th>
                <th v-for="sunday in uniqueSundaysInRecords" :key="sunday" class="p-4 text-center min-w-[110px]">
                  {{ sunday.replace('Dimanche ', '') }}
                </th>
                <th class="p-4 text-right min-w-[90px]">Score Global</th>
              </tr>
            </thead>

            <!-- Corps de la Matrice -->
            <tbody class="divide-y divide-outline-variant/40 text-on-surface font-body">
              <tr v-if="matrixRows.length === 0">
                <td :colspan="uniqueSundaysInRecords.length + 2" class="p-8 text-center text-on-surface-variant">
                  Aucune donnée d'émargement disponible pour ce mois.
                </td>
              </tr>
              
              <tr v-for="row in matrixRows" :key="row.teacherId" class="hover:bg-surface-container-low/10 transition-colors">
                <!-- Profil Moniteur -->
                <td class="p-4 font-semibold">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-[10px] uppercase border border-outline-variant/40">
                      {{ row.firstName.charAt(0) }}{{ row.lastName.charAt(0) }}
                    </div>
                    <div class="truncate">
                      <p class="truncate text-xs">{{ row.firstName }} {{ row.lastName }}</p>
                    </div>
                  </div>
                </td>

                <!-- Les Cellules Statuts des Dimanches -->
                <td v-for="sunday in uniqueSundaysInRecords" :key="sunday" class="p-4 text-center">
                  <div class="flex justify-center items-center gap-1">
                    <span 
                      v-if="row.history[sunday] === 'PRESENT'" 
                      class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-success/10 text-success text-[10px] font-black border border-success/20"
                      title="Présent"
                    >P</span>
                    <span 
                      v-else-if="row.history[sunday] === 'ABSENT'" 
                      class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-error/10 text-error text-[10px] font-black border border-error/20"
                      title="Absent"
                    >A</span>
                    <span 
                      v-else 
                      class="text-outline/40 text-xs font-semibold"
                      title="Non planifié ou non émargé"
                    >—</span>
                  </div>
                </td>

                <!-- Pourcentage d'assiduité du moniteur -->
                <td class="p-4 text-right font-bold">
                  <span :class="[
                    'px-2 py-1 rounded text-[10px] font-black',
                    row.attendanceRate >= 80 ? 'bg-success/10 text-success' : row.attendanceRate >= 50 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                  ]">
                    {{ row.attendanceRate }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTeacher } from '~/composables/useTeacher'
import { useAttendance } from '~/composables/useAttendance'
import type { ClasseType } from '~/types/classe'
import type { SeanceType } from '~/types/seance'
import {classes} from '~/stores/child'

definePageMeta({
  layout: 'dashboard'
})

// Accès aux services réactifs
const { listTeachers, fetchAllTeachers } = useTeacher()
const { isLoading: isLoadingAttendance, savedAttendances, fetchAllAttendancesByMonth, fetchAttendanceByContext } = useAttendance()

interface MonthOption {
  key: string
  label: string
}

interface TeacherMatrixRow {
  teacherId: string
  firstName: string
  lastName: string
  history: Record<string, 'PRESENT' | 'ABSENT' | 'NONE'>
  attendanceRate: number
}
// Select
const slotTypes = ["NORMAL","SUNDAY_SCHOOL","DLT"]
const classeSelected=ref<ClasseType>('JuniorA')
const slotTypeSelected=ref<SeanceType>("NORMAL")
// Le mois sélectionné initialisé dynamiquement à l'instant T
const now = new Date()
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
const selectedMonth = ref<string>(currentMonthKey)

// Génération dynamique des mois (Précédent, Courant, Suivant) autour de l'année réelle
const dynamicMonthsOptions = computed<MonthOption[]>(() => {
  const options: MonthOption[] = []
  const baseDate = new Date()
  
  for (let i = -1; i <= 1; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1)
    const year = d.getFullYear()
    const monthStr = String(d.getMonth() + 1).padStart(2, '0')
    const monthLabel = d.toLocaleString('fr-FR', { month: 'long' })
    
    options.push({
      key: `${year}-${monthStr}`,
      label: `${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)} ${year}`
    })
  }
  
  return options
})

// Fonction de chargement des données
const loadAdministrativeData = async () => {
  if (selectedMonth.value) {
    await fetchAllAttendancesByMonth(selectedMonth.value)
  }
}

// 🔄 ÉCOUTEUR RÉACTIF : Dès que selectedMonth change, on recharge automatiquement les données depuis l'API
watch(selectedMonth, async (newMonth) => {
  if (newMonth) {
    await loadAdministrativeData()
  }
})



// Initialisation globale au montage du composant
onMounted(async () => {
  await fetchAllTeachers()
  await loadAdministrativeData()
})

/**
 * 📆 Extrait de manière unique tous les dimanches ayant fait l'objet d'un émargement réel
 */
const uniqueSundaysInRecords = computed<string[]>(() => {
  if (!Array.isArray(savedAttendances.value.filter(s=>s.className==classeSelected.value && s.slotType == slotTypeSelected.value))) return []
  const sundays = (savedAttendances.value.filter(s=>s.className==classeSelected.value && s.slotType == slotTypeSelected.value)).map(record => String(record.dateLabel))
  return [...new Set(sundays)].sort()
})

/**
 * 📊 STRUCTURE MATRICIELLE DES DONNÉES PAR MONITEUR
 */
const matrixRows = computed<TeacherMatrixRow[]>(() => {
  // Sécurité si les enseignants ne sont pas encore chargés
  if (!Array.isArray(listTeachers.value) || listTeachers.value.length === 0) return []

  return listTeachers.value.map(teacher => {
    const history: Record<string, 'PRESENT' | 'ABSENT' | 'NONE'> = {}
    let totalPlannedAndChecked = 0
    let totalPresentCount = 0

    // Si aucun enregistrement n'existe pour le mois, l'historique de chaque dimanche restera à 'NONE'
    uniqueSundaysInRecords.value.forEach(sunday => {
      const sundaySheets = ((savedAttendances.value.filter(s=>s.className==classeSelected.value && s.slotType == slotTypeSelected.value)) || []).filter(s => String(s.dateLabel) === sunday)
      let finalStatus: 'PRESENT' | 'ABSENT' | 'NONE' = 'NONE'

      sundaySheets.forEach(sheet => {
        if (!Array.isArray(sheet.assignments)) return
        const match = sheet.assignments.find(a => a.teacherId === teacher.id)
        if (match) {
          finalStatus = match.isPresent ? 'PRESENT' : 'ABSENT'
        }
      })

      history[sunday] = finalStatus

      if (finalStatus !== 'NONE') {
        totalPlannedAndChecked++
        if (finalStatus === 'PRESENT') {
          totalPresentCount++
        }
      }
    })

    const attendanceRate = totalPlannedAndChecked > 0 
      ? Math.round((totalPresentCount / totalPlannedAndChecked) * 100) 
      : 0

    return {
      teacherId: teacher.id || '',
      firstName: teacher.first_name || 'Inconnu',
      lastName: teacher.last_name || 'Moniteur',
      history,
      attendanceRate
    }
  })
  // Suppression du filtre .filter() bloquant pour que le tableau affiche toujours vos moniteurs, même vides.
})

/**
 * 📈 CALCULS MACRO DES INDICES DE RENDEMENT (KPI CARDS)
 */
const statistics = computed(() => {
  if (!Array.isArray(savedAttendances.value.filter(s=>s.className==classeSelected.value && s.slotType == slotTypeSelected.value)) || (savedAttendances.value.filter(s=>s.className==classeSelected.value && s.slotType == slotTypeSelected.value)).length === 0) {
    return { globalRate: 0, totalSessions: 0, totalAbsences: 0 }
  }

  let globalCheckedCount = 0
  let globalPresenceCount = 0
  let totalAbsences = 0

  savedAttendances.value.filter(s=>s.className==classeSelected.value && s.slotType == slotTypeSelected.value).forEach(sheet => {
    if (!Array.isArray(sheet.assignments)) return
    sheet.assignments.forEach(assignment => {
      globalCheckedCount++
      if (assignment.isPresent) {
        globalPresenceCount++
      } else {
        totalAbsences++
      }
    })
  })

  const globalRate = globalCheckedCount > 0 
    ? Math.round((globalPresenceCount / globalCheckedCount) * 100) 
    : 0

  return {
    globalRate,
    totalSessions: (savedAttendances.value.filter(s=>s.className==classeSelected.value && s.slotType == slotTypeSelected.value)).length,
    totalAbsences
  }
})
</script>