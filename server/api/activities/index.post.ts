import { state } from './index.get'
import type { Activity } from '~/types/activity'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title) {
    throw createError({ statusCode: 400, statusMessage: 'Activity title is required' })
  }

  // Simulation d'un ID auto-incrémenté unique
  const newActivity: Activity = {
    id: `activity-${String(state.activities.length + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 5)}`,
    title: body.title
  }

  state.activities.push(newActivity)
  return { success: true, data: newActivity }
})