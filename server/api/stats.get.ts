import { mockChildren, mockClasses, mockModerators, mockTests, mockTeachers, mockActivities } from '~/data/mockData'
import type { ClasseType } from '~/types/classe'

import { processNotesAndAverages } from '~/utils/processNotes' // Ta fonction pure exportée

export default defineEventHandler(() => {
  // 1. STATS GLOBALES (Calculées au plus simple)
  const totalLengthChildren = mockChildren.length
  const totalLengthClasses = mockClasses.length
  const totalLengthModerators = mockModerators.length
  const totalLengthTeachers = mockTeachers.length
  const totalLengthTests = mockTests.length
  const totalLengthActivities = mockActivities.length



  const totalStats = {
    totalLengthChildren,
    totalLengthClasses,
    totalLengthModerators,
    totalLengthTeachers,
    totalLengthTests,
    totalLengthActivities
  }

  const listStats = {
    listChildren: mockChildren,
    listClasses: mockClasses,
    listModerators: mockModerators,
    listTeachers: mockTeachers,
    listTests: mockTests
  }

  // 2. STATS ENFANTS (Optimisation des boucles)
  let totalBoy = 0
  let totalGirl = 0

  const listParentInfos = mockChildren.map(child => {
    // Comptage des genres au passage pour éviter des .filter additionnels
    if (child.sexe === 'Masculin') totalBoy++
    else if (child.sexe === 'Feminin') totalGirl++

    const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
    // Règle conservée : Premier mot extrait pour le Nom de Famille
    const parentName = child.name.trim().split(' ')[0]
    return { name: `${denomination} ${parentName}`, tel: child.telParent }
  })

  const childrenPerClass = mockClasses.map(classe => {
    const count = mockChildren.filter(child => child.classe === classe.classe).length
    const rate = totalLengthChildren > 0 
      ? Number((count / totalLengthChildren).toFixed(2)) 
      : 0
    return { classe: classe.classe, count, rate }
  })

  const childrenStats = { childrenPerClass, totalBoy, totalGirl, listParentInfos }

  // 3. STATS ENSEIGNANTS (Optimisé : 1 seule boucle au lieu de 4)
  const teachersStats = mockTeachers.reduce((acc, t) => {
    if (t.isAvailable) acc.teachersAvailable++
    else acc.teachersUnavailable++

    if (t.sexe === 'Masculin') acc.teacherMasculin++
    else if (t.sexe === 'Feminin') acc.teacherFeminin++

    return acc
  }, {
    teachersAvailable: 0,
    teachersUnavailable: 0,
    teacherMasculin: 0,
    teacherFeminin: 0
  })

  // 4. STATS MODÉRATEURS (Optimisé : 1 seule boucle au lieu de 4)
  const moderatorsStats = mockModerators.reduce((acc, m) => {
    if (m.isAvailable) acc.moderatorsAvailable++
    else acc.moderatorsUnavailable++

    if (m.sexe === 'Masculin') acc.moderatorMasculin++
    else if (m.sexe === 'Feminin') acc.moderatorFeminin++

    return acc
  }, {
    moderatorsAvailable: 0,
    moderatorsUnavailable: 0,
    moderatorMasculin: 0,
    moderatorFeminin: 0
  })

  // 5. STATS TESTS (Optimisé : Groupements simultanés par type et par mois)
  const testsPerClass = mockClasses.map(classe => {
    const count = mockTests.filter(test => test.classe === classe.classe).length
    return { classe: classe.classe, count }
  })

  const testsPerMonth: Record<string, number> = {}
  const testEvaluation: typeof mockTests = []
  const testConcours: typeof mockTests = []
  const testSundaySchool: typeof mockTests = []

  mockTests.forEach(test => {
    // Calcul mois (minuscule pour rester raccord avec ton type Month)
    const month = new Date(test.created_at).toLocaleString('fr-FR', { month: 'long' }).toLowerCase()
    testsPerMonth[month] = (testsPerMonth[month] || 0) + 1

    // Dispatching par type
    if (test.typeTest === 'EVALUATION') testEvaluation.push(test)
    else if (test.typeTest === 'CONCOURS') testConcours.push(test)
    else if (test.typeTest === 'SUNDAY_SCHOOL') testSundaySchool.push(test)
  })

  const testsStats = {
    testsPerClass,
    testsPerMonth,
    testEvaluation: { liste: testEvaluation, count: testEvaluation.length },
    testConcours: { liste: testConcours, count: testConcours.length },
    testSundaySchool: { liste: testSundaySchool, count: testSundaySchool.length }
  }

  // 6. STATS NOTES (Conserve l'appel à ta fonction pure)
  const notesStats = {
    evaluations: processNotesAndAverages('EVALUATION'),
    sundaySchool: processNotesAndAverages('SUNDAY_SCHOOL'),
    concours: processNotesAndAverages('CONCOURS')
  }

  // Envoi de la réponse structurée au Dashboard frontend
  return {
    totalStats,
    listStats,
    childrenStats,
    teachersStats,
    moderatorsStats,
    testsStats,
    notesStats
  }
})