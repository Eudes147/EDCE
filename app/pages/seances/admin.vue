<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full space-y-4 md:space-y-8">
    
    <div class="flex justify-between items-end px-1">
      <div>
        <h2 class="font-h1 text-lg sm:text-xl md:text-2xl font-bold text-on-background">Registre des Séances</h2>
        <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-1">
          Visualisez, modifiez et supprimez les séances d'enseignement de l'année {{ actualYear }}.
        </p>
      </div>
    </div>

    <section class="overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/60">
      <div class="p-4 md:p-6 border-b border-outline-variant/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 class="font-h3 text-sm sm:text-base md:text-h3 flex items-center gap-2 font-semibold text-on-surface">
          <Icon name="school" class="text-primary" size="1.25rem" />
          Liste des Séances créées cette année
        </h3>
        
        <div class="flex flex-row items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end">
          <select 
            v-model="monthSelected" 
            class="bg-surface-container-low border border-outline-variant rounded-lg text-xs md:text-sm px-2.5 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-on-surface cursor-pointer flex-1 sm:flex-none min-w-[110px] sm:min-w-[130px]"
          >
            <option v-for="month in months" :key="month" :value="month">
              {{ month.charAt(0).toUpperCase() + month.slice(1) }}
            </option>
          </select>

          <select 
            v-model="classeSelected" 
            class="bg-surface-container-low border border-outline-variant rounded-lg text-xs md:text-sm px-2.5 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-on-surface cursor-pointer flex-1 sm:flex-none min-w-[110px] sm:min-w-[130px]"
          >
            <option v-for="child_classe in classes" :key="child_classe" :value="child_classe">
              {{ child_classe }}
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse table-fixed lg:table-auto">
          <thead class="bg-surface-container-low border-b border-outline-variant/40">
            <tr>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 w-[45%] lg:w-auto">Titre</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 w-[20%] lg:w-auto max-md:hidden">Type</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 w-[15%] lg:w-auto max-md:hidden">Classe</th>
              <th class="px-4 py-3.5 md:px-6 font-caption text-[11px] md:text-xs uppercase tracking-wider font-semibold text-on-surface-variant/80 text-right w-[20%] min-w-[120px] lg:w-48 ">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30">
            <tr 
              v-for="seance in getSeancebyMonthAndClasse" 
              :key="seance.id" 
              class="hover:bg-surface-container-low/50 transition-colors group">
              <td class="px-5 py-5 md:px-6 align-middle">
                <div class="inline-block bg-primary/5 text-primary px-3 py-2 rounded-lg font-semibold text-xs md:text-sm border border-primary/10 leading-snug">
                  {{ seance.title }}
                </div>
              </td>

              <td class="px-5 py-5 md:px-6 align-middle  max-md:hidden">
                <span class="inline-block px-3 py-1 bg-surface-container rounded-md text-[10px] md:text-xs font-mono tracking-wide text-on-surface-variant font-medium uppercase border border-outline-variant/20">
                  {{ seance.type }}
                </span>
              </td>

              <td class="px-5 py-5 md:px-6 font-body text-xs md:text-sm text-on-surface font-medium whitespace-nowrap align-middle  max-md:hidden">
                {{ seance.classe }}
              </td>

              <td class="px-2 py-2 md:px-6 text-right align-middle">
                <div class="flex items-center justify-end gap-2 sm:gap-3">
                  <button 
                    @click="view(seance)" 
                    class="p-1 md:p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
                    title="Voir les détails"
                  >
                    <Icon name="visibility" size="1.25rem" />
                  </button>
                  <button v-if="authStore.isAdmin || permissionsLocal.canEditSeance"
                    @click="edit(seance)" 
                    class="p-1 md:p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
                    title="Modifier"
                  >                  
                    <Icon name="edit" size="1.25rem" />
                  </button>
                  <button v-if="authStore.isAdmin"
                    @click="supprimer(seance)" 
                    class="p-1 md:p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all" 
                    title="Supprimer"
                  >
                    <Icon name="delete" size="1.25rem" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="isLoading || isGlobalTeachersLoading">
              <td colspan="4" class="px-6 py-12 text-center text-on-surface-variant text-xs md:text-sm font-medium">
                Chargement...
              </td>
            </tr>
            <tr v-else-if="!getSeancebyMonthAndClasse || getSeancebyMonthAndClasse.length === 0">
              <td colspan="4" class="px-6 py-16 text-center text-on-surface-variant italic text-xs md:text-sm">
                Aucune séance trouvée pour la classe <span class="font-semibold text-primary not-italic">{{ classeSelected }}</span> en {{ monthSelected }}.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Modal v-model="showViewModal" title="Détails de la séance" size="md">
      <div v-if="seanceModal" class="space-y-4 py-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40">
          <div class="sm:col-span-2">
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Thème / Titre</p>
            <p class="font-bold text-on-surface text-sm sm:text-base mt-0.5 leading-snug">{{ seanceModal.title }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Type de rassemblement</p>
            <p class="font-semibold text-primary text-xs sm:text-sm mt-0.5">{{ seanceModal.type }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Classe assignée</p>
            <p class="font-semibold text-on-surface text-xs sm:text-sm mt-0.5">{{ seanceModal.classe }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Date de tenue</p>
            <p class="font-medium text-on-surface text-xs sm:text-sm mt-0.5">{{ formatDate(seanceModal.created_at) }}</p>
          </div>
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Créé(e) par</p>
            <p class="font-semibold text-on-surface text-xs sm:text-sm mt-0.5">
              {{ getAuthorSupervisorbySeance(seanceModal)?.authorName || 'Moniteur non renseigné' }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Supervisé par</p>
            <p class="font-medium text-on-surface-variant text-xs sm:text-sm mt-0.5">
              {{ getAuthorSupervisorbySeance(seanceModal)?.supervisorName || 'Aucun superviseur' }}
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
          <button 
            v-if="seanceModal"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm text-xs sm:text-sm w-full sm:w-auto"
            @click="openParticipantsFromView"
          >
            <Icon name="groups" size="1.1rem" />
            Voir les participants
          </button>
          <button 
            v-if="seanceModal"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-tertiary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm text-xs sm:text-sm w-full sm:w-auto"
            @click="openSuperVisorsFromView"
          >
            <Icon name="school" size="1.1rem" />
            Voir les moniteurs
          </button>
          
          <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface transition-colors hover:bg-surface-container text-xs sm:text-sm font-medium w-full sm:w-auto sm:ml-auto" @click="showViewModal = false">Fermer</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showEditModal" title="Modifier la séance" size="lg">
      <div v-if="seanceModal" class="space-y-5 py-1">
        <form @submit.prevent="handleUpdate" id="editSeanceForm" class="space-y-4">
          <div>
            <label class="block font-caption text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Titre de la Séance</label>
            <input 
              v-model="seanceModal.title" 
              class="w-full bg-white border border-outline-variant rounded-lg text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-medium" 
              type="text" 
              required 
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-caption text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Type</label>
              <select v-model="seanceModal.type" class="w-full bg-white border border-outline-variant rounded-lg text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer">
                <option v-for="typeS in typeSeances" :key="typeS" :value="typeS">{{ typeS }}</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Classe</label>
              <select v-model="seanceModal.classe" class="w-full bg-white border border-outline-variant rounded-lg text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer">
                <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <hr class="border-outline-variant/30 my-4">

          <div>
            <label class="block font-caption text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5">
              Superviseur Principal (Obligatoire)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-1 border border-outline-variant/30 rounded-xl custom-scrollbar bg-surface-container-lowest">
              <div 
                v-for="teacher in availableSupervisorsList" 
                :key="`sup-${teacher.id}`"
                @click="selectedSupervisorId = teacher.id"
                :class="[
                  'flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all',
                  selectedSupervisorId === teacher.id ? 'bg-primary/5 border-primary shadow-xs' : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                ]"
              >
                <input 
                  type="radio" 
                  :id="`radio-${teacher.id}`" 
                  :value="teacher.id" 
                  v-model="selectedSupervisorId"
                  class="text-primary focus:ring-primary/20 h-3.5 w-3.5 border-outline-variant"
                  @click.stop
                />
                <label :for="`radio-${teacher.id}`" class="text-xs font-medium text-on-surface truncate cursor-pointer">
                  {{ teacher.first_name.toUpperCase() }} {{ teacher.last_name }}
                </label>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label class="block font-caption text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2 flex items-center gap-1.5">
              Autres Moniteurs présents (Optionnel)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-1 border border-outline-variant/30 rounded-xl custom-scrollbar bg-surface-container-lowest">
              <div 
                v-for="teacher in availableAssistantsList" 
                :key="`asst-${teacher.id}`"
                @click="toggleAssistantSelection(teacher.id)"
                :class="[
                  'flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all',
                  selectedAssistantIds.includes(teacher.id) ? 'bg-secondary/5 border-secondary shadow-xs' : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                ]"
              >
                <input 
                  type="checkbox" 
                  :id="`check-${teacher.id}`" 
                  :value="teacher.id" 
                  v-model="selectedAssistantIds"
                  class="rounded text-secondary focus:ring-secondary/20 h-3.5 w-3.5 border-outline-variant"
                  @click.stop
                />
                <label :for="`check-${teacher.id}`" class="text-xs font-medium text-on-surface truncate cursor-pointer">
                  {{ teacher.first_name.toUpperCase() }} {{ teacher.last_name }}
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <button type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors text-xs sm:text-sm font-medium order-2 sm:order-1" @click="showEditModal = false">Annuler</button>
          <button type="submit" form="editSeanceForm" class="px-5 py-2 bg-primary text-white rounded-lg shadow-sm font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity order-1 sm:order-2" :disabled="isLoading">Enregistrer</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showDeleteModal" title="Supprimer la séance" size="sm">
      <div v-if="seanceModal" class="space-y-3 text-center py-2">
        <div class="w-11 h-11 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <Icon name="delete" size="1.3rem" />
        </div>
        <p class="text-xs sm:text-sm md:text-base font-medium text-on-surface">Êtes-vous sûr de vouloir supprimer définitivement cette séance ? Tous les émargements associés seront perdus.</p>
        <p class="text-xs sm:text-sm font-bold text-error bg-error/5 p-2 rounded border border-error/20 break-words max-w-full">
          {{ seanceModal.title }}
        </p>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface w-full hover:bg-surface-container-low transition-colors text-xs sm:text-sm font-medium order-2 sm:order-1" @click="showDeleteModal = false">Annuler</button>
          <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium order-1 sm:order-2" @click="confirmDelete" :disabled="isLoading">Supprimer</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showParticipantsModal" title="Liste des Participants" size="lg">
      <div v-if="seanceModal" class="space-y-4 py-1">
        <div class="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40 flex flex-col gap-0.5">
          <span class="text-[9px] sm:text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Séance sélectionnée</span>
          <h4 class="font-bold text-sm sm:text-base text-on-surface leading-tight">{{ seanceModal.title }}</h4>
          <p class="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
            <span class="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs rounded font-semibold">{{ seanceModal.classe }}</span>
            <span class="text-on-surface-variant/50">•</span> 
            <span class="font-medium">{{ formatDate(seanceModal.created_at) }}</span>
          </p>
        </div>

        <div class="space-y-2.5">
          <div class="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span class="font-bold text-[10px] sm:text-xs uppercase tracking-wide text-on-surface-variant">Élèves présents</span>
            <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[11px] rounded-full font-bold">
              {{ currentSeanceParticipants.length }} inscrit(s)
            </span>
          </div>

          <div v-if="currentSeanceParticipants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            <div 
              v-for="child in currentSeanceParticipants" 
              :key="child.id"
              class="flex items-center gap-3 p-2.5 bg-surface-container-low/40 rounded-xl border border-outline-variant/40 hover:border-outline-variant transition-all"
            >
              <div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] uppercase flex-shrink-0">
                {{ child.name.substring(0, 2) }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-body text-xs sm:text-sm text-on-surface font-semibold truncate">{{ child.name }}</span>
                <span v-if="child.nivScolaire" class="text-[11px] text-on-surface-variant font-medium truncate">{{ child.nivScolaire }}</span>
              </div>
            </div>
          </div>

          <div class="text-center py-8 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/30" v-else>
            <Icon name="face" size="1.8rem" class="text-on-surface-variant/40 mb-1.5 mx-auto" />
            <p class="font-body text-xs italic text-on-surface-variant">Aucun enfant n'a été émargé présent pour cette séance.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface transition-colors hover:bg-surface-container text-xs sm:text-sm font-medium ml-auto" @click="showParticipantsModal = false">Fermer</button>
      </template>
    </Modal>

    <Modal v-model="showSupervisorsModal" title="Liste des autres Moniteurs" size="lg">
      <div v-if="seanceModal" class="space-y-4 py-1">
        <div class="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40 flex flex-col gap-0.5">
          <span class="text-[9px] sm:text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Séance sélectionnée</span>
          <h4 class="font-bold text-sm sm:text-base text-on-surface leading-tight">{{ seanceModal.title }}</h4>
          <p class="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
            <span class="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs rounded font-semibold">{{ seanceModal.classe }}</span>
            <span class="text-on-surface-variant/50">•</span> 
            <span class="font-medium">{{ formatDate(seanceModal.created_at) }}</span>
          </p>
        </div>

        <div class="space-y-2.5">
          <div class="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span class="font-bold text-[10px] sm:text-xs uppercase tracking-wide text-on-surface-variant">Moniteurs présents</span>
            <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[11px] rounded-full font-bold">
              {{ currentSeanceSupervisors?.length || 0 }} inscrit(s)
            </span>
          </div>

          <div v-if="currentSeanceSupervisors?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            <div 
              v-for="supervisor in currentSeanceSupervisors" 
              :key="supervisor.id"
              class="flex items-center gap-3 p-2.5 bg-surface-container-low/40 rounded-xl border border-outline-variant/40 hover:border-outline-variant transition-all"
            >
              <div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] uppercase flex-shrink-0">
                {{ supervisor?.first_name[0] }}{{ supervisor?.last_name[0] }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-body text-xs sm:text-sm text-on-surface font-semibold truncate">{{ supervisor?.first_name }} {{ supervisor?.last_name }}</span>
                <span v-if="supervisor.tel" class="text-[11px] text-on-surface-variant font-medium truncate">{{ supervisor.tel }}</span>
              </div>
            </div>
          </div>

          <div class="text-center py-8 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/30" v-else>
            <Icon name="face" size="1.8rem" class="text-on-surface-variant/40 mb-1.5 mx-auto" />
            <p class="font-body text-xs italic text-on-surface-variant">Aucun autre moniteur n'a été émargé présent pour cette séance.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-outline-variant rounded-lg text-on-surface transition-colors hover:bg-surface-container text-xs sm:text-sm font-medium ml-auto" @click="showSupervisorsModal = false">Fermer</button>
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
import { ref, computed, onMounted } from 'vue'
import { classes } from '~/stores/child'
import { useSeance } from '~/composables/useSeance'
import { useParticipantSeance } from '~/composables/useParticipant'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import { useSupervisorSeance } from '~/composables/useSupervisor'
import { useTeacher } from '~/composables/useTeacher'
import type { ClasseType } from '~/types/classe'
import type { Month } from '~/types/index'
import type { Seance } from '~/types/seance'

definePageMeta({
  layout: 'dashboard'
})

// Composables & Stores
const toast = useToast()
const authStore = useAuthStore()
const { groupSeanceperYear, typeSeances, fetchAllSeances, updateSeance, deleteSeance, isLoading } = useSeance()
const { isSupervSeanceLoading, listTeachers: activeSeanceTeachers, fetchAllSupervSeances, create: linkSupervisorToSeance } = useSupervisorSeance()
const { getAuthorSupervisorbySeance, fetchAllSeanceData, getChildbySeanceId } = useParticipantSeance()

// Nouveau Composable Enseignants Globaux injecté 🟢
const { listTeachers: allGlobalTeachers, fetchAllTeachers, isLoading: isGlobalTeachersLoading } = useTeacher()

// États d'affichage & Modales
const showViewModal = ref(false)
const showEditModal = ref(false)
const showSupervisorsModal = ref(false)
const showDeleteModal = ref(false)
const showParticipantsModal = ref(false)
const seanceModal = ref<Seance | null>(null)

// 🟢 États d'édition locale pour l'allocation des rôles
const selectedSupervisorId = ref<string>('')
const selectedAssistantIds = ref<string[]>([])
// Conserver la liste brute originale à l'ouverture pour calculer le différentiel (Ajout/Suppression)
let originalAssistantIds: string[] = []

// Filtres de recherche
const classeSelected = ref<ClasseType>("Petit")
const monthSelected = ref<Month>('janvier')
const actualYear = computed(() => new Date().getFullYear().toString())

const months = ref<Month[]>([
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
])
const permissionsLocal = ref()
const seanceId = computed(() => seanceModal.value?.id)

onMounted(async () => {
  await fetchAllSeances()
  await fetchAllSeanceData()
  await fetchAllTeachers() // Synchronisation de la liste de tous les enseignants du système 🟢
})

if (authStore.permissions && authStore.userStatus) {
  permissionsLocal.value = authStore.permissions[authStore.userStatus]
}

// --- COMPUTED FILTRAGES ENSEIGNANTS DANS L'ÉDITION ---

// 1. Liste des superviseurs éligibles (On exclut l'auteur originel de la séance)
const availableSupervisorsList = computed(() => {
  if (!seanceModal.value) return allGlobalTeachers.value
  return allGlobalTeachers.value.filter(t => t.id !== seanceModal.value?.authorId)
})

// 2. Liste des assistants éligibles (On exclut l'auteur et le superviseur principal actuellement choisi)
const availableAssistantsList = computed(() => {
  if (!seanceModal.value) return allGlobalTeachers.value
  return allGlobalTeachers.value.filter(t => t.id !== seanceModal.value?.authorId && t.id !== selectedSupervisorId.value)
})

const currentSeanceParticipants = computed(() => {
  if (!seanceModal.value?.id) return []
  return getChildbySeanceId(seanceModal.value.id)
})

const currentSeanceSupervisors = computed(() => {
  if (!seanceId.value) return []
  return activeSeanceTeachers.value
})

const getSeanceActualYear = computed(() => {
  return groupSeanceperYear.value[actualYear.value] || []
})

const getSeancebyMonthAndClasse = computed(() => {
  return getSeanceActualYear.value.filter(seance => {
    if (!seance.created_at) return false
    const seanceMonth = new Date(seance.created_at).toLocaleString('fr-FR', { month: 'long' })
    return seanceMonth.toLowerCase() === monthSelected.value && seance.classe === classeSelected.value
  })
})

const formatDate = (dateStr: string | Date) => {
  if (!dateStr) return '-'
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}

// --- ACTIONS CLICS MONITEURS ---
const toggleAssistantSelection = (id: string) => {
  const index = selectedAssistantIds.value.indexOf(id)
  if (index > -1) {
    selectedAssistantIds.value.splice(index, 1)
  } else {
    selectedAssistantIds.value.push(id)
  }
}

// --- GESTIONNAIRES ACTIONS SÉANCES ---
const view = async (seance: Seance) => {
  seanceModal.value = { ...seance }
  showViewModal.value = true
  if (seanceId.value) await fetchAllSupervSeances(seanceId.value)
}

const openParticipantsFromView = () => {
  showViewModal.value = false
  showParticipantsModal.value = true
}
const openSuperVisorsFromView = () => {
  showViewModal.value = false
  showSupervisorsModal.value = true
}

// Déclencheur Édition : Hydratation des états de modification locaux 🟢
const edit = async (seance: Seance) => {
  seanceModal.value = { ...seance }
  
  // 1. Charger la liste des enseignants assignés à cette séance spécifique
  await fetchAllSupervSeances(seance.id)

  // 2. Hydrater le superviseur principal obligatoire
  selectedSupervisorId.value = seance.supervisorId || ''

  // 3. Filtrer et hydrater les assistants (les enseignants liés qui ne sont pas le superviseur principal)
  const assistantIds = activeSeanceTeachers.value
    .filter(t => t.id !== seance.supervisorId)
    .map(t => t.id)
  
  selectedAssistantIds.value = [...assistantIds]
  originalAssistantIds = [...assistantIds] // Mémoire tampon pour la comparaison différentielle

  showEditModal.value = true
}

const supprimer = (seance: Seance) => {
  seanceModal.value = seance
  showDeleteModal.value = true
}

// Enregistrement global asynchrone (Option B : Sauvegarde au bouton Enregistrer) 🟢
const handleUpdate = async () => {
  if (!seanceModal.value) return
  if (!selectedSupervisorId.value) {
    toast.warning('Superviseur manquant', 'Le choix du superviseur témoin principal est obligatoire.')
    return
  }

  try {
    // Phase 1 : Mise à jour de la table Séance Racine (inclut le nouveau supervisorId s'il a changé)
    await updateSeance(seanceModal.value.id, {
      title: seanceModal.value.title,
      type: seanceModal.value.type,
      classe: seanceModal.value.classe,
      supervisorId: selectedSupervisorId.value
    })

    // Phase 2 : Ajuster l'assignation du Superviseur Témoin dans la table de jointure
    // On s'assure qu'il est présent (l'API gère ou on force l'ajout)
    await linkSupervisorToSeance({
      seanceId: seanceModal.value.id,
      supervisorSeanceId: selectedSupervisorId.value
    })

    // Phase 3 : Calcul différentiel et synchronisation des Moniteurs Assistants
    
    // A. Identifier les assistants supprimés (présents dans l'original mais plus dans la sélection courante)
    const assistantsToDelete = originalAssistantIds.filter(id => !selectedAssistantIds.value.includes(id))
    for (const idToDelete of assistantsToDelete) {
      await $fetch('/api/supervSeances', {
        method: 'DELETE',
        query: { seanceId: seanceModal.value.id, supervisorSeanceId: idToDelete }
      })
    }

    // B. Identifier les assistants ajoutés (présents dans la sélection courante mais pas dans l'original)
    const assistantsToAdd = selectedAssistantIds.value.filter(id => !originalAssistantIds.includes(id))
    for (const idToAdd of assistantsToAdd) {
      await linkSupervisorToSeance({
        seanceId: seanceModal.value.id,
        supervisorSeanceId: idToAdd
      })
    }

    toast.success('Séance mise à jour', 'Les détails et l\'équipe d\'encadrement ont été modifiés.')
    showEditModal.value = false
    await fetchAllSeances() // Rafraîchir l'affichage global
  } catch (err) {
    console.error(err)
    toast.error('Erreur', 'Impossible de modifier la séance et ses moniteurs.')
  }
}

const confirmDelete = async () => {
  if (!seanceModal.value) return
  const title = seanceModal.value.title
  try {
    await deleteSeance(seanceModal.value.id)
    toast.success('Séance annulée', `La séance "${title}" a été supprimée.`)
    showDeleteModal.value = false
    seanceModal.value = null
    await fetchAllSeances()
  } catch (err) {
    toast.error('Erreur d\'annulation', 'Le serveur a bloqué la suppression de cette séance.')
  }
}
</script>