export interface TeacherAttendance {
  teacherId: string
  isPresent: boolean
}

export interface AttendancePayload {
  monthKey: string          // "2026-06"
  dateLabel: string         // "Dimanche 28 Juin"
  className: string         // "JuniorA"
  slotType: 'NORMAL' | 'SUNDAY_SCHOOL' | 'DLT'
  checkedAt: string         // Horodatage ISO
  checkedBy: string         // Auteur de l'émargement
  assignments: TeacherAttendance[]
}