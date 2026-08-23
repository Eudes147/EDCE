// server/api/notes/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Note } from '~/types/test'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    const { data: listNotes, error } = await client
      .from('notes')
      .select('*')

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const notes: Note[] = (listNotes || []).map((n: any) => ({
      id: n.id,
      childId: n.child_id,
      testId: n.test_id,
      note: Number(n.note),
      created_at: n.created_at
    }))

    return {
      listNotes: notes
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des notes.",
    })
  }
})