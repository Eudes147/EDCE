import { defineEventHandler, readBody, createError } from 'h3'
import {testsState} from './index.get'

export default defineEventHandler(async (event) => {
  // 1. Récupérer l'ID passé dans l'URL (/api/tests/123)
  const testId = event.context.params?.id
  const index=testsState.tests.findIndex(test=>test.id==testId)

  if (!testId) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'identifiant du test est manquant.",
    })
  }

  // 2. Récupérer les données envoyées dans le corps de la requête
  const body = await readBody(event)

  try {
    // Fusion des données en conservant l'ID d'origine
      testsState.tests[index] = { 
        ...testsState.tests[index], 
        ...body, 
        testId
      }

    return {
      success: true,
      message: `Le test avec l'ID ${testId} a été modifié avec succès.`,
      data: testsState.tests[index]
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur lors de la modification du test sur le serveur.",
    })
  }
})