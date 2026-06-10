import { notesState } from './index.get'
import type { Note } from '~/types/test'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.childId || !body.testId || body.note === undefined) {
    throw createError({ statusCode: 400, message: 'Champs requis manquants (childId, testId, note)' })
  }

  const newNote: Note = {
    id: `note-${Math.random().toString(36).substring(2, 11)}`,
    childId: body.childId,
    testId: body.testId,
    note: Number(body.note),
    created_at: new Date().toISOString()
  }

  notesState.notes.push(newNote)
  return { success: true, data: newNote }
})