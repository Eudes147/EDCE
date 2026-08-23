// server/api/global-attendance/[monthKey].post.ts
import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const monthKey = getRouterParam(event, 'monthKey')
    const body = await readBody(event)
    
    // Validation stricte des données requises
    if (!monthKey || !body || !body.dateLabel || !Array.isArray(body.assignments)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Données de réunion incomplètes ou invalides (dateLabel et assignments requis).",
      })
    }

    // ÉTAPE 1 : Insérer ou récupérer l'en-tête dans `global_attendances`
    // On cherche d'abord si une feuille existe déjà pour ce mois et cette date
    const { data: existingRecord, error: fetchError } = await client
      .from('global_attendances')
      .select('id')
      .eq('month_key', monthKey)
      .eq('date_label', body.dateLabel)
      .maybeSingle()

    if (fetchError) {
      throw createError({ statusCode: 400, statusMessage: fetchError.message })
    }

    let attendanceId: string

    if (existingRecord) {
      // Si l'en-tête existe, on met à jour ses métadonnées
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
      // Sinon, on crée un nouvel en-tête
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

    // ÉTAPE 2 : Gérer les lignes de détails dans `global_attendance_assignments`
    // Pour éviter les doublons ou nettoyer les anciennes lignes avant de réinsérer les nouvelles du formulaire :
    await client
      .from('global_attendance_assignments')
      .delete()
      .eq('global_attendance_id', attendanceId)

    // Préparation des nouvelles lignes à insérer en masse (bulk insert)
    const assignmentsToInsert = body.assignments.map((assignment: any) => ({
      global_attendance_id: attendanceId,
      teacher_id: assignment.teacherId || assignment.id, // Adapte selon la structure exacte de ton type
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