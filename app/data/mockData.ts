import type { Child } from '~/types/child'
import type { Classe } from '~/types/classe'
import type { Moderator } from '~/types/moderator'
import type { Teacher } from '~/types/teacher'
import type { Test } from '~/types/test'

import type { Activity,EventActivity }
from '~/types/activity'

import type {Seance, SeanceType} from '~/types/seance'

import type {ParticipantSeance, ParticipantEventActivity} from '~/types/participant'

import type{Note} from "~/types/test"

import type { User } from '~/types/auth'
import type {MonthlySchedulePayload} from '~/types/monthlySchedule'
import type { SupervisorSeance } from '~/types/seance'

import type { AttendancePayload } from '~/types/attendance'
import type { MeetingTeacherAttendance,MeetingAttendancePayload } from '~/types/globalAttendance'



export const mockGlobalAttendanceDb: MeetingAttendancePayload[] = [
  {
    monthKey: "2026-06",
    dateLabel: "Dimanche 07 Juin",
    checkedAt: "2026-06-07T13:00:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true },
      { teacherId: "teacher-010", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dimanche 14 Juin",
    checkedAt: "2026-06-14T13:15:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true },
      { teacherId: "teacher-002", isPresent: false }
    ]
  }
]

// Base de données simulée en mémoire
export const mockAttendanceDb: AttendancePayload[] = [
  // =========================================================================
  // DIMANCHE 7 JUIN ("Dim 7 Juin")
  // =========================================================================
  {
    monthKey: "2026-06",
    dateLabel: "Dim 7 Juin",
    className: "Petit",
    slotType: "NORMAL",
    checkedAt: "2026-06-07T09:15:00.000Z",
    checkedBy: "Admin",
    assignments: [
      { teacherId: "teacher-001", isPresent: true },
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 7 Juin",
    className: "Petit",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-07T10:30:00.000Z",
    checkedBy: "Admin",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 7 Juin",
    className: "Débutant",
    slotType: "NORMAL",
    checkedAt: "2026-06-07T09:12:00.000Z",
    checkedBy: "Admin",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 7 Juin",
    className: "Débutant",
    slotType: "DLT",
    checkedAt: "2026-06-07T12:05:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: false } // Absent ce jour-là
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 7 Juin",
    className: "Moyen",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-07T10:32:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 7 Juin",
    className: "JuniorA",
    slotType: "NORMAL",
    checkedAt: "2026-06-07T09:14:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: false } // Absent lors du premier dimanche
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 7 Juin",
    className: "JuniorA",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-07T10:35:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },

  // =========================================================================
  // DIMANCHE 14 JUIN ("Dim 14 Juin")
  // =========================================================================
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "Petit",
    slotType: "NORMAL",
    checkedAt: "2026-06-14T09:05:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "Petit",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-14T10:15:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "Petit",
    slotType: "DLT",
    checkedAt: "2026-06-14T12:00:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "Débutant",
    slotType: "NORMAL",
    checkedAt: "2026-06-14T09:08:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "Débutant",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-14T10:20:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "Moyen",
    slotType: "NORMAL",
    checkedAt: "2026-06-14T09:10:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "Moyen",
    slotType: "DLT",
    checkedAt: "2026-06-14T12:10:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "JuniorA",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-14T10:22:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "JuniorA",
    slotType: "DLT",
    checkedAt: "2026-06-14T12:12:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: false }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "JuniorB",
    slotType: "NORMAL",
    checkedAt: "2026-06-14T09:12:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 14 Juin",
    className: "JuniorB",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-14T10:25:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },

  // =========================================================================
  // DIMANCHE 21 JUIN ("Dim 21 Juin")
  // =========================================================================
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "Petit",
    slotType: "NORMAL",
    checkedAt: "2026-06-21T09:11:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "Petit",
    slotType: "DLT",
    checkedAt: "2026-06-21T12:02:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "Débutant",
    slotType: "NORMAL",
    checkedAt: "2026-06-21T09:15:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "Débutant",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-21T10:30:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "Moyen",
    slotType: "NORMAL",
    checkedAt: "2026-06-21T09:16:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "Moyen",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-21T10:32:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "JuniorA",
    slotType: "NORMAL",
    checkedAt: "2026-06-21T09:18:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "JuniorA",
    slotType: "DLT",
    checkedAt: "2026-06-21T12:05:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: false }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "JuniorB",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-21T10:35:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 21 Juin",
    className: "JuniorB",
    slotType: "DLT",
    checkedAt: "2026-06-21T12:08:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },

  // =========================================================================
  // DIMANCHE 28 JUIN ("Dim 28 Juin")
  // =========================================================================
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "Petit",
    slotType: "NORMAL",
    checkedAt: "2026-06-28T09:10:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "Petit",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-28T10:20:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "Petit",
    slotType: "DLT",
    checkedAt: "2026-06-28T12:01:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "Débutant",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-28T10:22:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "Débutant",
    slotType: "DLT",
    checkedAt: "2026-06-28T12:03:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "Moyen",
    slotType: "NORMAL",
    checkedAt: "2026-06-28T09:12:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "Moyen",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-28T10:25:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "JuniorA",
    slotType: "NORMAL",
    checkedAt: "2026-06-28T09:14:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-002", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "JuniorA",
    slotType: "SUNDAY_SCHOOL",
    checkedAt: "2026-06-28T10:28:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-001", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "JuniorB",
    slotType: "NORMAL",
    checkedAt: "2026-06-28T09:16:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-004", isPresent: true }
    ]
  },
  {
    monthKey: "2026-06",
    dateLabel: "Dim 28 Juin",
    className: "JuniorB",
    slotType: "DLT",
    checkedAt: "2026-06-28T12:06:00.000Z",
    checkedBy: "Jean-Pierre Kouassi",
    assignments: [
      { teacherId: "teacher-003", isPresent: false }
    ]
  }
]

