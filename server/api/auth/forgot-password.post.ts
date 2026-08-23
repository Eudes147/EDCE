// server/api/auth/forgot-password.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)
    const { email } = body

    if (!email) {
      throw createError({ statusCode: 400, message: "L'adresse e-mail est requise." })
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${getRequestURL(event).origin}/reset-password`,
    })

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    return { success: true, message: "E-mail de réinitialisation envoyé avec succès." }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la demande de réinitialisation."
    })
  }
})