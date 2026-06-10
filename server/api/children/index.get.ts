import { mockChildren, mockClasses } from '~/data/mockData'
import type { Child } from '~/types/child'
import type { Activity } from '~/types/activity'

// State en mémoire vive côté serveur
export const childrenState = {
  children: [...mockChildren] as Child[],
  classes: [...mockClasses]
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  
  // Permet de chercher un enfant spécifique par son ID via /api/children?id=child-001
  if (query.id) {
    const child = childrenState.children.find(c => c.id === query.id)
    if (!child) throw createError({ statusCode: 404, statusMessage: 'Child not found' })
    return child
  }

  // Logique des anciennes propriétés calculées déplacée côté serveur pour plus de légèreté
  const examClasses = ["CM2", "3e", "Tle"]
  
  const childrenPerClass = childrenState.classes.reduce((acc, classe) => {
    acc[classe.classe] = childrenState.children.filter(c => c.classe === classe.classe)
    return acc
  }, {} as Record<string, Child[]>)

  const childrenExamClass = examClasses.reduce((acc, classe) => {
    acc[classe] = childrenState.children.filter(c => c.nivScolaire === classe)
    return acc
  }, {} as Record<string, Child[]>)

  const totalBoy = childrenState.children.filter(c => c.sexe === 'Masculin')
  const totalGirl = childrenState.children.filter(c => c.sexe === 'Feminin')

  // On renvoie la liste brute ainsi que toutes les agrégations prêtes
  return {
    listChildren: childrenState.children,
    totalLengthChildren: childrenState.children.length,
    childrenPerClass,
    childrenExamClass,
    totalBoy,
    totalGirl
  }
})