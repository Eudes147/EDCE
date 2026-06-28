import { AttendancePayload } from './types/attendance'

declare global {
  // On indique à TypeScript que globalThis possède désormais notre fausse base de données
  var attendanceDb: AttendancePayload[] | undefined
}

export {}