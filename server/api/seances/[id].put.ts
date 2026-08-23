// server/api/seances/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Seance ID is required' })
    }

    const updatePayload: any = {}
    if (body.title !== undefined) updatePayload.title = body.title
    if (body.type !== undefined) updatePayload.type = body.type
    if (body.classe !== undefined) updatePayload.classe = body.classe
    if (body.authorId !== undefined || body.author_id !== undefined) {
      updatePayload.author_id = body.authorId || body.author_id
    }
    if (body.supervisorId !== undefined || body.supervisor_id !== undefined) {
      updatePayload.supervisor_id = body.supervisorId || body.supervisor_id
    }

    const { data, error } = await client
      .from('seances')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Seance not found' })
    }

    const formattedData = {
      id: data.id,
      title: data.title,
      type: data.type,
      classe: data.classe,
      authorId: data.author_id,
      supervisorId: data.supervisor_id,
      created_at: data.created_at
    }

    return { success: true, data: formattedData }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la mise à jour de la séance.",
    })
  }
})