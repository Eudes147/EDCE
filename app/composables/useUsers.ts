import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { User, UserStatus } from '~/types/auth'

export const useUsers = () => {
  const listUsers = ref<User[]>([])
  const isUsersLoading = ref(true)
  const authStore = useAuthStore()

  // Récupère tous les utilisateurs depuis l'API back-end
  const fetchUsers = async () => {
    isUsersLoading.value = true
    try {
      // Ajuste l'URL de l'API selon tes routes réelles
      const data = await $fetch<User[]>('/api/admin/users')
      listUsers.value = data
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
    } finally {
      isUsersLoading.value = false
    }
  }

  // Modifie le rôle/statut via le store d'authentification puis synchronise avec la DB
  const changeUserRole = async (user: User, newStatus: UserStatus) => {
    isUsersLoading.value = true
    try {
      // 1. Appel de l'action locale du store qui vérifie si l'exécuteur est admin
      const hasPermission = authStore.updateUserStatus(user, newStatus)
      
      if (!hasPermission) {
        throw new Error("Droits insuffisants. Vous devez être administrateur.")
      }

      // 2. Persistance de la modification vers ton API
      await $fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        body: { status: newStatus }
      })

      // 3. Rafraîchissement des données locales pour mettre à jour l'interface
      await fetchUsers()
      return true
    } catch (error) {
      console.error("Échec de la modification du rôle de l'utilisateur:", error)
      return false
    } finally {
      isUsersLoading.value = false
    }
  }

  return {
    listUsers,
    isUsersLoading,
    fetchUsers,
    changeUserRole
  }
}