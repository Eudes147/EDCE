// server/api/auth/logout.post.ts
import { defineEventHandler, getHeader, deleteCookie, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé : Aucun token valide fourni pour la déconnexion.',
      })
    }

    const token = authHeader.split(' ')[1]
    const client = await serverSupabaseClient(event)

    const { error } = await client.auth.signOut(token)

    if (error) {
      console.warn("Avertissement Supabase lors du signOut :", error.message)
    }

    deleteCookie(event, 'auth_token', {
      path: '/'
    })

    return {
      success: true,
      message: 'Déconnexion réussie. Session clôturée avec succès.'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Une erreur interne est survenue lors de la déconnexion.',
    })
  }
})