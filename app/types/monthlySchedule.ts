export interface MonthlySchedulePayload {
  monthKey: string // Ex: "2026-06"
  status: 'draft' | 'published'
  rows: {
    dateLabel: string
    assignments: {
      NORMAL: string[]
      SUNDAY_SCHOOL: string[]
      DLT: string[]
    }
  }[]
}