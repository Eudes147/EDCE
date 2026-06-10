import { defineEventHandler, createError, readBody, parseCookies } from 'h3'
import type { User, UserStatus } from '~/types/auth'
// Importation de ta source de données locale pour la modifier
import { mockUsers } from '~/data/mockData'

export default defineEventHandler(async (event) => {
  // 1. Récupération de l'ID cible depuis l'URL de la requête
  const targetUserId = event.context.params?.id

  // 2. Vérification de l'authentification et du rôle de l'exécuteur
  const cookies = parseCookies(event)
  const authUserCookie = cookies['auth_user']

  if (!authUserCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié.' })
  }

  const currentUser = JSON.parse(authUserCookie) as User

  if (currentUser.status !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Action réservée aux administrateurs.' })
  }

  // 3. Récupération du nouveau rôle demandé
  const body = await readBody<{ status: UserStatus }>(event)
  if (!body || !body.status) {
    throw createError({ statusCode: 400, statusMessage: 'Le champ status est requis.' })
  }

  try {
    // 4. Recherche de l'utilisateur dans le tableau local
    const userToUpdate = mockUsers.find(u => u.id === targetUserId)

    if (!userToUpdate) {
      throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable.' })
    }

    // 5. Mutation de l'objet en mémoire (Simulation d'un UPDATE en base de données)
    userToUpdate.status = body.status

    return { 
      success: true, 
      message: `Le statut de ${userToUpdate.first_name} a été modifié en ${body.status} avec succès.` 
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la mise à jour du mock.",
    })
  }
})