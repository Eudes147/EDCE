// server/api/activities/[id].put.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Activity ID is required' })
    }

    const { data, error } = await client
      .from('activities')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Activity not found' })
    }

    return { success: true, data }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la mise à jour de l'activité.",
    })
  }
})