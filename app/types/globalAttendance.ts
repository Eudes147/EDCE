export interface MeetingTeacherAttendance {
  teacherId: string
  isPresent: boolean
}

export interface MeetingAttendancePayload {
  monthKey: string          // "2026-06"
  dateLabel: string         // "Dimanche 28 Juin"
  checkedAt: string         // Horodatage ISO
  checkedBy: string         // Auteur de l'émargement
  assignments: MeetingTeacherAttendance[]
}