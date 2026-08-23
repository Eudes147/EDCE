// server/api/supervSeances/index.delete.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const query = getQuery(event)
    const seanceId = query.seanceId as string
    const supervisorSeanceId = query.supervisorSeanceId as string

    if (!seanceId || !supervisorSeanceId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Champs (seanceId et supervisorSeanceId) requis pour la suppression.'
      })
    }

    const { error } = await client
      .from('supervisor_seance')
      .delete()
      .eq('seance_id', seanceId)
      .eq('supervisor_seance_id', supervisorSeanceId)

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return { 
      success: true, 
      message: 'Moniteur retiré de la séance avec succès' 
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la suppression de la liaison.",
    })
  }
})