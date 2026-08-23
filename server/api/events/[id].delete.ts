// server/api/events/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Event relation ID is required' })
    }

    // Cascade manuelle sur la table participant_event_activities avec la colonne event_activity_id
    await client
      .from('participant_event_activities')
      .delete()
      .eq('event_activity_id', id)

    // Suppression de la relation event_activities
    const { error } = await client
      .from('event_activities')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return { success: true, message: 'Event relation deleted successfully' }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la suppression de la relation d'événement.",
    })
  }
})