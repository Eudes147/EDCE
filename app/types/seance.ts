import type { ClasseType } from "~/types/classe"

export type SeanceType="NORMAL" | "DLT" | "SUNDAY_SCHOOL"

export interface Seance {
  id: string
  title: string
  type: SeanceType
  classe: ClasseType
  authorId: string
  supervisorId: string
  created_at: string
}

export interface SupervisorSeance {
  id: string
  seanceId: string
  supervisorSeanceId: string
}

export interface SeanceStats {
  [year: string]:{
    "NORMAL": number,
    "DLT": number,
    "SUNDAY_SCHOOL": number,
  }
}