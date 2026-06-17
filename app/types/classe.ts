export interface Classe {
  id: string
  classe: ClasseType
}

export type ClasseType='Petit' | 'Débutant' | 'Moyen' | 'Débutant' | 'JuniorA' | 'JuniorB'

export interface classeStats {
  totalChildren: number
  totalBoy: number
  totalGirl: number
  totalExamClasse: number
  geniusBibParticipant: number
}

export interface classeDetail {
  classe: ClasseType
  children: []
}

export type niveauScolaire = "M1" | "M2" | "CI" | "CP" | "CE1" | "CE2" | "CM1" | "CM2" | "6e" | "5e"| "4e"| "3e"| "2nd"| "1e"| "Tle"| "Autres"