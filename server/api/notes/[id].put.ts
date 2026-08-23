// server/api/notes/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Note } from '~/types/test'

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
    if (body.child_id !== undefined) updatePayload.child_id = body.child_id
    if (body.testId !== undefined) updatePayload.test_id = body.testId
    if (body.test_id !== undefined) updatePayload.test_id = body.test_id
    if (body.testid !== undefined) updatePayload.test_id = body.testid
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

    const formattedData: Note = {
      id: data.id,
      childId: data.child_id,
      testId: data.test_id,
      note: Number(data.note),
      created_at: data.created_at
    }

    return { success: true, data: formattedData }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la modification de la note.",
    })
  }
})