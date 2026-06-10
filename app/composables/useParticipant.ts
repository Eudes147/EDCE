import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ParticipantSeance, ParticipantEventActivity } from '~/types/participant'
import type { Month } from '~/types/index'
import type { Seance } from '~/types/seance'
import type { Child } from '~/types/child'
import type { EventType } from '~/types/activity'
import type { Teacher } from '~/types/teacher'
import { getFullName } from '~/utils/getFullName'

// ==========================================
// 1. COMPOSABLE: PARTICIPANTS AUX SÉANCES
// ==========================================
export function useParticipantSeance() {
  const listSeances = ref<Seance[]>([])
  const listParticipantSeance = ref<ParticipantSeance[]>([])
  const listChildren = ref<Child[]>([])
  const listTeachers = ref<Teacher[]>([])
  const isLoading = ref(false)

  // 🔄 Charger les données synchronisées depuis le serveur
  const fetchAllSeanceData = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/participants/seances')
      listSeances.value = data.listSeances
      listParticipantSeance.value = data.listParticipantSeance
      listChildren.value = data.listChildren
      listTeachers.value = data.listTeachers
    } catch (error) {
      console.error('Erreur de chargement des participants de séance:', error)
    } finally {
      isLoading.value = false
    }
  }

  // ➕ Ajouter un participant à une séance
  const createParticipantSeance = async (participantSeance: ParticipantSeance) => {
    try {
      await $fetch('/api/participants/seances', { method: 'POST', body: participantSeance })
      await fetchAllSeanceData()
    } catch (error) {
      console.error(error)
    }
  }

  // ❌ Supprimer un émargement
  const deleteParticipantSeance = async (participantSeanceId: string) => {
    try {
      await $fetch(`/api/participants/seances?id=${participantSeanceId}`, { method: 'DELETE' })
      await fetchAllSeanceData()
    } catch (error) {
      console.error(error)
    }
  }

  // 📝 Mettre à jour (ex: passer de présent à absent)
  const updateParticipantSeance = async (participantSeance: ParticipantSeance) => {
    try {
      await $fetch('/api/participants/seances', { method: 'PUT', body: participantSeance })
      await fetchAllSeanceData()
    } catch (error) {
      console.error(error)
    }
  }

  // --- FILTRES ET GETTERS LOCAUX ACTIFS POUR LES VUES ---
  const getChildbySeanceId = (seanceId: string): Child[] => {
    const seances = listParticipantSeance.value.filter(p => p.seanceId == seanceId)
    let children: Child[] = []
    seances.forEach(seance => {
      let child = listChildren.value.find(c => c.id == seance.childId)
      if (child) children.push(child)
    })
    return children
  }

  const readParticipantSeance = (participantSeanceId: string) => {
    return listParticipantSeance.value.find(p => p.id === participantSeanceId)
  }

  const getParticipantSeanceByChildId = (childId: string) => {
    return listParticipantSeance.value.filter(p => p.childId === childId)
  }

  const getSeanceById = (seanceId: string) => {
    return listSeances.value.find(s => s.id === seanceId)
  }

  const getAuthorbySeanceId = (seanceId: string) => {
    const seance = getSeanceById(seanceId)
    return seance ? seance.authorId : null
  }

  const getSupervisorbySeanceId = (seanceId: string) => {
    const seance = getSeanceById(seanceId)
    return seance ? seance.supervisorId : null
  }

  const getSeancebyMonth = (month: Month) => {
    return listSeances.value.filter(seance => {
      const seanceMonth = new Date(seance.created_at).toLocaleString('fr-FR', { month: 'long' })
      return seanceMonth.toLowerCase() === month.toLowerCase()
    })
  }

  const getAuthorSupervisorbySeance = (seance: Seance) => {
    const author = listTeachers.value.find(t => t.id === seance.authorId)
    const supervisor = listTeachers.value.find(t => t.id === seance.supervisorId)
    return {
      authorName: (author?.first_name || '-') + " " + (author?.last_name || '-'),
      supervisorName: (supervisor?.first_name || '-') + " " + (supervisor?.last_name || '-')
    }
  }

  return {
    listParticipantSeance,
    getParticipantSeanceByChildId,
    getSeanceById,
    getAuthorbySeanceId,
    getSupervisorbySeanceId,
    getSeancebyMonth,
    createParticipantSeance,
    deleteParticipantSeance,
    updateParticipantSeance,
    listSeances,
    readParticipantSeance,
    getFullName,
    getChildbySeanceId,
    getAuthorSupervisorbySeance,
    isLoading,
    fetchAllSeanceData // Action réseau globale à appeler sur ton composant
  }
}


