// server/api/auth/login.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    const { email, password } = body

    if (!email || !password) {
      throw createError({ statusCode: 400, message: 'Email et mot de passe requis.' })
    }

    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      throw createError({ statusCode: 401, message: 'Identifiants invalides.' })
    }

    const { data: userData, error: userError } = await client
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError || !userData) {
      throw createError({ statusCode: 404, message: 'Profil utilisateur introuvable.' })
    }

    return {
      token: authData.session.access_token,
      user: userData
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Échec de la connexion."
    })
  }
})