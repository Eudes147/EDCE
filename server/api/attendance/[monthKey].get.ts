import { defineEventHandler, getQuery } from 'h3'
import { mockAttendanceDb } from '~/data/mockData'

export default defineEventHandler(async (event) => {
  const monthKey = event.context.params?.monthKey
  const query = getQuery(event)
  
  const className = query.className as string
  const slotType = query.slotType as string
  const dateLabel = query.dateLabel as string

  // Filtre les données sur le mois demandé
  const monthlyRecords = mockAttendanceDb.filter((item) => item.monthKey === monthKey)

  // Si on demande un émargement ultra-précis (Saisie terrain)
  if (className && slotType && dateLabel) {
    const specificRecord = monthlyRecords.find(
      (item) =>
        item.className === className &&
        item.slotType === slotType &&
        item.dateLabel === dateLabel
    )
    return specificRecord || null
  }

  // Sinon, renvoie tout le mois (Dashboard Admin)
  return monthlyRecords
})