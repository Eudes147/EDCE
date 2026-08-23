// server/api/auth/register.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    const firstName = body.firstName || body.first_name
    const lastName = body.lastName || body.last_name
    const email = body.email
    const password = body.password
    const tel = body.tel || '+229 00 00 00 00'
    const sexe = body.sexe
    const birthDate = body.birthDate || body.birth_date
    const quarter = body.quarter
    const now = new Date().toISOString()

    if (!firstName || !lastName || !email || !password || !sexe) {
      throw createError({ statusCode: 400, message: 'Tous les champs requis ne sont pas remplis.' })
    }

    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          sexe: sexe,
          tel: tel,
          birth_date: birthDate
        }
      }
    })

    if (authError) {
      throw createError({ statusCode: 400, message: authError.message })
    }

    const userId = authData.user?.id

    if (userId) {
      const { error: userTableError } = await client
        .from('users')
        .upsert({
          id: userId,
          email: email,
          first_name: firstName,
          last_name: lastName,
          sexe: sexe,
          tel: tel,
          birth_date: birthDate || '2000-01-01',
          status: 'teacher',
          password: 'SUPABASE_AUTH_MANAGED',
          created_at: now
        })

      if (userTableError) {
        console.warn("Avertissement lors de l'insertion dans users :", userTableError.message)
      }

      const { error: teacherError } = await client
        .from('teachers')
        .upsert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          sexe: sexe,
          tel: tel,
          quarter: quarter,
          is_available: true
        })

      if (teacherError) {
        console.warn("Avertissement lors de l'insertion dans teachers :", teacherError.message)
      }
    }

    const { data: userData } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return {
      token: authData.session?.access_token,
      user: userData || authData.user
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Une erreur est survenue lors de l'inscription."
    })
  }
})