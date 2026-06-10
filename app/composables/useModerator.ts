import { ref, computed } from 'vue'
import type { Moderator } from '~/types/moderator'
import type { UserStatus } from '~/types/auth'
import { getFullName } from '~/utils/getFullName'

export const useModerator = () => {
  const listModerators = ref<Moderator[]>([])
  const serverModeratorsAvailable = ref<Moderator[]>([])
  const serverModeratorsUnavailable = ref<Moderator[]>([])
  const serverModeratorMasculin = ref<Moderator[]>([])
  const serverModeratorFeminin = ref<Moderator[]>([])
  const isLoading = ref(false)

  // --- ACTIONS RÉSEAU ---

  // 🔄 Charger les modérateurs synchronisés depuis le serveur
  const fetchAllModerators = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/moderators')
      
      listModerators.value = data.listModerators
      serverModeratorsAvailable.value = data.moderatorsAvailable
      serverModeratorsUnavailable.value = data.moderatorsUnavailable
      serverModeratorMasculin.value = data.moderatorMasculin
      serverModeratorFeminin.value = data.moderatorFeminin
    } catch (error) {
      console.error('Erreur lors du chargement des modérateurs:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 📝 Mettre à jour un modérateur (Données ou Changement de rôle / Option B)
  const updateModerator = async (moderatorId: string, payload: { status?: UserStatus; isAvailable?: boolean; quarter?: string; tel?: string }) => {
    try {
      await $fetch(`/api/moderators/${moderatorId}`, {
        method: 'PUT',
        body: payload
      })
      await fetchAllModerators() // Rafraîchit instantanément l'interface
    } catch (error) {
      console.error('Erreur lors de la modification du modérateur:', error)
    }
  }

  // 🔍 Trouver un modérateur par son ID (Localement)
  const getModeratorById = (moderatorId: string): Moderator | undefined => {
    return listModerators.value.find(m => m.id === moderatorId)
  }

  // --- GETTERS ---
  const getTelModerator = (moderatorId: string) => {
    const moderator = listModerators.value.find(m => m.id === moderatorId)
    return moderator?.tel
  }

  // --- COMPUTED PROPERTIES MIROIRS ---
  const moderatorsAvailable = computed(() => serverModeratorsAvailable.value)
  const moderatorsUnavailable = computed(() => serverModeratorsUnavailable.value)
  const moderatorMasculin = computed(() => serverModeratorMasculin.value)
  const moderatorFeminin = computed(() => serverModeratorFeminin.value)

  return {
    listModerators,
    moderatorFeminin,
    moderatorMasculin,
    getTelModerator,
    moderatorsAvailable,
    moderatorsUnavailable,
    isLoading,
    fetchAllModerators, // À appeler au cycle 'onMounted' sur tes vues Modérateurs
    updateModerator,
    getModeratorById,
    getFullName
  }
}