// server/api/activities/[id].delete.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const client = await serverSupabaseClient(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Activity ID is required' })
    }

    // Si tu n'as pas activé le CASCADE dans ta BDD, tu peux supprimer les relations manuellement avant :
    // await client.from('event_activities').delete().eq('activityId', id)

    // 1. Supprime l'activité dans Supabase
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