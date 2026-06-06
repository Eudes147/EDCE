import type{Child} from '~/types/child'
import { mockChildren,mockClasses } from '~/data/mockData'
import {ref, computed} from 'vue'


export const useChildren = ()=>{
  const examClasses=["CM2", "3e","Tle"]
  const listChildren =ref(mockChildren)
  const totalLengthChildren=ref(listChildren.value.length)

  const childrenPerClass = computed(()=>{
    mockClasses.reduce((acc,classe)=>{
              const childbyClass= listChildren.value.filter(child=>child.classe===classe.classe)
            
              if(childbyClass){
                acc[classe.classe] = (childbyClass|| [])
              }
              
    
              return acc
    
          },{} as Record<string,Child[]>)
  })

  const childrenExamClass=computed(()=>{
    examClasses.reduce((acc,classe)=>{
              const childbyClass= listChildren.value.filter(child=>child.classe==classe)
            
              if(childbyClass){
                acc[classe] = (childbyClass|| [])
              }
              
    
              return acc
    
          },{} as Record<string,Child[]>)
  })
  
  const totalBoy = computed(()=>{
    listChildren.value.filter(child => child.sexe === 'Masculin')
  })
  
  
  const totalGirl = computed(()=>{
    listChildren.value.filter(child => child.sexe === 'Feminin')
  })
   

  const listParentInfos = computed(()=>{
    listChildren.value.map(child => {
        const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
        const parentName = child.name.trim().split(' ')[0]
        return { name: `${denomination} ${parentName}`, tel: child.telParent }
      })
  })
  
  
  return {
    listChildren,
    totalLengthChildren,
    childrenPerClass,
    childrenExamClass,
    totalBoy,
    totalGirl, 
    listParentInfos,
    examClasses
  }
}