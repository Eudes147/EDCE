// server/api/supervSeances/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.seanceId || !body.supervisorSeanceId) {
      throw createError({ statusCode: 400, message: 'Champs (seanceId et supervisorSeanceId) requis.' })
    }

    const payload = {
      ...(body.id ? { id: body.id } : {}),
      seance_id: body.seanceId,
      supervisor_seance_id: body.supervisorSeanceId
    }

    const { data, error } = await client
      .from('supervisor_seance')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    const newSupervisor = {
      id: data.id,
      seanceId: data.seance_id,
      supervisorSeanceId: data.supervisor_seance_id
    }

    return {
      success: true, 
      data: newSupervisor 
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'ajout du superviseur.",
    })
  }
})