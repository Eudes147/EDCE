// server/api/moderators/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Moderator ID is required' })
    }

    // Préparation de l'objet de mise à jour pour la table 'moderators'
    const updatePayload: any = {}
    if (body.isAvailable !== undefined) updatePayload.is_available = body.isAvailable
    if (body.quarter !== undefined) updatePayload.quarter = body.quarter
    if (body.tel !== undefined) updatePayload.tel = body.tel
    if (body.first_name !== undefined) updatePayload.first_name = body.first_name
    if (body.last_name !== undefined) updatePayload.last_name = body.last_name
    if (body.sexe !== undefined) updatePayload.sexe = body.sexe

    const { data, error } = await client
      .from('moderators')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Moderator not found' })
    }

    const formattedData = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      sexe: data.sexe,
      tel: data.tel,
      quarter: data.quarter,
      isAvailable: data.is_available
    }

    return { success: true, message: 'Moderator updated successfully', data: formattedData }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la mise à jour du modérateur.",
    })
  }
})