// server/api/children/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Child ID is required' })
    }

    const payload = {
      ...body,
      birth_date: body.birth_date ? new Date(body.birth_date).toISOString() : undefined
    }

    // On retire l'ID du payload de mise à jour pour éviter les conflits
    delete payload.id

    const { data, error } = await client
      .from('children')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Child not found' })
    }

    return { success: true, data }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la mise à jour de l'enfant.",
    })
  }
})