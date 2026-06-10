import { usersState } from '../teachers/index.get'
import { moderatorsState } from './index.get'
import type { UserStatus } from '~/types/auth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event) // Peut contenir: { status, isAvailable, quarter, tel }

  // 1. Mettre à jour l'utilisateur dans le state User (Utile si rétrogradation ou modification profil)
  const userIndex = usersState.users.findIndex(u => u.id === id)
  if (userIndex !== -1 && usersState.users[userIndex]) {
    if (body.status) usersState.users[userIndex].status = body.status as UserStatus
    if (body.quarter) usersState.users[userIndex].quarter = body.quarter
    if (body.tel) usersState.users[userIndex].tel = body.tel
  }

  // 2. Mettre à jour ou initialiser l'état spécifique au Modérateur
  const modIndex = moderatorsState.moderators.findIndex(m => m.id === id)
  if (body.isAvailable !== undefined) {
    if (modIndex !== -1 && moderatorsState.moderators[modIndex]) {
      moderatorsState.moderators[modIndex].isAvailable = body.isAvailable
    } else {
      const user = usersState.users.find(u => u.id === id)
      if (user) {
        moderatorsState.moderators.push({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          sexe: user.sexe,
          tel: user.tel,
          quarter: user.quarter,
          isAvailable: body.isAvailable
        })
      }
    }
  }

  return { success: true, message: 'Moderator updated successfully' }
})