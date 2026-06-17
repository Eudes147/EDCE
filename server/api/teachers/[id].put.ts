import { usersTeachersState, teachersState } from './index.get'
import type { UserStatus } from '~/types/auth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event) // Peut contenir { status, isAvailable, quarter, tel }

  // 1. Mettre à jour l'utilisateur dans le state User (Option B: Changement de statut)
  const userIndex = usersTeachersState.users.findIndex(u => u.id === id)
  if (userIndex !== -1) {
    if (body.status && usersTeachersState.users[userIndex]) {
      usersTeachersState.users[userIndex].status = body.status as UserStatus
    }
    if (body.quarter && usersTeachersState.users[userIndex]) usersTeachersState.users[userIndex].quarter = body.quarter
    if (body.tel && usersTeachersState.users[userIndex]) usersTeachersState.users[userIndex].tel = body.tel
  }

  // 2. Mettre à jour ou initialiser l'état spécifique au Teacher (Disponibilité)
  const teacherIndex = teachersState.teachers.findIndex(t => t.id === id)
  if (body.isAvailable !== undefined) {
    if (teacherIndex !== -1 && teachersState.teachers[teacherIndex]) {
      teachersState.teachers[teacherIndex].isAvailable = body.isAvailable
    } else {
      // Si l'enseignant n'existait pas encore dans la table étendue, on l'ajoute
      const user = usersTeachersState.users.find(u => u.id === id)
      if (user) {
        teachersState.teachers.push({
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

  return { success: true, message: 'Teacher updated successfully' }
})