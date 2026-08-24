// utils/dateHelpers.ts

/**
 * Calcule la date maximale autorisée pour un input de type date en fonction d'un âge minimum.
 * @param minAge L'âge minimum requis (ex: 3 ans)
 * @returns Une chaîne au format 'YYYY-MM-DD' compatible avec l'attribut max d'un input date
 */
export const getMaxBirthDate = (minAge: number = 3): string => {
  const today = new Date() // Nous sommes le 24 août 2026
  const maxYear = today.getFullYear() - minAge
  
  // Option A : Exactement la date d'il y a X ans (ex: 24-08-2023)
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  
  return `${maxYear}-${month}-${day}`

  // Option B (si tu préfères fixer au 1er janvier de l'année limite) :
  // return `${maxYear}-01-01`
}