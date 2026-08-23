// server/api/teachers/[id].put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { UserStatus } from '~/types/auth'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Teacher ID is required' })
    }

    // 1. Si le corps de la requête demande un changement de statut global
    if (body.status) {
      const { error: statusError } = await client
        .from('users')
        .update({ status: body.status as UserStatus })
        .eq('id', id)

      if (statusError) {
        throw createError({ statusCode: 400, statusMessage: statusError.message })
      }
    }

    // 2. Préparation de la mise à jour pour la table 'teachers'
    const updatePayload: any = {}
    if (body.isAvailable !== undefined) updatePayload.is_available = body.isAvailable
    if (body.quarter !== undefined) updatePayload.quarter = body.quarter
    if (body.tel !== undefined) updatePayload.tel = body.tel
    if (body.first_name !== undefined) updatePayload.first_name = body.first_name
    if (body.last_name !== undefined) updatePayload.last_name = body.last_name
    if (body.sexe !== undefined) updatePayload.sexe = body.sexe

    if (Object.keys(updatePayload).length > 0) {
      const { data, error: teacherError } = await client
        .from('teachers')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single()

      if (teacherError) {
        throw createError({ statusCode: 400, statusMessage: teacherError.message })
      }

      // Formatage du retour en camelCase pour le front
      const formattedData = data ? {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        sexe: data.sexe,
        tel: data.tel,
        quarter: data.quarter,
        isAvailable: data.is_available
      } : null

      return { success: true, message: 'Teacher updated successfully', data: formattedData }
    }

    return { success: true, message: 'Teacher updated successfully' }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la mise à jour de l'enseignant.",
    })
  }
})