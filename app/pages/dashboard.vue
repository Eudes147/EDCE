<template>
  <div v-if="pending">
    <Loader name="du Tableau de Bord" />
  </div>
  <div v-else-if="error" class="p-lg text-error">{{ error.message }}</div>
  
  <main v-else-if="stats" ref="desktopMain" class="hidden md:flex flex-1 flex-col min-w-0 h-full bg-background overflow-hidden">
    <header class="flex justify-between items-center w-full px-margin-desktop py-sm h-16 bg-background border-b border-outline-variant">
      <div class="flex items-center gap-4">
        <h2 class="font-h2 text-h2 font-bold text-primary">Dashboard</h2>
      </div>
      <div class="flex items-center gap-lg">
        <div class="flex items-center gap-4">
          <button class="text-on-surface-variant hover:text-primary transition-colors">
            <Icon size="1.5rem" name="notifications" />
          </button>
          <button class="text-on-surface-variant hover:text-primary transition-colors">
            <Icon size="1.5rem" name="help" />
          </button>
          <div class="h-8 w-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden">
            <img class="w-full h-full object-cover" alt="Admin" src="" />
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-margin-desktop space-y-lg">
      <div class="relative flex flex-wrap gap-md">
        <button @click="navigateTo('/teachers')" class="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md hover:scale-95 transition-transform ultra-shadow">
          <Icon size="1.5rem" name="add_circle" />
          Voir la liste des moniteurs
        </button>
        <button @click="navigateTo('/tests')" class="flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-lg font-label-md hover:scale-95 transition-transform ultra-shadow">
          <Icon size="1.5rem" name="assignment" />
          Voir les tests
        </button>
        <div class="absolute right-0 w-full md:w-64">
          <select v-model="filtreClasse" class="w-full pl-4 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body text-on-surface ultra-minimal-shadow cursor-pointer">
            <option v-for="classe in classeEDCE" :key="classe" :value="classe">{{ classe }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Enfants totaux</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">{{ (childStatistics?.count || 0).toString().padStart(2, '0') }}</h3>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{{ ((childStatistics?.rate || 0) * 100).toFixed(2) }}%</span>
          </div>
          <div class="mt-4 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary" :style="`width: ${(childStatistics?.rate || 0) * 100}%`"></div>
          </div>
        </div>
        
        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Séances créées (Classe)</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">{{ getStatsSeance.count }}</h3>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{{ (getStatsSeance.rate * 100).toFixed(2) }}%</span>
          </div>
          <div class="mt-4 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary" :style="`width: ${getStatsSeance.rate * 100}%`"></div>
          </div>
        </div>

        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Enseignants actifs</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">{{ (teacherStatistics?.teachersAvailable || 0).toString().padStart(2, '0') }}</h3>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{{ (percentTeachers * 100).toFixed(2) }}%</span>
          </div>
          <div class="mt-4 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary" :style="`width: ${percentTeachers * 100}%`"></div>
          </div>
        </div>

        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Total Activités</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">{{ totalStatistics?.totalLengthActivities || 0 }}</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <div class="glass-card p-lg pb-0 flex flex-col justify-center items-start">
          <h4 class="font-h3 text-h3 mb-lg">Répartition par classe</h4>
          <div class="flex items-end gap-4 h-48 px-2 w-full">
            <div v-for="classe in classeEDCE" :key="classe" class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-primary/20 rounded-t-md hover:bg-primary transition-colors" :style="`height: calc(10rem * ${childrenPerClassCount(classe)?.rate || 0})`"></div>
              <span class="font-label-sm text-on-surface-variant">{{ classe }}</span>
            </div>      
          </div>
        </div>

        <div class="glass-card p-lg">
          <h4 class="font-h3 text-h3 mb-lg">Succès aux examens (Sunday school)</h4>
          <div class="space-y-md">
            <div v-for="classe in classeEDCE" :key="classe">
              <div class="flex justify-between mb-2">
                <span class="font-label-md">{{ classe }}</span>
                <span class="font-label-md text-primary">{{ percentSuccessbyClasse(classe).toFixed(2) }}%</span>
              </div>
              <div class="h-2 bg-surface-container-high rounded-full">
                <div class="h-full bg-secondary rounded-full" :style="`width: ${percentSuccessbyClasse(classe)}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="glass-card overflow-hidden">
        <div class="px-lg py-md border-b border-outline-variant flex justify-between items-center">
          <h4 class="font-h3 text-h3">Liste des enfants ({{ filtreClasse }})</h4>
          <button class="text-primary font-label-md hover:underline">Voir tout</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Nom</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Classe</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Age</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Téléphone</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <tr v-for="child in childrenFiltered.slice(0, 10)" :key="child?.id || 'none'" class="hover:bg-surface-container-lowest transition-colors group">
                <td class="px-lg py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {{ getFullName(child?.name).initials }}
                    </div>
                    <div>
                      <p class="font-label-md text-on-surface">{{ getFullName(child?.name)?.name || '--' }}</p>
                      <p class="text-[11px] text-on-surface-variant">Mail non défini</p>
                    </div>
                  </div>
                </td>
                <td class="px-lg py-4 font-body-sm">{{ child?.classe }}</td>
                <td class="px-lg py-4 font-body-sm">{{ getAgeByBirthDate(child?.birth_date || new Date()) }} ans</td>
                <td class="px-lg py-4">
                  <span class="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">{{ child?.telParent || 'Non défini' }}</span>
                </td>
                <td class="px-lg py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <button class="text-on-surface-variant hover:text-primary"><Icon size="1.5rem" name="visibility" /></button>
                    <button class="text-on-surface-variant hover:text-primary"><Icon size="1.5rem" name="edit" /></button>
                    <button class="text-error hover:text-error-container"><Icon size="1.5rem" name="delete" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-gutter pb-xl">
        <div class="xl:col-span-1 glass-card flex flex-col">
          <div class="p-md border-b border-outline-variant">
            <h4 class="font-label-md text-on-surface font-bold uppercase tracking-wider">Contacts Parents ({{ filtreClasse }})</h4>
          </div>
          <div class="p-4 space-y-4 overflow-y-auto max-h-[350px]">
            <div v-for="parentInfo in filteredParentInfos" :key="parentInfo.tel" class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                  <Icon size="1.2rem" class="text-primary" name="call" />
                </div>
                <div>
                  <p class="font-label-sm">{{ parentInfo.name }}</p>
                  <p class="text-[10px] text-on-surface-variant">{{ parentInfo.tel }}</p>
                </div>
              </div>
              <button class="p-2 flex justify-center items-center rounded-full hover:bg-primary-container hover:text-white transition-colors">
                <Icon size="1.2rem" name="chat" />
              </button>
            </div>
          </div>
        </div>

        <div class="xl:col-span-2 glass-card">
          <div class="p-md border-b border-outline-variant">
            <h4 class="font-label-md text-on-surface font-bold uppercase tracking-wider">Délibération de fin d'année (Top 3)</h4>
          </div>
          <div class="p-lg">
            <div v-for="(classementFinal, index) in classementsFinal.slice(0, 3)" :key="classementFinal.childId" class="space-y-md">
              <div class="flex items-center gap-4 my-3">
                <span :class="['w-6 font-h3', index === 0 ? 'text-secondary' : 'text-on-surface-variant']">{{ index + 1 }}</span>
                <div class="flex-1 flex items-center justify-between bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  <span class="font-label-md">{{ getNamebyId(classementFinal.childId) || 'Non défini' }}</span>
                  <span class="font-bold text-primary">{{ classementFinal.moyGen }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div v-else class="md:hidden min-h-[max(884px,100dvh)] w-full font-body-md text-body-md overflow-x-hidden bg-background">
    <header class="sticky top-0 z-50 bg-background flex justify-between items-center w-full px-margin-mobile py-sm h-16 border-b border-outline-variant">
      <div class="flex items-center gap-2">
        <h1 class="font-h3 text-h3 font-bold text-primary">EDCE</h1>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <Icon size="1.5rem" name="notifications" />
        </button>
        <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors" @click="showDashboardMenu?.()">
          <Icon size="1.5rem" name="menu" />
        </button>
      </div>
    </header>

    <main class="px-margin-mobile py-md space-y-md">
      <section>
        <h2 class="font-h2 text-h2-mobile text-on-surface">Tableau de bord</h2>
        <p class="font-body-sm text-on-surface-variant">Bienvenue, Admin. Données globales réelles.</p>
      </section>

      <section class="grid grid-cols-1 gap-sm">
        <div class="bg-white border border-[#E8E4DE] p-sm rounded-xl custom-shadow flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
            <Icon size="1.5rem" name="child_care" />
          </div>
          <div>
            <p class="font-label-sm text-on-surface-variant">Total enfants</p>
            <p class="font-h3 text-h3">{{ totalStatistics?.totalLengthChildren || 0 }}</p>
          </div>
        </div>
        <div class="bg-white border border-[#E8E4DE] p-sm rounded-xl custom-shadow flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
            <Icon size="1.5rem" name="school" />
          </div>
          <div>
            <p class="font-label-sm text-on-surface-variant">Séances totales</p>
            <p class="font-h3 text-h3">{{ totalStatistics?.totalLengthSeances || 0 }}</p>
          </div>
        </div>
        <div class="bg-white border border-[#E8E4DE] p-sm rounded-xl custom-shadow flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <Icon size="1.5rem" name="group" />
          </div>
          <div>
            <p class="font-label-sm text-on-surface-variant">Moniteurs actifs</p>
            <p class="font-h3 text-h3">{{ (teacherStatistics?.teachersAvailable || 0) }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, inject } from 'vue' // 👈 Correction : Ajout de onMounted
import { useChildren } from '~/composables/useChild'
import { useNote } from '~/composables/useNote'
import { useSeance } from '~/composables/useSeance'
import { useDashboard } from '../composables/useDashboard'
import { classes } from '../stores/child'
import { getFullName } from '~/utils/getFullName'
import type { ClasseType } from '../types/classe'
import { useRouter } from 'vue-router'

// 1. Appel unique de l'API de statistiques (via ton Composable global)
const { stats, pending, error } = useDashboard()

const router = useRouter()
const navigateTo = (to: string) => {
  router.push(to)
} 

// 2. Extraction des listes issues des states de l'API
const listChildrenFromApi = computed(() => stats.value?.listStats?.listChildren || [])
const listSeancesFromApi = computed(() => stats.value?.listStats.listSeances || [])

const classeEDCE = ref<ClasseType[]>(classes)
const filtreClasse = ref<ClasseType>("Petit")

// 3. STATS ET FILTRES DYNAMIQUES (Synchronisés à l'API)
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

const childrenPerClassCount = computed(() => { 
  return (classe: ClasseType) => {
    return stats.value?.childrenStats?.childrenPerClass?.find((c: any) => c.classe === classe)
  }
})

// Filtrage local des listes vivantes transmises par l'API selon la classe choisie
const childrenFiltered = computed(() => {
  return listChildrenFromApi.value.filter((child: any) => child.classe === filtreClasse.value)
})

const filteredParentInfos = computed(() => {
  // Récupération des infos parents calculées proprement par l'API pour la classe active
  return listChildrenFromApi.value
    .filter((child: any) => child.classe === filtreClasse.value)
    .map((child: any) => {
      const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
      const parentName = child.name.trim().split(' ')[0]
      return { name: `${denomination} ${parentName}`, tel: child.telParent || child.tel }
    })
})

// Séances
const getStatsSeance = computed(() => {
  const count = listSeancesFromApi.value.filter((s: any) => s.classe === filtreClasse.value).length
  const totalSeances = listSeancesFromApi.value.length || 1
  return { count, rate: count / totalSeances }
})

// 4. LOGIQUE DES NOTES (Fonctions pures réactives)
const { getClassementFinal, getNamebyId, percentSuccessbyClasse } = useNote()

const classementsFinal = computed(() => {
  return getClassementFinal(filtreClasse.value)
})

// Helpers utilitaires
const getAgeByBirthDate = (birthDate: string | Date) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// 5. ANIMATIONS ET INTERACTIONS
const desktopMain = ref<HTMLElement | null>(null)
const showDashboardMenu = inject<() => void>('showDashboardMenu')

onMounted(() => {
  document.querySelectorAll<HTMLElement>('.glass-card').forEach((card) => {
    card.addEventListener('mouseenter', () => card.style.borderColor = '#2D5BE3')
    card.addEventListener('mouseleave', () => card.style.borderColor = '#E8E4DE')
  })

  if (desktopMain.value) {
    desktopMain.value.style.opacity = '0'
    desktopMain.value.style.transform = 'translateY(10px)'
    desktopMain.value.style.transition = 'all 0.6s ease-out'
    window.setTimeout(() => {
      if (!desktopMain.value) return
      desktopMain.value.style.opacity = '1'
      desktopMain.value.style.transform = 'translateY(0)'
    }, 100)
  }
})

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'EDCE Admin Dashboard' })
</script>

<style scoped>
.ultra-shadow, .custom-shadow { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.glass-card { background: #FFFFFF; border: 1px solid #E8E4DE; border-radius: 12px; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #E8E4DE; border-radius: 10px; }
</style>