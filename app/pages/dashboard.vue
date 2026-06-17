<template>
  <div v-if="pending">
    <Loader name="du Tableau de Bord" />
  </div>
  <div v-else-if="error" class="p-lg text-error">{{ error.message }}</div>
  
  <main v-else-if="stats" ref="desktopMain" class="flex-1 w-full bg-background overflow-x-hidden p-4 md:p-6 space-y-6 pb-24 md:pb-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/30 pb-4">
      <div>
        <h2 class="font-h2 text-2xl md:text-3xl font-bold text-primary">Dashboard</h2>
        <p class="font-body-sm text-xs md:text-sm text-on-surface-variant">Bienvenue, Admin. Données globales réelles.</p>
      </div>
      
      <div class="w-full sm:w-64 relative">
        <select v-model="filtreClasse" class="w-full pl-4 pr-10 py-2.5 bg-white border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body text-on-surface ultra-minimal-shadow cursor-pointer text-sm">
          <option v-for="classe in classeEDCE" :key="classe" :value="classe">{{ classe }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
          <Icon name="arrow_drop_down" size="1.5rem" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
      <button @click="navigateTo('/teachers')" class="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-label-md hover:scale-98 transition-transform ultra-shadow text-sm font-medium">
        <Icon size="1.25rem" name="add_circle" />
        Voir la liste des moniteurs
      </button>
      <button @click="navigateTo('/tests')" class="flex items-center justify-center gap-2 px-5 py-3 bg-primary-container text-white rounded-xl font-label-md hover:scale-98 transition-transform ultra-shadow text-sm font-medium">
        <Icon size="1.25rem" name="assignment" />
        Voir les tests
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="glass-card p-4 flex flex-col justify-between ultra-shadow transition-all hover:border-primary">
        <div>
          <p class="text-xs font-medium text-on-surface-variant mb-1">Enfants ({{ filtreClasse }})</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-2xl md:text-3xl font-bold text-primary">{{ (childStatistics?.count || 0).toString().padStart(2, '0') }}</h3>
            <span class="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{{ ((childStatistics?.rate || 0) * 100).toFixed(1) }}%</span>
          </div>
        </div>
        <div class="mt-4 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-500" :style="`width: ${(childStatistics?.rate || 0) * 100}%`"></div>
        </div>
      </div>
      
      <div class="glass-card p-4 flex flex-col justify-between ultra-shadow transition-all hover:border-primary">
        <div>
          <p class="text-xs font-medium text-on-surface-variant mb-1">Séances créées</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-2xl md:text-3xl font-bold text-primary">{{ getStatsSeance.count }}</h3>
            <span class="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{{ (getStatsSeance.rate * 100).toFixed(1) }}%</span>
          </div>
        </div>
        <div class="mt-4 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-500" :style="`width: ${(getStatsSeance.rate * 100)}%`"></div>
        </div>
      </div>

      <div class="glass-card p-4 flex flex-col justify-between ultra-shadow transition-all hover:border-primary">
        <div>
          <p class="text-xs font-medium text-on-surface-variant mb-1">Enseignants actifs</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-2xl md:text-3xl font-bold text-primary">{{ (teacherStatistics?.teachersAvailable || 0).toString().padStart(2, '0') }}</h3>
            <span class="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{{ (percentTeachers * 100).toFixed(1) }}%</span>
          </div>
        </div>
        <div class="mt-4 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-500" :style="`width: ${percentTeachers * 100}%`"></div>
        </div>
      </div>

      <div class="glass-card p-4 flex items-center gap-3 ultra-shadow transition-all hover:border-primary">
        <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon size="1.5rem" name="history" />
        </div>
        <div>
          <p class="text-xs font-medium text-on-surface-variant">Total Activités</p>
          <h3 class="font-h1 text-2xl font-bold text-primary">{{ totalStatistics?.totalLengthActivities || 0 }}</h3>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="glass-card p-4 md:p-6 flex flex-col justify-between">
        <h4 class="font-h3 text-base md:text-lg font-bold mb-4 text-on-surface">Répartition par classe</h4>
        <div class="flex items-end gap-3 h-48 px-2 w-full pt-4 border-b border-outline-variant/30">
          <div v-for="classe in classeEDCE" :key="classe" class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div class="w-full bg-primary/20 rounded-t-lg hover:bg-primary transition-colors cursor-pointer" :style="`height: calc(100% * ${childrenPerClassCount(classe)?.rate || 0})`"></div>
            <span class="text-[10px] md:text-xs font-medium text-on-surface-variant truncate max-w-full">{{ classe }}</span>
          </div>
        </div>
      </div>

      <div @click="showSuccessModal = true" class="glass-card p-4 md:p-6 cursor-pointer hover:shadow-md hover:border-primary transition-all duration-300">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-h3 text-base md:text-lg font-bold text-on-surface">Succès aux examens</h4>
          <span class="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
            <Icon name="visibility" size="1.1rem" /> Détails
          </span>
        </div>
        <div class="space-y-3">
          <div v-if="isLoading" class="w-full flex justify-center items-center">
            <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    class="w-8 h-8 sm:w-16 sm:h-12 md:w-12 md:h-16 fill-primary"
                  >
                    <!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
                    <g>
                      <circle cx="12" cy="3.5" r="1.5">
                        <animateTransform attributeName="transform" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="0 12 12;90 12 12;180 12 12;270 12 12"/>
                        <animate attributeName="opacity" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
                      </circle>
                      <circle cx="12" cy="3.5" r="1.5" transform="rotate(30 12 12)">
                        <animateTransform attributeName="transform" begin="0.2s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="30 12 12;120 12 12;210 12 12;300 12 12"/>
                        <animate attributeName="opacity" begin="0.2s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
                      </circle>
                      <circle cx="12" cy="3.5" r="1.5" transform="rotate(60 12 12)">
                        <animateTransform attributeName="transform" begin="0.4s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="60 12 12;150 12 12;240 12 12;330 12 12"/>
                        <animate attributeName="opacity" begin="0.4s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
                      </circle>
                    </g>
                  </svg>
          </div>
          <div v-else-if="notesbyYear" v-for="classe in classeEDCE" :key="classe">
            <div class="flex justify-between text-xs font-medium mb-1">
              <span>{{ classe }}</span>
              <span class="text-primary font-bold">{{ percentSuccessbyClasse(classe).toFixed(1) }}%</span>
            </div>
            <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div class="h-full bg-secondary rounded-full transition-all duration-500" :style="`width: ${percentSuccessbyClasse(classe)}%`"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="glass-card overflow-hidden" @click="navigateTo('/children')">
      <div class="px-4 py-3 md:px-6 border-b border-outline-variant flex justify-between items-center">
        <h4 class="font-h3 text-base font-bold text-on-surface">Liste des enfants ({{ filtreClasse }})</h4>
        <button class="text-primary font-medium text-xs hover:underline">Voir tout</button>
      </div>
      <div class="overflow-x-auto w-full custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead class="bg-surface-container-low text-xs text-on-surface-variant font-medium">
            <tr>
              <th class="px-4 py-3">Nom</th>
              <th class="px-4 py-3">Classe</th>
              <th class="px-4 py-3">Âge</th>
              <th class="px-4 py-3">Téléphone Parent</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30 text-sm">
            <tr v-for="child in childrenFiltered.slice(0, 3)" :key="child?.id || 'none'" class="hover:bg-surface-container-lowest transition-colors group">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {{ getFullName(child?.name).initials }}
                  </div>
                  <div class="truncate max-w-[180px]">
                    <p class="font-medium text-on-surface truncate">{{ getFullName(child?.name)?.name || '--' }}</p>
                    <p class="text-[10px] text-on-surface-variant">Mail non défini</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">{{ child?.classe }}</td>
              <td class="px-4 py-3 text-xs">{{ getAgeByBirthDate(child?.birth_date || new Date()) }} ans</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200/50">{{ child?.telParent || 'Non défini' }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-1">
                  <button class="p-1.5 text-on-surface-variant hover:text-primary rounded-md"><Icon size="1.2rem" name="visibility" /></button>
                  <button class="p-1.5 text-on-surface-variant hover:text-primary rounded-md"><Icon size="1.2rem" name="edit" /></button>
                  <button class="p-1.5 text-error hover:text-error/80 rounded-md"><Icon size="1.2rem" name="delete" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-1 glass-card flex flex-col">
        <div class="p-4 border-b border-outline-variant">
          <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Contacts Parents ({{ filtreClasse }})</h4>
        </div>
        <div class="p-4 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
          <div v-for="parentInfo in filteredParentInfos" :key="parentInfo.tel" class="flex items-center justify-between group">
            <div class="flex items-center gap-3 truncate">
              <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                <Icon size="1.1rem" class="text-primary" name="call" />
              </div>
              <div class="truncate">
                <p class="text-xs font-medium truncate">{{ parentInfo.name }}</p>
                <p class="text-[10px] text-on-surface-variant">{{ parentInfo.tel }}</p>
              </div>
            </div>
            <button class="p-2 flex justify-center items-center rounded-full hover:bg-primary-container hover:text-white transition-colors shrink-0" @click="copyToClipboard(parentInfo.tel)">
              <Icon size="1.1rem" name="chat" />
            </button>
          </div>
        </div>
      </div>

      <div @click="showDeliberationModal = true" class="xl:col-span-2 glass-card cursor-pointer hover:shadow-md hover:border-primary transition-all duration-300">
        <div class="p-4 border-b border-outline-variant flex justify-between items-center">
          <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Délibération fin d'année (Top 3)</h4>
          <span class="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
            <Icon name="workspace_premium" size="1.1rem" /> Registre complet
          </span>
        </div>
        <div v-if="isLoading" class="w-full p-4 space-y-3 flex justify-center items-center">
            <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    class="w-8 h-8 sm:w-16 sm:h-12 md:w-12 md:h-16 fill-primary"
                  >
                    <!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
                    <g>
                      <circle cx="12" cy="3.5" r="1.5">
                        <animateTransform attributeName="transform" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="0 12 12;90 12 12;180 12 12;270 12 12"/>
                        <animate attributeName="opacity" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
                      </circle>
                      <circle cx="12" cy="3.5" r="1.5" transform="rotate(30 12 12)">
                        <animateTransform attributeName="transform" begin="0.2s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="30 12 12;120 12 12;210 12 12;300 12 12"/>
                        <animate attributeName="opacity" begin="0.2s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
                      </circle>
                      <circle cx="12" cy="3.5" r="1.5" transform="rotate(60 12 12)">
                        <animateTransform attributeName="transform" begin="0.4s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="60 12 12;150 12 12;240 12 12;330 12 12"/>
                        <animate attributeName="opacity" begin="0.4s" dur="0.6s" repeatCount="indefinite" values="1;1;0"/>
                      </circle>
                    </g>
                  </svg>
          </div>
        <div v-else-if="notesbyYear" class="p-4 space-y-3">
          <div v-for="(classementFinal, index) in totalDeliberationList.slice(0, 3)" v-if="totalDeliberationList.length!=0" :key="classementFinal.childId" class="flex items-center gap-3">
            <span :class="['w-5 font-bold text-center text-sm', index === 0 ? 'text-secondary text-base' : 'text-on-surface-variant']">{{ index + 1 }}</span>
            <div class="flex-1 flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 text-sm">
              <span class="font-medium truncate max-w-[200px]">{{ getNamebyId(classementFinal.childId) || 'Non défini' }}</span>
              <span class="font-bold text-primary">{{ classementFinal.moyGen }}</span>
            </div>
          </div>
          <div v-else class="text-primary text-center">
            <p>Information Indisponible.</p>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="showSuccessModal" :title="`Statut des Examens — ${filtreClasse}`" size="lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
        <div class="space-y-3">
          <h5 class="flex items-center gap-2 font-bold text-green-700 bg-green-50 p-2 rounded-lg sticky top-0 text-sm">
            <Icon name="check_circle" class="text-green-600" />
            Enfants Réussis ({{ successSundayList.passed.length }})
          </h5>
          <div v-if="successSundayList.passed.length === 0" class="text-xs text-on-surface-variant italic p-4 text-center">Aucun élève.</div>
          <div v-for="item in successSundayList.passed" :key="item.id" class="flex justify-between items-center bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg text-sm">
            <span class="font-medium text-on-surface">{{ item.name }}</span>
            <span class="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold text-xs">{{ item.moyenne !== null ? item.moyenne.toFixed(2) : '--' }}</span>
          </div>
        </div>
        <div class="space-y-3">
          <h5 class="flex items-center gap-2 font-bold text-error bg-error/5 p-2 rounded-lg sticky top-0 text-sm">
            <Icon name="cancel" class="text-error" />
            Enfants Échoués ({{ successSundayList.failed.length }})
          </h5>
          <div v-if="successSundayList.failed.length === 0" class="text-xs text-on-surface-variant italic p-4 text-center">Aucun échec. Bravo !</div>
          <div v-for="item in successSundayList.failed" :key="item.id" class="flex justify-between items-center bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg text-sm">
            <span class="font-medium text-on-surface">{{ item.name }}</span>
            <span class="px-2 py-0.5 bg-error/10 text-error rounded font-bold text-xs">{{ item.moyenne !== null ? item.moyenne.toFixed(2) : '--' }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-outline-variant rounded-lg text-sm transition-colors" @click="showSuccessModal = false">Fermer</button>
      </template>
    </Modal>

    <Modal v-model="showDeliberationModal" :title="`Registre de Délibération — ${filtreClasse}`" size="md">
      <div class="p-1 max-h-[50vh] overflow-y-auto space-y-2 custom-scrollbar">
        <p class="text-xs text-on-surface-variant mb-3">Classement récapitulatif par moyenne générale globale pour l'année.</p>
        <div v-for="(row, idx) in totalDeliberationList" v-if="totalDeliberationList.length != 0" :key="row.childId" class="flex items-center gap-3 bg-surface-container-low border border-outline-variant/40 p-2.5 rounded-xl text-sm">
          <span :class="['w-6 text-center font-bold', idx === 0 ? 'text-secondary text-base' : 'text-on-surface-variant']">{{ idx + 1 }}</span>
          <div class="flex-1 flex justify-between items-center">
            <span class="font-medium text-on-surface truncate max-w-[180px]">{{ row?.name }}</span>
            <span class="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 text-xs">{{ Number(row.moyGen).toFixed(2) }}</span>
          </div>
        </div>
        <div v-else class="text-primary text-center">
            <p>Information Indisponible.</p>
          </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm" @click="showDeliberationModal = false">Terminer l'analyse</button>
      </template>
    </Modal>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNote } from '~/composables/useNote'
import { getAgeByBirthDate } from '~/utils/getAgebyBirthDate'
import { getFullName } from '~/utils/getFullName'
import { useDashboard } from '../composables/useDashboard'
import { classes } from '../stores/child'
import type { ClasseType } from '../types/classe'
import {useToast} from '~/composables/useToast'

const { stats, pending, error } = useDashboard()

const toast=useToast()
const router = useRouter()
const navigateTo = (to: string) => {
  router.push(to)
} 

const listChildrenFromApi = computed(() => stats.value?.listStats?.listChildren || [])
const listSeancesFromApi = computed(() => stats.value?.listStats.listSeances || [])

const classeEDCE = ref<ClasseType[]>(classes)
const filtreClasse = ref<ClasseType>("Petit")

const showSuccessModal = ref(false)
const showDeliberationModal = ref(false)

const totalStatistics = computed(() => stats.value?.totalStats)
const teacherStatistics = computed(() => stats.value?.teachersStats)

const childStatistics = computed(() => {
  return stats.value?.childrenStats?.childrenPerClass?.find(
    (c: any) => c.classe === filtreClasse.value
  ) || { count: 0, rate: 0 }
})

const percentTeachers = computed(() => {
  const available = teacherStatistics.value?.teachersAvailable || 0
  const total = totalStatistics.value?.totalLengthTeachers || 1
  return available / total
})

const childrenPerClassCount = (classe: ClasseType) => {
  return stats.value?.childrenStats?.childrenPerClass?.find((c: any) => c.classe === classe)
}

const childrenFiltered = computed(() => {
  return listChildrenFromApi.value.filter((child: any) => child.classe === filtreClasse.value)
})

const filteredParentInfos = computed(() => {
  return listChildrenFromApi.value
    .filter((child: any) => child.classe === filtreClasse.value)
    .map((child: any) => {
      const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
      const parentName = child.name.trim().split(' ')[0]
      return { name: `${denomination} ${parentName}`, tel: child.telParent || child.tel }
    })
})

const getStatsSeance = computed(() => {
  const count = listSeancesFromApi.value.filter((s: any) => s.classe === filtreClasse.value).length
  const totalSeances = listSeancesFromApi.value.length || 1
  return { count: count, rate: count / totalSeances }
})

const { 
  getClassementFinal, 
  getNamebyId, 
  percentSuccessbyClasse, 
  fetchAllNotesData,
  isLoading,
  getPassageDeliberation,
  notesbyYear,
} = useNote()

const classementsFinal = computed(() => {
  return getClassementFinal(filtreClasse.value)
})

const successSundayList = computed(() => {
  const currentYear = new Date().getFullYear().toString()
  const sundaySchoolMoyennes = notesbyYear.value?.sundaySchool?.moyenne?.[currentYear] || []
  
  const passed: any[] = []
  const failed: any[] = []

  childrenFiltered.value.forEach((child: any) => {
    const isPassed = getPassageDeliberation(child)
    const childMoy = sundaySchoolMoyennes.find((m: any) => m.childId === child.id)?.moyenne ?? null
    
    const childPayload = { id: child.id, name: child.name, moyenne: childMoy }
    if (isPassed) {
      passed.push(childPayload)
    } else {
      failed.push(childPayload)
    }
  })

  passed.sort((a, b) => b.moyenne - a.moyenne)
  failed.sort((a, b) => b.moyenne - a.moyenne)

  return { passed, failed }
})

const totalDeliberationList = computed(() => {
  return classementsFinal.value.map((row: any) => {
      return {
      childId: row.childId,
      classe: row.classe,
      name: getNamebyId(row.childId),
      moyGen: row.moyGen
    }
    
  }).filter(item => item.name !== '' && item.moyGen !== 'Pas de la classe')
})
const copyToClipboard = async(numero:string)=>{
  //Logique de copie du numéro
  try {
    await navigator.clipboard.writeText(numero)
    toast.success('Lien copié dans le presse-papiers')
  } 
  catch(err) {
    toast.error('Erreur lors de la copie')
  }
}


const desktopMain = ref<HTMLElement | null>(null)

onMounted(async () => {
  await fetchAllNotesData()
  document.querySelectorAll<HTMLElement>('.glass-card').forEach((card) => {
    card.addEventListener('mouseenter', () => card.style.borderColor = '#2D5BE3')
    card.addEventListener('mouseleave', () => card.style.borderColor = '#E8E4DE')
  })

  if (desktopMain.value) {
    desktopMain.value.style.opacity = '0'
    desktopMain.value.style.transform = 'translateY(10px)'
    desktopMain.value.style.transition = 'all 0.5s ease-out'
    window.setTimeout(() => {
      if (!desktopMain.value) return
      desktopMain.value.style.opacity = '1'
      desktopMain.value.style.transform = 'translateY(0)'
    }, 50)
  }
})

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'EDCE Admin Dashboard' })
</script>

<style scoped>
.ultra-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.glass-card { background: #FFFFFF; border: 1px solid #E8E4DE; border-radius: 16px; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E4DE; border-radius: 10px; }
</style>