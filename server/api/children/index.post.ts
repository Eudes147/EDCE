import { childrenState } from './index.get'
import type { Child } from '~/types/child'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.classe) {
    throw createError({ statusCode: 400, statusMessage: 'Fields name and classe are required' })
  }

  const newChild: Child = {
    ...body,
    id: `child-${String(childrenState.children.length + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 5)}`,
    birth_date: body.birth_date ? new Date(body.birth_date) : undefined,
    created_at: new Date().toISOString()
  }

  childrenState.children.push(newChild)
  return { success: true, data: newChild }
})