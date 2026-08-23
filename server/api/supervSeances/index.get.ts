// server/api/supervSeances/index.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Teacher } from '~/types/teacher'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const query = getQuery(event)
    const seanceId = query.seanceId as string

    if (!seanceId) {
      throw createError({ statusCode: 400, statusMessage: 'SeanceId est requis.' })
    }

    // 1. Récupérer les lignes de liaison pour cette séance
    const { data: relations, error: relError } = await client
      .from('supervisor_seance')
      .select('supervisor_seance_id')
      .eq('seance_id', seanceId)

    if (relError) {
      throw createError({ statusCode: 400, statusMessage: relError.message })
    }

    if (!relations || relations.length === 0) {
      return { teachers: [] }
    }

    // Extraire les IDs des superviseurs
    const supervisorIds = relations.map((r: any) => r.supervisor_seance_id)

    // 2. Récupérer les profils complets des teachers correspondants
    const { data: teachers, error: teacherError } = await client
      .from('teachers')
      .select('*')
      .in('id', supervisorIds)

    if (teacherError) {
      throw createError({ statusCode: 400, statusMessage: teacherError.message })
    }

    return {
      teachers: (teachers || []) as Teacher[]
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des superviseurs.",
    })
  }
})