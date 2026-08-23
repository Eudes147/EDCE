// server/api/tests/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Test } from '~/types/test'

// Fonction utilitaire de mapping de la BDD vers le Front
const mapTestFromDb = (t: any): Test => ({
  id: t.id,
  titleTest: t.title_test,
  classe: t.classe,
  typeTest: t.type_test,
  sujetTest: t.sujet_test || undefined,
  correctionTest: t.correction_test || undefined,
  authorId: t.author_id,
  created_at: t.created_at
})

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    const { data: listTests, error } = await client
      .from('tests')
      .select('*')

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const formattedTests = (listTests || []).map(mapTestFromDb)

    return {
      listTests: formattedTests
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des tests.",
    })
  }
})