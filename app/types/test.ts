import type { ClasseType } from '~/types/classe'

export type TypeTest = 'EVALUATION' | 'SUNDAY_SCHOOL' | 'CONCOURS'

// Interface principale répercutée
export interface Test {
  id: string
  titleTest: string
  classe: ClasseType
  typeTest: TypeTest
  sujetTest?: string       // URL Google Drive
  correctionTest?: string  // URL Google Drive
  authorId: string
  created_at: string
}

// Payload d'envoi du formulaire
export interface TestSubmit {
  titleTest: string
  classe: ClasseType
  typeTest: TypeTest
  sujetTest?: string       // URL Google Drive
  correctionTest?: string  // URL Google Drive
  authorId: string
}

export interface TestDetail {
  titleTest: string
  classe: ClasseType
  typeTest: TypeTest
  sujetTest?: string
  correctionTest?: string
  created_by: string
}

export interface TestStats {
  totalParticipants: number
  successRate: number
  failedRate: number
}

export interface Note {
  id: string
  childId: string
  testId: string
  note: number;
  created_at: string
}