// server/api/admin/users.get.ts
import { defineEventHandler, createError, parseCookies } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { User } from '~/types/auth'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // 1. Récupération et validation de la session via le cookie
    const cookies = parseCookies(event)
    const authUserCookie = cookies['auth_user']

    if (!authUserCookie) {
      throw createError({ statusCode: 401, statusMessage: 'Non authentifié.' })
    }

    const currentUser = JSON.parse(authUserCookie) as User

    // 2. Contrôle d'accès Admin
    if (currentUser.status !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Accès interdit. Admin requis.' })
    }

    // 3. Récupération des utilisateurs depuis la table Supabase (ex: 'users')
    const { data: users, error } = await client
      .from('users')
      .select('*')

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    // 4. Par sécurité, on s'assure de ne jamais renvoyer de champ sensible s'il y en a
    const sanitizedUsers = (users || []).map((u: any) => {
      const { password, ...userWithoutPassword } = u
      return userWithoutPassword
    })

    return sanitizedUsers

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Impossible de charger les utilisateurs.',
    })
  }
})