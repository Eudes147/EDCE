<template>
  <div v-if="isUsersLoading">
    <Loader name="des Utilisateurs" />
  </div>
  <div v-else-if="listUsers" class="max-w-6xl mx-auto p-0 md:p-4 sm:p-6 space-y-6 sm:space-y-8">
    <!-- 📌 EN-TÊTE -->
    <div>
      <h2 class="font-h1 text-xl sm:text-2xl font-bold text-on-surface mb-1 sm:mb-2">Paramètres du système</h2>
      <p class="text-on-surface-variant font-body text-xs sm:text-sm">Gerez les accès, les permissions et les alertes de votre plateforme.</p>
    </div>

    <!-- 🎛️ SYSTEME D'ONGLETS -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px] border border-outline-variant/40">
      <div class="flex border-b border-outline-variant px-4 sm:px-6 bg-surface-bright overflow-x-auto scrollbar-none">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 sm:px-6 py-3 sm:py-4 font-body text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 relative active:scale-95 shrink-0',
            activeTab === tab.id 
              ? 'text-primary border-primary font-bold' 
              : 'text-on-surface-variant border-transparent hover:text-primary'
          ]"
        >
          <Icon :name="tab.icon" size="1.2rem" />
          {{ tab.label }}
        </button>
      </div>

      <!-- 👤 TAB 1 : ACCESSIBILITE (TEACHERS & MODERATORS) -->
      <div v-if="activeTab === 'teachers'" class="p-4 sm:p-6 space-y-6 sm:space-y-8 animate-fade-in">
        
        <!-- SECTION TEACHERS -->
        <div class="space-y-4">
          <h3 class="font-h3 text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
            <Icon name="school" class="text-primary" />
            Enseignants (Teachers)
            <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{{ teachersList.length }}</span>
          </h3>

          <div v-if="isUsersLoading" class="py-12 text-center text-on-surface-variant text-xs sm:text-sm">
            <span class="inline-block">
                  <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        class="w-4 h-4 sm:w-8 sm:h-8 md:w-12 md:h-12 fill-primary"
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
                </span> Chargement des comptes du système...
          </div>

          <div v-else-if="teachersList.length === 0" class="text-center py-8 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/40 text-xs sm:text-sm text-on-surface-variant italic">
            Aucun enseignant (Teacher) n'est configuré actuellement.
          </div>

          <div v-else class="overflow-hidden border border-outline-variant rounded-xl bg-white shadow-sm">
            <!-- Table Desktop (cachée sur mobile) -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead class="bg-surface-container-low font-body text-sm font-bold text-on-surface-variant border-b border-outline-variant">
                  <tr>
                    <th class="px-6 py-4">Utilisateur</th>
                    <th class="px-6 py-4">Email / Téléphone</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/60 font-body text-sm">
                  <tr v-for="teacher in teachersList" :key="teacher.id" class="hover:bg-surface-container-lowest transition-colors">
                    <td class="px-6 py-4 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold uppercase">
                        {{ teacher.last_name?.[0] }}{{ teacher.first_name?.[0] }}
                      </div>
                      <div>
                        <p class="font-bold text-on-surface">{{ teacher.last_name }} {{ teacher.first_name }}</p>
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase tracking-wider">Teacher</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-sm text-on-surface">{{ teacher.email }}</p>
                      <p class="text-xs text-on-surface-variant">{{ teacher.tel || 'Aucun numéro' }}</p>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button 
                        @click="openConfirmationModal(teacher, 'moderator')" 
                        class="text-primary font-bold text-xs bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/10 transition-colors whitespace-nowrap"
                      >
                        Promouvoir Modérateur
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Liste Mobile (cachée sur desktop) -->
            <div class="block md:hidden divide-y divide-outline-variant/40">
              <div v-for="teacher in teachersList" :key="`mob-t-${teacher.id}`" class="p-4 space-y-3 bg-white">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold uppercase text-xs">
                    {{ teacher.last_name?.[0] }}{{ teacher.first_name?.[0] }}
                  </div>
                  <div>
                    <p class="font-bold text-xs text-on-surface">{{ teacher.last_name }} {{ teacher.first_name }}</p>
                    <span class="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase tracking-wider">Teacher</span>
                  </div>
                </div>
                <div class="text-xs space-y-0.5 text-on-surface-variant pl-12">
                  <p class="truncate">{{ teacher.email }}</p>
                  <p>{{ teacher.tel || 'Aucun numéro' }}</p>
                </div>
                <div class="pt-2 pl-12 flex justify-end">
                  <button 
                    @click="openConfirmationModal(teacher, 'moderator')" 
                    class="w-full text-center text-primary font-bold text-xs bg-primary/5 hover:bg-primary/10 py-2 rounded-lg border border-primary/10"
                  >
                    Promouvoir Modérateur
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-outline-variant/60" />

        <!-- SECTION MODERATORS -->
        <div class="space-y-4">
          <h3 class="font-h3 text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
            <Icon name="security" class="text-tertiary" />
            Modérateurs (Moderators)
            <span class="text-xs bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full font-bold">{{ moderatorsList.length }}</span>
          </h3>

          <div v-if="!isUsersLoading && moderatorsList.length === 0" class="text-center py-8 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/40 text-xs sm:text-sm text-on-surface-variant italic">
            Aucun modérateur n'est configuré actuellement.
          </div>

          <div v-else-if="moderatorsList.length > 0" class="overflow-hidden border border-outline-variant rounded-xl bg-white shadow-sm">
            <!-- Table Desktop (cachée sur mobile) -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead class="bg-surface-container-low font-body text-sm font-bold text-on-surface-variant border-b border-outline-variant">
                  <tr>
                    <th class="px-6 py-4">Utilisateur</th>
                    <th class="px-6 py-4">Email / Téléphone</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/60 font-body text-sm">
                  <tr v-for="mod in moderatorsList" :key="mod.id" class="hover:bg-surface-container-lowest transition-colors">
                    <td class="px-6 py-4 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-bold uppercase">
                        {{ mod.last_name?.[0] }}{{ mod.first_name?.[0] }}
                      </div>
                      <div>
                        <p class="font-bold text-on-surface">{{ mod.last_name }} {{ mod.first_name }}</p>
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-tertiary/10 text-tertiary font-medium uppercase tracking-wider">Modérateur</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-sm text-on-surface">{{ mod.email }}</p>
                      <p class="text-xs text-on-surface-variant">{{ mod.tel || 'Aucun numéro' }}</p>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button 
                        @click="openConfirmationModal(mod, 'teacher')" 
                        class="text-error font-bold text-xs bg-error/5 hover:bg-error/10 px-3 py-1.5 rounded-lg border border-error/10 transition-colors whitespace-nowrap"
                      >
                        Rétrograder Teacher
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Liste Mobile (cachée sur desktop) -->
            <div class="block md:hidden divide-y divide-outline-variant/40">
              <div v-for="mod in moderatorsList" :key="`mob-m-${mod.id}`" class="p-4 space-y-3 bg-white">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-bold uppercase text-xs">
                    {{ mod.last_name?.[0] }}{{ mod.first_name?.[0] }}
                  </div>
                  <div>
                    <p class="font-bold text-xs text-on-surface">{{ mod.last_name }} {{ mod.first_name }}</p>
                    <span class="text-[9px] px-1.5 py-0.5 rounded bg-tertiary/10 text-tertiary font-medium uppercase tracking-wider">Modérateur</span>
                  </div>
                </div>
                <div class="text-xs space-y-0.5 text-on-surface-variant pl-12">
                  <p class="truncate">{{ mod.email }}</p>
                  <p>{{ mod.tel || 'Aucun numéro' }}</p>
                </div>
                <div class="pt-2 pl-12 flex justify-end">
                  <button 
                    @click="openConfirmationModal(mod, 'teacher')" 
                    class="w-full text-center text-error font-bold text-xs bg-error/5 hover:bg-error/10 py-2 rounded-lg border border-error/10"
                  >
                    Rétrograder Teacher
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔐 TAB 2 : PERMISSIONS GLOBALES -->
      <div v-slot-key="'permissions'" v-if="activeTab === 'permissions'" class="p-4 sm:p-8 animate-fade-in">
        <div class="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <div>
            <h3 class="font-h3 text-base sm:text-lg font-bold mb-1">Contrôle des Accès</h3>
            <p class="text-xs sm:text-sm text-on-surface-variant opacity-70">Définissez les actions autorisées pour les différents niveaux de rôles.</p>
          </div>
          
          <div class="space-y-3 sm:space-y-4">
            <label v-for="(perm, index) in permissionsList" :key="index" class="flex items-center justify-between p-2 sm:p-5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all group bg-white shadow-sm">
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div :class="['w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shrink-0', perm.bg]">
                  <Icon :name="perm.icon" :class="perm.iconColor" size="1.2rem" />
                </div>
                <div class="min-w-0">
                  <p class="font-bold font-body text-xs sm:text-sm text-on-surface truncate">{{ perm.title }}</p>
                  <p class="text-[10px] sm:text-xs text-on-surface-variant truncate">{{ perm.description }}</p>
                </div>
              </div>
              <input class="w-5 h-5 sm:w-6 sm:h-6 rounded-md text-primary focus:ring-primary border-outline-variant cursor-pointer ml-3 shrink-0" type="checkbox" v-model="perm.value" />
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4 sm:pt-6 border-t border-outline-variant">
            <button class="px-4 sm:px-6 py-2 rounded-lg border border-outline text-xs sm:text-sm text-on-surface font-body hover:bg-surface-container-high transition-all">Réinitialiser</button>
            <button @click="savePermissions" class="px-6 sm:px-8 py-2 rounded-lg bg-primary text-xs sm:text-sm text-on-primary font-bold font-body shadow-sm hover:opacity-90 transition-all">Enregistrer</button>
          </div>
        </div>
      </div>

      <!-- 🔔 TAB 3 : NOTIFICATIONS -->
      <div v-slot-key="'notifications'" v-if="activeTab === 'notifications'" class="p-4 sm:p-6 animate-fade-in">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 class="font-h3 text-base sm:text-lg font-bold">Journal des Notifications</h3>
              <p class="text-xs sm:text-sm text-on-surface-variant opacity-70">Historique des messages envoyés par le système.</p>
            </div>
            <div class="flex gap-2 items-center self-start sm:self-auto text-xs">
              <span class="bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full font-bold">12 Non-lues</span>
              <button @click="markAllAsRead" class="text-primary hover:underline font-medium">Marquer tout comme lu</button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3 p-1 md:p-4 rounded-xl bg-surface-container-high border-l-4 border-primary transition-all hover:bg-surface-container-highest">
              <div class="w-9 h-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="error" class="text-primary" size="1.2rem" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start gap-2">
                  <p class="font-bold font-body text-xs sm:text-sm text-on-surface truncate">Alerte Absence Critique</p>
                  <span class="text-[10px] text-on-surface-variant whitespace-nowrap">À l'instant</span>
                </div>
                <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">L'élève Lucas Bernard a manqué 3 séances consécutives dans la classe de CM1-B.</p>
              </div>
              <div class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⚠️ MODALE DE CONFIRMATION DE ROLES (Remplace confirm natif) -->
    <div v-if="modalState.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-1 md:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-3 md:p-5 sm:p-6 space-y-4 border border-outline-variant/30">
        <div class="flex items-center gap-3 text-primary">
          <Icon name="help_outline" size="1.6rem" />
          <h4 class="font-bold text-base sm:text-lg text-on-surface">Confirmer la modification</h4>
        </div>
        <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Voulez-vous vraiment modifier le statut de <strong>{{ modalState.user?.first_name }} {{ modalState.user?.last_name }}</strong> vers le rôle de <span class="font-bold uppercase text-primary">"{{ modalState.newRole }}"</span> ?
        </p>
        <div class="flex justify-end gap-3 pt-2 text-xs sm:text-sm">
          <button 
            @click="closeModal" 
            class="px-4 py-2 border border-outline rounded-lg text-on-surface font-medium hover:bg-surface-container-low transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="confirmRoleSwitch" 
            :disabled="isProcessing"
            class="px-5 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
          >
            <span v-if="isProcessing" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Confirmer
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between items-center text-on-surface-variant opacity-60 text-[10px] sm:text-xs">
      <p>© 2026 EDCE - Sunday School Management</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useUsers } from '~/composables/useUsers'
