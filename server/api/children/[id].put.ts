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

    // Mapping sécurisé vers le format Snake_case de la BDD
    const payload: Record<string, any> = {}

    if (body.classe !== undefined) payload.classe = body.classe
    if (body.name !== undefined) payload.name = body.name
    if (body.birth_date !== undefined || body.birthDate !== undefined) {
      const bDate = body.birth_date || body.birthDate
      payload.birth_date = bDate ? new Date(bDate).toISOString() : null
    }
    if (body.tel !== undefined) payload.tel = body.tel
    if (body.telParent !== undefined || body.tel_parent !== undefined) {
      payload.tel_parent = body.telParent || body.tel_parent
    }
    if (body.sexe !== undefined) payload.sexe = body.sexe
    if (body.nivScolaire !== undefined || body.niv_scolaire !== undefined) {
      payload.niv_scolaire = body.nivScolaire || body.niv_scolaire
    }
    if (body.sexeParent !== undefined || body.sexe_parent !== undefined) {
      payload.sexe_parent = body.sexeParent || body.sexe_parent
    }
    if (body.adresse !== undefined) payload.adresse = body.adresse

    if (body.quarter !== undefined) payload.quarter = body.quarter


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