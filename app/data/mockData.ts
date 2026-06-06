import type { Child } from '~/types/child'
import type { Classe } from '~/types/classe'
import type { Moderator } from '~/types/moderator'
import type { Teacher } from '~/types/teacher'
import type { Test } from '~/types/test'

import type { Activity,EventActivity }
from '~/types/activity'

import type {Seance, SeanceType} from '~/types/seance'


export interface Note {
  id: string;
  childId: string;
  testId: string;
  note: number;
  created_at: string;
}

export const mockChildren: Child[] = [
  {
    id: 'child-001',
    classe: 'Petit',
    name: 'Anaïs Koné',
    birth_date: new Date('2019-03-12'),
    tel: '+225 07 12 34 56',
    telParent: '+225 05 98 76 54',
    sexe: 'Feminin',
    sexeParent: 'Masculin',
    adresse: 'Cocody, Abidjan',
    created_at: '2025-11-07T08:22:00Z'
  },
  {
    id: 'child-002',
    classe: 'Débutant',
    name: 'Kouadio Yao',
    birth_date: new Date('2018-09-05'),
    tel: '+225 07 45 67 89',
    telParent: '+225 05 23 45 67',
    sexe: 'Masculin',
    sexeParent: 'Feminin',
    adresse: 'Yopougon, Abidjan',
    created_at: '2025-09-25T12:15:00Z'
  },
  {
    id: 'child-003',
    classe: 'Moyen',
    name: 'Isabelle Doue',
    birth_date: new Date('2017-06-18'),
    telParent: '+225 05 88 77 66',
    sexe: 'Feminin',
    sexeParent: 'Feminin',
    adresse: 'Marcory, Abidjan',
    created_at: '2025-10-10T14:40:00Z'
  },
  {
    id: 'child-004',
    classe: 'JuniorA',
    name: 'Yannick Mensah',
    birth_date: new Date('2016-01-22'),
    tel: '+225 07 11 22 33',
    telParent: '+225 05 66 55 44',
    sexe: 'Masculin',
    sexeParent: 'Masculin',
    adresse: 'Treichville, Abidjan',
    created_at: '2025-08-17T09:10:00Z'
  },
  {
    id: 'child-005',
    classe: 'JuniorB',
    name: 'Amélie Kouamé',
    birth_date: new Date('2015-12-01'),
    tel: '+225 07 99 88 77',
    telParent: '+225 05 44 33 22',
    sexe: 'Feminin',
    sexeParent: 'Masculin',
    adresse: 'Plateau, Abidjan',
    created_at: '2025-07-01T10:00:00Z'
  },
  {
    id: 'child-006',
    classe: 'Petit',
    name: 'Mathis Bamba',
    birth_date: new Date('2019-11-20'),
    telParent: '+225 05 63 12 78',
    sexe: 'Masculin',
    sexeParent: 'Masculin',
    adresse: 'Adjamé, Abidjan',
    created_at: '2025-12-01T07:15:00Z'
  },
  {
    id: 'child-007',
    classe: 'Débutant',
    name: 'Noémie Soro',
    birth_date: new Date('2018-05-09'),
    tel: '+225 07 32 11 90',
    telParent: '+225 05 87 41 22',
    sexe: 'Feminin',
    sexeParent: 'Feminin',
    adresse: 'Koumassi, Abidjan',
    created_at: '2025-08-29T16:00:00Z'
  },
  {
    id: 'child-008',
    classe: 'Moyen',
    name: 'Souleymane Diallo',
    birth_date: new Date('2017-02-14'),
    telParent: '+225 05 31 09 27',
    sexe: 'Masculin',
    sexeParent: 'Masculin',
    adresse: 'Yamoussoukro',
    created_at: '2025-10-02T08:50:00Z'
  },
  {
    id: 'child-009',
    classe: 'JuniorA',
    name: 'Céleste Djédjé',
    birth_date: new Date('2016-07-27'),
    tel: '+225 07 58 44 12',
    telParent: '+225 05 77 66 55',
    sexe: 'Feminin',
    sexeParent: 'Feminin',
    adresse: 'Grand-Bassam',
    created_at: '2025-08-05T10:30:00Z'
  },
  {
    id: 'child-010',
    classe: 'JuniorB',
    name: 'Kevin Kouadio',
    birth_date: new Date('2015-03-01'),
    tel: '+225 07 39 28 17',
    telParent: '+225 05 29 84 61',
    sexe: 'Masculin',
    sexeParent: 'Masculin',
    adresse: 'Bouaké',
    created_at: '2025-07-18T09:05:00Z'
  },
  {
    id: 'child-011',
    classe: 'Petit',
    name: 'Nina Dugué',
    birth_date: new Date('2019-12-08'),
    tel: '+225 07 84 33 21',
    telParent: '+225 05 81 22 13',
    sexe: 'Feminin',
    sexeParent: 'Feminin',
    adresse: 'Tiassalé',
    created_at: '2025-09-12T14:52:00Z'
  },
  {
    id: 'child-012',
    classe: 'Débutant',
    name: 'Mamadou Koné',
    birth_date: new Date('2018-10-11'),
    tel: '+225 07 17 39 45',
    telParent: '+225 05 17 39 45',
    sexe: 'Masculin',
    sexeParent: 'Masculin',
    adresse: 'Daloa',
    created_at: '2025-10-07T18:20:00Z'
  },
  {
    id: 'child-013',
    classe: 'Moyen',
    name: 'Aïssatou Kone',
    birth_date: new Date('2017-08-22'),
    telParent: '+225 05 71 23 89',
    sexe: 'Feminin',
    sexeParent: 'Feminin',
    adresse: 'Man',
    created_at: '2025-11-03T11:25:00Z'
  },
  {
    id: 'child-014',
    classe: 'JuniorA',
    name: "Franck N'Guessan",
    birth_date: new Date('2016-04-30'),
    tel: '+225 07 96 20 54',
    telParent: '+225 05 96 20 54',
    sexe: 'Masculin',
    sexeParent: 'Masculin',
    adresse: 'Sassandra',
    created_at: '2025-08-11T12:00:00Z'
  },
  {
    id: 'child-015',
    classe: 'JuniorB',
    name: 'Léna Adjoua',
    nivScolaire: '6e',
    birth_date: new Date('2015-11-19'),
    sexe: 'Feminin',
    sexeParent: 'Masculin',
    adresse: 'San Pedro',
    created_at: '2025-07-21T15:40:00Z'
  }
]

