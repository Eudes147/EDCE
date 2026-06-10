import { childrenState } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = childrenState.children.findIndex(c => c.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Child not found' })
  }

  childrenState.children.splice(index, 1)
  return { success: true, message: 'Child deleted successfully' }
})