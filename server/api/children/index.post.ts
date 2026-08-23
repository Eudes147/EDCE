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

    // Conversion du payload CamelCase (front) vers Snake_case (base de données)
    const payload = {
      ...(body.id ? { id: body.id } : {}), // L'ID est optionnel, généré automatiquement par la BD si absent
      classe: body.classe,
      name: body.name,
      birth_date: body.birth_date ? new Date(body.birth_date).toISOString() : null,
      tel: body.tel || null,
      tel_parent: body.telParent || body.tel_parent,
      sexe: body.sexe,
      niv_scolaire: body.nivScolaire || body.niv_scolaire,
      sexe_parent: body.sexeParent || body.sexe_parent,
      adresse: body.adresse || null,
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