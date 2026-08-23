// server/api/attendance/[monthKey].get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { AttendancePayload } from '~/types/attendance'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const monthKey = event.context.params?.monthKey
    const query = getQuery(event)
    
    const className = query.className as string
    const slotType = query.slotType as string
    const dateLabel = query.dateLabel as string

    if (!monthKey) {
      throw createError({ statusCode: 400, statusMessage: 'MonthKey is required' })
    }

    // Requête de base avec jointure sur la table enfant des assignations (ex: attendance_assignments)
    let queryBuilder = client
      .from('attendances')
      .select(`
        id,
        month_key,
        date_label,
        class_name,
        slot_type,
        checked_at,
        checked_by,
        attendance_assignments (
          id,
          attendance_id,
          child_id,
          is_present
        )
      `)
      .eq('month_key', monthKey)

    // Si on demande un émargement ultra-précis (Saisie terrain)
    if (className && slotType && dateLabel) {
      const { data, error } = await queryBuilder
        .eq('class_name', className)
        .eq('slot_type', slotType)
        .ilike('date_label', dateLabel)
        .maybeSingle()

      if (error) {
        throw createError({ statusCode: 400, statusMessage: error.message })
      }

      if (!data) return null

      // Formatage pour correspondre au type AttendancePayload
      const formattedData: AttendancePayload = {
        monthKey: data.month_key,
        dateLabel: data.date_label,
        className: data.class_name,
        slotType: data.slot_type,
        checkedAt: data.checked_at,
        checkedBy: data.checked_by,
        assignments: data.attendance_assignments || []
      }

      return formattedData
    }

    // Sinon, renvoie tout le mois (Dashboard Admin)
    const { data, error } = await queryBuilder

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const formattedList = (data || []).map((item: any) => ({
      monthKey: item.month_key,
      dateLabel: item.date_label,
      className: item.class_name,
      slotType: item.slot_type,
      checkedAt: item.checked_at,
      checkedBy: item.checked_by,
      assignments: item.attendance_assignments || []
    }))

    return formattedList as AttendancePayload[]

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des présences.",
    })
  }
})