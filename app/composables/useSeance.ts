import { ref, computed } from 'vue'
import type { Seance } from '~/types/seance'

export const useSeance = () => {
  const typeSeances = ["NORMAL", "SUNDAY_SCHOOL", "DLT"]

  // Refs réactives miroirs synchronisées par le serveur
  const listSeances = ref<Seance[]>([])
  const serverGroupSeanceperType = ref<Record<string, Seance[]>>({})
  const serverGroupSeanceperClasse = ref<Record<string, Seance[]>>({})
  const serverGroupSeanceperYear = ref<Record<string, Seance[]>>({})
  const isLoading = ref(false)

  // --- ACTIONS RÉSEAU ---

  // 🔄 Charger toutes les séances et leurs regroupements calculés
  const fetchAllSeances = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/seances')
      
      listSeances.value = data.listSeances
      serverGroupSeanceperType.value = data.groupSeanceperType
      serverGroupSeanceperClasse.value = data.groupSeanceperClasse
      serverGroupSeanceperYear.value = data.groupSeanceperYear
    } catch (error) {
      console.error('Erreur lors du chargement des séances:', error)
    } finally {
      isLoading.value = false
    }
  }

  // ➕ Créer une séance
  const createSeance = async (seancePayload: Omit<Seance, 'id' | 'created_at'>) => {
    try {
      await $fetch('/api/seances', {
        method: 'POST',
        body: seancePayload
      })
      await fetchAllSeances() // Re-synchronise l'interface
    } catch (error) {
      console.error(error)
    }
  }

  // ❌ Supprimer une séance
  const deleteSeance = async (seanceId: string) => {
    try {
      await $fetch(`/api/seances/${seanceId}`, { method: 'DELETE' })
      await fetchAllSeances()
    } catch (error) {
      console.error(error)
    }
  }

  // 📝 Modifier une séance
  const updateSeance = async (seanceId: string, updatedSeance: Partial<Seance>) => {
    try {
      await $fetch(`/api/seances/${seanceId}`, {
        method: 'PUT',
        body: updatedSeance
      })
      await fetchAllSeances()
    } catch (error) {
      console.error(error)
    }
  }

  // 🔍 Obtenir une séance par son ID (En local)
  const getSeanceById = (seanceId: string): Seance | undefined => {
    return listSeances.value.find(seance => seance.id === seanceId)
  }

  // 🔍 Filtrer les séances par auteur (En local)
  const getSeancenbyAuthor = (authorId: string): Seance[] => {
    return listSeances.value.filter(seance => seance.authorId === authorId)
  }

  // --- COMPUTED PROPERTIES CONSERVÉES ---
  const groupSeanceperType = computed(() => serverGroupSeanceperType.value)
  const groupSeanceperClasse = computed(() => serverGroupSeanceperClasse.value)
  const groupSeanceperYear = computed(() => serverGroupSeanceperYear.value)

  return {
    groupSeanceperClasse,
    groupSeanceperYear,
    groupSeanceperType,
    typeSeances,
    listSeances,
    isLoading,
    fetchAllSeances, // Nouvelle action requise pour charger la vue
    createSeance,
    deleteSeance,
    updateSeance,
    getSeanceById,
    getSeancenbyAuthor
  }
}