export const mockClasses: Classe[] = [
  { id: 'class-001', classe: 'Petit' },
  { id: 'class-002', classe: 'Débutant' },
  { id: 'class-003', classe: 'Moyen' },
  { id: 'class-004', classe: 'JuniorA' },
  { id: 'class-005', classe: 'JuniorB' },
]

export const mockTeachers: Teacher[] = [
  {
    id: 'teacher-001',
    first_name: 'Élisabeth',
    last_name: "N'dri",
    sexe: 'Feminin',
    tel: '+225 07 22 33 44',
    isAvailable: true
  },
  {
    id: 'teacher-002',
    first_name: 'Abdoulaye',
    last_name: 'Traoré',
    sexe: 'Masculin',
    tel: '+225 07 55 66 77',
    quarter: 'Q2',
    isAvailable: false
  },
  {
    id: 'teacher-003',
    first_name: 'Marie',
    last_name: 'Kouassi',
    sexe: 'Feminin',
    isAvailable: true
  },
  {
    id: 'teacher-004',
    first_name: 'Olivier',
    last_name: 'Gnan',
    sexe: 'Masculin',
    tel: '+225 07 42 18 66',
    quarter: 'Q1',
    isAvailable: true
  },
  {
    id: 'teacher-005',
    first_name: 'Nadia',
    last_name: 'Téa',
    sexe: 'Feminin',
    tel: '+225 07 34 67 88',
    isAvailable: false
  },
  {
    id: 'teacher-006',
    first_name: 'Sébastien',
    last_name: 'Kouakou',
    sexe: 'Masculin',
    tel: '+225 07 29 15 47',
    quarter: 'Q3',
    isAvailable: true
  },
  {
    id: 'teacher-007',
    first_name: 'Claire',
    last_name: 'Odjo',
    sexe: 'Feminin',
    isAvailable: true
  },
  {
    id: 'teacher-008',
    first_name: 'Franck',
    last_name: 'Konan',
    sexe: 'Masculin',
    tel: '+225 07 28 39 40',
    isAvailable: false
  },
  {
    id: 'teacher-009',
    first_name: 'Aïssatou',
    last_name: 'Bakayoko',
    sexe: 'Feminin',
    tel: '+225 07 62 18 90',
    quarter: 'Q4',
    isAvailable: true
  },
  {
    id: 'teacher-010',
    first_name: 'Marius',
    last_name: 'Koffi',
    sexe: 'Masculin',
    isAvailable: true
  },
  {
    id: 'teacher-011',
    first_name: 'Rita',
    last_name: 'Assié',
    sexe: 'Feminin',
    tel: '+225 07 71 33 22',
    quarter: 'Q2',
    isAvailable: false
  },
  {
    id: 'teacher-012',
    first_name: 'Derek',
    last_name: 'Zeu',
    sexe: 'Masculin',
    tel: '+225 07 55 11 88',
    isAvailable: true
  },
  {
    id: 'teacher-013',
    first_name: 'Sophie',
    last_name: 'Kouadio',
    sexe: 'Feminin',
    tel: '+225 07 18 44 77',
    quarter: 'Q1',
    isAvailable: true
  },
  {
    id: 'teacher-014',
    first_name: 'Gaël',
    last_name: 'Tano',
    sexe: 'Masculin',
    tel: '+225 07 41 55 33',
    isAvailable: false
  },
  {
    id: 'teacher-015',
    first_name: 'Hélène',
    last_name: 'Anoma',
    sexe: 'Feminin',
    tel: '+225 07 90 12 34',
    quarter: 'Q3',
    isAvailable: true
  }
]

