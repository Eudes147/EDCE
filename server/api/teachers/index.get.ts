import { mockUsers, mockTeachers } from '~/data/mockData'
import type { User } from '~/types/auth'
import type { Teacher } from '~/types/teacher'

// Les états serveur persistent en mémoire vive
export const usersState = {
  users: [...mockUsers] as User[]
}

export const teachersState = {
  teachers: [...mockTeachers] as Teacher[]
}

export default defineEventHandler(() => {
  // 1. Filtrer les utilisateurs qui ont le statut 'teacher'
  const activeUserTeachers = usersState.users.filter(u => u.status === 'teacher')

  // 2. Construire la liste complète des Teacher en combinant l'User et son état de disponibilité
  const listTeachers: Teacher[] = activeUserTeachers.map(user => {
    // On cherche si on a déjà un état étendu (isAvailable) pour cet ID
    const extendedInfo = teachersState.teachers.find(t => t.id === user.id)
    
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      sexe: user.sexe,
      tel: user.tel,
      quarter: user.quarter,
      // Si aucune info de dispo n'existe encore (ex: nouvel upgradé), on met true par défaut
      isAvailable: extendedInfo ? extendedInfo.isAvailable : true
    }
  })

  // 3. Calculer les propriétés filtrées directement sur le serveur
  const teachersAvailable = listTeachers.filter(t => t.isAvailable)
  const teachersUnavailable = listTeachers.filter(t => !t.isAvailable)
  const teacherMasculin = listTeachers.filter(t => t.sexe === 'Masculin')
  const teacherFeminin = listTeachers.filter(t => t.sexe === 'Feminin')

  return {
    listTeachers,
    teachersAvailable,
    teachersUnavailable,
    teacherMasculin,
    teacherFeminin
  }
})