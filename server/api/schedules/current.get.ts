import { defineEventHandler } from 'h3'
import { mockMonthlySchedule } from '~/data/mockData'

export default defineEventHandler(async (event) => {
  try {
    // Simulation d'une lecture en Base de données réussie grâce au Mock
    console.log(`[API Schedule GET] Envoi du mock de l'emploi du temps pour la période : ${mockMonthlySchedule.monthKey}`)
    
    return mockMonthlySchedule
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération de l\'emploi du temps.',
    })
  }
})