export const mockModerators: Moderator[] = [
  {
    id: 'moderator-001',
    first_name: 'Victor',
    last_name: 'N’Guessan',
    sexe: 'Masculin',
    tel: '+225 07 88 99 00',
    isAvailable: true
  },
  {
    id: 'moderator-002',
    first_name: 'Carine',
    last_name: 'Ahoua',
    sexe: 'Feminin',
    tel: '+225 07 66 55 44',
    isAvailable: false
  },
  {
    id: 'moderator-003',
    first_name: 'Yves',
    last_name: 'Zoro',
    sexe: 'Masculin',
    quarter: 'Q4',
    isAvailable: true
  },
  {
    id: 'moderator-004',
    first_name: 'Awa',
    last_name: 'Tra',
    sexe: 'Feminin',
    tel: '+225 07 35 68 92',
    isAvailable: true
  },
  {
    id: 'moderator-005',
    first_name: 'Loïc',
    last_name: 'Amani',
    sexe: 'Masculin',
    tel: '+225 07 58 22 90',
    quarter: 'Q1',
    isAvailable: false
  },
  {
    id: 'moderator-006',
    first_name: 'Natacha',
    last_name: 'Edoh',
    sexe: 'Feminin',
    isAvailable: true
  },
  {
    id: 'moderator-007',
    first_name: 'Mickaël',
    last_name: 'Koffi',
    sexe: 'Masculin',
    tel: '+225 07 12 98 76',
    isAvailable: true
  },
  {
    id: 'moderator-008',
    first_name: 'Sandrine',
    last_name: 'Affi',
    sexe: 'Feminin',
    tel: '+225 07 44 18 22',
    isAvailable: false
  },
  {
    id: 'moderator-009',
    first_name: 'Koffi',
    last_name: 'Abo',
    sexe: 'Masculin',
    quarter: 'Q2',
    isAvailable: true
  },
  {
    id: 'moderator-010',
    first_name: 'Sanaa',
    last_name: 'Béatrice',
    sexe: 'Feminin',
    tel: '+225 07 79 32 14',
    isAvailable: true
  },
  {
    id: 'moderator-011',
    first_name: 'Bruno',
    last_name: 'Kon',
    sexe: 'Masculin',
    tel: '+225 07 24 16 83',
    isAvailable: false
  },
  {
    id: 'moderator-012',
    first_name: 'Adja',
    last_name: 'Kouamé',
    sexe: 'Feminin',
    quarter: 'Q3',
    isAvailable: true
  },
  {
    id: 'moderator-013',
    first_name: 'Hugues',
    last_name: 'Zan',
    sexe: 'Masculin',
    tel: '+225 07 81 54 29',
    isAvailable: true
  },
  {
    id: 'moderator-014',
    first_name: 'Marie',
    last_name: 'Ébrié',
    sexe: 'Feminin',
    tel: '+225 07 65 43 21',
    isAvailable: false
  },
  {
    id: 'moderator-015',
    first_name: 'Mansour',
    last_name: 'Amani',
    sexe: 'Masculin',
    quarter: 'Q4',
    isAvailable: true
  }
]

