import { participantSeanceState } from './seances.get'
import type { ParticipantSeance } from '~/types/participant'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.childId || !body.seanceId) {
    throw createError({ statusCode: 400, message: 'Champs requis manquants (childId, seanceId)' })
  }

  const newParticipant: ParticipantSeance = {
    id: body.id || `part-s-${Math.random().toString(36).substring(2, 11)}`,
    childId: body.childId,
    seanceId: body.seanceId
  }

  participantSeanceState.participants.push(newParticipant)
  return { success: true, data: newParticipant }
})