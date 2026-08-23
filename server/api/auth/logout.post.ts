// server/api/auth/logout.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // 1. Récupération et vérification du token d'authentification dans les headers
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé : Aucun token valide fourni pour la déconnexion.',
      })
    }

    const token = authHeader.split(' ')[1]
    const client = await serverSupabaseClient(event)

    // 2. Déconnexion officielle auprès de Supabase avec le token de l'utilisateur
    // On crée un client scopé avec le token pour cibler la bonne session
    const { error } = await client.auth.signOut(token)

    if (error) {
      console.warn("Avertissement Supabase lors du signOut :", error.message)
      // On continue quand même le nettoyage local pour ne pas bloquer l'utilisateur
    }

    // 3. Suppression explicite du cookie d'authentification côté serveur
    deleteCookie(event, 'auth_token', {
      path: '/'
    })

    // 4. Réponse au format JSON standardisé
    return {
      success: true,
      message: 'Déconnexion réussie. Session clôturée avec succès.'
    }

  } catch (error: any) {
    // Propagation propre de l'erreur
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Une erreur interne est survenue lors de la déconnexion.',
    })
  }
})