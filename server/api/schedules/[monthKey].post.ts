import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { mockSchedulesStore, type ScheduleRow } from '~/data/mockData'

export default defineEventHandler(async (event) => {
  try {
    const monthKey = getRouterParam(event, 'monthKey')
    const body = await readBody(event)

    if (!monthKey || !body || !body.rows || !body.classe) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides. monthKey (URL), classe et rows (body) sont requis.',
      })
    }

    const { rows, classe, status } = body
    const classeName = classe as string

    // 1. Recherche sécurisée de l'index dans le store
    const scheduleIndex = mockSchedulesStore.schedules.findIndex(s => s.monthKey === monthKey)
    
    // Récupération sécurisée sans chaînage optionnel conflictuel
// 1. On récupère l'élément du tableau s'il existe
const currentSchedule = scheduleIndex !== -1 ? mockSchedulesStore.schedules[scheduleIndex] : null

// 2. On extrait les lignes en s'assurant que l'objet ET ses lignes sont bien définis
const existingRows: ScheduleRow[] = (currentSchedule && currentSchedule.rows) ? currentSchedule.rows : []

    // 2. Fusion native strictement typée grâce à ScheduleRow[]
    const updatedGlobalRows: ScheduleRow[] = rows.map((incomingRow: any) => {
      const existingRow = existingRows.find((r) => r.dateLabel === incomingRow.dateLabel)
      
      // On extrait ou on initialise l'objet des classes
      const currentClassesData = existingRow?.classes ? { ...existingRow.classes } : {}

      // Assignation de l'index dynamique
      currentClassesData[classeName] = incomingRow.assignments

      return {
        dateLabel: incomingRow.dateLabel as string,
        classes: currentClassesData
      }
    })

    // 3. Persistence (Upsert) sécurisée via stockage de la référence
    if (scheduleIndex !== -1) {
      const currentSchedule = mockSchedulesStore.schedules[scheduleIndex]
      if (currentSchedule) {
        currentSchedule.status = status || currentSchedule.status
        currentSchedule.rows = updatedGlobalRows
      }
    } else {
      mockSchedulesStore.schedules.push({
        monthKey,
        status: status || 'draft',
        rows: updatedGlobalRows
      })
    }

    return {
      success: true,
      monthKey,
      classe: classeName,
      status: status || 'draft',
      rows: updatedGlobalRows.map((r) => ({
        dateLabel: r.dateLabel,
        assignments: r.classes[classeName] || { NORMAL: [], SUNDAY_SCHOOL: [], DLT: [] }
      }))
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors du POST du planning.' })
  }
})