import { defineEventHandler, readBody, createError } from 'h3'
import { mockAttendanceDb } from '~/data/mockData'
import type { AttendancePayload } from '~/types/attendance'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AttendancePayload>(event)
    
    // Validation stricte
    if (!body.monthKey || !body.dateLabel || !body.className || !body.slotType || !Array.isArray(body.assignments)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Données d'émargement incomplètes ou invalides.",
      })
    }

    // Cherche si la feuille existe déjà pour la mettre à jour
    const existingIndex = mockAttendanceDb.findIndex(
      (item) =>
        item.monthKey === body.monthKey &&
        item.dateLabel === body.dateLabel &&
        item.className === body.className &&
        item.slotType === body.slotType
    )

    const updatedRecord: AttendancePayload = {
      ...body,
      checkedAt: new Date().toISOString(),
      checkedBy: "Responsable de Séance" // Peut être rendu dynamique via une session utilisateur plus tard
    }

    if (existingIndex !== -1) {
      // Équivalent d'un PUT : On écrase l'ancien enregistrement
      mockAttendanceDb[existingIndex] = updatedRecord
    } else {
      // Équivalent d'un POST classique : On ajoute la nouvelle feuille
      mockAttendanceDb.push(updatedRecord)
    }

    return { 
      success: true, 
      message: "Présences enregistrées avec succès." 
    }

  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur interne lors de la sauvegarde.",
    })
  }
})