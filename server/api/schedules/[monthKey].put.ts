import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { updateSchedule, getSchedule } from '~/composables/useSchedule'

export default defineEventHandler(async (event) => {
  try {
    // 1. Récupération du monthKey depuis l'URL
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

    // 4. Récupération du body de la requête
    const body = await readBody(event)

    // 5. Vérification que le body n'est pas vide
    if (!body || (Object.keys(body).length === 0)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le corps de la requête ne peut pas être vide. Fournissez au moins "status" ou "rows".',
      })
    }

    // 6. Vérification que le schedule existe avant mise à jour (depuis le store)
    const existingSchedule = getSchedule(monthKey)

    if (!existingSchedule) {
      throw createError({
        statusCode: 404,
        statusMessage: `L'emploi du temps pour ${monthKey} n'existe pas. Utilisez POST pour le créer.`,
      })
    }

    // 7. Préparation des données pour la mise à jour
    const updates: { status?: string; rows?: any[] } = {}

    // 8. Validation et ajout du status si fourni
    if (body.status !== undefined) {
      const validStatus = ['draft', 'published']
      if (!validStatus.includes(body.status)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Le statut doit être "draft" ou "published".',
        })
      }
      updates.status = body.status
    }

    // 9. Validation et ajout des rows si fournis
    if (body.rows !== undefined) {
      if (!Array.isArray(body.rows) || body.rows.length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Les lignes du planning (rows) doivent être un tableau non-vide.',
        })
      }

      // Validation de la structure des rows
      const validAssignmentTypes = ['NORMAL', 'SUNDAY_SCHOOL', 'DLT']
      for (const row of body.rows) {
        if (!row.dateLabel || !row.assignments) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Chaque ligne doit contenir "dateLabel" et "assignments".',
          })
        }

        // Vérifier que assignments contient les bonnes clés
        for (const key of Object.keys(row.assignments)) {
          if (!validAssignmentTypes.includes(key)) {
            throw createError({
              statusCode: 400,
              statusMessage: `Type d'assignment invalide: ${key}. Les types valides sont: ${validAssignmentTypes.join(', ')}`,
            })
          }
        }

        // Vérifier que chaque assignment est un array
        for (const assignmentList of Object.values(row.assignments)) {
          if (!Array.isArray(assignmentList)) {
            throw createError({
              statusCode: 400,
              statusMessage: 'Chaque type d\'assignment doit contenir un tableau d\'IDs d\'enseignants.',
            })
          }
        }
      }

      updates.rows = body.rows
    }

    // 10. Mise à jour dans le store en mémoire (mockées)
    const schedule = updateSchedule(monthKey, updates)

    if (!schedule) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la mise à jour du planning.',
      })
    }

    // 11. Parsing des données pour la réponse
    const parsedRows = JSON.parse(schedule.matrixData)

    console.log(`[API Schedule PUT] Emploi du temps mis à jour pour: ${monthKey}`)

    // 12. Réponse renvoyée au client
    return {
      success: true,
      message: `L'emploi du temps pour ${monthKey} a été mis à jour avec succès.`,
      monthKey: schedule.monthKey,
      status: schedule.status,
      rows: parsedRows,
      updatedAt: schedule.updatedAt.toISOString(),
    }

  } catch (error: any) {
    console.error('[API Schedule PUT] Erreur:', error)

    // Si c'est une erreur créée, la renvoyer directement
    if (error.statusCode) {
      throw error
    }

    // Sinon, renvoyer une erreur générique
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne lors de la mise à jour du planning.',
    })
  }
})