// server/api/schedules/index.get.ts (ou dans votre fichier de données globales)
export const mockSchedules = [
  // Insertion de l'objet natif de Juin 2026 que vous avez fourni
  {
    monthKey: "2026-06",
    status: "published",
    rows: [
      {
        dateLabel: "Dim 7 Juin",
        classes: {
          Petit: { NORMAL: ["teacher-001", "teacher-002"], SUNDAY_SCHOOL: ["teacher-003"], DLT: [] },
          Débutant: { NORMAL: ["teacher-004"], SUNDAY_SCHOOL: [], DLT: ["teacher-001"] },
          Moyen: { NORMAL: [], SUNDAY_SCHOOL: ["teacher-002"], DLT: [] },
          JuniorA: { NORMAL: ["teacher-003"], SUNDAY_SCHOOL: ["teacher-004"], DLT: [] },
          JuniorB: { NORMAL: [], SUNDAY_SCHOOL: [], DLT: ["teacher-002"] }
        }
      },
      {
        dateLabel: "Dim 14 Juin",
        classes: {
          Petit: { NORMAL: ["teacher-002"], SUNDAY_SCHOOL: ["teacher-001"], DLT: ["teacher-003"] },
          Débutant: { NORMAL: ["teacher-003"], SUNDAY_SCHOOL: ["teacher-002"], DLT: [] },
          Moyen: { NORMAL: ["teacher-004"], SUNDAY_SCHOOL: [], DLT: ["teacher-001"] },
          JuniorA: { NORMAL: [], SUNDAY_SCHOOL: ["teacher-003"], DLT: ["teacher-002"] },
          JuniorB: { NORMAL: ["teacher-001"], SUNDAY_SCHOOL: ["teacher-004"], DLT: [] }
        }
      },
      {
        dateLabel: "Dim 21 Juin",
        classes: {
          Petit: { NORMAL: ["teacher-004"], SUNDAY_SCHOOL: [], DLT: ["teacher-001"] },
          Débutant: { NORMAL: ["teacher-001"], SUNDAY_SCHOOL: ["teacher-003"], DLT: [] },
          Moyen: { NORMAL: ["teacher-002"], SUNDAY_SCHOOL: ["teacher-004"], DLT: [] },
          JuniorA: { NORMAL: ["teacher-003"], SUNDAY_SCHOOL: [], DLT: ["teacher-004"] },
          JuniorB: { NORMAL: [], SUNDAY_SCHOOL: ["teacher-002"], DLT: ["teacher-001"] }
        }
      },
      {
        dateLabel: "Dim 28 Juin",
        classes: {
          Petit: { NORMAL: ["teacher-001"], SUNDAY_SCHOOL: ["teacher-002"], DLT: ["teacher-004"] },
          Débutant: { NORMAL: [], SUNDAY_SCHOOL: ["teacher-004"], DLT: ["teacher-003"] },
          Moyen: { NORMAL: ["teacher-003"], SUNDAY_SCHOOL: ["teacher-001"], DLT: [] },
          JuniorA: { NORMAL: ["teacher-002"], SUNDAY_SCHOOL: ["teacher-001"], DLT: [] },
          JuniorB: { NORMAL: ["teacher-004"], SUNDAY_SCHOOL: [], DLT: ["teacher-003"] }
        }
      }
    ]
  }
]

// ~/data/mockData.ts
// Boîte de stockage en mémoire partagée pour vos APIs
// app/data/mockData.ts (ou ~/data/mockData.ts)

export interface ScheduleClassAssignment {
  NORMAL: string[]
  SUNDAY_SCHOOL: string[]
  DLT: string[]
}

export interface ScheduleRow {
  dateLabel: string
  classes: {
    Petit?: ScheduleClassAssignment
    Débutant?: ScheduleClassAssignment
    Moyen?: ScheduleClassAssignment
    JuniorA?: ScheduleClassAssignment
    JuniorB?: ScheduleClassAssignment
    [key: string]: ScheduleClassAssignment | undefined // Permet l'indexation par chaîne dynamique
  }
}

export interface MonthlySchedule {
  monthKey: string
  status: string
  rows: ScheduleRow[]
}


export const mockSchedulesStore: { schedules: MonthlySchedule[] } = {
  schedules: [...mockSchedules]
}

