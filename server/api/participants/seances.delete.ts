import { participantSeanceState } from './seances.get'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id as string

  const index = participantSeanceState.participants.findIndex(p => p.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Participant introuvable.' })
  }

  participantSeanceState.participants.splice(index, 1)
  return { success: true }
})