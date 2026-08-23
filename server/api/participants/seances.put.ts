// server/api/participants/seances.put.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = readBody(event) instanceof Promise ? await readBody(event) : readBody(event)

    if (!body.id) {
      throw createError({ statusCode: 400, message: "L'identifiant du participant est requis." })
    }

    const updatePayload: any = {}
    if (body.childId !== undefined) updatePayload.child_id = body.childId
    if (body.seanceId !== undefined) updatePayload.seance_id = body.seanceId

    const { data, error } = await client
      .from('participant_seance')
      .update(updatePayload)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, message: 'Participant de séance introuvable.' })
    }

    return { success: true }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la modification du participant.",
    })
  }
})