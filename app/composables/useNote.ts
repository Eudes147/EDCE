import { ref, computed } from 'vue'
import type { TypeTest } from '~/types/test'
import type { ClasseType } from '~/types/classe'
import type { Child } from '~/types/child'
import type { Note } from '~/types/test'
import type { Test } from '~/types/test'

import { useChildren } from "~/composables/useChild"
import { useTest } from "~/composables/useTest" // Import du composable de tests qu'on a écrit ensemble
import { getMoyFinal } from '~/utils/getMoyFinal'
import { processNotesAndAverages } from "~/utils/processNotes"

export const useNote = () => {
  const { listChildren, fetchAllChildren } = useChildren()
  const { listTests, fetchAllTests } = useTest()
  
  const listNotes = ref<Note[]>([])
  const isLoading = ref(false)
  const actualYear = computed(() => new Date().getFullYear().toString())

  // 🔄 Charger toutes les notes et dépendances depuis le serveur
  const fetchAllNotesData = async () => {
    isLoading.value = true
    try {
      // Chargement simultané des dépendances enfants et tests
      await Promise.all([fetchAllChildren?.(), fetchAllTests?.()])
      
      const data = await $fetch<any>('/api/notes')
      listNotes.value = data.listNotes
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error)
    } finally {
      isLoading.value = false
    }
  }

  // ➕ Ajouter une note (Action Réseau)
  const createNote = async (notePayload: Omit<Note, 'id' | 'created_at'>) => {
    try {
      await $fetch('/api/notes', { method: 'POST', body: notePayload })
      await fetchAllNotesData() // Rafraîchissement
    } catch (error) {
      console.error(error)
    }
  }

  // 🔥 MISE EN CACHE RÉACTIVE GLOBALE (mise à jour dynamique grâce aux Refs)
  const notesAndAveragesComputed = computed(() => {
    return {
      evaluations: processNotesAndAverages('EVALUATION', listNotes.value, listTests.value),
      sundaySchool: processNotesAndAverages('SUNDAY_SCHOOL', listNotes.value, listTests.value),
      concours: processNotesAndAverages('CONCOURS', listNotes.value, listTests.value)
    }
  })

  const notesbyYear = computed(() => notesAndAveragesComputed.value)

  const getNotesAndAverages = (typeFilter: 'EVALUATION' | 'SUNDAY_SCHOOL' | 'CONCOURS') => {
    if (typeFilter === 'EVALUATION') return notesAndAveragesComputed.value.evaluations
    if (typeFilter === 'SUNDAY_SCHOOL') return notesAndAveragesComputed.value.sundaySchool
    return notesAndAveragesComputed.value.concours
  }

  const getnotebychildperTestType = (child: Child, testType: TypeTest) => {
    const source = testType === 'EVALUATION' ? notesAndAveragesComputed.value.evaluations 
                 : testType === 'SUNDAY_SCHOOL' ? notesAndAveragesComputed.value.sundaySchool 
                 : notesAndAveragesComputed.value.concours

    const listNotesActualYear = source.listNotes[actualYear.value]
    const childNotes = listNotesActualYear?.find(item => item.childId === child.id)

    return childNotes?.notes || []
  }

  const getPassageDeliberation = (child: Child, moyenneCoupure: number = 10) => {
    const moyennesActualYear = notesAndAveragesComputed.value.sundaySchool.moyenne[actualYear.value]
    const childMoyenne = moyennesActualYear?.find(m => m.childId === child.id)

    if (childMoyenne?.moyenne !== undefined) {
      return childMoyenne.moyenne >= moyenneCoupure
    }
    return false  
  }

  const percentSuccessbyClasse = computed(() => {
    return (classe: ClasseType) => {
      const filteredChildren = listChildren.value.filter(child => child.classe === classe)
      if (filteredChildren.length === 0) return 0
      return (filteredChildren.filter(child => getPassageDeliberation(child)).length / filteredChildren.length) * 100
    }
  })

  const getMoyGenperChildId = (child: Child) => {
    const moyennesEvaluationActualYear = notesAndAveragesComputed.value.evaluations.moyenne[actualYear.value]
    const moyennesConcoursActualYear = notesAndAveragesComputed.value.concours.moyenne[actualYear.value]

    const moyEval = moyennesEvaluationActualYear?.find(m => m.childId === child.id)?.moyenne
    const moyConcours = moyennesConcoursActualYear?.find(m => m.childId === child.id)?.moyenne

    if (moyEval !== undefined || moyConcours !== undefined) {
      return getMoyFinal(moyEval || 0, moyConcours || 0)
    }
    return 0
  }

  const getClassementFinal = (classe: ClasseType) => {
    const currentYearMoyennes = notesAndAveragesComputed.value.evaluations.moyenne[actualYear.value] || []
    
    const finalClassement = currentYearMoyennes.map(moyennebyYear => {
      const child = listChildren.value.find(c => c.id === moyennebyYear.childId && c.classe == classe)
      const moyenneFinal = child ? getMoyGenperChildId(child) : 0
      return {
        childId: moyennebyYear.childId,
        moyGen: moyenneFinal
      }
    })
    
    return finalClassement.sort((a, b) => Number(b.moyGen) - Number(a.moyGen))
  }

  const getNamebyId = (id: string): string => {
    const child = listChildren.value.find(c => c.id === id)
    return child?.name || ''
  }

  return {
    notesbyYear,
    listNotes,
    isLoading,
    fetchAllNotesData, // À appeler à l'initialisation de ta page de notes / bulletins
    createNote,
    getNamebyId,
    getPassageDeliberation,
    getnotebychildperTestType,
    getMoyGenperChildId,
    getClassementFinal,
    getNotesAndAverages,
    percentSuccessbyClasse
  }
}