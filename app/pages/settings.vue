<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="mb-8">
      <h2 class="font-h1 text-h1 text-on-surface mb-2">Paramètres du système</h2>
      <p class="text-on-surface-variant font-body text-body">Gérez les accès, les permissions et les alertes de votre plateforme.</p>
    </div>

    <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      
      <div class="flex border-b border-outline-variant px-6 bg-surface-bright">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-4 font-body text-body flex items-center gap-2 transition-all border-b-2 relative active:scale-95',
            activeTab === tab.id 
              ? 'text-primary border-primary font-bold' 
              : 'text-on-surface-variant border-transparent hover:text-primary'
          ]"
        >
          <Icon :name="tab.icon" class="text-[20px]" />
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'teachers'" class="p-6 space-y-8 animate-fade-in">
        
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-h3 text-h3 text-on-surface flex items-center gap-2">
              <Icon name="school" class="text-primary" />
              Enseignants (Teachers)
              <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{{ teachersList.length }}</span>
            </h3>
          </div>

          <div v-if="isUsersLoading" class="py-12 text-center text-on-surface-variant text-body-sm">
            <span class="inline-block animate-spin mr-2">🔄</span> Chargement des comptes du système...
          </div>

          <div v-else-if="teachersList.length === 0" class="text-center py-8 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/40">
            <p class="text-sm text-on-surface-variant italic">Aucun enseignant (Teacher) n'est configuré actuellement dans la base de données.</p>
          </div>

          <div v-else class="overflow-hidden border border-outline-variant rounded-xl bg-white">
            <table class="w-full text-left border-collapse">
              <thead class="bg-surface-container-low font-body text-body font-bold text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th class="px-6 py-4">Utilisateur</th>
                  <th class="px-6 py-4">Email / Téléphone</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/60 font-body text-body">
                <tr v-for="teacher in teachersList" :key="teacher.id" class="hover:bg-surface-container-lowest transition-colors">
                  <td class="px-6 py-4 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold uppercase">
                      {{ teacher.last_name?.[0] }}{{ teacher.first_name?.[0] }}
                    </div>
                    <div>
                      <p class="font-bold text-on-surface">{{ teacher.last_name }} {{ teacher.first_name }}</p>
                      <span class="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase tracking-wider">Teacher</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-on-surface">{{ teacher.email }}</p>
                    <p class="text-caption text-on-surface-variant">{{ teacher.tel || 'Aucun numéro' }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      @click="handleRoleSwitch(teacher, 'moderator')" 
                      class="text-primary hover:underline font-bold text-sm bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/10 transition-colors"
                    >
                      Promouvoir Modérateur
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr class="border-outline-variant/60" />

        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-h3 text-h3 text-on-surface flex items-center gap-2">
              <Icon name="security" class="text-tertiary" />
              Modérateurs (Moderators)
              <span class="text-xs bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full font-bold">{{ moderatorsList.length }}</span>
            </h3>
          </div>

          <div v-if="!isUsersLoading && moderatorsList.length === 0" class="text-center py-8 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/40">
            <p class="text-sm text-on-surface-variant italic">Aucun modérateur n'est configuré actuellement dans la base de données.</p>
          </div>

          <div v-else-if="moderatorsList.length > 0" class="overflow-hidden border border-outline-variant rounded-xl bg-white">
            <table class="w-full text-left border-collapse">
              <thead class="bg-surface-container-low font-body text-body font-bold text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th class="px-6 py-4">Utilisateur</th>
                  <th class="px-6 py-4">Email / Téléphone</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/60 font-body text-body">
                <tr v-for="mod in moderatorsList" :key="mod.id" class="hover:bg-surface-container-lowest transition-colors">
                  <td class="px-6 py-4 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-bold uppercase">
                      {{ mod.last_name?.[0] }}{{ mod.first_name?.[0] }}
                    </div>
                    <div>
                      <p class="font-bold text-on-surface">{{ mod.last_name }} {{ mod.first_name }}</p>
                      <span class="text-xs px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-medium uppercase tracking-wider">Modérateur</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-on-surface">{{ mod.email }}</p>
                    <p class="text-caption text-on-surface-variant">{{ mod.tel || 'Aucun numéro' }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      @click="handleRoleSwitch(mod, 'teacher')" 
                      class="text-error hover:underline font-bold text-sm bg-error/5 hover:bg-error/10 px-3 py-1.5 rounded-lg border border-error/10 transition-colors"
                    >
                      Rétrograder Teacher
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div v-if="activeTab === 'permissions'" class="p-8 animate-fade-in">
        <div class="max-w-3xl mx-auto space-y-8">
          <div>
            <h3 class="font-h3 text-h3 mb-1">Contrôle des Accès</h3>
            <p class="text-body text-on-surface-variant opacity-70">Définissez les actions autorisées pour les différents niveaux de rôles.</p>
          </div>
          
          <div class="space-y-4">
            <label v-for="(perm, index) in permissionsList" :key="index" class="flex items-center justify-between p-5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all group bg-white">
              <div class="flex items-center gap-4">
                <div :class="['w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform', perm.bg]">
                  <Icon :name="perm.icon" :class="perm.iconColor" />
                </div>
                <div>
                  <p class="font-bold font-body text-on-surface">{{ perm.title }}</p>
                  <p class="text-small text-on-surface-variant">{{ perm.description }}</p>
                </div>
              </div>
              <input class="w-6 h-6 rounded-md text-primary focus:ring-primary border-outline-variant cursor-pointer" type="checkbox" v-model="perm.value" />
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-outline-variant">
            <button class="px-6 py-2.5 rounded-lg border border-outline text-on-surface font-body hover:bg-surface-container-high active:scale-95 transition-all">Réinitialiser</button>
            <button class="px-8 py-2.5 rounded-lg bg-primary text-on-primary font-bold font-body shadow-sm hover:opacity-90 active:scale-95 transition-all">Enregistrer</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'notifications'" class="p-6 animate-fade-in">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="font-h3 text-h3">Journal des Notifications</h3>
              <p class="text-body text-on-surface-variant opacity-70">Historique des messages envoyés par le système.</p>
            </div>
            <div class="flex gap-2 items-center">
              <span class="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-small font-bold">12 Non-lues</span>
              <button class="text-primary text-small hover:underline font-medium">Marquer tout comme lu</button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-4 p-4 rounded-xl bg-surface-container-high border-l-4 border-primary transition-all hover:bg-surface-container-highest group">
              <div class="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="error" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <p class="font-bold font-body text-on-surface">Alerte Absence Critique</p>
                  <span class="text-caption text-on-surface-variant">À l'instant</span>
                </div>
                <p class="text-body text-on-surface-variant mt-1">L'élève Lucas Bernard a manqué 3 séances consécutives dans la classe de CM1-B.</p>
              </div>
              <div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="mt-8 flex justify-between items-center text-on-surface-variant opacity-60 font-caption text-caption">
      <p>© 2026 EDCE - Sunday School Management</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useUsers } from '~/composables/useUsers'
import type { User, UserStatus } from '~/types/auth'

definePageMeta({
  layout: 'dashboard'
})

// --- INJECTION DU NEW COMPOSABLE USER ---
const { listUsers, isUsersLoading, fetchUsers, changeUserRole } = useUsers()

// Déclenchement automatique de la récupération au montage du composant
onMounted(async () => {
  await fetchUsers()
})

// --- TRIS CALCULÉS ET DYNAMIQUES DES SECTIONS DE RÔLES ---
// Ajout d'une sécurité (|| []) pour éviter le crash si listUsers est temporairement indéfini
const teachersList = computed(() => {
  return (listUsers.value || []).filter(u => u.status === 'teacher')
})

const moderatorsList = computed(() => {
  return (listUsers.value || []).filter(u => u.status === 'moderator')
})

// --- ACTION AUTOMATIQUE DE CHANGEMENT DE STATUT (ROLE) ---
const handleRoleSwitch = async (user: User, newRole: UserStatus) => {
  const confirmAction = confirm(`Voulez-vous modifier le statut de ${user.first_name} ${user.last_name} vers "${newRole}" ?`)
  if (!confirmAction) return

  const success = await changeUserRole(user, newRole)
  if (success) {
    alert("Le statut de l'utilisateur a été mis à jour avec succès.")
    // Optionnel : Re-fetch les utilisateurs pour s'assurer que le state global est à jour
    await fetchUsers()
  } else {
    alert("Erreur lors de la modification. Vérifiez vos droits d'administrateur.")
  }
}

// --- SYSTÈME D'ONGLETS RÉACTIFS ---
type TabId = 'teachers' | 'permissions' | 'notifications'
interface TabItem { id: TabId; label: string; icon: string }

const activeTab = ref<TabId>('teachers')
const tabs: TabItem[] = [
  { id: 'teachers', label: 'Gestion Accessibilité', icon: 'school' },
  { id: 'permissions', label: 'Permissions Globales', icon: 'security' },
  { id: 'notifications', label: 'Centre de Notifications', icon: 'mail' }
]

// --- PERMISSIONS STRUCTURES ---
const permissionsList = ref([
  { title: 'Activer notifications auto', description: 'Envoie des rappels aux parents 24h avant chaque séance.', icon: 'notifications_active', iconColor: 'text-primary', bg: 'bg-primary/10', value: false },
  { title: 'Permettre teachers de créer tests', description: 'Autorise les enseignants à générer de nouveaux examens sans validation.', icon: 'edit_square', iconColor: 'text-secondary', bg: 'bg-secondary/10', value: true },
  { title: 'Masquer les notes globales', description: "Seuls les administrateurs peuvent voir la moyenne de l'école.", icon: 'visibility_off', iconColor: 'text-tertiary', bg: 'bg-tertiary/10', value: false },
  { title: 'Partage de documents externe', description: 'Permet le partage de liens vers des ressources hors plateforme.', icon: 'share', iconColor: 'text-primary', bg: 'bg-primary/10', value: true }
])
</script>
<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>