export const mockUsers: User[] = [
  // ==========================================
  // ADMINISTRATEUR UNIQUE (1)
  // ==========================================
  {
    id: 'admin-001',
    first_name: 'Jean-Pierre',
    last_name: 'Kouassi',
    email: 'jp.kouassi@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpasswordadmin',
    tel: '+225 01 02 03 04',
    sexe: 'Masculin',
    status: 'admin',
    quarter: 'Q1',
    birth_date: new Date('1985-04-12'),
    created_at: '2025-01-10T08:00:00Z'
  },

  // ==========================================
  // TEACHERS (15)
  // ==========================================
  {
    id: 'teacher-001',
    first_name: 'Élisabeth',
    last_name: "N'dri",
    email: 'elisabeth.ndri@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 22 33 44',
    sexe: 'Feminin',
    status: 'teacher',
    birth_date: new Date('1990-05-24'),
    created_at: '2025-09-15T09:30:00Z'
  },
  {
    id: 'teacher-002',
    first_name: 'Abdoulaye',
    last_name: 'Traoré',
    email: 'abdoulaye.traore@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 55 66 77',
    sexe: 'Masculin',
    status: 'teacher',
    quarter: 'Q2',
    birth_date: new Date('1988-11-02'),
    created_at: '2025-09-15T10:15:00Z'
  },
  {
    id: 'teacher-003',
    first_name: 'Marie',
    last_name: 'Kouassi',
    email: 'marie.kouassi@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 11 22', // Fallback car absent du mock initial
    sexe: 'Feminin',
    status: 'teacher',
    birth_date: new Date('1993-02-14'),
    created_at: '2025-09-16T14:22:00Z'
  },
  {
    id: 'teacher-004',
    first_name: 'Olivier',
    last_name: 'Gnan',
    email: 'olivier.gnan@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 42 18 66',
    sexe: 'Masculin',
    status: 'teacher',
    quarter: 'Q1',
    birth_date: new Date('1985-08-30'),
    created_at: '2025-09-16T15:00:00Z'
  },
  {
    id: 'teacher-005',
    first_name: 'Nadia',
    last_name: 'Téa',
    email: 'nadia.tea@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 34 67 88',
    sexe: 'Feminin',
    status: 'teacher',
    birth_date: new Date('1995-07-19'),
    created_at: '2025-09-17T08:45:00Z'
  },
  {
    id: 'teacher-006',
    first_name: 'Sébastien',
    last_name: 'Kouakou',
    email: 'sebastien.kouakou@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 29 15 47',
    sexe: 'Masculin',
    status: 'teacher',
    quarter: 'Q3',
    birth_date: new Date('1991-03-11'),
    created_at: '2025-09-17T11:30:00Z'
  },
  {
    id: 'teacher-007',
    first_name: 'Claire',
    last_name: 'Odjo',
    email: 'claire.odjo@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 11 33',
    sexe: 'Feminin',
    status: 'teacher',
    birth_date: new Date('1994-12-05'),
    created_at: '2025-09-18T09:00:00Z'
  },
  {
    id: 'teacher-008',
    first_name: 'Franck',
    last_name: 'Konan',
    email: 'franck.konan@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 28 39 40',
    sexe: 'Masculin',
    status: 'teacher',
    birth_date: new Date('1989-06-15'),
    created_at: '2025-09-18T10:00:00Z'
  },
  {
    id: 'teacher-009',
    first_name: 'Aïssatou',
    last_name: 'Bakayoko',
    email: 'aissatou.bakayoko@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 62 18 90',
    sexe: 'Feminin',
    status: 'teacher',
    quarter: 'Q4',
    birth_date: new Date('1992-10-22'),
    created_at: '2025-09-19T16:10:00Z'
  },
  {
    id: 'teacher-010',
    first_name: 'Marius',
    last_name: 'Koffi',
    email: 'marius.koffi@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 11 44',
    sexe: 'Masculin',
    status: 'teacher',
    birth_date: new Date('1987-01-25'),
    created_at: '2025-09-20T11:15:00Z'
  },
  {
    id: 'teacher-011',
    first_name: 'Rita',
    last_name: 'Assié',
    email: 'rita.assie@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 71 33 22',
    sexe: 'Feminin',
    status: 'teacher',
    quarter: 'Q2',
    birth_date: new Date('1996-09-08'),
    created_at: '2025-09-21T14:35:00Z'
  },
  {
    id: 'teacher-012',
    first_name: 'Derek',
    last_name: 'Zeu',
    email: 'derek.zeu@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 55 11 88',
    sexe: 'Masculin',
    status: 'teacher',
    birth_date: new Date('1990-04-17'),
    created_at: '2025-09-22T08:20:00Z'
  },
  {
    id: 'teacher-013',
    first_name: 'Sophie',
    last_name: 'Kouadio',
    email: 'sophie.kouadio@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 18 44 77',
    sexe: 'Feminin',
    status: 'teacher',
    quarter: 'Q1',
    birth_date: new Date('1993-03-31'),
    created_at: '2025-09-22T10:50:00Z'
  },
  {
    id: 'teacher-014',
    first_name: 'Gaël',
    last_name: 'Tano',
    email: 'gael.tano@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 41 55 33',
    sexe: 'Masculin',
    status: 'teacher',
    birth_date: new Date('1986-07-14'),
    created_at: '2025-09-23T09:05:00Z'
  },
  {
    id: 'teacher-015',
    first_name: 'Hélène',
    last_name: 'Anoma',
    email: 'helene.anoma@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 90 12 34',
    sexe: 'Feminin',
    status: 'teacher',
    quarter: 'Q3',
    birth_date: new Date('1991-12-25'),
    created_at: '2025-09-23T13:40:00Z'
  },

  // ==========================================
  // MODERATORS (15)
  // ==========================================
  {
    id: 'moderator-001',
    first_name: 'Victor',
    last_name: 'N’Guessan',
    email: 'victor.nguessan@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 88 99 00',
    sexe: 'Masculin',
    status: 'moderator',
    birth_date: new Date('1984-10-10'),
    created_at: '2025-08-20T07:45:00Z'
  },
  {
    id: 'moderator-002',
    first_name: 'Carine',
    last_name: 'Ahoua',
    email: 'carine.ahoua@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 66 55 44',
    sexe: 'Feminin',
    status: 'moderator',
    birth_date: new Date('1989-05-18'),
    created_at: '2025-08-20T09:15:00Z'
  },
  {
    id: 'moderator-003',
    first_name: 'Yves',
    last_name: 'Zoro',
    email: 'yves.zoro@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 22 11',
    sexe: 'Masculin',
    status: 'moderator',
    quarter: 'Q4',
    birth_date: new Date('1987-03-22'),
    created_at: '2025-08-21T11:00:00Z'
  },
  {
    id: 'moderator-004',
    first_name: 'Awa',
    last_name: 'Tra',
    email: 'awa.tra@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 35 68 92',
    sexe: 'Feminin',
    status: 'moderator',
    birth_date: new Date('1992-08-14'),
    created_at: '2025-08-22T14:30:00Z'
  },
  {
    id: 'moderator-005',
    first_name: 'Loïc',
    last_name: 'Amani',
    email: 'loic.amani@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 58 22 90',
    sexe: 'Masculin',
    status: 'moderator',
    quarter: 'Q1',
    birth_date: new Date('1990-11-30'),
    created_at: '2025-08-23T10:10:00Z'
  },
  {
    id: 'moderator-006',
    first_name: 'Natacha',
    last_name: 'Edoh',
    email: 'natacha.edoh@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 22 33',
    sexe: 'Feminin',
    status: 'moderator',
    birth_date: new Date('1994-01-17'),
    created_at: '2025-08-24T08:50:00Z'
  },
  {
    id: 'moderator-007',
    first_name: 'Mickaël',
    last_name: 'Koffi',
    email: 'mickael.koffi@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 12 98 76',
    sexe: 'Masculin',
    status: 'moderator',
    birth_date: new Date('1986-06-05'),
    created_at: '2025-08-24T16:25:00Z'
  },
  {
    id: 'moderator-008',
    first_name: 'Sandrine',
    last_name: 'Affi',
    email: 'sandrine.affi@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 44 18 22',
    sexe: 'Feminin',
    status: 'moderator',
    birth_date: new Date('1991-09-27'),
    created_at: '2025-08-25T13:12:00Z'
  },
  {
    id: 'moderator-009',
    first_name: 'Koffi',
    last_name: 'Abo',
    email: 'koffi.abo@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 22 44',
    sexe: 'Masculin',
    status: 'moderator',
    quarter: 'Q2',
    birth_date: new Date('1983-12-12'),
    created_at: '2025-08-26T09:40:00Z'
  },
  {
    id: 'moderator-010',
    first_name: 'Sanaa',
    last_name: 'Béatrice',
    email: 'sanaa.beatrice@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 79 32 14',
    sexe: 'Feminin',
    status: 'moderator',
    birth_date: new Date('1995-04-03'),
    created_at: '2025-08-27T10:55:00Z'
  },
  {
    id: 'moderator-011',
    first_name: 'Bruno',
    last_name: 'Kon',
    email: 'bruno.kon@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 24 16 83',
    sexe: 'Masculin',
    status: 'moderator',
    birth_date: new Date('1988-07-21'),
    created_at: '2025-08-28T14:20:00Z'
  },
  {
    id: 'moderator-012',
    first_name: 'Adja',
    last_name: 'Kouamé',
    email: 'adja.kouame@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 22 55',
    sexe: 'Feminin',
    status: 'moderator',
    quarter: 'Q3',
    birth_date: new Date('1993-10-10'),
    created_at: '2025-08-29T11:15:00Z'
  },
  {
    id: 'moderator-013',
    first_name: 'Hugues',
    last_name: 'Zan',
    email: 'hugues.zan@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 81 54 29',
    sexe: 'Masculin',
    status: 'moderator',
    birth_date: new Date('1985-02-28'),
    created_at: '2025-08-30T08:45:00Z'
  },
  {
    id: 'moderator-014',
    first_name: 'Marie',
    last_name: 'Ébrié',
    email: 'marie.ebrie@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 65 43 21',
    sexe: 'Feminin',
    status: 'moderator',
    birth_date: new Date('1990-03-14'),
    created_at: '2025-08-31T15:50:00Z'
  },
  {
    id: 'moderator-015',
    first_name: 'Mansour',
    last_name: 'Amani',
    email: 'mansour.amani@edce.ci',
    password: '$argon2id$v=19$m=65536,t=3,p=4$mockpassword',
    tel: '+225 07 00 22 66',
    sexe: 'Masculin',
    status: 'moderator',
    quarter: 'Q4',
    birth_date: new Date('1989-09-02'),
    created_at: '2025-09-01T10:30:00Z'
  }
]

