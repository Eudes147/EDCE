// server/api/activities/index.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    if (!body.title) {
      throw createError({ statusCode: 400, statusMessage: 'Activity title is required' })
    }

    // L'ID est désormais généré automatiquement par la base de données par défaut
    const { data, error } = await client
      .from('activities')
      .insert({
        title: body.title
      })
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 400, message: error.message })
    }

    return { success: true, data }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la création de l'activité.",
    })
  }
})