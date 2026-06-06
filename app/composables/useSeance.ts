import {ref,computed} from 'vue'
import type { Seance,SeanceStats } from '~/types/seance'
import { classes } from '~/stores/child'
import {mockSeance} from '~/data/mockData'

export const useSeance=()=>{
  const typeSeances=["NORMAL","SUNDAY_SCHOOL","DLT"]
  const listSeances=ref(mockSeance)

  const groupSeanceperType=computed(()=>{
    typeSeances.reduce((acc,typeSeance)=>{
                  const seancebyType= listSeances.value.filter(seance=>seance.type===typeSeance)
                
                  if(seancebyType){
                    acc[typeSeance] = (seancebyType|| [])
                  }
                  
        
                  return acc
        
              },{} as Record<string,Seance[]>)
  })

    const groupSeanceperClasse=computed(()=>{
      classes.reduce((acc,classe)=>{
                    const seancebyClasse= listSeances.value.filter(seance=>seance.classe==classe)
                  
                    if(seancebyClasse){
                      acc[classe] = (seancebyClasse|| [])
                    }
                    
          
                    return acc
          
                },{} as Record<string,Seance[]>)
    })

    const groupSeanceperYear=computed(()=>{
      const listYear= listSeances.value.reduce((acc,seance)=>{
        const year = new Date(seance.created_at).getFullYear().toString()
        if(!(year in acc)) acc.push(year)
        return acc
      },[] as String[])
      listYear.reduce((acc,year)=>{

        const seancebyYear= listSeances.value.filter(seance=>year==new Date(seance.created_at).getFullYear().toString())  
        
        if(acc[year.toString()]) acc[year.toString()]=(seancebyYear || [])
        
        return acc
      },{} as Record<string,Seance[]>)
    })
    


  return {
    groupSeanceperClasse,
    groupSeanceperYear,
    groupSeanceperType,
    typeSeances
  }


}