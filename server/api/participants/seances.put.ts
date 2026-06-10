import { participantSeanceState } from './seances.get'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) 

  const index = participantSeanceState.participants.findIndex(p => p.id === body.id)
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Participant de séance introuvable.' })
  }

  participantSeanceState.participants[index] = {
    id: body.id,
    childId: body.childId,
    seanceId: body.seanceId
  }
  return { success: true }
})