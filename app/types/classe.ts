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