export const mockChildren: Child[] = [
  {
    id: 'child-001',
    classe: 'Petit',
    name: 'Anaïs Koné',
    birth_date: new Date('2019-03-12'),
    tel: '+225 07 12 34 56',
    telParent: '+225 05 98 76 54',
    sexe: 'Feminin',
    nivScolaire: 'CM2',
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
    nivScolaire: "3e",
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
  { "id": "activity-001", "title": "Interprétation Biblique" },
  { "id": "activity-002", "title": "Chorale des Anges" },
  { "id": "activity-003", "title": "Ballet des Petits" },
  { "id": "activity-004", "title": "Génie Biblique" }, // L'unique référence conservée
  { "id": "activity-024", "title": "Théâtre des Juniors" },
  { "id": "activity-025", "title": "Récitation de Versets" },
  { "id": "activity-026", "title": "Chorale des Flambeaux" },
  { "id": "activity-027", "title": "Mime et Expression" },
  { "id": "activity-028", "title": "Danse Liturgique" },
  { "id": "activity-029", "title": "Poésie Chrétienne" },
  { "id": "activity-030", "title": "Jeux de Rôles Bibliques" },
  { "id": "activity-031", "title": "Atelier Dessin & Foi" },
  { "id": "activity-032", "title": "Chants de Noël" },
  { "id": "activity-033", "title": "Marionnettes Bibliques" },
  { "id": "activity-034", "title": "Sketch des Paraboles" },
  { "id": "activity-035", "title": "Percussions et Rythmes" },
  { "id": "activity-036", "title": "Contes du Dimanche" },
  { "id": "activity-037", "title": "Concours de Dessin" },
  { "id": "activity-038", "title": "Flûte à bec spirituelle" },
  { "id": "activity-039", "title": "Acrobaties des Petits" },
  { "id": "activity-040", "title": "Lecture Publique Évangile" },
  { "id": "activity-041", "title": "Chant en Duo" },
  { "id": "activity-042", "title": "Ballet des Juniors" },
  { "id": "activity-043", "title": "Orchestre des Enfants" },
  { "id": "activity-044", "title": "Jeu des Énigmes Saintes" },
  { "id": "activity-045", "title": "Fresque Murale Collective" },
  { "id": "activity-046", "title": "Louange Gestuelle" },
  { "id": "activity-047", "title": "Calligraphie de Versets" },
  { "id": "activity-048", "title": "Pièce de Théâtre : Moïse" },
  { "id": "activity-049", "title": "Chorale Éveil" },
  { "id": "activity-050", "title": "Slam Spirituel" }
]

export const mockActivityatEvent: EventActivity[] = [
  { "id": "event-001", "activityId": "activity-003", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-002", "activityId": "activity-001", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-003", "activityId": "activity-003", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-004", "activityId": "activity-004", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-007", "activityId": "activity-004", "eventType": "Soirée récréative des enfants", "year": "2026" }, // Réaligné sur activity-004
  { "id": "event-008", "activityId": "activity-002", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-009", "activityId": "activity-002", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-026", "activityId": "activity-024", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-027", "activityId": "activity-025", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-028", "activityId": "activity-026", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-029", "activityId": "activity-027", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-030", "activityId": "activity-028", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-031", "activityId": "activity-029", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-032", "activityId": "activity-030", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-033", "activityId": "activity-031", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-034", "activityId": "activity-032", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-035", "activityId": "activity-033", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-036", "activityId": "activity-034", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-037", "activityId": "activity-035", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-038", "activityId": "activity-036", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-039", "activityId": "activity-037", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-040", "activityId": "activity-038", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-041", "activityId": "activity-039", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-042", "activityId": "activity-040", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-043", "activityId": "activity-041", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-044", "activityId": "activity-042", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-045", "activityId": "activity-043", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-046", "activityId": "activity-044", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-047", "activityId": "activity-045", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-048", "activityId": "activity-046", "eventType": "Arbre de noël", "year": "2026" },
  { "id": "event-049", "activityId": "activity-047", "eventType": "Soirée récréative des enfants", "year": "2026" },
  { "id": "event-050", "activityId": "activity-048", "eventType": "Arbre de noël", "year": "2026" }
]

export const mockSeance:Seance[]=[
  { "id": "seance-001", "title": "Éveil de la Foi - Rentrée", "type": "SUNDAY_SCHOOL", "classe": "Petit", "authorId": "teacher-001", "supervisorId": "teacher-003", "created_at": "2026-01-04T09:00:00Z" },
  { "id": "seance-002", "title": "Bases de la Foi 1", "type": "NORMAL", "classe": "Débutant", "authorId": "teacher-004", "supervisorId": "teacher-006", "created_at": "2026-01-04T09:00:00Z" },
  { "id": "seance-003", "title": "Histoires Bibliques", "type": "NORMAL", "classe": "Moyen", "authorId": "teacher-007", "supervisorId": "teacher-009", "created_at": "2026-01-04T10:30:00Z" },
  { "id": "seance-004", "title": "Introduction DLT", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-010", "supervisorId": "teacher-012", "created_at": "2026-01-07T15:00:00Z" },
  { "id": "seance-005", "title": "Approfondissement Junior B", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-013", "supervisorId": "teacher-015", "created_at": "2026-01-07T16:30:00Z" },
  { "id": "seance-006", "title": "Les paraboles pour Petits", "type": "SUNDAY_SCHOOL", "classe": "Petit", "authorId": "teacher-001", "supervisorId": "teacher-004", "created_at": "2026-01-11T09:00:00Z" },
  { "id": "seance-007", "title": "Bases de la Foi 2", "type": "NORMAL", "classe": "Débutant", "authorId": "teacher-003", "supervisorId": "teacher-007", "created_at": "2026-01-11T09:00:00Z" },
  { "id": "seance-008", "title": "Vivre ensemble", "type": "NORMAL", "classe": "Moyen", "authorId": "teacher-006", "supervisorId": "teacher-010", "created_at": "2026-01-11T10:30:00Z" },
  { "id": "seance-009", "title": "DLT - Session Écoute", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-009", "supervisorId": "teacher-013", "created_at": "2026-01-14T15:00:00Z" },
  { "id": "seance-010", "title": "Grandir en Sagesse", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-012", "supervisorId": "teacher-001", "created_at": "2026-01-14T16:30:00Z" },
  { "id": "seance-011", "title": "Chants et Louanges Petits", "type": "SUNDAY_SCHOOL", "classe": "Petit", "authorId": "teacher-015", "supervisorId": "teacher-003", "created_at": "2026-01-18T09:00:00Z" },
  { "id": "seance-012", "title": "La prière simple", "type": "SUNDAY_SCHOOL", "classe": "Débutant", "authorId": "teacher-004", "supervisorId": "teacher-006", "created_at": "2026-01-18T09:00:00Z" },
  { "id": "seance-013", "title": "L'Arche de Noé", "type": "SUNDAY_SCHOOL", "classe": "Moyen", "authorId": "teacher-007", "supervisorId": "teacher-012", "created_at": "2026-01-18T10:30:00Z" },
  { "id": "seance-014", "title": "DLT - Partage et Service", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-010", "supervisorId": "teacher-015", "created_at": "2026-01-21T15:00:00Z" },
  { "id": "seance-015", "title": "Le respect des autres", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-001", "supervisorId": "teacher-009", "created_at": "2026-01-21T16:30:00Z" },
  { "id": "seance-016", "title": "Histoires animées", "type": "NORMAL", "classe": "Petit", "authorId": "teacher-003", "supervisorId": "teacher-004", "created_at": "2026-01-25T09:00:00Z" },
  { "id": "seance-017", "title": "Obéissance et Amour", "type": "NORMAL", "classe": "Débutant", "authorId": "teacher-006", "supervisorId": "teacher-007", "created_at": "2026-01-25T09:00:00Z" },
  { "id": "seance-018", "title": "David et Goliath", "type": "NORMAL", "classe": "Moyen", "authorId": "teacher-013", "supervisorId": "teacher-001", "created_at": "2026-01-25T10:30:00Z" },
  { "id": "seance-019", "title": "DLT - Identité", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-012", "supervisorId": "teacher-010", "created_at": "2026-01-28T15:00:00Z" },
  { "id": "seance-020", "title": "Responsabilité Chrétienne", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-015", "supervisorId": "teacher-003", "created_at": "2026-01-28T16:30:00Z" },
  { "id": "seance-021", "title": "Le Premier Miracle", "type": "SUNDAY_SCHOOL", "classe": "Petit", "authorId": "teacher-004", "supervisorId": "teacher-013", "created_at": "2026-02-01T09:00:00Z" },
  { "id": "seance-022", "title": "La Création", "type": "SUNDAY_SCHOOL", "classe": "Débutant", "authorId": "teacher-009", "supervisorId": "teacher-001", "created_at": "2026-02-01T09:00:00Z" },
  { "id": "seance-023", "title": "La patience", "type": "SUNDAY_SCHOOL", "classe": "Moyen", "authorId": "teacher-010", "supervisorId": "teacher-006", "created_at": "2026-02-01T10:30:00Z" },
  { "id": "seance-024", "title": "DLT - Témoignage", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-007", "supervisorId": "teacher-015", "created_at": "2026-02-04T15:00:00Z" },
  { "id": "seance-025", "title": "Vivre sa foi au collège", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-012", "supervisorId": "teacher-003", "created_at": "2026-02-04T16:30:00Z" },
  { "id": "seance-026", "title": "Dessine ta foi", "type": "NORMAL", "classe": "Petit", "authorId": "teacher-001", "supervisorId": "teacher-007", "created_at": "2026-02-08T09:00:00Z" },
  { "id": "seance-027", "title": "Le Bon Samaritain", "type": "NORMAL", "classe": "Débutant", "authorId": "teacher-013", "supervisorId": "teacher-010", "created_at": "2026-02-08T09:00:00Z" },
  { "id": "seance-028", "title": "Les 10 Commandements", "type": "NORMAL", "classe": "Moyen", "authorId": "teacher-015", "supervisorId": "teacher-004", "created_at": "2026-02-08T10:30:00Z" },
  { "id": "seance-029", "title": "DLT - Esprit d'Équipe", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-006", "supervisorId": "teacher-012", "created_at": "2026-02-11T15:00:00Z" },
  { "id": "seance-030", "title": "Étude Biblique Junior", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-009", "supervisorId": "teacher-001", "created_at": "2026-02-11T16:30:00Z" },
  { "id": "seance-031", "title": "Jésus aime les enfants", "type": "SUNDAY_SCHOOL", "classe": "Petit", "authorId": "teacher-003", "supervisorId": "teacher-015", "created_at": "2026-02-15T09:00:00Z" },
  { "id": "seance-032", "title": "Dire la vérité", "type": "SUNDAY_SCHOOL", "classe": "Débutant", "authorId": "teacher-010", "supervisorId": "teacher-004", "created_at": "2026-02-15T09:00:00Z" },
  { "id": "seance-033", "title": "Daniel dans la fosse", "type": "SUNDAY_SCHOOL", "classe": "Moyen", "authorId": "teacher-012", "supervisorId": "teacher-007", "created_at": "2026-02-15T10:30:00Z" },
  { "id": "seance-034", "title": "DLT - Pureté", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-001", "supervisorId": "teacher-006", "created_at": "2026-02-18T15:00:00Z" },
  { "id": "seance-035", "title": "Le pardon mutuel", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-013", "supervisorId": "teacher-009", "created_at": "2026-02-18T16:30:00Z" },
  { "id": "seance-036", "title": "Dieu est Amour", "type": "NORMAL", "classe": "Petit", "authorId": "teacher-004", "supervisorId": "teacher-010", "created_at": "2026-02-22T09:00:00Z" },
  { "id": "seance-037", "title": "Partager sa joie", "type": "NORMAL", "classe": "Débutant", "authorId": "teacher-007", "supervisorId": "teacher-012", "created_at": "2026-02-22T09:00:00Z" },
  { "id": "seance-038", "title": "Joseph et ses frères", "type": "NORMAL", "classe": "Moyen", "authorId": "teacher-015", "supervisorId": "teacher-003", "created_at": "2026-02-22T10:30:00Z" },
  { "id": "seance-039", "title": "DLT - Fidélité", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-006", "supervisorId": "teacher-001", "created_at": "2026-02-25T15:00:00Z" },
  { "id": "seance-040", "title": "Prendre de bonnes décisions", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-009", "supervisorId": "teacher-013", "created_at": "2026-02-25T16:30:00Z" },
  { "id": "seance-041", "title": "Jésus calme la tempête", "type": "SUNDAY_SCHOOL", "classe": "Petit", "authorId": "teacher-012", "supervisorId": "teacher-004", "created_at": "2026-03-01T09:00:00Z" },
  { "id": "seance-042", "title": "La brebis perdue", "type": "SUNDAY_SCHOOL", "classe": "Débutant", "authorId": "teacher-001", "supervisorId": "teacher-007", "created_at": "2026-03-01T09:00:00Z" },
  { "id": "seance-043", "title": "Moïse et la Mer Rouge", "type": "SUNDAY_SCHOOL", "classe": "Moyen", "authorId": "teacher-003", "supervisorId": "teacher-015", "created_at": "2026-03-01T10:30:00Z" },
  { "id": "seance-044", "title": "DLT - L'Humilité", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-010", "supervisorId": "teacher-006", "created_at": "2026-03-04T15:00:00Z" },
  { "id": "seance-045", "title": "La prière persévérante", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-013", "supervisorId": "teacher-009", "created_at": "2026-03-04T16:30:00Z" },
  { "id": "seance-046", "title": "Dieu me protège", "type": "NORMAL", "classe": "Petit", "authorId": "teacher-006", "supervisorId": "teacher-012", "created_at": "2026-03-08T09:00:00Z" },
  { "id": "seance-047", "title": "L'amour du prochain", "type": "NORMAL", "classe": "Débutant", "authorId": "teacher-015", "supervisorId": "teacher-001", "created_at": "2026-03-08T09:00:00Z" },
  { "id": "seance-048", "title": "La tour de Babel", "type": "NORMAL", "classe": "Moyen", "authorId": "teacher-004", "supervisorId": "teacher-003", "created_at": "2026-03-08T10:30:00Z" },
  { "id": "seance-049", "title": "DLT - Synthèse Trimestre", "type": "DLT", "classe": "JuniorA", "authorId": "teacher-007", "supervisorId": "teacher-013", "created_at": "2026-03-11T15:00:00Z" },
  { "id": "seance-050", "title": "Bilan Intermédiaire", "type": "NORMAL", "classe": "JuniorB", "authorId": "teacher-010", "supervisorId": "teacher-009", "created_at": "2026-03-11T16:30:00Z" }
]

export const mockSupervisorSeance: SupervisorSeance[]=[
  {"id": "superv-seance-001", "seanceId": "seance-003","supervisorSeanceId": "teacher-002"},
  {"id": "superv-seance-010", "seanceId": "seance-003","supervisorSeanceId": "teacher-005"},
  {"id": "superv-seance-011", "seanceId": "seance-003","supervisorSeanceId": "teacher-009"},
  {"id": "superv-seance-001", "seanceId": "seance-003","supervisorSeanceId": "teacher-012"},
  {"id": "superv-seance-002", "seanceId": "seance-010","supervisorSeanceId": "teacher-010"},
  {"id": "superv-seance-003", "seanceId": "seance-013","supervisorSeanceId": "teacher-011"},
  {"id": "superv-seance-004", "seanceId": "seance-004","supervisorSeanceId": "teacher-004"},
  {"id": "superv-seance-005", "seanceId": "seance-014","supervisorSeanceId": "teacher-008"},
  {"id": "superv-seance-006", "seanceId": "seance-004","supervisorSeanceId": "teacher-002"},
]

export const mockParticipantSeance: ParticipantSeance[]=[
  { "id": "part-001", "seanceId": "seance-001", "childId": "child-001" },
  { "id": "part-002", "seanceId": "seance-001", "childId": "child-006" },
  { "id": "part-003", "seanceId": "seance-001", "childId": "child-011" },
  { "id": "part-004", "seanceId": "seance-002", "childId": "child-002" },
  { "id": "part-005", "seanceId": "seance-002", "childId": "child-007" },
  { "id": "part-006", "seanceId": "seance-003", "childId": "child-003" },
  { "id": "part-007", "seanceId": "seance-003", "childId": "child-008" },
  { "id": "part-008", "seanceId": "seance-004", "childId": "child-004" },
  { "id": "part-009", "seanceId": "seance-004", "childId": "child-009" },
  { "id": "part-010", "seanceId": "seance-005", "childId": "child-005" },
  { "id": "part-011", "seanceId": "seance-005", "childId": "child-010" },
  { "id": "part-012", "seanceId": "seance-006", "childId": "child-001" },
  { "id": "part-013", "seanceId": "seance-006", "childId": "child-011" },
  { "id": "part-014", "seanceId": "seance-007", "childId": "child-002" },
  { "id": "part-015", "seanceId": "seance-007", "childId": "child-012" },
  { "id": "part-016", "seanceId": "seance-008", "childId": "child-003" },
  { "id": "part-017", "seanceId": "seance-008", "childId": "child-013" },
  { "id": "part-018", "seanceId": "seance-009", "childId": "child-004" },
  { "id": "part-019", "seanceId": "seance-009", "childId": "child-014" },
  { "id": "part-020", "seanceId": "seance-010", "childId": "child-005" },
  { "id": "part-021", "seanceId": "seance-010", "childId": "child-015" },
  { "id": "part-022", "seanceId": "seance-011", "childId": "child-006" },
  { "id": "part-023", "seanceId": "seance-012", "childId": "child-007" },
  { "id": "part-024", "seanceId": "seance-012", "childId": "child-012" },
  { "id": "part-025", "seanceId": "seance-013", "childId": "child-008" },
  { "id": "part-026", "seanceId": "seance-013", "childId": "child-013" },
  { "id": "part-027", "seanceId": "seance-014", "childId": "child-009" },
  { "id": "part-028", "seanceId": "seance-014", "childId": "child-014" },
  { "id": "part-029", "seanceId": "seance-015", "childId": "child-010" },
  { "id": "part-030", "seanceId": "seance-015", "childId": "child-015" },
  { "id": "part-031", "seanceId": "seance-016", "childId": "child-001" },
  { "id": "part-032", "seanceId": "seance-017", "childId": "child-002" },
  { "id": "part-033", "seanceId": "seance-018", "childId": "child-003" },
  { "id": "part-034", "seanceId": "seance-019", "childId": "child-004" },
  { "id": "part-035", "seanceId": "seance-020", "childId": "child-005" },
  { "id": "part-036", "seanceId": "seance-021", "childId": "child-006" },
  { "id": "part-037", "seanceId": "seance-022", "childId": "child-007" },
  { "id": "part-038", "seanceId": "seance-023", "childId": "child-008" },
  { "id": "part-039", "seanceId": "seance-024", "childId": "child-009" },
  { "id": "part-040", "seanceId": "seance-025", "childId": "child-010" },
  { "id": "part-041", "seanceId": "seance-026", "childId": "child-011" },
  { "id": "part-042", "seanceId": "seance-027", "childId": "child-012" },
  { "id": "part-043", "seanceId": "seance-028", "childId": "child-013" },
  { "id": "part-044", "seanceId": "seance-029", "childId": "child-014" },
  { "id": "part-045", "seanceId": "seance-030", "childId": "child-015" },
  { "id": "part-046", "seanceId": "seance-031", "childId": "child-001" },
  { "id": "part-047", "seanceId": "seance-031", "childId": "child-006" },
  { "id": "part-048", "seanceId": "seance-032", "childId": "child-002" },
  { "id": "part-049", "seanceId": "seance-032", "childId": "child-007" },
  { "id": "part-050", "seanceId": "seance-033", "childId": "child-003" },
  { "id": "part-051", "seanceId": "seance-033", "childId": "child-008" },
  { "id": "part-052", "seanceId": "seance-034", "childId": "child-004" },
  { "id": "part-053", "seanceId": "seance-034", "childId": "child-009" },
  { "id": "part-054", "seanceId": "seance-035", "childId": "child-005" },
  { "id": "part-055", "seanceId": "seance-035", "childId": "child-010" },
  { "id": "part-056", "seanceId": "seance-036", "childId": "child-011" },
  { "id": "part-057", "seanceId": "seance-037", "childId": "child-012" },
  { "id": "part-058", "seanceId": "seance-038", "childId": "child-013" },
  { "id": "part-059", "seanceId": "seance-039", "childId": "child-014" },
  { "id": "part-060", "seanceId": "seance-040", "childId": "child-015" },
  { "id": "part-061", "seanceId": "seance-041", "childId": "child-001" },
  { "id": "part-062", "seanceId": "seance-042", "childId": "child-002" },
  { "id": "part-063", "seanceId": "seance-043", "childId": "child-003" },
  { "id": "part-064", "seanceId": "seance-044", "childId": "child-004" },
  { "id": "part-065", "seanceId": "seance-045", "childId": "child-005" },
  { "id": "part-066", "seanceId": "seance-046", "childId": "child-006" },
  { "id": "part-067", "seanceId": "seance-047", "childId": "child-007" },
  { "id": "part-068", "seanceId": "seance-048", "childId": "child-008" },
  { "id": "part-069", "seanceId": "seance-049", "childId": "child-009" },
  { "id": "part-070", "seanceId": "seance-050", "childId": "child-010" }
]

export const mockParticipantEvent: ParticipantEventActivity[]=[
  { "id": "part-event-001", "eventActivityId": "event-001", "childId": "child-001" },
  { "id": "part-event-002", "eventActivityId": "event-001", "childId": "child-002" },
  { "id": "part-event-003", "eventActivityId": "event-001", "childId": "child-003" },
  { "id": "part-event-004", "eventActivityId": "event-002", "childId": "child-004" },
  { "id": "part-event-005", "eventActivityId": "event-002", "childId": "child-005" },
  { "id": "part-event-006", "eventActivityId": "event-003", "childId": "child-006" },
  { "id": "part-event-007", "eventActivityId": "event-003", "childId": "child-007" },
  { "id": "part-event-008", "eventActivityId": "event-004", "childId": "child-001" },
  { "id": "part-event-009", "eventActivityId": "event-004", "childId": "child-008" },
  { "id": "part-event-010", "eventActivityId": "event-005", "childId": "child-002" },
  { "id": "part-event-011", "eventActivityId": "event-005", "childId": "child-009" },
  { "id": "part-event-014", "eventActivityId": "event-007", "childId": "child-004" },
  { "id": "part-event-015", "eventActivityId": "event-007", "childId": "child-011" },
  { "id": "part-event-016", "eventActivityId": "event-008", "childId": "child-005" },
  { "id": "part-event-017", "eventActivityId": "event-008", "childId": "child-012" },
  { "id": "part-event-018", "eventActivityId": "event-009", "childId": "child-006" },
  { "id": "part-event-019", "eventActivityId": "event-009", "childId": "child-013" },
  { "id": "part-event-020", "eventActivityId": "event-010", "childId": "child-007" },
  { "id": "part-event-021", "eventActivityId": "event-010", "childId": "child-014" },
  { "id": "part-event-052", "eventActivityId": "event-026", "childId": "child-002" },
  { "id": "part-event-053", "eventActivityId": "event-026", "childId": "child-014" },
  { "id": "part-event-054", "eventActivityId": "event-027", "childId": "child-003" },
  { "id": "part-event-055", "eventActivityId": "event-027", "childId": "child-015" },
  { "id": "part-event-056", "eventActivityId": "event-028", "childId": "child-004" },
  { "id": "part-event-057", "eventActivityId": "event-028", "childId": "child-008" },
  { "id": "part-event-058", "eventActivityId": "event-029", "childId": "child-005" },
  { "id": "part-event-059", "eventActivityId": "event-029", "childId": "child-009" },
  { "id": "part-event-060", "eventActivityId": "event-030", "childId": "child-006" },
  { "id": "part-event-061", "eventActivityId": "event-030", "childId": "child-010" },
  { "id": "part-event-062", "eventActivityId": "event-031", "childId": "child-007" },
  { "id": "part-event-063", "eventActivityId": "event-031", "childId": "child-011" },
  { "id": "part-event-064", "eventActivityId": "event-032", "childId": "child-001" },
  { "id": "part-event-065", "eventActivityId": "event-032", "childId": "child-012" },
  { "id": "part-event-066", "eventActivityId": "event-033", "childId": "child-002" },
  { "id": "part-event-067", "eventActivityId": "event-033", "childId": "child-013" },
  { "id": "part-event-068", "eventActivityId": "event-034", "childId": "child-003" },
  { "id": "part-event-069", "eventActivityId": "event-034", "childId": "child-014" },
  { "id": "part-event-070", "eventActivityId": "event-035", "childId": "child-004" },
  { "id": "part-event-071", "eventActivityId": "event-035", "childId": "child-015" },
  { "id": "part-event-072", "eventActivityId": "event-036", "childId": "child-005" },
  { "id": "part-event-073", "eventActivityId": "event-036", "childId": "child-008" },
  { "id": "part-event-074", "eventActivityId": "event-037", "childId": "child-006" },
  { "id": "part-event-075", "eventActivityId": "event-037", "childId": "child-009" },
  { "id": "part-event-076", "eventActivityId": "event-038", "childId": "child-007" },
  { "id": "part-event-077", "eventActivityId": "event-038", "childId": "child-010" },
  { "id": "part-event-078", "eventActivityId": "event-039", "childId": "child-001" },
  { "id": "part-event-079", "eventActivityId": "event-039", "childId": "child-011" },
  { "id": "part-event-080", "eventActivityId": "event-040", "childId": "child-002" },
  { "id": "part-event-081", "eventActivityId": "event-040", "childId": "child-012" },
  { "id": "part-event-082", "eventActivityId": "event-041", "childId": "child-003" },
  { "id": "part-event-083", "eventActivityId": "event-041", "childId": "child-013" },
  { "id": "part-event-084", "eventActivityId": "event-042", "childId": "child-004" },
  { "id": "part-event-085", "eventActivityId": "event-042", "childId": "child-014" },
  { "id": "part-event-086", "eventActivityId": "event-043", "childId": "child-005" },
  { "id": "part-event-087", "eventActivityId": "event-043", "childId": "child-015" },
  { "id": "part-event-088", "eventActivityId": "event-044", "childId": "child-006" },
  { "id": "part-event-089", "eventActivityId": "event-044", "childId": "child-008" },
  { "id": "part-event-090", "eventActivityId": "event-045", "childId": "child-007" },
  { "id": "part-event-091", "eventActivityId": "event-045", "childId": "child-009" },
  { "id": "part-event-092", "eventActivityId": "event-046", "childId": "child-001" },
  { "id": "part-event-093", "eventActivityId": "event-046", "childId": "child-010" },
  { "id": "part-event-094", "eventActivityId": "event-047", "childId": "child-002" },
  { "id": "part-event-095", "eventActivityId": "event-047", "childId": "child-011" },
  { "id": "part-event-096", "eventActivityId": "event-048", "childId": "child-003" },
  { "id": "part-event-097", "eventActivityId": "event-048", "childId": "child-012" },
  { "id": "part-event-098", "eventActivityId": "event-049", "childId": "child-004" },
  { "id": "part-event-099", "eventActivityId": "event-049", "childId": "child-013" },
  { "id": "part-event-100", "eventActivityId": "event-050", "childId": "child-005" }
]