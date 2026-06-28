import { defineEventHandler, createError, getRouterParam, getQuery } from 'h3'
import { mockSchedulesStore } from '~/data/mockData'

export default defineEventHandler(async (event) => {
  // Récupération du paramètre de l'URL [monthKey]
  const monthKey = getRouterParam(event, 'monthKey')
  const query = getQuery(event)
  const classe = query.classe as string

  if (!monthKey || !classe) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Le monthKey dans l\'URL et le paramètre "classe" en query string sont requis.' 
    })
  }

  // 1. Recherche du mois dans le store en mémoire
  const schedule = mockSchedulesStore.schedules.find(s => s.monthKey === monthKey)

  if (!schedule) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `L'emploi du temps pour le mois ${monthKey} n'existe pas.` 
    })
  }

  // 2. Filtrage des lignes pour extraire uniquement les rôles de la classe ciblée
  const filteredRows = schedule.rows.map((row) => ({
    dateLabel: row.dateLabel,
    assignments: (row.classes && row.classes[classe as keyof typeof row.classes]) 
      ? row.classes[classe as keyof typeof row.classes] 
      : { NORMAL: [], SUNDAY_SCHOOL: [], DLT: [] }
  }))

  return {
    success: true,
    monthKey: schedule.monthKey,
    classe,
    status: schedule.status,
    rows: filteredRows
  }
})