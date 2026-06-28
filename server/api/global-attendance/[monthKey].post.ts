import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { mockGlobalAttendanceDb } from '~/data/mockData'
import type { MeetingAttendancePayload } from '~/types/globalAttendance'

export default defineEventHandler(async (event) => {
  try {
    const monthKey = getRouterParam(event, 'monthKey')
    const body = await readBody<MeetingAttendancePayload>(event)
    
    // Validation stricte des données requises
    if (!monthKey || !body || !body.dateLabel || !Array.isArray(body.assignments)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Données de réunion incomplètes ou invalides (dateLabel et assignments requis).",
      })
    }

    // Recherche d'un émargement existant pour ce dimanche précis
    const existingIndex = mockGlobalAttendanceDb.findIndex(
      (item) => item.monthKey === monthKey && item.dateLabel === body.dateLabel
    )

    const updatedRecord: MeetingAttendancePayload = {
      monthKey: monthKey,
      dateLabel: body.dateLabel,
      checkedAt: new Date().toISOString(),
      checkedBy: body.checkedBy || "Responsable Réunion",
      assignments: body.assignments
    }

    if (existingIndex !== -1) {
      // Équivalent d'un PUT : Mise à jour par écrasement de la feuille existante
      mockGlobalAttendanceDb[existingIndex] = updatedRecord
    } else {
      // Équivalent d'un POST classique : Ajout d'une nouvelle feuille dominicale
      mockGlobalAttendanceDb.push(updatedRecord)
    }

    return { 
      success: true, 
      message: "Présences à la réunion enregistrées avec succès.",
      data: updatedRecord
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    return createError({
      statusCode: 500,
      statusMessage: "Erreur interne lors de la sauvegarde de l'émargement de la réunion.",
    })
  }
})