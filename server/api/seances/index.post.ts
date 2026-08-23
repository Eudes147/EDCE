// server/api/seances/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.title || !body.type || !body.classe || !body.authorId || !body.supervisorId) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields for creating a seance' })
    }

    const payload = {
      ...(body.id ? { id: body.id } : {}), // L'ID est optionnel, généré automatiquement par la BD si absent
      title: body.title,
      type: body.type,
      classe: body.classe,
      author_id: body.authorId || body.author_id,
      supervisor_id: body.supervisorId || body.supervisor_id,
      created_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('seances')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const formattedData = data ? {
      id: data.id,
      title: data.title,
      type: data.type,
      classe: data.classe,
      authorId: data.author_id,
      supervisorId: data.supervisor_id,
      created_at: data.created_at
    } : null

    return { success: true, data: formattedData }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la création de la séance.",
    })
  }
})