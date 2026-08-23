// server/api/moderators/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Moderator } from '~/types/moderator'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // Récupération directe de tous les modérateurs depuis la table dédiée
    const { data: listModerators, error } = await client
      .from('moderators')
      .select('*')

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const moderators = (listModerators || []) as Moderator[]

    // Calculs des filtres de listes directement sur les données de la table
    const moderatorsAvailable = moderators.filter(m => m.isAvailable)
    const moderatorsUnavailable = moderators.filter(m => !m.isAvailable)
    const moderatorMasculin = moderators.filter(m => m.sexe === 'Masculin')
    const moderatorFeminin = moderators.filter(m => m.sexe === 'Feminin')

    return {
      listModerators: moderators,
      moderatorsAvailable,
      moderatorsUnavailable,
      moderatorMasculin,
      moderatorFeminin
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des modérateurs.",
    })
  }
})