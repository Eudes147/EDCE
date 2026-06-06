import type { Teacher } from "~/types/teacher"
import {ref,computed} from 'vue'
import { mockModerators } from "~/data/mockData"



export const useTeacher= ()=>{
  const listModerators=ref(mockModerators)

  const teachersAvailable=computed(()=>{
    mockModerators.filter(t => t.isAvailable)
  })

  const teachersUnavailable=computed(()=>{
    mockModerators.filter(t => !t.isAvailable)
  })

  const teacherMasculin=computed(()=>{
    mockModerators.filter(t => t.sexe === 'Masculin')
  })

  const teacherFeminin=computed(()=>{
    mockModerators.filter(t => t.sexe === 'Feminin')
  })

  const getTelModerator=(teacherId: string)=>{
    const teacher = listModerators.value.find(teacher=>teacher.id===teacherId)
    return teacher?.tel
  }
   
  return {
    listModerators,
    teacherFeminin,
    teacherMasculin,
    getTelModerator,
    teachersAvailable,
    teachersUnavailable
  }
}