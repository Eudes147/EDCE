import { seancesState } from './index.get'
import type { Seance } from '~/types/seance'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title || !body.type || !body.classe || !body.authorId || !body.supervisorId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields for creating a seance' })
  }

  const newSeance: Seance = {
    ...body,
    id: `seance-${String(seancesState.seances.length + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 5)}`,
    created_at: new Date().toISOString()
  }

  seancesState.seances.push(newSeance)
  return { success: true, data: newSeance }
})