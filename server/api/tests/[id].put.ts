// server/api/tests/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
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

    const body = await readBody(event)

    // Préparation du payload de mise à jour (conversion en snake_case pour la BDD)
    const updatePayload: any = {}
    if (body.titleTest !== undefined) updatePayload.title_test = body.titleTest
    if (body.classe !== undefined) updatePayload.classe = body.classe
    if (body.typeTest !== undefined) updatePayload.type_test = body.typeTest
    if (body.sujetTest !== undefined) updatePayload.sujet_test = body.sujetTest
    if (body.correctionTest !== undefined) updatePayload.correction_test = body.correctionTest
    if (body.authorId !== undefined) updatePayload.author_id = body.authorId

    const { data, error } = await client
      .from('tests')
      .update(updatePayload)
      .eq('id', testId)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: "Test introuvable." })
    }

    return {
      success: true,
      message: `Le test avec l'ID ${testId} a été modifié avec succès.`,
      data
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la modification du test sur le serveur.",
    })
  }
})