import type{User} from '~/types/auth'
import type{ClasseType} from '~/types/classe'

// Main Interface: DB
export interface Test {
  id: string
  titleTest: string
  classe: ClasseType
  typeTest: TypeTest
  sujetTest?: File
  correctionTest?: File
  authorId: string
  created_at: string
}

export type TypeTest= 'EVALUATION' | 'SUNDAY_SCHOOL' | 'CONCOURS'

// Création d'un test
export interface TestSubmit{
  titleTest: string
  classe: ClasseType
  typeTest: TypeTest
  sujetTest?: File
  correctionTest?: File
  authorId: string
}

// Pour l'affichage
export interface TestDetail {
  titleTest: string
  classe: ClasseType
  typeTest: TypeTest
  sujetTest?: File
  correctionTest?: File
  created_by: string
}
// Statistiques
export interface TestStats {
  totalParticipants: number
  successRate: number
  failedRate: number
}
export interface Note {
  id: string;
  childId: string;
  testId: string;
  note: number;
  created_at: string;
}