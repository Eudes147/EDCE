// server/api/attendance/[monthKey].post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { AttendancePayload } from '~/types/attendance'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody<AttendancePayload>(event)
    
    if (!body.monthKey || !body.dateLabel || !body.className || !body.slotType || !Array.isArray(body.assignments)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Données d'émargement incomplètes ou invalides.",
      })
    }

    const { data: existingRecord, error: fetchError } = await client
      .from('attendances')
      .select('id')
      .eq('month_key', body.monthKey)
      .eq('date_label', body.dateLabel)
      .eq('class_name', body.className)
      .eq('slot_type', body.slotType)
      .maybeSingle()

    if (fetchError) {
      throw createError({ statusCode: 400, statusMessage: fetchError.message })
    }

    let attendanceId: any

    if (existingRecord) {
      attendanceId = existingRecord.id
      const { error: updateError } = await client
        .from('attendances')
        .update({
          checked_at: new Date().toISOString(),
          checked_by: body.checkedBy || "Responsable de Séance"
        })
        .eq('id', attendanceId)

      if (updateError) {
        throw createError({ statusCode: 400, statusMessage: updateError.message })
      }
    } else {
      const { data: newRecord, error: insertError } = await client
        .from('attendances')
        .insert({
          month_key: body.monthKey,
          date_label: body.dateLabel,
          class_name: body.className,
          slot_type: body.slotType,
          checked_at: new Date().toISOString(),
          checked_by: body.checkedBy || "Responsable de Séance"
        })
        .select('id')
        .single()

      if (insertError || !newRecord) {
        throw createError({ statusCode: 400, statusMessage: insertError?.message || "Erreur lors de la création de la feuille d'émargement." })
      }
      attendanceId = newRecord.id
    }

    await client
      .from('attendance_assignments')
      .delete()
      .eq('attendance_id', attendanceId)

    // Mapping de teacherId vers teacher_id pour la base de données
    const assignmentsToInsert = body.assignments.map((assignment: any) => ({
      attendance_id: attendanceId,
      teacher_id: assignment.teacherId || assignment.teacher_id,
      is_present: assignment.isPresent ?? assignment.is_present ?? false
    }))

    if (assignmentsToInsert.length > 0) {
      const { error: insertAssignmentsError } = await client
        .from('attendance_assignments')
        .insert(assignmentsToInsert)

      if (insertAssignmentsError) {
        throw createError({ statusCode: 400, statusMessage: insertAssignmentsError.message })
      }
    }

    return { 
      success: true, 
      message: "Présences enregistrées avec succès." 
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur interne lors de la sauvegarde.",
    })
  }
})