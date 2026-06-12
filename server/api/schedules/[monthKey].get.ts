import { defineEventHandler, createError, getRouterParam } from 'h3'
import { getSchedule } from '~/composables/useSchedule'

export default defineEventHandler(async (event) => {
  try {
    // 1. Récupération du monthKey depuis l'URL (/api/schedules/2026-06)
    const monthKey = getRouterParam(event, 'monthKey')

    // 2. Validation du monthKey
    if (!monthKey) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le paramètre monthKey est requis (ex: /api/schedules/2026-06).',
      })
    }

    // 3. Validation du format monthKey (YYYY-MM)
    const monthKeyRegex = /^\d{4}-\d{2}$/
    if (!monthKeyRegex.test(monthKey)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format de mois invalide. Utilisez le format YYYY-MM (ex: 2026-06).',
      })
    }

    // 4. Récupération depuis le store en mémoire (mockées) au lieu de Prisma
    const schedule = getSchedule(monthKey)

    // 5. Gestion du cas où le schedule n'existe pas
    if (!schedule) {
      throw createError({
        statusCode: 404,
        statusMessage: `L'emploi du temps pour ${monthKey} n'existe pas.`,
      })
    }

    // 6. Parsing des données
    const parsedRows = JSON.parse(schedule.matrixData)

    console.log(`[API Schedule GET] Emploi du temps récupéré pour: ${monthKey}`)

    // 7. Réponse renvoyée au client
    return {
      success: true,
      monthKey: schedule.monthKey,
      status: schedule.status,
      rows: parsedRows,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt.toISOString(),
    }

  } catch (error: any) {
    console.error('[API Schedule GET] Erreur:', error)

    // Si c'est une erreur créée, la renvoyer directement
    if (error.statusCode) {
      throw error
    }

    // Sinon, renvoyer une erreur générique
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne lors de la récupération du planning.',
    })
  }
})