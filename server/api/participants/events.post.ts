// server/api/participants/events.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.childId || !body.eventActivityId) {
      throw createError({ statusCode: 400, message: 'Champs requis manquants (childId, eventActivityId)' })
    }

    const payload = {
      ...(body.id ? { id: body.id } : {}),
      child_id: body.childId,
      event_activity_id: body.eventActivityId
    }

    const { data, error } = await client
      .from('participant_event_activities')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    const newParticipantEvent = {
      id: data.id,
      childId: data.child_id,
      eventActivityId: data.event_activity_id
    }

    return { success: true, data: newParticipantEvent }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'ajout de la participation à l'événement.",
    })
  }
})