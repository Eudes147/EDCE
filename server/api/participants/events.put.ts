import { participantEventState } from './events.get'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const index = participantEventState.participantEvents.findIndex(p => p.id === body.id)
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Liaison événement-enfant introuvable.' })
  }

  participantEventState.participantEvents[index] = {
    id: body.id,
    childId: body.childId,
    eventActivityId: body.eventActivityId
  }
  return { success: true }
})