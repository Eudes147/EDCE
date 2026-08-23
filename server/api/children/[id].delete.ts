// server/api/children/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Child ID is required' })
    }

    // Cascade manuelle si non gérée par la BDD (tables de liaisons)
    await client.from('participants_seances').delete().eq('childId', id)
    await client.from('participants_events').delete().eq('childId', id)

    // Suppression de l'enfant
    const { error } = await client
      .from('children')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return { success: true, message: 'Child deleted successfully' }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la suppression de l'enfant.",
    })
  }
})