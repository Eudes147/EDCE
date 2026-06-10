import { mockSeance, mockClasses } from '~/data/mockData'
import type { Seance } from '~/types/seance'

// Persistence en mémoire vive sur le serveur Nitro
export const seancesState = {
  seances: [...mockSeance] as Seance[]
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const listSeances = seancesState.seances

  // Permet de filtrer par auteur si l'API est appelée avec /api/seances?authorId=XYZ
  if (query.authorId) {
    return listSeances.filter(seance => seance.authorId === query.authorId)
  }

  const typeSeances = ["NORMAL", "SUNDAY_SCHOOL", "DLT"]
  // On extrait les noms des classes depuis tes mockClasses pour le regroupement
  const classesList = mockClasses.map(c => c.classe)

  // 1. Regroupement par Type (NORMAL, SUNDAY_SCHOOL, DLT)
  const groupSeanceperType = typeSeances.reduce((acc, typeSeance) => {
    acc[typeSeance] = listSeances.filter(seance => seance.type === typeSeance)
    return acc
  }, {} as Record<string, Seance[]>)

  // 2. Regroupement par Classe
  const groupSeanceperClasse = classesList.reduce((acc, classe) => {
    acc[classe] = listSeances.filter(seance => seance.classe === classe)
    return acc
  }, {} as Record<string, Seance[]>)

  // 3. Regroupement par Année
  const years = listSeances.map(seance => new Date(seance.created_at).getFullYear().toString())
  const uniqueYears = [...new Set(years)]

  const groupSeanceperYear = uniqueYears.reduce((acc, year) => {
    acc[year] = listSeances.filter(seance => 
      new Date(seance.created_at).getFullYear().toString() === year
    )
    return acc
  }, {} as Record<string, Seance[]>)

  // Retour complet des données demandées par le front
  return {
    listSeances,
    groupSeanceperType,
    groupSeanceperClasse,
    groupSeanceperYear
  }
})