export function useParticipantEventActivity() {
  const router = useRouter()
  
  const listActivities = ref<any[]>([])
  const listParticipantEventActivity = ref<ParticipantEventActivity[]>([])
  const listEventActivity = ref<any[]>([])
  const listChildren = ref<Child[]>([])
  const isLoading = ref(false)

  // 🔄 Charger l'état global
  const fetchAllEventData = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/participants/events')
      listActivities.value = data.listActivities
      listParticipantEventActivity.value = data.listParticipantEventActivity
      listEventActivity.value = data.listEventActivity
      listChildren.value = data.listChildren
    } catch (error) {
      console.error("Erreur de chargement des participants d'événements:", error)
    } finally {
      isLoading.value = false
    }
  }

  // ➕ Ajouter un enfant à une activité d'événement (Liaison)
  const createParticipantEventActivity = async (participantEvent: ParticipantEventActivity) => {
    try {
      await $fetch('/api/participants/events', { method: 'POST', body: participantEvent })
      await fetchAllEventData() // Rafraîchit l'interface instantanément
    } catch (error) {
      console.error("Erreur lors de l'inscription à l'événement:", error)
    }
  }

  // 📝 Modifier une liaison existante
  const updateParticipantEventActivity = async (participantEvent: ParticipantEventActivity) => {
    try {
      await $fetch('/api/participants/events', { method: 'PUT', body: participantEvent })
      await fetchAllEventData()
    } catch (error) {
      console.error("Erreur lors de la modification de l'inscription:", error)
    }
  }

  // ❌ Supprimer (Désinscrire l'enfant de l'activité)
  const deleteParticipantEventActivity = async (participantEventId: string) => {
    try {
      await $fetch(`/api/participants/events?id=${participantEventId}`, { method: 'DELETE' })
      await fetchAllEventData()
    } catch (error) {
      console.error("Erreur lors de la désinscription:", error)
    }
  }

  // 🔍 Obtenir une liaison par son ID en local
  const readParticipantEventActivity = (participantEventId: string) => {
    return listParticipantEventActivity.value.find(p => p.id === participantEventId)
  }

  // --- TON FILTRE DE CROISEMENT DE DONNÉES (INCHANGÉ ET ACTIF) ---
  const getChildrenByActivityTitle = (year: string, eventType: EventType): Record<string, Child[]> => {
    const result: Record<string, Child[]> = {}

    const filteredEventActivities = listEventActivity.value.filter(
      (event) => event.year === year && event.eventType === eventType
    )

    const validEventIds = new Set(filteredEventActivities.map((e) => e.id))

    listParticipantEventActivity.value.forEach((part) => {
      if (validEventIds.has(part.eventActivityId)) {
        const eventAct = filteredEventActivities.find((e) => e.id === part.eventActivityId)
        if (!eventAct) return

        const activity = listActivities.value.find((a) => a.id === eventAct.activityId)
        if (!activity) return

        const child = listChildren.value.find((c) => c.id === part.childId)
        if (!child) return

        if (!result[activity.title]) {
          result[activity.title] = []
        }

        const alreadyAdded = result[activity.title]?.some((c) => c.id === child.id)
        if (!alreadyAdded) {
          result[activity.title]?.push(child)
        }
      }
    })

    return result
  }

  return {
    listParticipantEventActivity,
    listActivities,
    listEventActivity,
    getChildrenByActivityTitle,
    createParticipantEventActivity,
    updateParticipantEventActivity,
    deleteParticipantEventActivity,
    readParticipantEventActivity,
    getFullName,
    isLoading,
    fetchAllEventData
  }
}