// server/api/participants/events.put.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.id) {
      throw createError({ statusCode: 400, message: "L'identifiant de la liaison est requis." })
    }

    const updatePayload: any = {}
    if (body.childId !== undefined) updatePayload.child_id = body.childId
    if (body.eventActivityId !== undefined) updatePayload.event_activity_id = body.eventActivityId

    const { data, error } = await client
      .from('participant_event_activities')
      .update(updatePayload)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, message: 'Liaison événement-enfant introuvable.' })
    }

    return { success: true }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la modification de la liaison.",
    })
  }
})