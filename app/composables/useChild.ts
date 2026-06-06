import type { Child } from '~/types/child'
import { mockChildren, mockClasses } from '~/data/mockData'
import { ref, computed } from 'vue'

export const useChildren = () => {
  const examClasses = ["CM2", "3e", "Tle"]
  const listChildren = ref<Child[]>(mockChildren)

  // CORRECTION (1) : Utilisation d'un computed pour garder la longueur synchronisée
  const totalLengthChildren = computed(() => listChildren.value.length)

  // --- CRUD CHILDREN ---
  const createChild = (child: Child) => {
    if (child.id && child.name) {
      listChildren.value.push(child)
    }
  }

  const deleteChild = (childId: string) => {
    listChildren.value = listChildren.value.filter(child => child.id !== childId)
  }

  const updateChild = (childId: string, updatedChild: Child) => {
    const index = listChildren.value.findIndex(child => child.id === childId)
    if (index !== -1) listChildren.value[index] = updatedChild
  }

  const getChildById = (childId: string): Child | undefined => {
    return listChildren.value.find(child => child.id === childId)
  }

  // --- COMPUTED PROPERTIES ---

  // Regroupement des enfants par classe (mockClasses)
  const childrenPerClass = computed<Record<string, Child[]>>(() => {
    // CORRECTION (2) : Ajout du return global pour le computed
    return mockClasses.reduce((acc, classe) => {
      const childbyClass = listChildren.value.filter(child => child.classe === classe.classe)
      acc[classe.classe] = childbyClass || []
      return acc
    }, {} as Record<string, Child[]>)
  })

  // Regroupement uniquement pour les classes d'examen
  const childrenExamClass = computed<Record<string, Child[]>>(() => {
    // CORRECTION (2) : Ajout du return global pour le computed
    return examClasses.reduce((acc, classe) => {
      const childbyClass = listChildren.value.filter(child => child.classe === classe)
      acc[classe] = childbyClass || []
      return acc
    }, {} as Record<string, Child[]>)
  })
  
  // EXIGENCE (3) : Renvoie le TABLEAU filtré des garçons
  const totalBoy = computed<Child[]>(() => {
    // CORRECTION (2) : Ajout du return manquant
    return listChildren.value.filter(child => child.sexe === 'Masculin')
  })
  
  // EXIGENCE (3) : Renvoie le TABLEAU filtré des filles
  const totalGirl = computed<Child[]>(() => {
    // CORRECTION (2) : Ajout du return manquant
    return listChildren.value.filter(child => child.sexe === 'Feminin')
  })

  // Liste des fiches de contact des parents
  const listParentInfos = computed(() => {
    // CORRECTION (2) : Ajout du return global pour le computed
    return listChildren.value.map(child => {
      const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
      
      // EXIGENCE (4) : On garde le premier mot (ex: "HOUHONOU" pour "HOUHONOU Germain")
      const parentName = child.name.trim().split(' ')[0]
      
      return { 
        name: `${denomination} ${parentName}`, 
        tel: child.telParent 
      }
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
    examClasses,
    createChild,
    deleteChild,
    updateChild,
    getChildById
  }
}