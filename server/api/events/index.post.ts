// server/api/events/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.activityId || !body.eventType || !body.year) {
      throw createError({ statusCode: 400, statusMessage: 'Missing fields: activityId, eventType, and year are required' })
    }

    const payload = {
      activityId: body.activityId,
      eventType: body.eventType,
      year: String(body.year)
    }

    const { data, error } = await client
      .from('event_activities')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return { success: true, data }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la création de la relation d'événement.",
    })
  }
})