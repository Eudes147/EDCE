import { ref, computed } from 'vue'
import type { Teacher } from '~/types/teacher'
import type { UserStatus } from '~/types/auth'
import { getFullName } from '~/utils/getFullName'

export const useTeacher = () => {
  // Refs miroirs synchronisées par le serveur
  const listTeachers = ref<Teacher[]>([])
  const serverTeachersAvailable = ref<Teacher[]>([])
  const serverTeachersUnavailable = ref<Teacher[]>([])
  const serverTeacherMasculin = ref<Teacher[]>([])
  const serverTeacherFeminin = ref<Teacher[]>([])
  const isLoading = ref(false)

  // --- ACTIONS RÉSEAU ---

  // 🔄 Charger les enseignants (filtrés automatiquement par le serveur)
  const fetchAllTeachers = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/teachers')
      
      listTeachers.value = data.listTeachers
      serverTeachersAvailable.value = data.teachersAvailable
      serverTeachersUnavailable.value = data.teachersUnavailable
      serverTeacherMasculin.value = data.teacherMasculin
      serverTeacherFeminin.value = data.teacherFeminin
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 📝 Mettre à jour un enseignant (Données ou Changement de rôle Option B)
  const updateTeacher = async (teacherId: string, payload: { status?: UserStatus; isAvailable?: boolean; quarter?: string; tel?: string }) => {
    try {
      await $fetch(`/api/teachers/${teacherId}`, {
        method: 'PUT',
        body: payload
      })
      await fetchAllTeachers() // Re-synchronise l'interface
    } catch (error) {
      console.error(error)
    }
  }

  // 🔍 Trouver un enseignant par son ID (Localement)
  const getTeacherById = (teacherId: string): Teacher | undefined => {
    return listTeachers.value.find(t => t.id === teacherId)
  }

  // --- GETTERS (CONSERVÉ) ---
  const getTelTeacher = (teacherId: string) => {
    const teacher = listTeachers.value.find(t => t.id === teacherId)
    return teacher?.tel
  }

  // --- COMPUTED PROPERTIES CONSERVÉES ---
  const teachersAvailable = computed(() => serverTeachersAvailable.value)
  const teachersUnavailable = computed(() => serverTeachersUnavailable.value)
  const teacherMasculin = computed(() => serverTeacherMasculin.value)
  const teacherFeminin = computed(() => serverTeacherFeminin.value)

  return {
    listTeachers,
    teacherFeminin,
    teacherMasculin,
    getTelTeacher,
    teachersAvailable,
    teachersUnavailable,
    isLoading,
    fetchAllTeachers, // À appeler au montage de tes composants professeurs
    updateTeacher,
    getTeacherById,
    getFullName
  }
}