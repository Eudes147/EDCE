import { ref, computed } from 'vue'
import type { Seance } from '~/types/seance'
import { classes } from '~/stores/child'
import { mockSeance } from '~/data/mockData'

export const useSeance = () => {
  const typeSeances = ["NORMAL", "SUNDAY_SCHOOL", "DLT"]
  const listSeances = ref<Seance[]>(mockSeance)

  // --- CRUD SEANCES ---
  const createSeance = (seance: Seance) => {
    if (seance.id && seance.type && seance.classe) {
      listSeances.value.push(seance)
    }
  }

  const deleteSeance = (seanceId: string) => {
    listSeances.value = listSeances.value.filter(seance => seance.id !== seanceId)
  }

  const updateSeance = (seanceId: string, updatedSeance: Seance) => {
    const index = listSeances.value.findIndex(seance => seance.id === seanceId)
    if (index !== -1) listSeances.value[index] = updatedSeance
  }

  const getSeanceById = (seanceId: string): Seance | undefined => {
    return listSeances.value.find(seance => seance.id === seanceId)
  }

  const getSeancenbyAuthor = (authorId: string) => {
    return listSeances.value.filter(seance => seance.authorId === authorId)
  }

  // --- COMPUTED PROPERTIES (CORRIGÉS) ---

  // 1. Regroupement par Type (NORMAL, SUNDAY_SCHOOL, DLT)
  const groupSeanceperType = computed<Record<string, Seance[]>>(() => {
    // CORRECTION : Ajout du return global
    return typeSeances.reduce((acc, typeSeance) => {
      const seancebyType = listSeances.value.filter(seance => seance.type === typeSeance)
      acc[typeSeance] = seancebyType || []
      return acc
    }, {} as Record<string, Seance[]>)
  })

  // 2. Regroupement par Classe
  const groupSeanceperClasse = computed<Record<string, Seance[]>>(() => {
    // CORRECTION : Ajout du return global
    return classes.reduce((acc, classe) => {
      const seancebyClasse = listSeances.value.filter(seance => seance.classe === classe)
      acc[classe] = seancebyClasse || []
      return acc
    }, {} as Record<string, Seance[]>)
  })

  // 3. Regroupement par Année
  const groupSeanceperYear = computed<Record<string, Seance[]>>(() => {
    // CORRECTION : Extraction propre des années via un Set (évite le bug du opérateur 'in')
    const years = listSeances.value.map(seance => 
      new Date(seance.created_at).getFullYear().toString()
    )
    const uniqueYears = [...new Set(years)]

    // CORRECTION : Ajout du return global
    return uniqueYears.reduce((acc, year) => {
      const seancebyYear = listSeances.value.filter(seance => 
        new Date(seance.created_at).getFullYear().toString() === year
      )
      
      // CORRECTION : Plus besoin du IF bloquant, on affecte directement le tableau
      acc[year] = seancebyYear || []
      
      return acc
    }, {} as Record<string, Seance[]>)
  })

  return {
    groupSeanceperClasse,
    groupSeanceperYear,
    groupSeanceperType,
    typeSeances,
    createSeance,
    deleteSeance,
    updateSeance,
    getSeanceById,
    getSeancenbyAuthor
  }
}