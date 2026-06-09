import { computed } from 'vue'
import type { TypeTest } from '~/types/test'
import type{Classe, ClasseType} from '~/types/classe'

import type { Child, YearGroupedAverages, YearGroupedNotes } from '~/types/child'
import { useChildren } from "~/composables/useChild"
import { getMoyFinal } from '~/utils/getMoyFinal'

// On garde ta fonction pure à l'extérieur, elle s'exécute parfaitement
import {processNotesAndAverages} from "~/utils/processNotes"

export const useNote = () => {
  const { listChildren } = useChildren()
  
  // Utilisation d'un computed pour l'année en cours
  const actualYear = computed(() => new Date().getFullYear().toString())

  // CORRECTION (3) : Mise en cache réactive globale pour éviter de recalculer à chaque appel de fonction
  const notesAndAveragesComputed = computed(() => {
    return {
      evaluations: processNotesAndAverages('EVALUATION'),
      sundaySchool: processNotesAndAverages('SUNDAY_SCHOOL'),
      concours: processNotesAndAverages('CONCOURS')
    }
  })

  // Permet de conserver l'accès à l'ancien format si utilisé dans tes composants
  const notesbyYear = computed(() => notesAndAveragesComputed.value)

  // Reste disponible si besoin d'un appel dynamique à la demande
  const getNotesAndAverages = (typeFilter: 'EVALUATION' | 'SUNDAY_SCHOOL' | 'CONCOURS') => {
    if (typeFilter === 'EVALUATION') return notesAndAveragesComputed.value.evaluations
    if (typeFilter === 'SUNDAY_SCHOOL') return notesAndAveragesComputed.value.sundaySchool
    return notesAndAveragesComputed.value.concours
  }

  const getnotebychildperTestType = (child: Child, testType: TypeTest) => {
    // CORRECTION (1) : On lit le cache du computed au lieu de réexécuter processNotesAndAverages
    const source = testType === 'EVALUATION' ? notesAndAveragesComputed.value.evaluations 
                 : testType === 'SUNDAY_SCHOOL' ? notesAndAveragesComputed.value.sundaySchool 
                 : notesAndAveragesComputed.value.concours

    const listNotesActualYear = source.listNotes[actualYear.value]
    const childNotes = listNotesActualYear?.find(item => item.childId === child.id)

    return childNotes?.notes || []
  }

  const getPassageDeliberation = (child: Child, moyenneCoupure: number = 10) => {
    // CORRECTION (1) : Lecture depuis le cache pré-calculé de SUNDAY_SCHOOL
    const moyennesActualYear = notesAndAveragesComputed.value.sundaySchool.moyenne[actualYear.value]
    const childMoyenne = moyennesActualYear?.find(m => m.childId === child.id)

    if (childMoyenne?.moyenne !== undefined) {
      return childMoyenne.moyenne >= moyenneCoupure
    }
    return false  
  }
  const percentSuccessbyClasse=computed(()=>{
    return (classe: ClasseType)=>{
    // CORRECTION (1) : Lecture depuis le cache pré-calculé de SUNDAY_SCHOOL
    const filtredChildren= listChildren.value.filter(child=>child.classe===classe)
    return (filtredChildren.filter  (child=>getPassageDeliberation(child)).length / filtredChildren.length) * 100
  }
  })
    
    

  const getMoyGenperChildId = (child: Child) => {
    // CORRECTION (1) : Lecture depuis le cache pré-calculé
    const moyennesEvaluationActualYear = notesAndAveragesComputed.value.evaluations.moyenne[actualYear.value]
    const moyennesConcoursActualYear = notesAndAveragesComputed.value.concours.moyenne[actualYear.value]

    const moyEval = moyennesEvaluationActualYear?.find(m => m.childId === child.id)?.moyenne
    const moyConcours = moyennesConcoursActualYear?.find(m => m.childId === child.id)?.moyenne

    // CORRECTION (4) : Si l'un des deux est manquant (ex: absent), on considère la note manquante comme un 0 au lieu de tout annuler
    if (moyEval !== undefined || moyConcours !== undefined) {
      return getMoyFinal(moyEval || 0, moyConcours || 0)
    }

    return 0
  }

  const getClassementFinal = (classe: ClasseType) => {
    // CORRECTION (1) : Lecture du cache d'évaluation
    const currentYearMoyennes = notesAndAveragesComputed.value.evaluations.moyenne[actualYear.value] || []
    
    const finalClassement = currentYearMoyennes.map(moyennebyYear => {
      const child = listChildren.value.find(c => c.id === moyennebyYear.childId && c.classe==classe)
      
      const moyenneFinal = child ? getMoyGenperChildId(child) : 0
      return {
        childId: moyennebyYear.childId,
        moyGen: moyenneFinal
      }
    })
    
    return finalClassement.sort((a, b) => Number(b.moyGen) - Number(a.moyGen))
  }

  const getNamebyId= (id: string): string=>{
    const child =listChildren.value.find(child=>child.id===id)
    return child?.name || ''
  }

  return {
    notesbyYear,
    getNamebyId,
    getPassageDeliberation,
    getnotebychildperTestType,
    getMoyGenperChildId,
    getClassementFinal,
    getNotesAndAverages,
    percentSuccessbyClasse
  }
}