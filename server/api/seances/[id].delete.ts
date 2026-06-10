import { seancesState } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = seancesState.seances.findIndex(s => s.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Seance not found' })
  }

  seancesState.seances.splice(index, 1)
  return { success: true, message: 'Seance deleted successfully' }
})