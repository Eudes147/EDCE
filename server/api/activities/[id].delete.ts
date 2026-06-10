import { state } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = state.activities.findIndex(a => a.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Activity not found' })
  }

  // 1. Supprime l'activité
  state.activities.splice(index, 1)

  // 2. Cascade : Supprime automatiquement toutes les liaisons liées à cette activité
  state.events = state.events.filter(ea => ea.activityId !== id)

  return { success: true, message: 'Activity and its event relations deleted successfully' }
})