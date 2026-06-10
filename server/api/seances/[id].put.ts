import { seancesState } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const index = seancesState.seances.findIndex(s => s.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Seance not found' })
  }

  seancesState.seances[index] = { ...seancesState.seances[index], ...body, id }
  return { success: true, data: seancesState.seances[index] }
})