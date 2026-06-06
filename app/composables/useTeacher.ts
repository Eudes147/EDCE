import type { Teacher } from "~/types/teacher"
import {ref,computed} from 'vue'
import { mockTeachers } from "~/data/mockData"



export const useTeacher= ()=>{
  const listTeachers=ref(mockTeachers)

  const teachersAvailable=computed(()=>{
    mockTeachers.filter(t => t.isAvailable)
  })

  const teachersUnavailable=computed(()=>{
    mockTeachers.filter(t => !t.isAvailable)
  })

  const teacherMasculin=computed(()=>{
    mockTeachers.filter(t => t.sexe === 'Masculin')
  })

  const teacherFeminin=computed(()=>{
    mockTeachers.filter(t => t.sexe === 'Feminin')
  })

  const getTelTeacher=(teacherId: string)=>{
    const teacher = listTeachers.value.find(teacher=>teacher.id===teacherId)
    return teacher?.tel
  }
   
  return {listTeachers,
    teacherFeminin,
    teacherMasculin,
    getTelTeacher,
    teachersAvailable,
    teachersUnavailable
  }
}