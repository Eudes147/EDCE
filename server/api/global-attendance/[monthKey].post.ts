// server/api/global-attendance/[monthKey].post.ts
import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const monthKey = getRouterParam(event, 'monthKey')
    const body = await readBody(event)
    
    if (!monthKey || !body || !body.dateLabel || !Array.isArray(body.assignments)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Données de réunion incomplètes ou invalides (dateLabel et assignments requis).",
      })
    }

    const { data: existingRecord, error: fetchError } = await client
      .from('global_attendances')
      .select('id')
      .eq('month_key', monthKey)
      .eq('date_label', body.dateLabel)
      .maybeSingle()

    if (fetchError) {
      throw createError({ statusCode: 400, statusMessage: fetchError.message })
    }

    let attendanceId: any

    if (existingRecord) {
      attendanceId = existingRecord.id
      const { error: updateError } = await client
        .from('global_attendances')
        .update({
          checked_at: new Date().toISOString(),
          checked_by: body.checkedBy || "Responsable Réunion"
        })
        .eq('id', attendanceId)

      if (updateError) {
        throw createError({ statusCode: 400, statusMessage: updateError.message })
      }
    } else {
      const { data: newRecord, error: insertError } = await client
        .from('global_attendances')
        .insert({
          month_key: monthKey,
          date_label: body.dateLabel,
          checked_at: new Date().toISOString(),
          checked_by: body.checkedBy || "Responsable Réunion"
        })
        .select('id')
        .single()

      if (insertError || !newRecord) {
        throw createError({ statusCode: 400, statusMessage: insertError?.message || "Erreur lors de la création de l'en-tête." })
      }
      attendanceId = newRecord.id
    }

    await client
      .from('global_attendance_assignments')
      .delete()
      .eq('global_attendance_id', attendanceId)

    const assignmentsToInsert = body.assignments.map((assignment: any) => ({
      global_attendance_id: attendanceId,
      teacher_id: assignment.teacherId || assignment.id,
      is_present: assignment.isPresent ?? assignment.is_present ?? false
    }))

    if (assignmentsToInsert.length > 0) {
      const { error: insertAssignmentsError } = await client
        .from('global_attendance_assignments')
        .insert(assignmentsToInsert)

      if (insertAssignmentsError) {
        throw createError({ statusCode: 400, statusMessage: insertAssignmentsError.message })
      }
    }

    return { 
      success: true, 
      message: "Présences à la réunion enregistrées avec succès dans les tables relationnelles."
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.statusMessage || error.message || "Erreur interne lors de la sauvegarde.",
    })
  }
})