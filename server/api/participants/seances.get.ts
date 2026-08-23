// server/api/participants/seances.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { ParticipantSeance } from '~/types/participant'
import type { Seance } from '~/types/seance'
import type { Child } from '~/types/child'
import type { Teacher } from '~/types/teacher'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // Exécution des requêtes en parallèle pour optimiser les performances
    const [seancesRes, participantsRes, childrenRes, teachersRes] = await Promise.all([
      client.from('seances').select('*'),
      client.from('participant_seance').select('*'),
      client.from('children').select('*'),
      client.from('teachers').select('*')
    ])

    if (seancesRes.error) throw createError({ statusCode: 400, statusMessage: seancesRes.error.message })
    if (participantsRes.error) throw createError({ statusCode: 400, statusMessage: participantsRes.error.message })
    if (childrenRes.error) throw createError({ statusCode: 400, statusMessage: childrenRes.error.message })
    if (teachersRes.error) throw createError({ statusCode: 400, statusMessage: teachersRes.error.message })

    // Normalisation des champs snake_case vers camelCase si nécessaire pour les participants
    const listParticipantSeance: ParticipantSeance[] = (participantsRes.data || []).map((p: any) => ({
      id: p.id,
      childId: p.child_id,
      seanceId: p.seance_id
    }))

    return {
      listSeances: (seancesRes.data || []) as Seance[],
      listParticipantSeance,
      listChildren: (childrenRes.data || []) as Child[],
      listTeachers: (teachersRes.data || []) as Teacher[]
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des données de participants aux séances.",
    })
  }
})