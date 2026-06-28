import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import { mockGlobalAttendanceDb } from '~/data/mockData'
import type { MeetingAttendancePayload } from '~/types/globalAttendance'

export default defineEventHandler(async (event) => {
  const monthKey = getRouterParam(event, 'monthKey')
  const query = getQuery(event)
  
  const dateLabel = query.dateLabel as string | undefined

  // Filtrage sur le mois demandé
  const monthlyMeetings = mockGlobalAttendanceDb.filter((item) => item.monthKey === monthKey)

  // Si on cible un dimanche spécifique (Vue de saisie terrain)
  if (dateLabel) {
    const specificMeeting = monthlyMeetings.find(
      (item) => item.dateLabel.toLowerCase() === dateLabel.toLowerCase()
    )
    return (specificMeeting as MeetingAttendancePayload) || null
  }

  // Sinon, renvoi complet de l'historique mensuel (Vue Administration)
  return monthlyMeetings as MeetingAttendancePayload[]
})