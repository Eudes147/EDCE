import { state } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const index = state.activities.findIndex(a => a.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Activity not found' })
  }

  state.activities[index] = { ...state.activities[index], ...body, id }
  return { success: true, data: state.activities[index] }
})

