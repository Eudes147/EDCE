import { defineEventHandler, createError, parseCookies } from 'h3'
import type { User } from '~/types/auth'
// Importation directe de ta source de données locale
import { mockUsers } from '~/data/mockData'

export default defineEventHandler(async (event) => {
  // 1. Récupération et validation de la session via le cookie
  const cookies = parseCookies(event)
  const authUserCookie = cookies['auth_user']

  if (!authUserCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié.' })
  }

  const currentUser = JSON.parse(authUserCookie) as User

  // 2. Contrôle d'accès Admin
  if (currentUser.status !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès interdit. Admin requis.' })
  }

  try {
    // 3. On nettoie la propriété 'password' de chaque utilisateur avant l'envoi au client
    return mockUsers.map((u) => {
      const { password, ...userWithoutPassword } = u
      return userWithoutPassword
    })
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de charger les utilisateurs du mock.',
    })
  }
})