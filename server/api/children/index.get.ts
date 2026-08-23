// server/api/children/index.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Child } from '~/types/child'

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
      return child
    }

    // Récupération de tous les enfants depuis Supabase
    const { data: children, error: childrenError } = await client
      .from('children')
      .select('*')

    if (childrenError) {
      throw createError({ statusCode: 400, statusMessage: childrenError.message })
    }

    // Récupération des classes depuis Supabase (ou liste fixe si gérée en dur)
    const { data: classes, error: classesError } = await client
      .from('classes')
      .select('*')

    // Si la table classes n'existe pas encore, on peut basculer sur un tableau vide ou une liste de secours
    const classList = classes || []
    const allChildren = (children || []) as Child[]

    const examClasses = ['CM2', '3e', 'Tle']
    
    const childrenPerClass = classList.reduce((acc: Record<string, Child[]>, classe: any) => {
      acc[classe.classe] = allChildren.filter(c => c.classe === classe.classe)
      return acc
    }, {})

    const childrenExamClass = examClasses.reduce((acc: Record<string, Child[]>, classe) => {
      acc[classe] = allChildren.filter(c => c.nivScolaire == classe)
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