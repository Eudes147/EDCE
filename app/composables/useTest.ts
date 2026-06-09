import type{ Test,TypeTest,TestSubmit } from '~/types/test'
import type{ Month } from '~/types/index'

import { mockTests } from '~/data/mockData'
import {ref,computed} from 'vue'
import type { ClasseType } from '~/types/classe'
export const useTest = ()=>{

  const actualYear = computed(() => new Date().getFullYear().toString())
  const listTests=ref(mockTests)

  const getTestbyMonthAndClasse= computed(()=>{
    return (classe: ClasseType, month: Month)=>{
      return listTests.value.filter(test=>{
        const testyear=new Date(test.created_at).getFullYear().toString()
        const testMonth=new Date(test.created_at).toLocaleString('fr-FR', {month: 'long'})
        return testMonth.toLowerCase() === month && test.classe===classe && testyear===actualYear.value
      })
    }
  })

  const getTestbyClasse= computed(()=>{
    return (classe: ClasseType)=>{
      return listTests.value.filter(test=>{
        const testyear=new Date(test.created_at).getFullYear().toString()
        return test.classe===classe && testyear===actualYear.value
      })
    }
  })

  const totalTests=computed(()=>{
    return (classe: ClasseType, month: Month)=>{
      return getTestbyMonthAndClasse.value(classe, month)
    }
  })

  const getTestbyType=computed(()=>{
    return (totalTests: Test[], type: TypeTest)=>{
      return totalTests.filter(test=>{
        test.typeTest===type
      })
    }
     
  })

  return {
    actualYear,
    listTests,
    getTestbyMonthAndClasse,
    totalTests,
    getTestbyType,
    getTestbyClasse
  }
}