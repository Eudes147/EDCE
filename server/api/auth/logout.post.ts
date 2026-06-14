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

    // 2. Suppression explicite du cookie d'authentification côté serveur
    deleteCookie(event, 'auth_token', {
      path: '/'
    })

    // 3. Réponse au format JSON standardisé
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