import { useToast } from '~/composables/useToast' // Utilisation officielle de ton Composable Alerte
import type { User, UserStatus } from '~/types/auth'


definePageMeta({
  layout: 'dashboard'
})

// --- MULTI-COMPOSABLES BINDING ---
const { listUsers, isUsersLoading, fetchUsers, changeUserRole } = useUsers()
const toast = useToast() // Composable injecté de manière pérenne

const isProcessing = ref(false)

// State de notre modale personnalisée
const modalState = ref<{
  isOpen: boolean
  user: User | null
  newRole: UserStatus | null
}>({
  isOpen: false,
  user: null,
  newRole: null
})

// Récupération des comptes au montage
onMounted(async () => {
  try {
    await fetchUsers()
  } catch (err) {
    toast.error("Échec du chargement des profils du système.")
  }
})

// --- TRI DES ACCESCalculés ---
const teachersList = computed(() => {
  return (listUsers.value || []).filter(u => u.status === 'teacher')
})

const moderatorsList = computed(() => {
  return (listUsers.value || []).filter(u => u.status === 'moderator')
})

// --- OUVERTURE DE LA MODALE MODERNE ---
const openConfirmationModal = (user: User, newRole: UserStatus) => {
  modalState.value = {
    isOpen: true,
    user,
    newRole
  }
}

