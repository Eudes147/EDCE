import { state } from '../activities/index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = state.events.findIndex(e => e.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Event relation not found' })
  }

  state.events.splice(index, 1)
  return { success: true, message: 'Event relation deleted successfully' }
})