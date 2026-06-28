import { supervSeancesState } from "./index.get";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const seanceId = query.seanceId
  const supervisorSeanceId = query.supervisorSeanceId

  // Validation des paramètres requis
  if (!seanceId || !supervisorSeanceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Champs (seanceId et supervisorSeanceId) requis pour la suppression.'
    })
  }

  // Trouver l'index de la liaison spécifique
  const index = supervSeancesState.supervisors.findIndex(
    s => s.seanceId === seanceId && s.supervisorSeanceId === supervisorSeanceId
  )

  if (index === -1) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: 'Liaison moniteur/séance introuvable.' 
    })
  }

  // Suppression de la ligne de jointure
  supervSeancesState.supervisors.splice(index, 1)

  return { success: true, message: 'Moniteur retiré de la séance avec succès' }
})