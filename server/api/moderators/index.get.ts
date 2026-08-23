// server/api/moderators/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Moderator } from '~/types/moderator'

// Fonction utilitaire de mapping BDD -> Front
const mapModeratorFromDb = (m: any): Moderator => ({
  id: m.id,
  first_name: m.first_name,
  last_name: m.last_name,
  sexe: m.sexe,
  tel: m.tel,
  quarter: m.quarter,
  isAvailable: m.is_available ?? false
})

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

    const moderators = (listModerators || []).map(mapModeratorFromDb)

    // Calculs des filtres de listes directement sur les données mappées
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