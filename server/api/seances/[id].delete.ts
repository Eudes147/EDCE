import { seancesState } from './index.get'
import { participantSeanceState } from '../participants/seances.get'
// Importation du state des superviseurs de séances pour le nettoyage en cascade
import { supervSeancesState } from '../supervSeances/index.get' 

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const index = seancesState.seances.findIndex(s => s.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Seance not found' })
  }

  // 1. Séance supprimée
  seancesState.seances.splice(index, 1)

  // 2. Participants séance supprimés en cascade
  participantSeanceState.participants = participantSeanceState.participants.filter(
    participant => participant.seanceId !== id
  )

  // 3. Superviseurs et moniteurs de la séance supprimés en cascade 🟢
  supervSeancesState.supervisors = supervSeancesState.supervisors.filter(
    superv => superv.seanceId !== id
  )

  return { success: true, message: 'Seance and all relations deleted successfully' }
})