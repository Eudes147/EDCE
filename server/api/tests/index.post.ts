import { testsState } from './index.get'
import type { Test } from '~/types/test'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.titleTest || !body.classe || !body.typeTest || !body.authorId) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Champs obligatoires manquants (titleTest, classe, typeTest, authorId).' 
    })
  }

  const newTest: Test = {
    id: `test-${Math.random().toString(36).substring(2, 11)}`,
    titleTest: body.titleTest,
    classe: body.classe,
    typeTest: body.typeTest,
    sujetTest: body.sujetTest || '', // Reçoit un lien Google Drive (string)
    correctionTest: body.correctionTest || '', // Reçoit un lien Google Drive (string)
    authorId: body.authorId,
    created_at: new Date().toISOString()
  }

  testsState.tests.push(newTest)
  return { success: true, data: newTest }
})