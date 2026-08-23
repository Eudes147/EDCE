// server/api/notes/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, message: "L'identifiant de la note est manquant." })
    }

    const updatePayload: any = {}
    if (body.childId !== undefined) updatePayload.child_id = body.childId
    if (body.testId !== undefined) updatePayload.test_id = body.testId
    if (body.testid !== undefined) updatePayload.test_id = body.testid // Gestion de la petite faute de frappe éventuelle
    if (body.note !== undefined) updatePayload.note = Number(body.note)

    const { data, error } = await client
      .from('notes')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, message: 'Note introuvable.' })
    }

    return { success: true, data }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la modification de la note.",
    })
  }
})