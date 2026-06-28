import { mockSupervisorSeance } from "~/data/mockData";
import type { SupervisorSeance } from "~/types/seance";
import { seancesState } from "../seances/index.get";
import { teachersState } from "../teachers/index.get";
import type { Teacher } from "~/types/teacher";

export const supervSeancesState={
  supervisors: [...mockSupervisorSeance] as SupervisorSeance[]
}

export default defineEventHandler((event)=>{
  const query=getQuery(event)

  // Pour le chemin API /api/supervSeances?seanceId=XYZ
  const seanceId=query.seanceId
  // Retourner la liste des superviseurs pour une seanceId donnée

  const supervSeancesFound= supervSeancesState.supervisors.filter(supervSeance=>supervSeance.seanceId == seanceId)
  const listTeachers:Teacher[]=teachersState.teachers
  // Retourner la liste des teachers correspondants.
  return {
    teachers: supervSeancesFound.map(supervSeanceFound=>{
      return listTeachers.find(teacher=>teacher.id == supervSeanceFound.supervisorSeanceId)
    })
  }
  
})