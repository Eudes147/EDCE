import { childrenState } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const index = childrenState.children.findIndex(c => c.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Child not found' })
  }

  // Fusion des données en conservant l'ID d'origine
  childrenState.children[index] = { 
    ...childrenState.children[index], 
    ...body, 
    id,
    birth_date: body.birth_date ? new Date(body.birth_date) : childrenState.children[index]?.birth_date
  }

  return { success: true, data: childrenState.children[index] }
})