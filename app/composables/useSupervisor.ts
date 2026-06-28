import {ref, computed} from 'vue'
import type { Teacher } from '~/types/teacher'
import type { SupervisorSeance } from '~/types/seance'
import { useToast } from '~/composables/useToast'

const toast=useToast()
export const useSupervisorSeance=()=>{
  const listTeachers= ref<Teacher[]>([])
  const isSupervSeanceLoading=ref(true)

  // Actions Réseau
  const fetchAllSupervSeances = async(seanceId: string)=>{
    isSupervSeanceLoading.value=true
    try {
      const data= await $fetch<any>(`/api/supervSeances?seanceId=${seanceId}`)
      listTeachers.value=data.teachers
    }
    catch(err){
      console.error("Erreur de chargement des superviseurs")
      toast.error("Erreur de chargement des superviseurs")
    }
    finally {
      isSupervSeanceLoading.value=false
    }
  }
  // Create Supervisor Seances
  const create=async(supervSeance: Omit<SupervisorSeance,'id'>)=>{
    try{
      await $fetch(`/api/supervSeances`,{method: 'POST',
        body: supervSeance
      })
      await fetchAllSupervSeances(supervSeance.seanceId)
    }
    catch(err){
      console.error("Erreur de création des superviseurs")
      toast.error(`${err}`)
    }
  }



  return {
    listTeachers,
    isSupervSeanceLoading,
    fetchAllSupervSeances,
    create
  }
}