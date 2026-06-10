import { participantEventState } from './events.get'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id as string

  const index = participantEventState.participantEvents.findIndex(p => p.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Liaison événement-enfant introuvable.' })
  }

  participantEventState.participantEvents.splice(index, 1)
  return { success: true }
})