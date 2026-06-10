import { participantEventState } from './events.get'
import type { ParticipantEventActivity } from '~/types/participant'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.childId || !body.eventActivityId) {
    throw createError({ statusCode: 400, message: 'Champs requis manquants (childId, eventActivityId)' })
  }

  const newParticipantEvent: ParticipantEventActivity = {
    id: body.id || `part-e-${Math.random().toString(36).substring(2, 11)}`,
    childId: body.childId,
    eventActivityId: body.eventActivityId
  }

  participantEventState.participantEvents.push(newParticipantEvent)
  return { success: true, data: newParticipantEvent }
})