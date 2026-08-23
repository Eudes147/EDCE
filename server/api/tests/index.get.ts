// server/api/tests/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Test } from '~/types/test'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    const { data: listTests, error } = await client
      .from('tests')
      .select('*')

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return {
      listTests: (listTests || []) as Test[]
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des tests.",
    })
  }
})