const closeModal = () => {
  modalState.value = { isOpen: false, user: null, newRole: null }
}

// --- LOGIQUE RÉACTIVE DU SWITCH DE RÔLE (Sans alerts) ---
const confirmRoleSwitch = async () => {
  const { user, newRole } = modalState.value
  if (!user || !newRole) return

  isProcessing.value = true
  try {
    const success = await changeUserRole(user, newRole)
    if (success) {
      toast.info(`Le statut de ${user.first_name} a été mis à jour vers "${newRole}".`)
      await fetchUsers() // Rafraîchissement
    } else {
      toast.info("Action non autorisée. Vérifiez vos privilèges Admin.")
    }
  } catch (error) {
    toast.error("Erreur réseau lors de la mise à jour.")
  } finally {
    isProcessing.value = false
    closeModal()
  }
}

// --- ONGLETS ACTIFS DE NAVIGATION ---
type TabId = 'teachers' | 'permissions' | 'notifications'
interface TabItem { id: TabId; label: string; icon: string }

const activeTab = ref<TabId>('teachers')
const tabs: TabItem[] = [
  { id: 'teachers', label: 'Gestion Accessibilité', icon: 'school' },
  { id: 'permissions', label: 'Permissions Globales', icon: 'security' },
  { id: 'notifications', label: 'Centre de Notifications', icon: 'mail' }
]

// --- PERMISSIONS ET FAUX SATELLITES INTERACTIFS ---
const permissionsList = ref([
  { title: 'Activer notifications auto', description: 'Envoie des rappels aux parents 24h avant chaque séance.', icon: 'notifications_active', iconColor: 'text-primary', bg: 'bg-primary/10', value: false },
  { title: 'Permettre teachers de créer tests', description: 'Autorise les enseignants à générer de nouveaux examens sans validation.', icon: 'edit_square', iconColor: 'text-secondary', bg: 'bg-secondary/10', value: true },
  { title: 'Masquer les notes globales', description: "Seuls les administrateurs peuvent voir la moyenne de l'école.", icon: 'visibility_off', iconColor: 'text-tertiary', bg: 'bg-tertiary/10', value: false },
  { title: 'Partage de documents externe', description: 'Permet le partage de liens vers des ressources hors plateforme.', icon: 'share', iconColor: 'text-primary', bg: 'bg-primary/10', value: true }
])

const savePermissions = () => {
  toast.success("Configuration des permissions sauvegardée avec succès.")
}

const markAllAsRead = () => {
  toast.success("Toutes les notifications ont été marquées comme lues.")
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Masquage discret des scrollbars */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>