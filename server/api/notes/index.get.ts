import { mockNotes, mockTests } from '~/data/mockData'
import type { Note } from '~/types/test'

// State persistant des notes en mémoire vive
export const notesState = {
  notes: [...mockNotes] as Note[]
}

export default defineEventHandler(() => {
  // On renvoie la liste globale des notes à jour.
  // Note: Pour les tests, on va croiser avec le state des tests du serveur s'il existe
  return {
    listNotes: notesState.notes
  }
})