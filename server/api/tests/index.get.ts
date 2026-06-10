import { mockTests } from '~/data/mockData'
import type { Test } from '~/types/test'

// State unique et persistant pour les tests sur le serveur Nitro
export const testsState = {
  tests: [...mockTests] as unknown as Test[] 
}

export default defineEventHandler(() => {
  // Le serveur renvoie simplement la liste brute complète.
  // Les filtrages par mois/classe/type se feront côté client pour maximiser les performances.
  return {
    listTests: testsState.tests
  }
})