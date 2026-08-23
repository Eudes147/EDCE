// server/api/tests/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const testId = getRouterParam(event, 'id')

    if (!testId) {
      throw createError({
        statusCode: 400,
        statusMessage: "L'identifiant du test est manquant.",
      })
    }

    // 1. Cascade manuelle : Suppression des notes associées (si non gérée par la BDD en ON DELETE CASCADE)
    const { error: notesError } = await client
      .from('notes')
      .delete()
      .eq('test_id', testId)

    if (notesError) {
      throw createError({ statusCode: 400, statusMessage: notesError.message })
    }

    // 2. Suppression du test lui-même
    const { error: testError } = await client
      .from('tests')
      .delete()
      .eq('id', testId)

    if (testError) {
      throw createError({ statusCode: 400, statusMessage: testError.message })
    }

    return {
      success: true,
      message: `Le test avec l'ID ${testId} a été supprimé avec succès ainsi que les notes associées.`
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la suppression du test sur le serveur.",
    })
  }
})