export const mockTests: Test[] = [
  {
    id: 'test-001',
    titleTest: 'Évaluation Bible Genius',
    classe: 'JuniorA',
    typeTest: 'EVALUATION',
    authorId: 'teacher-001',
    created_at: '2026-04-10T10:30:00Z'
  },
  {
    id: 'test-002',
    titleTest: 'Quiz Paraboles',
    classe: 'Débutant',
    typeTest: 'SUNDAY_SCHOOL',
    authorId: 'teacher-002',
    created_at: '2026-05-05T11:00:00Z'
  },
  {
    id: 'test-003',
    titleTest: 'Concours Théologie Junior',
    classe: 'JuniorB',
    typeTest: 'CONCOURS',
    authorId: 'moderator-001',
    created_at: '2026-05-20T15:45:00Z'
  },
  {
    id: 'test-004',
    titleTest: 'Épreuve Lecture CP',
    classe: 'Petit',
    typeTest: 'EVALUATION',
    authorId: 'teacher-003',
    created_at: '2026-01-15T09:15:00Z'
  },
  {
    id: 'test-005',
    titleTest: 'Quiz Santé et Hygiène',
    classe: 'Moyen',
    typeTest: 'SUNDAY_SCHOOL',
    authorId: 'teacher-004',
    created_at: '2026-02-12T14:20:00Z'
  },
  {
    id: 'test-006',
    titleTest: 'Concours Bible Chronologique',
    classe: 'JuniorA',
    typeTest: 'CONCOURS',
    authorId: 'moderator-002',
    created_at: '2026-03-03T16:50:00Z'
  },
  {
    id: 'test-007',
    titleTest: 'Évaluation Lecture CE1',
    classe: 'Débutant',
    typeTest: 'EVALUATION',
    authorId: 'teacher-005',
    created_at: '2026-03-22T10:00:00Z'
  },
  {
    id: 'test-008',
    titleTest: 'Quiz Paraboles Avancées',
    classe: 'JuniorB',
    typeTest: 'SUNDAY_SCHOOL',
    authorId: 'teacher-006',
    created_at: '2026-04-08T13:30:00Z'
  },
  {
    id: 'test-009',
    titleTest: 'Concours Versets Rapides',
    classe: 'Moyen',
    typeTest: 'CONCOURS',
    authorId: 'moderator-003',
    created_at: '2026-04-25T11:10:00Z'
  },
  {
    id: 'test-010',
    titleTest: 'Évaluation Mathématiques CP',
    classe: 'JuniorA',
    typeTest: 'EVALUATION',
    authorId: 'teacher-007',
    created_at: '2026-05-02T08:40:00Z'
  },
  {
    id: 'test-011',
    titleTest: 'Quiz Valeurs Chrétiennes',
    classe: 'Débutant',
    typeTest: 'SUNDAY_SCHOOL',
    authorId: 'teacher-008',
    created_at: '2026-05-10T15:05:00Z'
  },
  {
    id: 'test-012',
    titleTest: 'Concours Mémoire Versets',
    classe: 'JuniorB',
    typeTest: 'CONCOURS',
    authorId: 'moderator-004',
    created_at: '2026-05-18T09:55:00Z'
  },
  {
    id: 'test-013',
    titleTest: 'Évaluation Sciences CM1',
    classe: 'Moyen',
    typeTest: 'EVALUATION',
    authorId: 'teacher-009',
    created_at: '2026-05-23T14:10:00Z'
  },
  {
    id: 'test-014',
    titleTest: 'Quiz Histoire Biblique',
    classe: 'JuniorA',
    typeTest: 'SUNDAY_SCHOOL',
    authorId: 'teacher-010',
    created_at: '2026-05-29T11:35:00Z'
  },
  {
    id: 'test-015',
    titleTest: 'Concours Paroles Inspirées',
    classe: 'JuniorB',
    typeTest: 'CONCOURS',
    authorId: 'moderator-005',
    created_at: '2026-06-01T17:00:00Z'
  }
]

