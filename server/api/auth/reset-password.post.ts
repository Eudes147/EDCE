// server/api/auth/reset-password.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)
    const { password, accessToken } = body

    if (!password) {
      throw createError({ statusCode: 400, message: "Le nouveau mot de passe est requis." })
    }

    // Si on passe le token d'accès temporaire de la session de récupération
    if (accessToken) {
      await client.auth.setSession({ access_token: accessToken, refresh_token: '' })
    }

    const { error } = await client.auth.updateUser({ password })

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    return { success: true, message: "Mot de passe mis à jour avec succès." }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la mise à jour du mot de passe."
    })
  }
})