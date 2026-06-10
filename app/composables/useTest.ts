import { ref, computed } from 'vue'
import type { Test, TypeTest, TestSubmit } from '~/types/test'
import type { Month } from '~/types/index'
import type { ClasseType } from '~/types/classe'

export const useTest = () => {
  const actualYear = computed(() => new Date().getFullYear().toString())
  const listTests = ref<Test[]>([])
  const isLoading = ref(false)

  // --- ACTIONS RÉSEAU (SYNCHRONISATION) ---

  // 🔄 Charger tous les tests depuis le serveur
  const fetchAllTests = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/tests')
      listTests.value = data.listTests || []
    } catch (error) {
      console.error('Erreur lors du chargement des tests:', error)
    } finally {
      isLoading.value = false
    }
  }

  // ➕ Ajouter un nouveau test via l'API
  const createTest = async (testPayload: TestSubmit) => {
    isLoading.value = true
    try {
      await $fetch('/api/tests', {
        method: 'POST',
        body: testPayload
      })
      await fetchAllTests()
    } catch (error) {
      console.error("Erreur lors de la création du test:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 📝 Modifier un test existant via l'API (Ajouté !)
  const updateTest = async (testId: string, updatedPayload: Partial<TestSubmit>) => {
    isLoading.value = true
    try {
      await $fetch(`/api/tests/${testId}`, {
        method: 'PUT',
        body: updatedPayload
      })
      await fetchAllTests()
    } catch (error) {
      console.error("Erreur lors de la modification du test:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // ❌ Supprimer un test via l'API (Ajouté !)
  const deleteTest = async (testId: string) => {
    isLoading.value = true
    try {
      await $fetch(`/api/tests/${testId}`, {
        method: 'DELETE'
      })
      await fetchAllTests()
    } catch (error) {
      console.error("Erreur lors de la suppression du test:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // --- FONCTIONS DE FILTRAGE ---

  const getTestbyMonthAndClasse = computed(() => {
    return (classe: ClasseType, month: Month) => {
      return listTests.value.filter(test => {
        if (!test.created_at) return false
        const testyear = new Date(test.created_at).getFullYear().toString()
        const testMonth = new Date(test.created_at).toLocaleString('fr-FR', { month: 'long' })
        return testMonth.toLowerCase() === month.toLowerCase() && test.classe === classe && testyear === actualYear.value
      })
    }
  })

  const getTestbyClasse = computed(() => {
    return (classe: ClasseType) => {
      return listTests.value.filter(test => {
        if (!test.created_at) return false
        const testyear = new Date(test.created_at).getFullYear().toString()
        return test.classe === classe && testyear === actualYear.value
      })
    }
  })

  const totalTests = computed(() => {
    return (classe: ClasseType, month: Month) => {
      return getTestbyMonthAndClasse.value(classe, month)
    }
  })

  const getTestbyType = computed(() => {
    return (testsArray: Test[], type: TypeTest) => {
      return testsArray.filter(test => test.typeTest === type)
    }
  })

  return {
    actualYear,
    listTests,
    isLoading,
    fetchAllTests,
    createTest,
    updateTest,
    deleteTest,
    getTestbyMonthAndClasse,
    totalTests,
    getTestbyType,
    getTestbyClasse
  }
}