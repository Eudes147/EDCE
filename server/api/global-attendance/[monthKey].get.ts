// server/api/global-attendance/[monthKey].get.ts
import { defineEventHandler, getQuery, getRouterParam, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { MeetingAttendancePayload } from '~/types/globalAttendance'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const monthKey = getRouterParam(event, 'monthKey')
    const query = getQuery(event)
    
    const dateLabel = query.dateLabel as string | undefined

    if (!monthKey) {
      throw createError({ statusCode: 400, statusMessage: 'MonthKey is required' })
    }

    let queryBuilder = client
      .from('global_attendances')
      .select(`
        id,
        month_key,
        date_label,
        checked_at,
        checked_by,
        global_attendance_assignments (
          id,
          global_attendance_id,
          teacher_id,
          is_present
        )
      `)
      .eq('month_key', monthKey)

    if (dateLabel) {
      const { data, error } = await queryBuilder
        .ilike('date_label', dateLabel)
        .maybeSingle()

      if (error) {
        throw createError({ statusCode: 400, statusMessage: error.message })
      }

      if (!data) return null

      const formattedData: MeetingAttendancePayload = {
        monthKey: data.month_key,
        dateLabel: data.date_label,
        checkedAt: data.checked_at,
        checkedBy: data.checked_by,
        assignments: (data.global_attendance_assignments || []).map((a: any) => ({
          teacherId: a.teacher_id,
          isPresent: a.is_present
        }))
      }

      return formattedData
    }

    const { data, error } = await queryBuilder

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const formattedList = (data || []).map((item: any) => ({
      monthKey: item.month_key,
      dateLabel: item.date_label,
      checkedAt: item.checked_at,
      checkedBy: item.checked_by,
      assignments: (item.global_attendance_assignments || []).map((a: any) => ({
        teacherId: a.teacher_id,
        isPresent: a.is_present
      }))
    }))

    return formattedList as MeetingAttendancePayload[]

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des présences globales.",
    })
  }
})