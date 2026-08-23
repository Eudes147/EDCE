// server/api/seances/index.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Seance } from '~/types/seance'

// Fonction utilitaire de mapping BDD -> Front
const mapSeanceFromDb = (s: any): Seance => ({
  id: s.id,
  title: s.title,
  type: s.type,
  classe: s.classe,
  authorId: s.author_id,
  supervisorId: s.supervisor_id,
  created_at: s.created_at
})

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const query = getQuery(event)

    let queryBuilder = client.from('seances').select('*')

    if (query.authorId) {
      queryBuilder = queryBuilder.eq('author_id', query.authorId)
    }

    const { data: listSeances, error } = await queryBuilder

    if (error) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    // Normalisation des clés pour correspondre au type Seance front-end
    const seances: Seance[] = (listSeances || []).map(mapSeanceFromDb)

    const typeSeances = ["NORMAL", "SUNDAY_SCHOOL", "DLT"]

    const { data: classesData } = await client.from('classes').select('*')
    const classesList = classesData ? classesData.map((c: any) => c.classe) : ['CM2', '3e', 'Tle']

    const groupSeanceperType = typeSeances.reduce((acc: Record<string, Seance[]>, typeSeance) => {
      acc[typeSeance] = seances.filter(seance => seance.type === typeSeance)
      return acc
    }, {})

    const groupSeanceperClasse = classesList.reduce((acc: Record<string, Seance[]>, classe) => {
      acc[classe] = seances.filter(seance => seance.classe === classe)
      return acc
    }, {})

    const years = seances.map(seance => new Date(seance.created_at).getFullYear().toString())
    const uniqueYears = [...new Set(years)]

    const groupSeanceperYear = uniqueYears.reduce((acc: Record<string, Seance[]>, year) => {
      acc[year] = seances.filter(seance => 
        new Date(seance.created_at).getFullYear().toString() === year
      )
      return acc
    }, {})

    return {
      listSeances: seances,
      groupSeanceperType,
      groupSeanceperClasse,
      groupSeanceperYear
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des séances.",
    })
  }
})