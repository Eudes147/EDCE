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
      title: body.title,
      type: body.type,
      classe: body.classe,
      author_id: body.authorId,
      supervisor_id: body.supervisorId,
      created_at: new Date().toISOString(),
      ...body // Permet de passer d'autres champs optionnels s'il y en a
    }
    
    // On nettoie pour éviter les doublons de clés camelCase vs snake_case si présents dans le body
    delete payload.authorId
    delete payload.supervisorId

    const { data, error } = await client
      .from('seances')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return { success: true, data }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la création de la séance.",
    })
  }
})