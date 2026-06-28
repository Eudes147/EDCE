import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { mockSchedulesStore, type ScheduleRow } from '~/data/mockData'

export default defineEventHandler(async (event) => {
  try {
    const monthKey = getRouterParam(event, 'monthKey')
    const body = await readBody(event)

    if (!monthKey || !body || !body.rows || !body.classe) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données incomplètes pour le PUT (monthKey, rows, classe requis).',
      })
    }

    const { rows, classe, status } = body
    const classeName = classe as string

    // 1. Recherche sécurisée de l'index
    const scheduleIndex = mockSchedulesStore.schedules.findIndex(s => s.monthKey === monthKey)
    
    const existingRows: ScheduleRow[] = scheduleIndex !== -1 ? mockSchedulesStore.schedules[scheduleIndex].rows : []

    // 2. Fusion des données avec le type ScheduleRow[]
    const updatedGlobalRows: ScheduleRow[] = rows.map((incomingRow: any) => {
      const existingRow = existingRows.find((r) => r.dateLabel === incomingRow.dateLabel)
      const currentClassesData = existingRow?.classes ? { ...existingRow.classes } : {}

      currentClassesData[classeName] = incomingRow.assignments

      return {
        dateLabel: incomingRow.dateLabel as string,
        classes: currentClassesData
      }
    })

    // 3. Persistence
    if (scheduleIndex !== -1) {
      mockSchedulesStore.schedules[scheduleIndex].status = status || mockSchedulesStore.schedules[scheduleIndex].status
      mockSchedulesStore.schedules[scheduleIndex].rows = updatedGlobalRows
    } else {
      mockSchedulesStore.schedules.push({
        monthKey,
        status: status || 'draft',
        rows: updatedGlobalRows
      })
    }

    return {
      success: true,
      message: 'Mise à jour réussie.',
      monthKey,
      classe: classeName,
      rows: updatedGlobalRows.map((r) => ({
        dateLabel: r.dateLabel,
        assignments: r.classes[classeName] || { NORMAL: [], SUNDAY_SCHOOL: [], DLT: [] }
      }))
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors du PUT du planning.' })
  }
})