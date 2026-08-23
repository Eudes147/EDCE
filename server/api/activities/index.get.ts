import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
      .from('activities')
      .select('*')

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la récupération des activités."
    })
  }
})