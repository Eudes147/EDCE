import { state } from '../activities/index.get'
import {participantEventState} from '../participants/events.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = state.events.findIndex(e => e.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Event relation not found' })
  }
  // Cascade : les participants aux Eventctivity
  participantEventState.participantEvents= participantEventState.participantEvents.filter(f=>f.eventActivityId !== id)

  state.events.splice(index, 1)
  return { success: true, message: 'Event relation deleted successfully' }
})