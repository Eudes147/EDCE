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

    // 1. Mappage complet des séances
    const listSeances: Seance[] = (seancesRes.data || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      classe: s.classe,
      type: s.type,
      authorId: s.author_id,
      supervisorId: s.supervisor_id,
      created_at: s.created_at,
    }))

    // 2. Mappage complet des participants aux séances
    const listParticipantSeance: ParticipantSeance[] = (participantsRes.data || []).map((p: any) => ({
      id: p.id,
      childId: p.child_id,
      seanceId: p.seance_id,
    }))

    // 3. Mappage complet des enfants
    const listChildren: Child[] = (childrenRes.data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      classe: c.classe,
      birth_date: c.birth_date,
      tel: c.tel,
      telParent: c.tel_parent,
      sexe: c.sexe,
      nivScolaire: c.niv_scolaire,
      sexeParent: c.sexe_parent,
      adresse: c.adresse,
      created_at: c.created_at
    }))

    // 4. Mappage complet des enseignants (teachers)
    const listTeachers: Teacher[] = (teachersRes.data || []).map((t: any) => ({
      id: t.id,
      first_name: t.first_name,
      last_name: t.last_name,
      sexe: t.sexe,
      tel: t.tel,
      quarter: t.quarter,
      isAvailable: t.is_available
    }))

    return {
      success: true,
      listSeances,
      listParticipantSeance,
      listChildren,
      listTeachers
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des données de participants aux séances.",
    })
  }
})