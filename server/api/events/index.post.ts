// server/api/events/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const activityId = body.activityId || body.activity_id
    const eventType = body.eventType || body.event_type
    const year = body.year

    if (!activityId || !eventType || !year) {
      throw createError({ statusCode: 400, statusMessage: 'Missing fields: activityId, eventType, and year are required' })
    }

    const payload = {
      ...(body.id ? { id: body.id } : {}),
      activity_id: activityId,
      event_type: eventType,
      year: String(year)
    }

    const { data, error } = await client
      .from('event_activities')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const formattedData = data ? {
      id: data.id,
      activityId: data.activity_id,
      eventType: data.event_type,
      year: data.year
    } : null

    return { success: true, data: formattedData }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la création de la relation d'événement.",
    })
  }
})