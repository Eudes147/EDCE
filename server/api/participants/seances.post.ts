// server/api/participants/seances.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const childId = body.childId || body.child_id
    const seanceId = body.seanceId || body.seance_id

    if (!childId || !seanceId) {
      throw createError({ statusCode: 400, message: 'Champs requis manquants (childId, seanceId)' })
    }

    const payload = {
      ...(body.id ? { id: body.id } : {}),
      child_id: childId,
      seance_id: seanceId
    }

    const { data, error } = await client
      .from('participant_seance')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    const newParticipant = data ? {
      id: data.id,
      childId: data.child_id,
      seanceId: data.seance_id
    } : null

    return { success: true, data: newParticipant }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'ajout du participant à la séance.",
    })
  }
})