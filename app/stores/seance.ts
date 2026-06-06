import {defineStore} from 'pinia'

export interface Seance {
  id: string
  date:Date
  type:SeanceType
  supervisors: (User & { status: 'teacher' })[]
  created_at: string
  updated_at: string
}

export type SeanceType = 'NORMAL' | 'DLT' | 'SUNDAY SCHOOL'

export interface SeanceStats {
  seanceCount: number

}

interface SeanceResponse {
  seances: Seance[]

}

export const useSeanceStore = defineStore('seance',{
  state: ()=>({
    seances: [] as Seance[],
  }),
  getters: {
    normalSeances: (state)=> state.seances.filter(seance=>seance.type==="NORMAL"),
    dltSeances: (state)=> state.seances.filter(seance=>seance.type==="DLT"),
    sundaySeances: (state)=> state.seances.filter(seance=>seance.type==="SUNDAY SCHOOL"),
    supervisors: (state)=>state.seances.flatMap(seance=>seance.supervisors)
  },
})