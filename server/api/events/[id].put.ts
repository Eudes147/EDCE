// server/api/events/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Event relation ID is required' })
    }

    const payload: any = {}
    if (body.activityId !== undefined) payload.activity_id = body.activityId
    if (body.activity_id !== undefined) payload.activity_id = body.activity_id
    if (body.eventType !== undefined) payload.event_type = body.eventType
    if (body.event_type !== undefined) payload.event_type = body.event_type
    if (body.year !== undefined) payload.year = String(body.year)

    const { data, error } = await client
      .from('event_activities')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Event relation not found' })
    }

    const formattedData = {
      id: data.id,
      activityId: data.activity_id,
      eventType: data.event_type,
      year: data.year
    }

    return { success: true, data: formattedData }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la mise à jour de la relation d'événement.",
    })
  }
})