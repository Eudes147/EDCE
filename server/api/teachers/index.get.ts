// server/api/teachers/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Teacher } from '~/types/teacher'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // 1. Récupération directe de tous les enseignants depuis la table dédiée 'teachers'
    const { data: listTeachers, error } = await client
      .from('teachers')
      .select('*')

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    const teachers = (listTeachers || []) as Teacher[]

    // 2. Calculer les propriétés filtrées directement sur le serveur
    const teachersAvailable = teachers.filter(t => t.isAvailable)
    const teachersUnavailable = teachers.filter(t => !t.isAvailable)
    const teacherMasculin = teachers.filter(t => t.sexe === 'Masculin')
    const teacherFeminin = teachers.filter(t => t.sexe === 'Feminin')

    return {
      listTeachers: teachers,
      teachersAvailable,
      teachersUnavailable,
      teacherMasculin,
      teacherFeminin
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des enseignants.",
    })
  }
})