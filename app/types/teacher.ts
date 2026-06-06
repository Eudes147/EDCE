import type{User} from '~/types/auth'
import type{Sexe} from '~/types/index'


export interface Teacher {
  id: string
  first_name: string
  last_name: string
  sexe: Sexe
  tel?:string
  quarter?:string
  isAvailable: boolean
}


export interface TeacherStats {
  availableCount: number
  unavailableCount: number
}
