// server/api/children/index.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Child } from '~/types/child'

// Fonction utilitaire de mapping Snake_case -> CamelCase
const mapChildFromDb = (c: any): Child => ({
  id: c.id,
  classe: c.classe,
  nivScolaire: c.niv_scolaire,
  name: c.name,
  birth_date: c.birth_date ? new Date(c.birth_date) : undefined,
  tel: c.tel,
  telParent: c.tel_parent,
  sexeParent: c.sexe_parent,
  adresse: c.adresse,
  sexe: c.sexe,
  quarter: c.quarter,
  created_at: c.created_at,
  updated_at: c.updated_at
})

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const query = getQuery(event)
    
    // Si on cherche un enfant spécifique par son ID
    if (query.id) {
      const { data: child, error } = await client
        .from('children')
        .select('*')
        .eq('id', query.id)
        .single()

      if (error || !child) {
        throw createError({ statusCode: 404, statusMessage: 'Child not found' })
      }
      return mapChildFromDb(child)
    }

    // Récupération de tous les enfants depuis Supabase
    const { data: children, error: childrenError } = await client
      .from('children')
      .select('*')

    if (childrenError) {
      throw createError({ statusCode: 400, statusMessage: childrenError.message })
    }

    // Récupération des classes depuis Supabase
    const { data: classes } = await client
      .from('classes')
      .select('*')

    const classList = classes || []
    // On mappe les données de la BDD vers le format CamelCase du front
    const allChildren = (children || []).map(mapChildFromDb)

    const examClasses = ['CM2', '3e', 'Tle']
    
    const childrenPerClass = classList.reduce((acc: Record<string, Child[]>, classe: any) => {
      acc[classe.classe] = allChildren.filter(c => c.classe === classe.classe)
      return acc
    }, {})

    const childrenExamClass = examClasses.reduce((acc: Record<string, Child[]>, classe) => {
      acc[classe] = allChildren.filter(c => c.nivScolaire === classe)
      return acc
    }, {})

    const totalBoy = allChildren.filter(c => c.sexe === 'Masculin')
    const totalGirl = allChildren.filter(c => c.sexe === 'Feminin')

    return {
      listChildren: allChildren,
      totalLengthChildren: allChildren.length,
      childrenPerClass,
      childrenExamClass,
      totalBoy,
      totalGirl
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des enfants.",
    })
  }
})