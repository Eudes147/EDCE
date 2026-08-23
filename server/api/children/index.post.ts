// server/api/children/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.name || !body.classe) {
      throw createError({ statusCode: 400, statusMessage: 'Fields name and classe are required' })
    }

    const payload = {
      ...body,
      birth_date: body.birth_date ? new Date(body.birth_date).toISOString() : null,
      created_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('children')
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
      statusMessage: error.statusMessage || error.message || "Erreur lors de la création de l'enfant.",
    })
  }
})