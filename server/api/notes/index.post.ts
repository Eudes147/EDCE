// server/api/notes/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Note } from '~/types/test'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const childId = body.childId || body.child_id
    const testId = body.testId || body.test_id

    if (!childId || !testId || body.note === undefined) {
      throw createError({ statusCode: 400, message: 'Champs requis manquants (childId, testId, note)' })
    }

    const payload = {
      ...(body.id ? { id: body.id } : {}),
      child_id: childId,
      test_id: testId,
      note: Number(body.note),
      created_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('notes')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    const newNote: Note = data ? {
      id: data.id,
      childId: data.child_id,
      testId: data.test_id,
      note: Number(data.note),
      created_at: data.created_at
    } : null

    return { success: true, data: newNote }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'enregistrement de la note.",
    })
  }
})