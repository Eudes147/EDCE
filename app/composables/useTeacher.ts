import type { Teacher } from "~/types/teacher"
import { ref, computed } from 'vue'
import { mockTeachers } from "~/data/mockData"

export const useTeacher = () => {
  const listTeachers = ref<Teacher[]>(mockTeachers)

  // --- CRUD TEACHERS (AJOUTÉ POUR LA COHÉRENCE) ---
  const createTeacher = (teacher: Teacher) => {
    if (teacher.id && teacher.first_name && teacher.last_name) {
      listTeachers.value.push(teacher)
    }
  }

  const deleteTeacher = (teacherId: string) => {
    listTeachers.value = listTeachers.value.filter(t => t.id !== teacherId)
  }

  const updateTeacher = (teacherId: string, updatedTeacher: Teacher) => {
    const index = listTeachers.value.findIndex(t => t.id === teacherId)
    if (index !== -1) listTeachers.value[index] = updatedTeacher
  }

  const getTeacherById = (teacherId: string): Teacher | undefined => {
    return listTeachers.value.find(t => t.id === teacherId)
  }

  // --- GETTERS ---
  const getTelTeacher = (teacherId: string) => {
    const teacher = listTeachers.value.find(t => t.id === teacherId)
    return teacher?.tel
  }

  // --- COMPUTED PROPERTIES (CORRIGÉS ET RÉACTIFS) ---

  // 1. Enseignants disponibles
  const teachersAvailable = computed<Teacher[]>(() => {
    // CORRECTION : Utilisation de listTeachers.value et ajout du return
    return listTeachers.value.filter(t => t.isAvailable)
  })

  // 2. Enseignants indisponibles
  const teachersUnavailable = computed<Teacher[]>(() => {
    // CORRECTION : Utilisation de listTeachers.value et ajout du return
    return listTeachers.value.filter(t => !t.isAvailable)
  })

  // 3. Enseignants masculins
  const teacherMasculin = computed<Teacher[]>(() => {
    // CORRECTION : Utilisation de listTeachers.value et ajout du return
    return listTeachers.value.filter(t => t.sexe === 'Masculin')
  })

  // 4. Enseignants féminins
  const teacherFeminin = computed<Teacher[]>(() => {
    // CORRECTION : Utilisation de listTeachers.value et ajout du return
    return listTeachers.value.filter(t => t.sexe === 'Feminin')
  })

  return {
    listTeachers,
    teacherFeminin,
    teacherMasculin,
    getTelTeacher,
    teachersAvailable,
    teachersUnavailable,
    createTeacher,
    deleteTeacher,
    updateTeacher,
    getTeacherById
  }
}