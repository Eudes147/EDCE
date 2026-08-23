// server/api/supervSeances/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const sId = body.seanceId || body.seance_id
    const supId = body.supervisorSeanceId || body.supervisor_seance_id

    if (!sId || !supId) {
      throw createError({ statusCode: 400, message: 'Champs (seanceId et supervisorSeanceId) requis.' })
    }

    const payload = {
      ...(body.id ? { id: body.id } : {}),
      seance_id: sId,
      supervisor_seance_id: supId
    }

    const { data, error } = await client
      .from('supervisor_seance')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    const newSupervisor = data ? {
      id: data.id,
      seanceId: data.seance_id,
      supervisorSeanceId: data.supervisor_seance_id
    } : null

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