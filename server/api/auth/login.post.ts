// server/api/auth/login.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    const { email, password } = body

    if (!email || !password) {
      throw createError({ statusCode: 400, message: 'Email et mot de passe requis.' })
    }
    // 1. Connexion via Supabase Auth
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      throw createError({ statusCode: 401, message: 'Identifiants invalides.' })
    }

    // 2. Récupérer les informations du profil dans public.users (rôle, nom, prénom, etc.)
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