export const mockNotes: Note[] = [
  // =========================================================================
  // CLASSE : JuniorA (Enfants: child-004, child-009, child-014)
  // Tests associés : test-001, test-006, test-010, test-014
  // =========================================================================
  { id: 'note-001', childId: 'child-004', testId: 'test-001', note: 14, created_at: '2026-04-10T14:00:00Z' },
  { id: 'note-002', childId: 'child-009', testId: 'test-001', note: 17, created_at: '2026-04-10T14:05:00Z' },
  { id: 'note-003', childId: 'child-014', testId: 'test-001', note: 11, created_at: '2026-04-10T14:10:00Z' },

  { id: 'note-004', childId: 'child-004', testId: 'test-006', note: 15, created_at: '2026-03-03T18:00:00Z' },
  { id: 'note-005', childId: 'child-009', testId: 'test-006', note: 19, created_at: '2026-03-03T18:15:00Z' },
  { id: 'note-006', childId: 'child-014', testId: 'test-006', note: 13, created_at: '2026-03-03T18:20:00Z' },

  { id: 'note-007', childId: 'child-004', testId: 'test-010', note: 12, created_at: '2026-05-02T11:00:00Z' },
  { id: 'note-008', childId: 'child-009', testId: 'test-010', note: 16, created_at: '2026-05-02T11:05:00Z' },
  { id: 'note-009', childId: 'child-014', testId: 'test-010', note: 14, created_at: '2026-05-02T11:15:00Z' },

  { id: 'note-010', childId: 'child-004', testId: 'test-014', note: 16, created_at: '2026-05-29T14:00:00Z' },
  { id: 'note-011', childId: 'child-009', testId: 'test-014', note: 18, created_at: '2026-05-29T14:12:00Z' },
  { id: 'note-012', childId: 'child-014', testId: 'test-014', note: 10, created_at: '2026-05-29T14:30:00Z' },

  // =========================================================================
  // CLASSE : Débutant (Enfants: child-002, child-007, child-012)
  // Tests associés : test-002, test-007, test-011
  // =========================================================================
  { id: 'note-013', childId: 'child-002', testId: 'test-002', note: 13, created_at: '2026-05-05T14:00:00Z' },
  { id: 'note-014', childId: 'child-007', testId: 'test-002', note: 15, created_at: '2026-05-05T14:15:00Z' },
  { id: 'note-015', childId: 'child-012', testId: 'test-002', note: 10, created_at: '2026-05-05T14:30:00Z' },

  { id: 'note-016', childId: 'child-002', testId: 'test-007', note: 16, created_at: '2026-03-22T13:00:00Z' },
  { id: 'note-017', childId: 'child-007', testId: 'test-007', note: 18, created_at: '2026-03-22T13:10:00Z' },
  { id: 'note-018', childId: 'child-012', testId: 'test-007', note: 12, created_at: '2026-03-22T13:45:00Z' },

  { id: 'note-019', childId: 'child-002', testId: 'test-011', note: 14, created_at: '2026-05-10T17:00:00Z' },
  { id: 'note-020', childId: 'child-007', testId: 'test-011', note: 14, created_at: '2026-05-10T17:10:00Z' },
  { id: 'note-021', childId: 'child-012', testId: 'test-011', note: 15, created_at: '2026-05-10T17:25:00Z' },

  // =========================================================================
  // CLASSE : JuniorB (Enfants: child-005, child-010, child-015)
  // Tests associés : test-003, test-008, test-012, test-015
  // =========================================================================
  { id: 'note-022', childId: 'child-005', testId: 'test-003', note: 20, created_at: '2026-05-20T17:00:00Z' },
  { id: 'note-023', childId: 'child-010', testId: 'test-003', note: 14, created_at: '2026-05-20T17:15:00Z' },
  { id: 'note-024', childId: 'child-015', testId: 'test-003', note: 15, created_at: '2026-05-20T17:30:00Z' },

  { id: 'note-025', childId: 'child-005', testId: 'test-008', note: 17, created_at: '2026-04-08T15:30:00Z' },
  { id: 'note-026', childId: 'child-010', testId: 'test-008', note: 12, created_at: '2026-04-08T15:45:00Z' },
  { id: 'note-027', childId: 'child-015', testId: 'test-008', note: 13, created_at: '2026-04-08T16:00:00Z' },

  { id: 'note-028', childId: 'child-005', testId: 'test-012', note: 19, created_at: '2026-05-18T11:10:00Z' },
  { id: 'note-029', childId: 'child-010', testId: 'test-012', note: 15, created_at: '2026-05-18T11:30:00Z' },
  { id: 'note-030', childId: 'child-015', testId: 'test-012', note: 14, created_at: '2026-05-18T11:45:00Z' },

  { id: 'note-031', childId: 'child-005', testId: 'test-015', note: 18, created_at: '2026-06-01T18:30:00Z' },
  { id: 'note-032', childId: 'child-010', testId: 'test-015', note: 11, created_at: '2026-06-01T18:40:00Z' },
  { id: 'note-033', childId: 'child-015', testId: 'test-015', note: 16, created_at: '2026-06-01T18:45:00Z' },

  // =========================================================================
  // CLASSE : Petit (Enfants: child-001, child-006, child-011)
  // Tests associés : test-004 (Unique test pour cette classe, doublé ici pour la cohérence des effectifs)
  // =========================================================================
  { id: 'note-034', childId: 'child-001', testId: 'test-004', note: 14, created_at: '2026-01-15T11:00:00Z' },
  { id: 'note-035', childId: 'child-006', testId: 'test-004', note: 12, created_at: '2026-01-15T11:15:00Z' },
  { id: 'note-036', childId: 'child-011', testId: 'test-004', note: 17, created_at: '2026-01-15T11:20:00Z' },

  // =========================================================================
  // CLASSE : Moyen (Enfants: child-003, child-008, child-013)
  // Tests associés : test-005, test-009, test-013
  // =========================================================================
  { id: 'note-037', childId: 'child-003', testId: 'test-005', note: 15, created_at: '2026-02-12T16:00:00Z' },
  { id: 'note-038', childId: 'child-008', testId: 'test-005', note: 13, created_at: '2026-02-12T16:05:00Z' },
  { id: 'note-039', childId: 'child-013', testId: 'test-005', note: 16, created_at: '2026-02-12T16:20:00Z' },

  { id: 'note-040', childId: 'child-003', testId: 'test-009', note: 12, created_at: '2026-04-25T13:00:00Z' },
  { id: 'note-041', childId: 'child-008', testId: 'test-009', note: 17, created_at: '2026-04-25T13:15:00Z' },
  { id: 'note-042', childId: 'child-013', testId: 'test-009', note: 14, created_at: '2026-04-25T13:40:00Z' },

  { id: 'note-043', childId: 'child-003', testId: 'test-013', note: 11, created_at: '2026-05-23T16:00:00Z' },
  { id: 'note-044', childId: 'child-008', testId: 'test-013', note: 14, created_at: '2026-05-23T16:15:00Z' },
  { id: 'note-045', childId: 'child-013', testId: 'test-013', note: 19, created_at: '2026-05-23T16:30:00Z' },

  // =========================================================================
  // EXTENSIONS POUR ATTEINDRE EXACTEMENT 50 LIGNES
  // Répétitions logiques (Ex: Rattrapages ou seconds devoirs basés sur la classe Petit/Débutant)
  // =========================================================================
  { id: 'note-046', childId: 'child-001', testId: 'test-004', note: 16, created_at: '2026-01-20T09:00:00Z' }, 
  { id: 'note-047', childId: 'child-006', testId: 'test-004', note: 15, created_at: '2026-01-20T09:30:00Z' },
  { id: 'note-048', childId: 'child-002', testId: 'test-002', note: 11, created_at: '2026-05-06T10:00:00Z' },
  { id: 'note-049', childId: 'child-007', testId: 'test-002', note: 17, created_at: '2026-05-06T10:15:00Z' },
  { id: 'note-050', childId: 'child-012', testId: 'test-002', note: 14, created_at: '2026-05-06T10:45:00Z' }
];

// Activities

export const mockActivities: Activity[] = [
    {
      id: "activity-001",
      title: 'Interprétation Biblique',
    },
    {
      id: "activity-002",
      title: 'Chorale des Anges',
    },
    {
      id: "activity-003",
      title: 'Ballet des Petits',
    }
  ]

export const mockActivityatEvent: EventActivity[]=[
  {
    activityId: 'activity-003',
    eventType: "Arbre de noël",
    year: '2026'
  },
  {
    activityId: 'activity-001',
    eventType: "Soirée récréative des enfants",
    year: '2026'
  },
  { 
    activityId: 'activity-003',
    eventType: "Soirée récréative des enfants",
    year: '2026'
  }
]

export const mockSeance:Seance[]=[
  {
    id: "seance-001",
    title: "Lecon de la veuve",
    type: "NORMAL",
    classe: "JuniorB",
    authorId: "teacher-002",
    supervisorId: "teacher-001",
    created_at: "2026-07-18T09:05:00Z"
  }
]