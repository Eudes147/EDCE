import { defineEventHandler, readBody, createError } from 'h3'
import { upsertSchedule } from '~/composables/useSchedule'

export default defineEventHandler(async (event) => {
  try {
    // 1. Récupération des données envoyées par le client Vue
    const body = await readBody(event)

    // 2. Validation des données obligatoires
    if (!body || !body.monthKey || !body.rows) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides. Le mois (monthKey) et les lignes du planning (rows) sont requis.',
      })
    }

    // 3. Validation du format monthKey (YYYY-MM)
    const monthKeyRegex = /^\d{4}-\d{2}$/
    if (!monthKeyRegex.test(body.monthKey)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format de mois invalide. Utilisez le format YYYY-MM (ex: 2026-06).',
      })
    }

    // 4. Validation du status
    const validStatus = ['draft', 'published']
    const status = body.status || 'draft'
    if (!validStatus.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le statut doit être "draft" ou "published".',
      })
    }

    // 5. Validation du tableau rows
    if (!Array.isArray(body.rows) || body.rows.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Les lignes du planning (rows) doivent être un tableau non-vide.',
      })
    }

    // 6. Validation de la structure des rows
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

    const { monthKey, rows } = body

    // 7. Utiliser le store en mémoire (mockées) au lieu de Prisma
    const schedule = upsertSchedule(monthKey, status, rows)

    // 8. Parsing des données pour la réponse
    const parsedRows = JSON.parse(schedule.matrixData)

    console.log(`[API Schedule POST] Emploi du temps publié avec succès pour: ${monthKey}`)
    console.log(`[API Schedule POST] Nombre de dimanches traités: ${rows.length}`)

    // 9. Réponse renvoyée au client
    return {
      success: true,
      message: `L'emploi du temps pour ${monthKey} a été enregistré et publié avec succès.`,
      monthKey: schedule.monthKey,
      status: schedule.status,
      rows: parsedRows,
      publishedAt: schedule.updatedAt.toISOString(),
    }

  } catch (error: any) {
    console.error('[API Schedule POST] Erreur:', error)

    // Si c'est une erreur créée, la renvoyer directement
    if (error.statusCode) {
      throw error
    }

    // Sinon, renvoyer une erreur générique
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne lors de la publication du planning.',
    })
  }
})