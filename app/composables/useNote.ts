import {ref,computed} from 'vue'
import type{TypeTest} from '~/types/test'
import {mockNotes,mockTests} from '~/data/mockData'
import type { Child, YearGroupedAverages,YearGroupedNotes } from '~/types/child'
import {useChildren} from "~/composables/useChild"

import { getMoyFinal } from '~/utils/getMoyFinal'

const testTypes=['EVALUATION','SUNDAY_SCHOOL','CONCOURS']
export function processNotesAndAverages(typeFilter: 'EVALUATION' | 'SUNDAY_SCHOOL' | 'CONCOURS') {
  // On ne parcourt le tableau mockNotes qu'UNE SEULE fois pour extraire les notes ET calculer les moyennes
  const listNotes: YearGroupedNotes = {}
  const moyenne: YearGroupedAverages = {}

  mockNotes.forEach((note) => {
    const associatedTest = mockTests.find(t => t.id === note.testId)
    if (!associatedTest || associatedTest.typeTest !== typeFilter) return

    const year = new Date(note.created_at).getFullYear().toString()

    if (!listNotes[year]) listNotes[year] = []

    const childEntry = listNotes[year].find(item => item.childId === note.childId)

    if (childEntry) {
      childEntry.notes.push(note.note)
    } else {
      listNotes[year].push({
        childId: note.childId,
        notes: [note.note]
      })
    }
  })

  // Calcul des moyennes à partir des notes groupées
  Object.keys(listNotes).forEach((year) => {
    if(listNotes[year]){
      moyenne[year] = listNotes[year].map((childData) => {
            const total = childData.notes.reduce((sum, n) => sum + n, 0)
            return {
              childId: childData.childId,
              moyenne: Number((total / childData.notes.length).toFixed(2))
            }
          })
    }
  })

  return { listNotes, moyenne }
}


export const useNote= ()=>{
  const {listChildren} = useChildren()
  const actualYear= new Date().getFullYear().toString()

  const notesbyYear = {
    evaluations: processNotesAndAverages('EVALUATION'),
    sundaySchool: processNotesAndAverages('SUNDAY_SCHOOL'),
    concours: processNotesAndAverages('CONCOURS')
  }
  const getnotebychildperTestType= (child: Child, testType: TypeTest)=>{

    const listNotesActualYear=processNotesAndAverages(testType).listNotes[actualYear]
    const listNotesActualYearbyChildId=listNotesActualYear?.find(listNoteActualYear=>listNoteActualYear.childId===child.id)

    return listNotesActualYearbyChildId?.notes

  }


  const getPassageDeliberation = (child: Child, moyenne:number=10)=>{

    const moyennesActualYear=processNotesAndAverages("SUNDAY_SCHOOL").moyenne[actualYear]
    const moyenneActualYearbyChildId=moyennesActualYear?.find(moyenneAcualYear=>moyenneAcualYear.childId===child.id)

    
    if(moyenneActualYearbyChildId?.moyenne){
      return moyenneActualYearbyChildId.moyenne >=moyenne ? true : false
    }
    return false
  }
  const getMoyGenperChildId=(child: Child)=>{

    const moyennesEvaluationActualYear=processNotesAndAverages("EVALUATION").moyenne[actualYear]

    const moyennesConcoursActualYear=processNotesAndAverages("CONCOURS").moyenne[actualYear]

    const moyenneEvaluationActualYearbyChildId=moyennesEvaluationActualYear?.find(moyenneEvaluationAcualYear=>moyenneEvaluationAcualYear.childId===child.id)

    const moyenneConcoursActualYearbyChildId=moyennesConcoursActualYear?.find(moyenneConcoursAcualYear=>moyenneConcoursAcualYear.childId===child.id)

    if(moyenneConcoursActualYearbyChildId?.moyenne && moyenneEvaluationActualYearbyChildId?.moyenne){

      return getMoyFinal(moyenneEvaluationActualYearbyChildId?.moyenne||0, moyenneConcoursActualYearbyChildId?.moyenne||0)
    }

    return 0
  }

  const getClassementFinal= ()=>{
    const finalClassement= processNotesAndAverages('EVALUATION').moyenne[actualYear]?.map(moyennebyYear=>{
      const list= listChildren.value
      const child=list.find(child=>child.id===moyennebyYear.childId)
      if(child){
        const moyenneFinal=getMoyGenperChildId(child)
        return {
          childId: moyennebyYear.childId,
          moyGen: moyenneFinal || 0

        }
      }
      return {
        childId: moyennebyYear.childId,
        moyGen: 0
      }
      
    })
    return finalClassement?.sort((a,b)=>Number(b.moyGen) - Number(a.moyGen))
  }


  

  return {
    notesbyYear,
    getPassageDeliberation,
    getnotebychildperTestType,
    getMoyGenperChildId,
    getClassementFinal
  }

}