import { usersState } from '../teachers/index.get' // Utilisation du state utilisateur unique
import { mockModerators } from '~/data/mockData'
import type { Moderator } from '~/types/moderator'

// Persistance locale des données métiers propres aux modérateurs (Disponibilité)
export const moderatorsState = {
  moderators: [...mockModerators] as Moderator[]
}

export default defineEventHandler(() => {
  // 1. Filtrer les utilisateurs globaux ayant le rôle de modérateur
  const activeUserModerators = usersState.users.filter(u => u.status === 'moderator')

  // 2. Associer les informations de base de l'User avec ses métadonnées de modérateur
  const listModerators: Moderator[] = activeUserModerators.map(user => {
    const extendedInfo = moderatorsState.moderators.find(m => m.id === user.id)
    
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      sexe: user.sexe,
      tel: user.tel,
      quarter: user.quarter,
      isAvailable: extendedInfo ? extendedInfo.isAvailable : true // true par défaut si nouvellement promu
    }
  })

  // 3. Calculs des filtres de listes côté serveur
  const moderatorsAvailable = listModerators.filter(m => m.isAvailable)
  const moderatorsUnavailable = listModerators.filter(m => !m.isAvailable)
  const moderatorMasculin = listModerators.filter(m => m.sexe === 'Masculin')
  const moderatorFeminin = listModerators.filter(m => m.sexe === 'Feminin')

  return {
    listModerators,
    moderatorsAvailable,
    moderatorsUnavailable,
    moderatorMasculin,
    moderatorFeminin
  }
})