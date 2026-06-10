import { state } from '../activities/index.get'
import type { EventActivity } from '~/types/activity'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.activityId || !body.eventType || !body.year) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields: activityId, eventType, and year are required' })
  }

  const newEventRelation: EventActivity = {
    id: `event-${String(state.events.length + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 5)}`,
    activityId: body.activityId,
    eventType: body.eventType,
    year: String(body.year)
  }

  state.events.push(newEventRelation)
  return { success: true, data: newEventRelation }
})