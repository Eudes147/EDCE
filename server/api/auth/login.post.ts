import { mockUsers } from '~/data/mockData' 

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // 1. Validation basique des champs reçus
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Veuillez fournir un e-mail et un mot de passe.',
      })
    }

    // 2. Recherche de l'utilisateur (insensible à la casse)
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Identifiants incorrects (E-mail introuvable).',
      })
    }

    // 3. Vérification du mot de passe
    // En développement, on accepte le mot de passe générique ou "password123"
    if (password !== 'password123' && password !== user.password) {
      throw createError({
        statusCode: 401,
        message: 'Identifiants incorrects (Mot de passe invalide).',
      })
    }

    // 4. Extraction du mot de passe par sécurité avant de renvoyer le profil
    const { password: _, ...userWithoutPassword } = user

    // 5. Envoi de la réponse structurée attendue par ton store
    return {
      token: `mock-jwt-token-${user.id}-${user.status}-${Date.now()}`,
      user: userWithoutPassword
    }

  } catch (error: any) {
    // On propage l'erreur interceptée ou on applique une erreur 500 par défaut
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Une erreur interne est survenue lors de la connexion.',
    })
  }
})