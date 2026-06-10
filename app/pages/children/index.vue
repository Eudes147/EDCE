<template>
  <div class="p-8 max-w-7xl mx-auto w-full space-y-8">
    <!-- Header Section -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="font-h1 text-h1 text-on-background text-2xl font-bold">Gestion des Enfants</h2>
        <p class="font-body text-body text-on-surface-variant mt-1">
          Supervisez les inscriptions, les notes et les participations aux événements de vos enfants.
        </p>
      </div>
    </div>

    <!-- 1. Children List Table -->
    <section class="section-card overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/20">
      <div class="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 class="font-h3 text-h3 flex items-center gap-2 font-semibold">
          <Icon name="format_list_bulleted" class="text-primary" />
          Liste des Enfants
        </h3>
        <div class="flex items-center gap-3">
          <select 
            v-model="classeSelected" 
            class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2 focus:ring-primary focus:outline-none"
          >
            <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">
              {{ child_classe }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Nom Complet</th>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Classe</th>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Niveau Scolaire</th>
              <th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            <tr 
              v-for="child in childrenPerClass[classeSelected]" 
              :key="child.id"
              @click="attribute(child)" 
              class="hover:bg-surface-container-low transition-colors cursor-pointer"
              :class="{'bg-primary/5': attributeChild?.id === child.id}"
            >
              <td class="px-6 py-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {{ getFullName(child.name).initials }}
                </div>
                <span class="font-body text-body font-medium text-doomu-text">{{ child.name }}</span>
              </td>
              <td class="px-6 py-4 text-body text-doomu-text">{{ child.classe }}</td>
              <td class="px-6 py-4 text-body text-doomu-text">{{ child?.nivScolaire || 'Non défini' }}</td>

              <td class="px-6 py-4 text-right space-x-2">
                <button @click.stop="view(child)" class="text-outline hover:text-primary transition-colors" title="Voir">
                  <Icon name="visibility" class="text-[20px]"/>
                </button>
                <button @click.stop="edit(child)" class="text-outline hover:text-primary transition-colors" title="Modifier">
                  <Icon name="edit" class="text-[20px]"/>
                </button>
                <button @click.stop="supprimer(child)" class="text-outline hover:text-error transition-colors" title="Supprimer">
                  <Icon name="delete" class="text-[20px]"/>
                </button>
              </td>
            </tr>
            <tr v-if="!childrenPerClass[classeSelected] || childrenPerClass[classeSelected]?.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-doomu-text-muted font-body">
                Aucun enfant inscrit dans cette classe.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 2. Attribution de Notes & 5. Add New Child (Asymmetric Grid) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Attribution de Notes -->
      <div class="lg:col-span-2 section-card overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
        <div>
          <div class="p-6 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 class="font-h3 text-h3 flex items-center gap-2 font-semibold">
              <Icon name="assignment" class="text-secondary-container"/>
              Attribution de Notes
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-small text-outline">Test:</span>
              <select v-model="testSelectedId" class="text-small bg-transparent border-none font-medium text-primary cursor-pointer focus:ring-0 focus:outline-none">
                <option v-for="test in getTestbyClasse(classeSelected)" :value="test.id" :key="test.id">
                  {{ test.titleTest }}
                </option>
              </select>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-if="!attributeChild" class="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-dashed border-outline-variant/40">
                <p class="text-doomu-text-muted text-sm">Sélectionnez un enfant dans la liste ci-dessus en cliquant sur sa ligne pour lui attribuer une note.</p>
              </div>
              <div v-else class="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-primary/20">
                <div class="flex-1 font-body text-body font-medium text-doomu-text">
                  Note pour : <span class="text-primary font-bold">{{ attributeChild.name }}</span>
                </div>
                <div class="w-24">
                  <input 
                    v-model="note" 
                    class="w-full bg-white border border-outline-variant/50 rounded-lg text-small px-3 py-1.5 focus:ring-primary focus:outline-none text-doomu-text" 
                    placeholder="Note" 
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                  />
                </div>
                <div class="w-32">
                  <button 
                    class="w-full bg-primary text-white hover:bg-primary-dark transition-all text-small font-semibold py-1.5 rounded-lg shadow-sm" 
                    @click="saveNote(attributeChild.id, testSelectedId)"
                    :disabled="isNoteLoading"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Form: Add New Child -->
      <div class="section-card p-6 h-fit bg-white rounded-xl shadow-sm border border-outline-variant/20">
        <h3 class="font-h3 text-h3 mb-6 flex items-center gap-2 font-semibold">
          <Icon name="add_circle" class="text-primary"/>
          Nouvelle Inscription
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Nom Complet <span class="text-error">*</span></label>
            <input v-model="formChild.name" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: AHOUNANSOU Viviane" type="text" required />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Genre</label>
              <select v-model="formChild.sexe" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none">
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Féminin</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Date Naiss. <span class="text-error">*</span></label>
              <input v-model="dateSelected" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" type="date" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Classe EDCE</label>
              <select v-model="formChild.classe" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none">
                <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Niveau Scolaire <span class="text-error">*</span></label>
              <input v-model="formChild.nivScolaire" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: CP2" type="text" required />
            </div>
          </div>
          
          <div v-if="formChild.classe?.includes('Junior')">
            <label class="block font-caption text-caption text-outline mb-1.5">Téléphone Personnel</label>
            <input v-model="formChild.tel" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: 0198564789" type="text" />
          </div>

          <div class="py-2">
            <button 
              class="w-full border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-outline rounded-lg py-3 flex flex-col items-center gap-1 transition-all bg-doomu-bg/20" 
              @click="activeParentModal = true" 
              type="button"
            >
              <p class="text-center flex items-center justify-center"><Icon name="family_history" /></p>
              <span class="text-small font-medium">
                {{ formChild.telParent && formChild.telParent !== '01xxxxxxxx' ? '👨‍👩‍👦 Parent configuré' : 'Associer des Parents' }}
              </span>
            </button>
          </div>

          <button 
            class="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform" 
            type="submit"
            :disabled="isLoading"
          >
            Finaliser l'Inscription
          </button>
        </form>
      </div>
    </div>

    <!-- ⬇️ LES DEUX CARDS D'ÉVÉNEMENTS RÉINTÉGRÉES ICI ⬇️ -->
<div class="space-y-6">
    <!-- ========================================== -->
    <!-- SECTION DES CARDS COMPACTES (MAX 2)        -->
    <!-- ========================================== -->
    <div v-if="isLoading" class="text-sm text-on-surface-variant italic py-4">
      Chargement des activités...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="(children, activityTitle) in limitedActivitiesWithChildren" 
        :key="activityTitle"
        class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-primary transition-all group"
      >
        <div>
          <!-- En-tête de la carte d'activité -->
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            <h4 class="font-bold font-h3 text-on-surface text-base group-hover:text-primary transition-colors">
              {{ activityTitle }}
            </h4>
          </div>

          <!-- Liste limitée à 3 enfants participants -->
          <p class="text-caption text-on-surface-variant mb-4">
            Participants récents :
          </p>
          
          <ul class="space-y-2 mb-6">
            <!-- Si aucun participant n'est trouvé dans le mock pour cette activité -->
            <li v-if="children.length === 0" class="text-xs text-on-surface-variant italic pl-2">
              Aucun participant enregistré
            </li>

            <li 
              v-for="child in children.slice(0, 3)" 
              :key="child.id"
              class="flex items-center gap-2 text-sm text-on-surface font-body bg-surface-container-low/50 px-3 py-1.5 rounded-lg"
            >
              <Icon name="person" class="text-on-surface-variant text-[16px]" />
              {{ child.last_name }} {{ child.first_name }}
            </li>
            
            <!-- Indicateur de surplus -->
            <li v-if="children.length > 3" class="text-caption text-primary font-medium pl-2 italic">
              + {{ children.length - 3 }} autre(s) enfant(s) inscrit(s)
            </li>
          </ul>
        </div>

        <!-- Bouton d'action pour associer un enfant -->
        <button 
          @click="openAssociationModal(activityTitle)"
          class="w-full bg-primary/5 hover:bg-primary text-primary hover:text-on-primary font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-primary/10"
        >
          <Icon name="person_add" />
          Associer un enfant
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODALE D'ASSOCIATION ENFANT 🔁 ACTIVITÉ    -->
    <!-- ========================================== -->
    <Modal 
      v-model="isModalOpen" 
      :title="`Inscrire un enfant à : ${selectedActivityTitle}`" 
      size="md"
    >
      <div class="space-y-4 py-2">
        <p class="text-body-sm text-on-surface-variant">
          Sélectionnez l'enfant à inscrire à cette session d'activité d'événement.
        </p>

        <!-- Sélecteur d'enfants issus de listChildren du composable -->
        <div class="flex flex-col gap-1.5">
          <label class="text-caption font-bold text-on-surface-variant">Enfants disponibles</label>
          <select 
            v-model="selectedChildId"
            class="w-full p-3 border border-outline-variant rounded-xl bg-white focus:ring-2 focus:ring-primary focus:border-primary text-sm font-body text-on-surface"
          >
            <option value="" disabled>-- Choisir un enfant --</option>
            <option 
              v-for="child in childrenPerClass[classeSelected]" 
              :key="child.id" 
              :value="child.id"
            >
              {{ child.name ? child.name.toUpperCase() : '' }}
            </option>
          </select>
        </div>

        <div class="p-3 bg-surface-container-high rounded-xl flex gap-2 items-start mt-2">
          <Icon name="info" class="text-primary mt-0.5" />
          <p class="text-xs text-on-surface-variant">
            L'inscription ajoutera immédiatement l'enfant au registre de l'activité liée à l'année en cours.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 w-full">
          <button 
            class="px-4 py-2.5 border border-outline rounded-xl text-on-surface w-full hover:bg-surface-container active:scale-95 transition-all text-sm font-bold" 
            @click="isModalOpen = false"
          >
            Annuler
          </button>
          <button 
            class="px-4 py-2.5 bg-primary text-on-primary font-bold rounded-xl w-full hover:opacity-90 active:scale-95 transition-all text-sm shadow-sm flex items-center justify-center gap-1"
            :disabled="!selectedChildId"
            @click="submitAssociation"
          >
            <Icon name="done" />
            Confirmer l'inscription
          </button>
        </div>
      </template>
    </Modal>
  </div>
    
    <!-- Modal : Parents -->
    <Modal v-model="activeParentModal" title="Informations Parents" size="md">
      <div class="space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Civilité</label>
              <select v-model="formChild.sexeParent" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none">
                <option value="Masculin">Mr (Père)</option>
                <option value="Feminin">Mme (Mère)</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Nom de famille hérité</label>
              <input class="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 text-doomu-text-muted font-medium" :value="formChild.name ? formChild.name.trim().split(' ')[0] : '-'" disabled type="text" />
            </div>
          </div>
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Téléphone du Responsable <span class="text-error">*</span></label>
            <input v-model="formChild.telParent" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: +2290195487596" type="tel" />
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg transition-colors" @click="activeParentModal = false">Annuler</button>
        <button class="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm" @click="validateParent">Valider le parent</button>
      </template>
    </Modal>

    <!-- Modal : View -->
    <Modal v-model="showViewModal" title="Détails de l'enfant" size="md">
      <div v-if="childSelected" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-doomu-text-muted">Nom Complet</p>
            <p class="font-medium text-doomu-text text-base">{{ childSelected.name }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Genre</p>
            <p class="font-medium text-doomu-text">{{ childSelected.sexe }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Classe EDCE</p>
            <p class="font-medium text-doomu-text">{{ childSelected.classe }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Niv. Scolaire</p>
            <p class="font-medium text-doomu-text">{{ childSelected.nivScolaire || 'Non défini' }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Téléphone Enfant</p>
            <p class="font-medium text-doomu-text">{{ childSelected.tel || 'Aucun' }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Téléphone Parent</p>
            <p class="font-medium text-doomu-text">{{ childSelected.telParent }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-doomu-bg hover:bg-doomu-border rounded-lg text-doomu-text transition-colors" @click="showViewModal = false">Fermer</button>
      </template>
    </Modal>

    <!-- Modal : Edit -->
    <Modal v-model="showEditModal" title="Modifier la fiche enfant" size="md">
      <div v-if="childSelected" class="space-y-4">
        <form @submit.prevent="handleUpdate" id="editChildForm" class="space-y-4">
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Nom Complet</label>
            <input v-model="childSelected.name" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none focus:border-primary" type="text" required />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Genre</label>
              <select v-model="childSelected.sexe" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none">
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Féminin</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Date Naissance</label>
              <input v-model="editDateSelected" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none" type="date" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Classe EDCE</label>
              <select v-model="childSelected.classe" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none">
                <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Niveau Scolaire</label>
              <input v-model="childSelected.nivScolaire" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none" type="text" required />
            </div>
          </div>
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Téléphone Parent</label>
            <input v-model="childSelected.telParent" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none" type="tel" required />
          </div>
        </form>
      </div>
      <template #footer>
        <button type="button" class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg" @click="showEditModal = false">Annuler</button>
        <button type="submit" form="editChildForm" class="px-6 py-2 bg-primary text-white rounded-lg shadow-sm" :disabled="isLoading">Enregistrer</button>
      </template>
    </Modal>

    <!-- Modal : Delete -->
    <Modal v-model="showDeleteModal" title="Supprimer la fiche d'inscription" size="sm">
      <div v-if="childSelected" class="space-y-3 text-center py-2">
        <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <Icon name="delete" class="text-[24px]" />
        </div>
        <p class="text-body font-medium text-doomu-text">Confirmez-vous la désinscription définitive de l'enfant ?</p>
        <p class="text-sm font-bold text-error bg-error/5 p-2 rounded border border-error/20">
          {{ childSelected.name }} ({{ childSelected.classe }})
        </p>
      </div>
      <template #footer>
        <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text w-full hover:bg-doomu-bg" @click="showDeleteModal = false">Annuler</button>
        <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:bg-error-dark" @click="confirmDelete" :disabled="isLoading">Supprimer</button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { classes } from "~/stores/child"
import { useChildren } from '~/composables/useChild'
import { useTest } from '~/composables/useTest'
import { useNote } from '~/composables/useNote' 
import { useToast } from '~/composables/useToast'
import type { ClasseType } from '~/types/classe'
import type { Child, childSubmit } from '~/types/child'

definePageMeta({
  layout: 'dashboard',
})

// --- COMPOSABLES GENERAUX ---
const actualYear = computed(() => new Date().getFullYear().toString())
const toast = useToast()
const { childrenPerClass, getFullName, fetchAllChildren, createChild, updateChild, deleteChild, isLoading } = useChildren()
const { getTestbyClasse } = useTest()
const { createNote } = useNote() 

// --- INSTANCIATION DU STORE DES PARTICIPANTS (Résout l'erreur 7022 & 2769) ---
const participantEventStore = useParticipantEventActivity()

// Extraction des refs réactives et méthodes nécessaires
const listEventActivity = participantEventStore.listEventActivity
const listActivities = participantEventStore.listActivities
const createParticipantEventActivity = participantEventStore.createParticipantEventActivity
const fetchAllEventData = participantEventStore.fetchAllEventData
const isEventLoading = participantEventStore.isLoading

// --- ETATS DE NAVIGATION / SELECTION ---
const activeParentModal = ref(false)
const child_classes = ref(classes)
const classeSelected = ref<ClasseType>('Petit')
const attributeChild = ref<Child | null>(null)
const childSelected = ref<Child | null>(null)

// --- VISIBILITE DES MODALES ---
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// --- GESTION LOCALE DES DATES POUR LES INPUTS HTML ---
const dateSelected = ref<string|undefined>("")
const editDateSelected = ref<string|undefined>("")

// --- GESTION DES ATTRIBUTIONS DE NOTES ---
const note = ref<number | null>(null)
const testSelectedId = ref("")
const isNoteLoading = ref(false)

// --- FORMULAIRE REACTIF D'INSCRIPTION ---
const formChild = ref<childSubmit>({
  classe: 'Petit',
  name: '',
  sexe: 'Masculin',
  birth_date: new Date(),
  nivScolaire: '',
  sexeParent: 'Masculin',
  tel: '',
  telParent: '',
})

// --- ETATS LOCAUX COMPOSANTE PARTICIPANTS / EVENT ---
const isModalOpen = ref(false)
const selectedActivityTitle = ref('')
const selectedChildId = ref('')

// --- CHARGEMENT INITIAL GLOBAL ---
onMounted(async () => {
  await fetchAllChildren()
  await fetchAllEventData()
  resetTestSelection()
})

// --- WATCHERS ET SYNCHRONISATIONS ---
watch(dateSelected, (newDate) => {
  if (newDate) formChild.value.birth_date = new Date(newDate)
})

const resetTestSelection = () => {
  const availableTests = getTestbyClasse.value(classeSelected.value)
  
  if (availableTests && availableTests.length > 0) {
    // Si on a des tests, on prend l'ID du premier (on sait qu'il existe, pas besoin de ?.id)
    testSelectedId.value = availableTests[0]?.id || ""
  } else {
    // Sinon, on remet à vide
    testSelectedId.value = ""
  }
}
watch(classeSelected, () => {
  resetTestSelection()
  attributeChild.value = null 
})

// --- PROPRIETE CALCULEE : PARTICIPANTS ---
const limitedActivitiesWithChildren = computed<Record<string, any[]>>(() => {
  // Appel sécurisé via l'instance du store pour éviter l'initialisation implicite 'any'
  const fullCrossedData = participantEventStore.getChildrenByActivityTitle('2026', 'regular' as any) as Record<string, any[]>
  
  return Object.fromEntries(
    Object.entries(fullCrossedData).slice(0, 2)
  )
})

// --- ACTIONS METIERS : ENFANTS ---
const attribute = (child: Child) => {
  attributeChild.value = child
}

const validateParent = () => {
  if (!formChild.value.telParent || formChild.value.telParent.includes('x')) {
    toast.warning('Numéro invalide', 'Veuillez saisir le numéro de téléphone réel du parent.')
    return
  }
  toast.success('Parent mémorisé', 'Les informations du tuteur légal ont été rattachées.')
  activeParentModal.value = false
}

const handleSubmit = async () => {
  if (!formChild.value.name.trim()) {
    toast.warning("Champs requis", "Le nom complet de l'enfant est obligatoire.")
    return
  }
  if (!dateSelected.value) {
    toast.warning("Champs requis", "La date de naissance est obligatoire.")
    return
  }
  if (!formChild.value.telParent || formChild.value.telParent === '01xxxxxxxx') {
    toast.warning("Parent manquant", "Veuillez associer un numéro de parent avant de valider.")
    return
  }

  try {
    await createChild({
      name: formChild.value.name,
      sexe: formChild.value.sexe,
      birth_date: formChild.value.birth_date,
      classe: formChild.value.classe,
      nivScolaire: formChild.value.nivScolaire,
      sexeParent: formChild.value.sexeParent,
      tel: formChild.value.tel || 'Aucun',
      telParent: formChild.value.telParent
    })
    
    toast.success('Inscription validée', `${formChild.value.name} a été inscrit en classe ${formChild.value.classe}.`)
    
    formChild.value = {
      classe: classeSelected.value,
      name: '',
      sexe: 'Masculin',
      birth_date: new Date(),
      nivScolaire: '',
      sexeParent: 'Masculin',
      tel: '',
      telParent: '',
    }
    dateSelected.value = ""
  } catch (err) {
    toast.error("Échec de l'inscription", "Le serveur a renvoyé une erreur lors du traitement.")
  }
}

const handleUpdate = async () => {
  if (!childSelected.value) return
  
  try {
    const payload: Partial<Child> = {
      name: childSelected.value.name,
      sexe: childSelected.value.sexe,
      classe: childSelected.value.classe,
      nivScolaire: childSelected.value.nivScolaire,
      telParent: childSelected.value.telParent
    }
    
    if (editDateSelected.value) {
      payload.birth_date = new Date(editDateSelected.value)
    }

    await updateChild(childSelected.value.id, payload)
    toast.success('Fiche modifiée', `Les modifications pour ${childSelected.value.name} ont été enregistrées.`)
    showEditModal.value = false
  } catch (err) {
    toast.error('Erreur', 'Impossible de mettre à jour le profil de l\'enfant.')
  }
}

const confirmDelete = async () => {
  if (!childSelected.value) return
  const name = childSelected.value.name
  try {
    await deleteChild(childSelected.value.id)
    toast.success('Enfant supprimé', `La fiche de ${name} a été définitivement retirée.`);
    showDeleteModal.value = false
    if (attributeChild.value?.id === childSelected.value.id) attributeChild.value = null
    childSelected.value = null
  } catch (err) {
    toast.error('Erreur', 'Suppression impossible depuis le serveur.')
  }
}

// --- ACTIONS METIERS : NOTES ---
const saveNote = async (childId: string, testId: string | undefined) => {
  if (!testId) {
    toast.error('Opération impossible', "Aucun test ou épreuve n'a été sélectionné pour cette classe.")
    return
  }
  
  if (note.value === null || note.value === undefined || note.value < 0 || note.value > 20) {
    toast.warning('Note incorrecte', 'La note doit être comprise entre 0 et 20.')
    return
  }

  isNoteLoading.value = true
  try {
    if (createNote) {
      await createNote({
        childId,
        testId: testId as string, // Cast explicite pour résoudre l'erreur 2322 🎯
        note: note.value
      })
      toast.success('Note enregistrée', `La note de ${note.value}/20 a été ajoutée avec succès.`)
      note.value = null 
    }
  } catch (err) {
    toast.error('Erreur', "La note n'a pas pu être sauvegardée.")
  } finally {
    isNoteLoading.value = false
  }
}

// --- ACTIONS METIERS : PARTICIPANTS / EVENT ---
const openAssociationModal = (activityTitle: string) => {
  selectedActivityTitle.value = activityTitle
  selectedChildId.value = ''
  isModalOpen.value = true
}

const submitAssociation = async () => {
  if (!selectedChildId.value) return

  const associatedActivity = listActivities.value.find((a: any) => a.title === selectedActivityTitle.value)
  const associatedEvent = listEventActivity.value.find(
    (e: any) => e.activityId === associatedActivity?.id && e.year === '2026'
  )

  if (!associatedEvent || !associatedEvent.id) {
    alert("Impossible de procéder à l'inscription : aucun événement correspondant trouvé pour 2026.")
    return
  }

  const newParticipant = {
    id: `part-${Date.now()}`, 
    childId: selectedChildId.value,
    eventActivityId: associatedEvent.id
  }

  await createParticipantEventActivity(newParticipant)
  
  isModalOpen.value = false
  selectedChildId.value = ''
}

// --- CONTRÔLEURS DE VISIBILITÉ ---
const view = (child: Child) => {
  childSelected.value = { ...child }
  showViewModal.value = true
}

const edit = (child: Child) => {
  childSelected.value = { ...child }
  if (child.birth_date && editDateSelected.value) {
    editDateSelected.value = new Date(child.birth_date).toISOString().split('T')[0]
  } else {
    editDateSelected.value = ""
  }
  showEditModal.value = true
}

const supprimer = (child: Child) => {
  childSelected.value = child
  showDeleteModal.value = true
}
</script>
