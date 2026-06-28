import type { SupervisorSeance } from "~/types/seance";
import { supervSeancesState } from "./index.get";

export default defineEventHandler(async(event)=>{
  const body=await readBody(event)

  // Logique d'une liste de superviseurs

  if(!body.seanceId || !body.supervisorSeanceId){
    throw createError({statusCode: 400, message: 'Champs (seanceId et SupervisorSeanceId) requis.'})
  }

  const newSupervisor:SupervisorSeance={
    id: body.id || `superv-seance-${Math.random().toString(36).substring(2, 11)}`,
    seanceId: body.seanceId,
    supervisorSeanceId: body.supervisorSeanceId
  }
  supervSeancesState.supervisors.push(newSupervisor)

  return {
    success: true, data:newSupervisor 
  }
})