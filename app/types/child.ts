import type{Sexe} from '~/types/index'
import type {ClasseType} from '~/types/classe'

export interface Child {
  id:string
  classe: ClasseType
  nivScolaire?:string
  name: string
  birth_date?: Date
  tel ?:string
  telParent?:string
  sexeParent:Sexe
  adresse ?:string
  sexe: Sexe
  created_at ?: string
  updated_at ?: string
}

export interface childDetail {
  name: string
  age: string
  nivScolaire: string
  tel?: string
  telParent?: string
  sexe: Sexe
  sexeParent: Sexe
}

export interface childSubmit {
  name: string
  classe: ClasseType
  nivScolaire: string
  birth_date: string
  tel?: string
  telParent?: string
  sexe: Sexe
  sexeParent: Sexe
}

export interface childUpdate {
  nivScolaire: string
  classe: ClasseType
}

export interface childTestNote {
  childId: string
  testId: string
  note: number
}

export interface NoteEvaluations {
  notes: number[]
  year: string
}
export interface NoteSundayschool {
  notes: number[]
  year: string
}

export interface NoteConcours {
  note: number
  year: string
}
// 1. Déclarations des types et fonctions HORS du handler pour les performances

export interface YearGroupedNotes {
  [year: string]: {
    childId: string;
    notes: number[];
  }[];
}

export interface YearGroupedAverages {
  [year: string]: {
    childId: string;
    moyenne: number;
  }[];
}