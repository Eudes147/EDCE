// server/api/schedules/[monthKey].get.ts
import { defineEventHandler, createError, getRouterParam, getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const monthKey = getRouterParam(event, 'monthKey')
    const query = getQuery(event)
    const classe = query.classe as string

    if (!monthKey || !classe) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Le monthKey dans l\'URL et le paramètre "classe" en query string sont requis.' 
      })
    }

    const { data: schedule, error: schedError } = await client
      .from('schedules')
      .select('id, month_key, status')
      .eq('month_key', monthKey)
      .maybeSingle()

    if (schedError) {
      throw createError({ statusCode: 400, statusMessage: schedError.message })
    }

    if (!schedule) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: `L'emploi du temps pour le mois ${monthKey} n'existe pas.` 
      })
    }

    const { data: rows, error: rowsError } = await client
      .from('schedule_rows')
      .select('id, date_label')
      .eq('schedule_id', schedule.id)

    if (rowsError) {
      throw createError({ statusCode: 400, statusMessage: rowsError.message })
    }

    if (!rows || rows.length === 0) {
      return {
        success: true,
        monthKey: schedule.month_key,
        classe,
        status: schedule.status,
        rows: []
      }
    }

    const rowIds = rows.map((r: any) => r.id)

    const { data: rowClasses, error: rcError } = await client
      .from('schedule_row_classes')
      .select('id, schedule_row_id, class_name')
      .in('schedule_row_id', rowIds)
      .eq('class_name', classe)

    if (rcError) {
      throw createError({ statusCode: 400, statusMessage: rcError.message })
    }

    const rowClassMap = new Map()
    const rowClassIds: string[] = []

    if (rowClasses) {
      rowClasses.forEach((rc: any) => {
        rowClassMap.set(rc.schedule_row_id, rc.id)
        rowClassIds.push(rc.id)
      })
    }

    let slots: any[] = []
    if (rowClassIds.length > 0) {
      const { data: slotData, error: slotError } = await client
        .from('schedule_slot_teachers')
        .select('id, schedule_row_class_id, slot_type, teacher_id')
        .in('schedule_row_class_id', rowClassIds)

      if (slotError) {
        throw createError({ statusCode: 400, statusMessage: slotError.message })
      }
      slots = slotData || []
    }

    const formattedRows = rows.map((row: any) => {
      const rcId = rowClassMap.get(row.id)
      const assignments: Record<string, string[]> = { NORMAL: [], SUNDAY_SCHOOL: [], DLT: [] }

      if (rcId) {
        slots
          .filter((slot: any) => slot.schedule_row_class_id === rcId)
          .forEach((slot: any) => {
            if (assignments[slot.slot_type]) {
              assignments[slot.slot_type].push(slot.teacher_id)
            }
          })
      }

      return {
        dateLabel: row.date_label,
        assignments
      }
    })

    return {
      success: true,
      monthKey: schedule.month_key,
      classe,
      status: schedule.status,
      rows: formattedRows
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Erreur lors de la récupération du planning.' 
    })
  }
})