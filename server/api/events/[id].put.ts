import { state } from '../activities/index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const index = state.events.findIndex(e => e.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Event relation not found' })
  }

  state.events[index] = { ...state.events[index], ...body, id }
  return { success: true, data: state.events[index] }
})