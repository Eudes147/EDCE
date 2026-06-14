import { defineEventHandler, createError } from 'h3'
import { testsState } from './index.get'
import { notesState } from '../notes/index.get'

export default defineEventHandler(async (event) => {
  // 1. Récupérer l'ID passé dans l'URL
  const testId = event.context.params?.id
  const index=testsState.tests.findIndex(test=>test.id == testId)
  if (!testId) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'identifiant du test est manquant.",
    })
  }

  try {
    // Suppression du test
    testsState.tests.splice(index,1)
    // Suppression des notes associées
    notesState.notes=notesState.notes.filter(note=>note.testId !== testId)
    return {
      success: true,
      message: `Le test avec l'ID ${testId} a été supprimé avec succès et les notes associés`
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur lors de la suppression du test sur le serveur.",
    })
  }
})