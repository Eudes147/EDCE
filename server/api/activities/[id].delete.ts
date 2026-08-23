// server/api/activities/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const client = await serverSupabaseClient(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Activity ID is required' })
    }

    // 1. Suppression manuelle des relations dans event_activities (si CASCADE non géré en BDD)
    const { error: eventActivitiesError } = await client
      .from('event_activities')
      .delete()
      .eq('activity_id', id)

    if (eventActivitiesError) {
      throw createError({ statusCode: 400, statusMessage: eventActivitiesError.message })
    }

    // 2. Suppression de l'activité dans Supabase
    const { error } = await client
      .from('activities')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return { success: true, message: 'Activity and its event relations deleted successfully' }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la suppression de l'activité.",
    })
  }
})