import { childrenState } from './index.get'
import {participantSeanceState} from "../participants/seances.get"
import {participantEventState} from "../participants/events.get"


export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = childrenState.children.findIndex(c => c.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Child not found' })
  }
  // Suppression du child
  childrenState.children.splice(index, 1)
  //Cascade suppression participantSeance,Event
  participantSeanceState.participants=participantSeanceState.participants.filter(participant=>participant.childId !== id)
  participantEventState.participantEvents=participantEventState.participantEvents.filter(participant=>participant.childId !== id)
  return { success: true, message: 'Child deleted successfully' }
})