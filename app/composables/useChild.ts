import { ref, computed } from 'vue'
import type { Child } from '~/types/child'
import type { ClasseType } from '~/types/classe'
import { getFullName } from '~/utils/getFullName'
import {useToast} from '~/composables/useToast'


const toast=useToast()
export const useChildren = () => {
  const examClasses = ['CM2', '3e', 'Tle']

  // Refs réactives miroirs de l'API
  const listChildren = ref<Child[]>([])
  const serverTotalLength = ref(0)
  const serverChildrenPerClass = ref<Record<string, Child[]>>({})
  const serverChildrenExamClass = ref<Record<string, Child[]>>({})
  const serverTotalBoy = ref<Child[]>([])
  const serverTotalGirl = ref<Child[]>([])
  const isLoading = ref(true)

  // --- ACTIONS RÉSEAU ---

  // 🔄 Charger les données du serveur
  const fetchAllChildren = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/children')
      
      listChildren.value = data.listChildren
      serverTotalLength.value = data.totalLengthChildren
      serverChildrenPerClass.value = data.childrenPerClass
      serverChildrenExamClass.value = data.childrenExamClass
      serverTotalBoy.value = data.totalBoy
      serverTotalGirl.value = data.totalGirl
    } catch (error) {
      toast.error('Erreur lors du chargement des enfants:')
    } finally {
      isLoading.value = false
    }
  }

  // ➕ Créer un enfant
  const createChild = async (childPayload: Omit<Child, 'id' | 'created_at'>) => {
    try {
      await $fetch('/api/children', {
        method: 'POST',
        body: childPayload
      })
      await fetchAllChildren() // Re-synchronise l'état global
    } catch (error) {
      console.error(error)
    }
  }

  // ❌ Supprimer un enfant
  const deleteChild = async (childId: string) => {
    try {
      await $fetch(`/api/children/${childId}`, { method: 'DELETE' })
      await fetchAllChildren()
    } catch (error) {
      console.error(error)
    }
  }

  // 📝 Modifier un enfant
  const updateChild = async (childId: string, updatedChild: Partial<Child>) => {
    try {
      await $fetch(`/api/children/${childId}`, {
        method: 'PUT',
        body: updatedChild
      })
      await fetchAllChildren()
    } catch (error) {
      console.error(error)
    }
  }

  // 🔍 Trouver un enfant par son ID (localement depuis la liste chargée)
  const getChildById = (childId: string): Child | undefined => {
    return listChildren.value.find(child => child.id === childId)
  }

  // --- COMPUTED PROPERTIES CONSERVÉES ---
  
  const totalLengthChildren = computed(() => serverTotalLength.value)
  const childrenPerClass = computed(() => serverChildrenPerClass.value)
  const childrenExamClass = computed(() => serverChildrenExamClass.value)
  const totalBoy = computed(() => serverTotalBoy.value)
  const totalGirl = computed(() => serverTotalGirl.value)

  // La fonction de fermeture (closure) pour les parents reste calculée dynamiquement à la demande
  const listParentInfos = computed(() => {
    return (classe: ClasseType) => {
      return listChildren.value
        .filter(child => child?.classe === classe)
        .map(child => {
          const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
          const parentName = child.name.trim().split(' ')[0]
          return { 
            name: `${denomination} ${parentName}`, 
            tel: child.telParent 
          }
        })
    }
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
    isLoading,
    fetchAllChildren, // Nouvelle fonction requise pour initialiser la vue
    createChild,
    deleteChild,
    updateChild,
    getChildById,
    getFullName
  }
}