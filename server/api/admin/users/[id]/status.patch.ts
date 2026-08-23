// server/api/admin/users/[id]/status.patch.ts
import { defineEventHandler, createError, readBody, parseCookies } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { User, UserStatus } from '~/types/auth'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // 1. Récupération de l'ID cible depuis l'URL de la requête
    const targetUserId = event.context.params?.id

    if (!targetUserId) {
      throw createError({ statusCode: 400, statusMessage: "ID de l'utilisateur manquant." })
    }

    // 2. Vérification de l'authentification et du rôle de l'exécuteur
    const cookies = parseCookies(event)
    const authUserCookie = cookies['auth_user']

    if (!authUserCookie) {
      throw createError({ statusCode: 401, statusMessage: 'Non authentifié.' })
    }

    const currentUser = JSON.parse(authUserCookie) as User

    if (currentUser.status !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Action réservée aux administrateurs.' })
    }

    // 3. Récupération de l'ancien statut et du nouveau rôle demandé
    const { data: existingUser, error: fetchError } = await client
      .from('users')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (fetchError || !existingUser) {
      throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable.' })
    }

    const oldStatus = existingUser.status

    const body = await readBody<{ status: UserStatus }>(event)
    if (!body || !body.status) {
      throw createError({ statusCode: 400, statusMessage: 'Le champ status est requis.' })
    }

    const newStatus = body.status

    // 4. Mise à jour dans la table Supabase 'users'
    const { data: updatedUser, error: updateError } = await client
      .from('users')
      .update({ status: newStatus })
      .eq('id', targetUserId)
      .select()
      .single()

    if (updateError) {
      throw createError({ statusCode: 400, statusMessage: updateError.message })
    }

    // 5. Gestion des tables spécifiques aux rôles (teachers / moderators / admins)
    // Si le statut change, on nettoie l'ancienne table de rôle
    if (oldStatus === 'teacher') {
      await client.from('teachers').delete().eq('id', targetUserId)
    } else if (oldStatus === 'moderator') {
      await client.from('moderators').delete().eq('id', targetUserId)
    }

    // Et on insère dans la nouvelle table de rôle correspondante
    if (newStatus === 'teacher') {
      await client.from('teachers').upsert({
        id: updatedUser.id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        sexe: updatedUser.sexe,
        tel: updatedUser.tel,
        quarter: updatedUser.quarter,
        is_available: true
      })
    } else if (newStatus === 'moderator') {
      await client.from('moderators').upsert({
        id: updatedUser.id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        sexe: updatedUser.sexe,
        tel: updatedUser.tel,
        quarter: updatedUser.quarter,
        is_available: true
      })
    }
    // Si le statut devient 'admin', il n'a pas forcément de table dédiée, ou tu peux en créer une si besoin.

    return { 
      success: true, 
      message: `Le statut de ${updatedUser.first_name || 'l\'utilisateur'} a été modifié en ${newStatus} avec succès.`,
      data: updatedUser
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la mise à jour du statut.",
    })
  }
})