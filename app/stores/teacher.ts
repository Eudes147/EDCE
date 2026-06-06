import {defineStore} from 'pinia'

import type { Teacher } from '~/types/teacher'
export const useTeacherStore = defineStore('teacher',{
  state: ()=>({
    teachers: [] as Teacher[],
    loading: false
  }),
  getters: {
    availableTeachers:(state)=>state.teachers.filter(teacher=>teacher.isAvailable),
    unavailableTeachers:(state)=>state.teachers.filter(teacher=>!teacher.isAvailable),
  },
  actions: {
    setLoading(value: boolean){
      this.loading=value
    },
    async fetchTeachers() {
      return 
    },
  }
})