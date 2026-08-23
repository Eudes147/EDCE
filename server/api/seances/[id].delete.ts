// server/api/seances/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Seance ID is required' })
    }

    // 1. Suppression des participants à la séance
    const { error: partError } = await client
      .from('participant_seance')
      .delete()
      .eq('seance_id', id)

    if (partError) {
      throw createError({ statusCode: 400, statusMessage: partError.message })
    }

    // 2. Suppression des superviseurs / moniteurs associés à la séance (supervisor_seance)
    const { error: supervError } = await client
      .from('supervisor_seance')
      .delete()
      .eq('seance_id', id)

    if (supervError) {
      throw createError({ statusCode: 400, statusMessage: supervError.message })
    }

    // 3. Suppression de la séance elle-même
    const { error: seanceError } = await client
      .from('seances')
      .delete()
      .eq('id', id)

    if (seanceError) {
      throw createError({ statusCode: 400, statusMessage: seanceError.message })
    }

    return { success: true, message: 'Seance and all relations deleted successfully' }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la suppression de la séance.",
    })
  }
})