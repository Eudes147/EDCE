// server/api/schedules/[monthKey].post.ts
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
        statusMessage: 'Données invalides. monthKey (URL), classe et rows (body) sont requis.',
      })
    }

    const { rows, classe, status } = body
    const classeName = classe as string
    const targetStatus = status || 'draft'

    // 1. Gérer la table parente 'schedules' (Upsert basé sur month_key)
    let { data: schedule, error: schedErr } = await client
      .from('schedules')
      .select('id, status')
      .eq('month_key', monthKey)
      .maybeSingle()

    if (schedErr) throw createError({ statusCode: 400, statusMessage: schedErr.message })

    let scheduleId: string

    if (!schedule) {
      const { data: newSched, error: insSchedErr } = await client
        .from('schedules')
        .insert({ month_key: monthKey, status: targetStatus })
        .select()
        .single()
      
      if (insSchedErr) throw createError({ statusCode: 400, statusMessage: insSchedErr.message })
      scheduleId = newSched.id
    } else {
      scheduleId = schedule.id
      if (status) {
        await client
          .from('schedules')
          .update({ status: targetStatus })
          .eq('id', scheduleId)
      }
    }

    // 2. Traitement ligne par ligne pour insérer/mettre à jour la hiérarchie
    for (const incomingRow of rows) {
      const dateLabel = incomingRow.dateLabel
      const assignments = incomingRow.assignments || { NORMAL: [], SUNDAY_SCHOOL: [], DLT: [] }

      // A. Trouver ou créer le schedule_row
      let { data: dbRow, error: rowErr } = await client
        .from('schedule_rows')
        .select('id')
        .eq('schedule_id', scheduleId)
        .eq('date_label', dateLabel)
        .maybeSingle()

      if (rowErr) throw createError({ statusCode: 400, statusMessage: rowErr.message })

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

      // B. Trouver ou créer le schedule_row_classe pour cette classe spécifique
      let { data: dbRowClass, error: rcErr } = await client
        .from('schedule_row_classes')
        .select('id')
        .eq('schedule_row_id', rowId)
        .eq('class_name', classeName)
        .maybeSingle()

      if (rcErr) throw createError({ statusCode: 400, statusMessage: rcErr.message })

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
        // Nettoyer les anciens slots pour cette classe et cette ligne avant de réinsérer
        await client
          .from('schedule_slot_teachers')
          .delete()
          .eq('schedule_row_class_id', rowClassId)
      }

      // C. Insérer les nouveaux slots enseignants (schedule_slot_teachers)
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
        const { error: slotInsErr } = await client
          .from('schedule_slot_teachers')
          .insert(slotInserts)
        if (slotInsErr) throw createError({ statusCode: 400, statusMessage: slotInsErr.message })
      }
    }

    return {
      success: true,
      monthKey,
      classe: classeName,
      status: targetStatus,
      rows
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || 'Erreur lors de l\'enregistrement du planning.' })
  }
})