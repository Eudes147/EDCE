// server/api/tests/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Test } from '~/types/test'

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

    return { success: true, data }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la création du test.",
    })
  }
})