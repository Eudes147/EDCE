// server/api/tests/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.titleTest || !body.classe || !body.typeTest || !body.authorId) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Champs obligatoires manquants (titleTest, classe, typeTest, authorId).' 
      })
    }

    const newTestPayload = {
      ...(body.id ? { id: body.id } : {}), // L'ID est optionnel, généré automatiquement par la BD si absent
      title_test: body.titleTest,
      classe: body.classe,
      type_test: body.typeTest,
      sujet_test: body.sujetTest || '',
      correction_test: body.correctionTest || '',
      author_id: body.authorId,
      created_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('tests')
      .insert(newTestPayload)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    // Formatage de la réponse en camelCase pour le front
    const formattedData = data ? {
      id: data.id,
      titleTest: data.title_test,
      classe: data.classe,
      typeTest: data.type_test,
      sujetTest: data.sujet_test,
      correctionTest: data.correction_test,
      authorId: data.author_id,
      created_at: data.created_at
    } : null

    return { success: true, data: formattedData }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la création du test.",
    })
  }
})