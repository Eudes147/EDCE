// server/api/auth/forgot-password.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)
    const { email, redirectTo } = body

    if (!email) {
      throw createError({ statusCode: 400, message: "L'adresse email est requise." })
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || undefined
    })

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    return { success: true, message: "Email de réinitialisation envoyé avec succès." }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'envoi de l'email de réinitialisation."
    })
  }
})