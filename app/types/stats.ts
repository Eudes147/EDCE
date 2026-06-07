import type { Child } from '~/types/child'
import type { Teacher } from '~/types/teacher'
import type { Moderator } from '~/types/moderator'
import type { Seance } from '~/types/seance'

export interface ClassStat {
  classe: string
  count: number
  rate: number
}

export interface DashboardStats {
  totalStats: {
    totalLengthChildren: number
    totalLengthClasses: number
    totalLengthModerators: number
    totalLengthTeachers: number
    totalLengthTests: number
  }
  listStats: {
    listChildren: Child[]
    listClasses: any[]
    listModerators: Moderator[]
    listTeachers: Teacher[]
    listTests: any[]
  }
  childrenStats: {
    childrenPerClass: ClassStat[]
    totalBoy: number
    totalGirl: number
    listParentInfos: Array<{ name: string; tel: string }>
  }
  teachersStats: {
    teachersAvailable: number
    teachersUnavailable: number
    teacherMasculin: number
    teacherFeminin: number
  }
  moderatorsStats: {
    moderatorsAvailable: number
    moderatorsUnavailable: number
    moderatorMasculin: number
    moderatorFeminin: number
  }
  testsStats: {
    testsPerClass: Array<{ classe: string; count: number }>
    testsPerMonth: Record<string, number>
    testEvaluation: { liste: any[]; count: number }
    testConcours: { liste: any[]; count: number }
    testSundaySchool: { liste: any[]; count: number }
  }
  notesStats: {
    evaluations: any
    sundaySchool: any
    concours: any
  }
}