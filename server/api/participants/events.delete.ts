// server/api/participants/events.delete.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const query = getQuery(event)
    const id = query.id as string

    if (!id) {
      throw createError({ statusCode: 400, message: 'Identifiant manquant dans les query params.' })
    }

    const { error } = await client
      .from('participant_event_activities')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    return { success: true }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la suppression de la liaison événement-enfant.",
    })
  }
})