import type { Moderator } from "~/types/moderator"
import { ref, computed } from 'vue'
import { mockModerators } from "~/data/mockData"
import {getFullName} from '~/utils/getFullName'

export const useModerator = () => {
  const listModerators = ref<Moderator[]>(mockModerators)

  // --- CRUD MODERATORS ---
  const createModerator = (moderator: Moderator) => {
    if (moderator.id && moderator.first_name && moderator.last_name) {
      listModerators.value.push(moderator)
    }
  }

  const deleteModerator = (moderatorId: string) => {
    listModerators.value = listModerators.value.filter(m => m.id !== moderatorId)
  }

  const updateModerator = (moderatorId: string, updatedModerator: Moderator) => {
    const index = listModerators.value.findIndex(m => m.id === moderatorId)
    if (index !== -1) listModerators.value[index] = updatedModerator
  }

  const getModeratorById = (moderatorId: string): Moderator | undefined => {
    return listModerators.value.find(m => m.id === moderatorId)
  }

  const getTelModerator = (moderatorId: string) => {
    const moderator = listModerators.value.find(m => m.id === moderatorId)
    return moderator?.tel
  }

  // --- COMPUTED PROPERTIES (CORRIGÉS ET RÉACTIFS) ---

  // 1. Modérateurs disponibles
  const moderatorsAvailable = computed<Moderator[]>(() => {
    // CORRECTION : Utilisation de listModerators.value et ajout du return
    return listModerators.value.filter(m => m.isAvailable)
  })

  // 2. Modérateurs indisponibles
  const moderatorsUnavailable = computed<Moderator[]>(() => {
    // CORRECTION : Utilisation de listModerators.value et ajout du return
    return listModerators.value.filter(m => !m.isAvailable)
  })

  // 3. Modérateurs masculins
  const moderatorMasculin = computed<Moderator[]>(() => {
    // CORRECTION : Utilisation de listModerators.value et ajout du return
    return listModerators.value.filter(m => m.sexe === 'Masculin')
  })

  // 4. Modérateurs féminins
  const moderatorFeminin = computed<Moderator[]>(() => {
    // CORRECTION : Utilisation de listModerators.value et ajout du return
    return listModerators.value.filter(m => m.sexe === 'Feminin')
  })

  return {
    listModerators,
    moderatorFeminin,
    moderatorMasculin,
    getTelModerator,
    moderatorsAvailable,
    moderatorsUnavailable,
    createModerator,
    deleteModerator,
    updateModerator,
    getModeratorById,
    getFullName
  }
}