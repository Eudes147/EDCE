// server/api/schedules/[monthKey].put.ts
import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
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

    // 1. Récupérer le schedule associé
    const { data: schedule, error: schedErr } = await client
      .from('schedules')
      .select('id, status')
      .eq('month_key', monthKey)
      .maybeSingle()

    if (schedErr || !schedule) {
      throw createError({ statusCode: 404, statusMessage: `Planning pour le mois ${monthKey} introuvable pour la mise à jour.` })
    }

    const scheduleId = schedule.id
    const targetStatus = status || schedule.status

    if (status) {
      await client
        .from('schedules')
        .update({ status: targetStatus })
        .eq('id', scheduleId)
    }

    // 2. Mise à jour des lignes et de leurs relations
    for (const incomingRow of rows) {
      const dateLabel = incomingRow.dateLabel
      const assignments = incomingRow.assignments || { NORMAL: [], SUNDAY_SCHOOL: [], DLT: [] }

      let { data: dbRow } = await client
        .from('schedule_rows')
        .select('id')
        .eq('schedule_id', scheduleId)
        .eq('date_label', dateLabel)
        .maybeSingle()

      let rowId: string
      if (!dbRow) {
        const { data: newRow, error: insRowErr } = await client
          .from('schedule_rows')
          .insert({ schedule_id: scheduleId, date_label: dateLabel })
          .select()
          .single()
        if (insRowErr) throw createError({ statusCode: 400, statusMessage: insRowErr.message })
        rowId = newRow.id
      } else {
        rowId = dbRow.id
      }

      let { data: dbRowClass } = await client
        .from('schedule_row_classes')
        .select('id')
        .eq('schedule_row_id', rowId)
        .eq('class_name', classeName)
        .maybeSingle()

      let rowClassId: string
      if (!dbRowClass) {
        const { data: newRc, error: insRcErr } = await client
          .from('schedule_row_classes')
          .insert({ schedule_row_id: rowId, class_name: classeName })
          .select()
          .single()
        if (insRcErr) throw createError({ statusCode: 400, statusMessage: insRcErr.message })
        rowClassId = newRc.id
      } else {
        rowClassId = dbRowClass.id
        await client
          .from('schedule_slot_teachers')
          .delete()
          .eq('schedule_row_class_id', rowClassId)
      }

      const slotInserts: any[] = []
      for (const [slotType, teacherIds] of Object.entries(assignments)) {
        if (Array.isArray(teacherIds)) {
          for (const teacherId of teacherIds) {
            slotInserts.push({
              schedule_row_class_id: rowClassId,
              slot_type: slotType,
              teacher_id: teacherId
            })
          }
        }
      }

      if (slotInserts.length > 0) {
        await client.from('schedule_slot_teachers').insert(slotInserts)
      }
    }

    return {
      success: true,
      message: 'Mise à jour réussie.',
      monthKey,
      classe: classeName,
      rows: rows.map((r: any) => ({
        dateLabel: r.dateLabel,
        assignments: r.assignments || { NORMAL: [], SUNDAY_SCHOOL: [], DLT: [] }
      }))
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Erreur lors du PUT du planning.' })
  }
})